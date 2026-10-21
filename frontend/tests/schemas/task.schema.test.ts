import { createTaskSchema } from "@/schemas/task.schema";

const valid = { title: "Write the README", status: "PENDING" as const };

const messagesOf = (input: unknown) => {
  const result = createTaskSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((i) => i.message);
};

describe("createTaskSchema", () => {
  it("should accept a task with title and status only", () => {
    expect(messagesOf(valid)).toEqual([]);
  });

  it("should require the title", () => {
    expect(messagesOf({ ...valid, title: "   " })).toContain(
      "Informe o título da tarefa",
    );
  });

  it("should require at least 3 characters in the title", () => {
    expect(messagesOf({ ...valid, title: "ab" })).toContain(
      "O título precisa ter ao menos 3 caracteres",
    );
    expect(messagesOf({ ...valid, title: "abc" })).toEqual([]);
  });

  it("should limit the title to 100 characters", () => {
    expect(messagesOf({ ...valid, title: "a".repeat(101) })).toContain(
      "O título pode ter no máximo 100 caracteres",
    );
  });

  it("should require a status", () => {
    expect(messagesOf({ title: valid.title })).toContain("Escolha um status");
  });

  it("should accept zero or more teams", () => {
    expect(messagesOf({ ...valid })).toEqual([]);
    expect(messagesOf({ ...valid, teamIds: [] })).toEqual([]);
    expect(messagesOf({ ...valid, teamIds: [1, 2] })).toEqual([]);
  });
});
