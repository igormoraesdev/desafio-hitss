import { createTeamSchema } from "@/schemas/team.schema";

const valid = { name: "Frontend", color: "#3B82F6" };

const messagesOf = (input: unknown) => {
  const result = createTeamSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((i) => i.message);
};

describe("createTeamSchema", () => {
  it("should accept a team with name and color", () => {
    expect(messagesOf(valid)).toEqual([]);
  });

  it("should trim the name", () => {
    const result = createTeamSchema.safeParse({ ...valid, name: "  QA  " });
    expect(result.success).toBe(true);
    expect(result.data?.name).toBe("QA");
  });

  it("should require the name", () => {
    expect(messagesOf({ ...valid, name: "   " })).toContain(
      "Informe o nome do time",
    );
  });

  it("should limit the name to 50 characters", () => {
    expect(messagesOf({ ...valid, name: "a".repeat(51) })).toContain(
      "O nome pode ter no máximo 50 caracteres",
    );
  });

  it("should accept 3 and 6 digit hex colors", () => {
    expect(messagesOf({ ...valid, color: "#fff" })).toEqual([]);
    expect(messagesOf({ ...valid, color: "#00B37E" })).toEqual([]);
  });

  it("should reject a color that is not hexadecimal", () => {
    expect(messagesOf({ ...valid, color: "" })).toContain("Escolha uma cor");
    expect(messagesOf({ ...valid, color: "azul" })).toContain(
      "Escolha uma cor",
    );
    expect(messagesOf({ ...valid, color: "#12345" })).toContain(
      "Escolha uma cor",
    );
  });
});
