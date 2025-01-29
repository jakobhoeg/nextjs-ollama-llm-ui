# Use Node.js as the base image
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

# Set a build-time argument for OLLAMA_URL with a default value
ARG OLLAMA_URL=http://127.0.0.1:11434
ENV OLLAMA_URL=${OLLAMA_URL}

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules

# Set environment variable with a default value that can be overridden at runtime
ENV OLLAMA_URL=http://127.0.0.1:11434
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]