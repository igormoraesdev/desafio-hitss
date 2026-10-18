import { Tasks } from "./task";

export type Teams = {
  name: string;
  color: string;
  tasks: Tasks[];
  createdAt: string;
};
