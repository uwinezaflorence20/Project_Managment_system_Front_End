import type { ApiErrorBody } from "./types";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, body: Partial<ApiErrorBody> | undefined) {
    const message = Array.isArray(body?.message)
      ? body.message.join(" ")
      : body?.message ?? "Something went wrong. Please try again.";
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function toApiError(response: Response): Promise<ApiError> {
  let body: Partial<ApiErrorBody> | undefined;
  try {
    body = await response.json();
  } catch {
    body = undefined;
  }
  return new ApiError(response.status, body);
}
