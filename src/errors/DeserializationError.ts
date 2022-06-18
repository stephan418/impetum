export default class DeserializationError extends Error {
  constructor(message?: string, readonly origin?: Error) {
    super(message ?? "DeserializationError");

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
  }
}
