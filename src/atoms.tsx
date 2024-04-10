import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

export interface IToDo {
  id: number;
  text: string;
}

interface IToDoState {
  id: number;
  title: string;
  list: IToDo[];
}

const { persistAtom } = recoilPersist({
  key: "todoLocal",
  storage: localStorage,
});

export const toDoState = atom<IToDoState[]>({
  key: "toDo",
  default: [
    {
      id: 123,
      title: "To Do",
      list: [
        { id: 0, text: "공부 하기" },
        { id: 1, text: "todo list page complete" },
      ],
    },
    {
      id: 456,
      title: "Done",
      list: [{ id: 29389, text: "asd" }],
    },
  ],
  effects_UNSTABLE: [persistAtom],
});
