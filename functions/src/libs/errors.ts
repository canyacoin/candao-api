export class RequestError extends Error {
  public name: string;
  public status: number;
  constructor(message = 'Invalid request') {
    super(message);
    this.name = (this.constructor as any).name;
    this.message = message;
    this.status = 400;
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends Error {
  public name: string;
  public status: number;
  constructor(message = 'Validation error') {
    super(message);
    this.name = (this.constructor as any).name;
    this.message = message;
    this.status = 422;
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotFoundError extends Error {
  public name: string;
  public status: number;
  constructor(message = 'Not found') {
    super(message);
    this.name = (this.constructor as any).name;
    this.message = message;
    this.status = 404;
    Error.captureStackTrace(this, this.constructor)
  }
}

export class AuthorisationError extends Error {
  public name: string;
  public status: number;
  constructor(message = 'Not authorised') {
    super(message);
    this.name = (this.constructor as any).name;
    this.message = message;
    this.status = 401;
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotAllowedError extends Error {
  public name: string;
  public status: number;
  constructor(message = 'Not allowed') {
    super(message);
    this.name = (this.constructor as any).name;
    this.message = message;
    this.status = 403;
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ServerError extends Error {
  public name: string;
  public status: number;
  constructor(message = 'Server error') {
    super(message);
    this.name = (this.constructor as any).name;
    this.message = message;
    this.status = 500;
    Error.captureStackTrace(this, this.constructor)
  }
}