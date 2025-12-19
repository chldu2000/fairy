import { writable } from 'svelte/store';

export const chatList = [
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

export const selectedChatId = writable<number | null>(1);
