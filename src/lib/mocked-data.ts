import { get, writable } from 'svelte/store';

export type Chat = {
  id: number;
  name: string;
  message: string;
  time: string;
  unread: boolean;
};

export const chatList = writable<Chat[]>([
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
]);

export const selectedChatId = writable<number | null>(1);

export function createChat(name: string) : number {
  const chats = get(chatList);
  const newId = chats.length > 0 ? Math.max(...chats.map(chat => chat.id)) + 1 : 1;
  chatList.update(chats => [
    ...chats,
    {
      id: newId,
      name,
      message: '',
      time: new Date().toLocaleTimeString(),
      unread: true,
    }
  ]);

  selectedChatId.set(newId);

  return newId;
}

export function deleteChat(id: number) {
  chatList.update(chats => chats.filter(chat => chat.id !== id));
}
