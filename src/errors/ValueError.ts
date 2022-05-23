export default class ValueError extends Error {
  constructor(message?: string) {
    super(message ?? "ValueError");

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
  }
}
