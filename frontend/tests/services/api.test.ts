import { getApiErrorMessage } from "@/services/api";
import { AxiosError, AxiosHeaders } from "axios";

const axiosError = (data: unknown, status = 400) =>
  new AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, {
    data,
    status,
    statusText: "",
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

describe("getApiErrorMessage", () => {
  it("should return the fallback for a non axios error", () => {
    expect(getApiErrorMessage(new Error("boom"), "fallback")).toBe("fallback");
  });

  it("should warn about the connection when there is no response", () => {
    const error = new AxiosError("Network Error", "ERR_NETWORK");
    expect(getApiErrorMessage(error, "fallback")).toBe(
      "Não foi possível conectar à API",
    );
  });

  it("should return the API error message", () => {
    const error = axiosError({
      error: { code: "CONFLICT", message: 'Já existe um time com o nome "QA"' },
    });
    expect(getApiErrorMessage(error, "fallback")).toBe(
      'Já existe um time com o nome "QA"',
    );
  });

  it("should join the validation details", () => {
    const error = axiosError({
      error: {
        code: "VALIDATION_ERROR",
        message: "Dados inválidos",
        details: ["title é obrigatório", "color é obrigatório"],
      },
    });
    expect(getApiErrorMessage(error, "fallback")).toBe(
      "title é obrigatório\ncolor é obrigatório",
    );
  });

  it("should return the fallback when the body has no envelope", () => {
    expect(getApiErrorMessage(axiosError("<html>", 502), "fallback")).toBe(
      "fallback",
    );
  });
});
