<div align="center">
  <img src="ollama-nextjs-ui.gif">
</div>

<h1 align="center">
  Fully-featured & beautiful web interface for Ollama LLMs
</h1>

<div align="center">
  
![GitHub Repo stars](https://img.shields.io/github/stars/jakobhoeg/nextjs-ollama-llm-ui)
  
</div>


Get up and running with Large Language Models **quickly**, **locally** and even **offline**.
This project aims to be the easiest way for you to get started with LLMs. No tedious and annoying setup required!

# Features ✨

- **Beautiful & intuitive UI:** Inspired by ChatGPT, to enhance similarity in the user experience.
- **Fully local:** Stores chats in localstorage for convenience. No need to run a database.
- **Fully responsive:** Use your phone to chat, with the same ease as on desktop.
- **Easy setup:** No tedious and annoying setup required. Just clone the repo and you're good to go!
- **Code syntax highligting:** Messages that include code, will be highlighted for easy access.
- **Copy codeblocks easily:** Easily copy the highlighted code with one click.
- **Download/Pull & Delete models:** Easily download and delete models directly from the interface.
- **Switch between models:** Switch between models fast with a click.
- **Chat history:** Chats are saved and easily accessed.
- **Light & Dark mode:** Switch between light & dark mode.

# Preview

https://github.com/jakobhoeg/nextjs-ollama-llm-ui/assets/114422072/08eaed4f-9deb-4e1b-b87a-ba17d81b9a02

# Requisites ⚙️

To use the web interface, these requisites must be met:

1. Download [Ollama](https://ollama.com/download) and have it running. Or run it in a Docker container. Check the [docs](https://github.com/ollama/ollama) for instructions.
2. Node.js (18+) and npm is required. [Download](https://nodejs.org/en/download)

# Deploy your own to Vercel or Netlify in one click ✨

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjakobhoeg%2Fnextjs-ollama-llm-ui&env=NEXT_PUBLIC_OLLAMA_URL&envDescription=Your%20Ollama%20URL) [![Deploy to Netlify Button](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/jakobhoeg/nextjs-ollama-llm-ui)

You'll need to set your [OLLAMA_ORIGINS](https://github.com/ollama/ollama/blob/main/docs/faq.md) environment variable on your machine that is running Ollama:

```
OLLAMA_ORIGINS="https://your-app.vercel.app/"
```

# Installation 📖

[![Packaging status](https://repology.org/badge/vertical-allrepos/nextjs-ollama-llm-ui.svg?columns=3)](https://repology.org/project/nextjs-ollama-llm-ui/versions)

Use a pre-build package from one of the supported package managers to run a local environment of the web interface.
Alternatively you can install from source with the instructions below.

> [!NOTE]  
> If your frontend runs on something other than `http://localhost` or `http://127.0.0.1`, you'll need to set the OLLAMA_ORIGINS to your frontend url.
>
> This is also stated in the [documentation](https://github.com/ollama/ollama/blob/main/docs/faq.md#how-do-i-configure-ollama-server):
> 
> `Ollama allows cross-origin requests from 127.0.0.1 and 0.0.0.0 by default. Additional origins can be configured with OLLAMA_ORIGINS`

## Install from source

**1. Clone the repository to a directory on your pc via command prompt:**

```
git clone https://github.com/jakobhoeg/nextjs-ollama-llm-ui
```

**2. Open the folder:**

```
cd nextjs-ollama-llm-ui
```

**3. Rename the `.example.env` to `.env`:**

```
mv .example.env .env
```

**4. If your instance of Ollama is NOT running on the default ip-address and port, change the variable in the .env file to fit your usecase:**

```
NEXT_PUBLIC_OLLAMA_URL="http://localhost:11434"
```

**5. Install dependencies:**

```
npm install
```

**6. Start the development server:**

```
npm run dev
```

**5. Go to [localhost:3000](http://localhost:3000) and start chatting with your favourite model!**

# Upcoming features

This is a to-do list consisting of upcoming features.
- ✅ Voice input support
- ✅ Code syntax highlighting
- ⬜️ Ability to send an image in the prompt to utilize vision language models.
- ⬜️ Ability to regenerate responses
- ⬜️ Import and export chats

# Tech stack

[NextJS](https://nextjs.org/) - React Framework for the Web

[TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework

[shadcn-ui](https://ui.shadcn.com/) - UI component built using Radix UI and Tailwind CSS

[shadcn-chat](https://github.com/jakobhoeg/shadcn-chat) - Chat components for NextJS/React projects

[Framer Motion](https://www.framer.com/motion/) - Motion/animation library for React

[Lucide Icons](https://lucide.dev/) - Icon library

# Helpful links

[Medium Article](https://medium.com/@bartek.lewicz/launch-your-own-chatgpt-clone-for-free-on-colab-shareable-and-online-in-less-than-10-minutes-da19e44be5eb) - How to launch your own ChatGPT clone for free on Google Colab. By Bartek Lewicz.

[Lobehub mention](https://lobehub.com/blog/5-ollama-web-ui-recommendation#5-next-js-ollama-llm-ui) - Five Excellent Free Ollama WebUI Client Recommendations
