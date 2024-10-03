
import { CoreMessage } from "ai";
import { create } from "zustand";

interface State {
  base64Images: string[] | null;
  messages: CoreMessage[];
}

interface Actions {
  setBase64Images: (base64Images: string[] | null) => void;
  setMessages: (
    fn: (
      messages: CoreMessage[]
    ) => CoreMessage[]
  ) => void;
}

const useChatStore = create<State & Actions>()(
  (set) => ({
    base64Images: null,
    setBase64Images: (base64Images) => set({ base64Images }),

    messages: [],
    setMessages: (fn) => set((state) => ({ messages: fn(state.messages) })),
  })
)

export default useChatStore;