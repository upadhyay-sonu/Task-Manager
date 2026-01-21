export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class BadRequest extends ApiError {
  constructor(message: string, details?: unknown) {
    super(400, message, details);
    this.name = "BadRequest";
  }
}

export class Unauthorized extends ApiError {
  constructor(message: string = "Unauthorized", details?: unknown) {
    super(401, message, details);
    this.name = "Unauthorized";
  }
}

export class NotFound extends ApiError {
  constructor(message: string, details?: unknown) {
    super(404, message, details);
    this.name = "NotFound";
  }
}

export class Conflict extends ApiError {
  constructor(message: string, details?: unknown) {
    super(409, message, details);
    this.name = "Conflict";
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = "Internal Server Error", details?: unknown) {
    super(500, message, details);
    this.name = "InternalServerError";
  }
}
