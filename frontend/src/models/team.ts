import { Tasks } from "./task";

export type Teams = {
  id: number;
  name: string;
  color: string;
  tasks: Tasks[];
  createdAt: string;
};
