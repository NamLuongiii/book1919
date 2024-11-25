import { Location } from "epubjs";

type BookProgress = {
  id: string;
  location?: string[];
  located?: Location;
};

export type LocalStorageObject = {
  [slug: string]: BookProgress;
};

const STORAGE_KEY = "b_h";
const MAX_LENGTH = 10;

export const storage = {
  get: (slug: string): BookProgress | undefined => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data)[slug] : undefined;
  },
  getAll: (): LocalStorageObject => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  },
  set: (slug: string, book: { location?: string[]; located?: Location }) => {
    const data = localStorage.getItem(STORAGE_KEY);
    const all_book: LocalStorageObject = data ? JSON.parse(data) : {};

    const _book: BookProgress | undefined = all_book[slug];
    if (!_book) {
      all_book[slug] = { ...book, id: slug };
    } else {
      if (book.location) _book.location = book.location;
      if (book.located) _book.located = book.located;
    }

    if (Object.keys(all_book).length > MAX_LENGTH) {
      delete all_book[Object.keys(all_book)[MAX_LENGTH + 1]];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all_book));
  },
};
