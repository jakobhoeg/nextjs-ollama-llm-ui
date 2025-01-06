import { CoreMessage, generateId, Message } from "ai";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ChatSession {
  messages: Message[];
  createdAt: string;
}

interface State {
  base64Images: string[] | null;
  chats: Record<string, ChatSession>;
  currentChatId: string | null;
  selectedModel: string | null;
  userName: string | "Anonymous";
  isDownloading: boolean; // New: Track download state
  downloadProgress: number; // New: Track download progress
  downloadingModel: string | null; // New: Track which model is being downloaded
}

interface Actions {
  setBase64Images: (base64Images: string[] | null) => void;
  setMessages: (chatId: string, fn: (messages: Message[]) => Message[]) => void;
  setCurrentChatId: (chatId: string) => void;
  setSelectedModel: (selectedModel: string) => void;
  getChatById: (chatId: string) => ChatSession | undefined;
  getMessagesById: (chatId: string) => Message[];
  saveMessages: (chatId: string, messages: Message[]) => void;
  handleDelete: (chatId: string, messageId?: string) => void;
  setUserName: (userName: string) => void;
  startDownload: (modelName: string) => void; // New: Start download
  stopDownload: () => void; // New: Stop download
  setDownloadProgress: (progress: number) => void; // New: Update progress
}

const useChatStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      base64Images: null,
      chats: {},
      currentChatId: null,
      selectedModel: null,
      userName: "Anonymous",
      isDownloading: false, // Default download state
      downloadProgress: 0, // Default progress
      downloadingModel: null, // Default downloading model

      // Existing actions
      setBase64Images: (base64Images) => set({ base64Images }),
      setUserName: (userName) => set({ userName }),
      setMessages: (chatId, fn) =>
        set((state) => {
          const existingChat = state.chats[chatId];
          const updatedMessages = fn(existingChat?.messages || []);

          return {
            chats: {
              ...state.chats,
              [chatId]: {
                ...existingChat,
                messages: updatedMessages,
                createdAt: existingChat?.createdAt || new Date().toISOString(),
              },
            },
          };
        }),
      setCurrentChatId: (chatId) => set({ currentChatId: chatId }),
      setSelectedModel: (selectedModel) => set({ selectedModel }),
      getChatById: (chatId) => {
        const state = get();
        return state.chats[chatId];
      },
      getMessagesById: (chatId) => {
        const state = get();
        return state.chats[chatId]?.messages || [];
      },
      saveMessages: (chatId, messages) => {
        console.log(`Saving messages for chatId: ${chatId}`, messages);
        set((state) => {
          const existingChat = state.chats[chatId];

          return {
            chats: {
              ...state.chats,
              [chatId]: {
                messages: [...messages],
                createdAt: existingChat?.createdAt || new Date().toISOString(),
              },
            },
          };
        });
      },
      handleDelete: (chatId, messageId) => {
        set((state) => {
          const chat = state.chats[chatId];
          if (!chat) return state;

          // If messageId is provided, delete specific message
          if (messageId) {
            const updatedMessages = chat.messages.filter(
              (message) => message.id !== messageId
            );
            return {
              chats: {
                ...state.chats,
                [chatId]: {
                  ...chat,
                  messages: updatedMessages,
                },
              },
            };
          }

          // If no messageId, delete the entire chat
          const { [chatId]: _, ...remainingChats } = state.chats;
          return {
            chats: remainingChats,
          };
        });
      },

      // New actions for download state
      startDownload: (modelName) =>
        set({ isDownloading: true, downloadingModel: modelName, downloadProgress: 0 }),
      stopDownload: () =>
        set({ isDownloading: false, downloadingModel: null, downloadProgress: 0 }),
      setDownloadProgress: (progress) => set({ downloadProgress: progress }),
    }),
    {
      name: "nextjs-ollama-ui-state",
      partialize: (state) => ({
        chats: state.chats,
        currentChatId: state.currentChatId,
        selectedModel: state.selectedModel,
        userName: state.userName,
      }),
    }
  )
);

export default useChatStore;