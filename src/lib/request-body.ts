export class RequestBodyError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
  ) {
    super(message);
  }
}

export async function readJsonBody<T>(request: Request, maxBytes = 128 * 1024): Promise<T> {
  const lengthHeader = request.headers.get("content-length");
  const contentLength = lengthHeader ? Number(lengthHeader) : 0;

  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new RequestBodyError("Payload muito grande.", 413);
  }

  const text = await request.text();

  if (text.length > maxBytes) {
    throw new RequestBodyError("Payload muito grande.", 413);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new RequestBodyError("JSON invalido.", 400);
  }
}
