import { SvelteDate } from "svelte/reactivity";

export type Chat = {
  id: number;
  name: string;
  message: string;
  time: string;
  unread: boolean;
};

export const chatHistory = $state({
  sessions: [
    {
      id: 1,
      name: 'Jane',
      message: 'Hi, how are you?',
      time: '10:00 AM',
      unread: true,
    },
    {
      id: 2,
      name: 'John',
      message: 'I am good, how about you?',
      time: '10:05 AM',
      unread: false,
    },
  ]
} as { sessions: Chat[] });

export const selectedChat = $state({
  id: -1
})
export function selectChat(id: number) {
  selectedChat.id = id;
}

export function createChat(name: string) : number {
  const newId = chatHistory.sessions.length > 0 ? Math.max(...chatHistory.sessions.map(chat => chat.id)) + 1 : 1;
  chatHistory.sessions.push(
    {
      id: newId,
      name,
      message: '',
      time: new SvelteDate().toLocaleTimeString(),
      unread: true,
    }
  );

  selectedChat.id = newId;

  return newId;
}

export function deleteChat(id: number) {
  chatHistory.sessions = chatHistory.sessions.filter(chat => chat.id !== id);
}
