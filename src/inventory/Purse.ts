import DeserializationError from "../errors/DeserializationError";
import ValueError from "../errors/ValueError";
import safeDeserialize from "../helpers/safeDeserialization";
import { Serializable } from "../interfaces/Saveable";

export default class Purse implements Serializable {
  private ownedCurrency: number;

  constructor(initCurrency?: number) {
    this.ownedCurrency = initCurrency ?? 0;
  }

  public static fromSerialized(serialized: string) {
    const deserialized = safeDeserialize(() => JSON.parse(serialized));

    if (typeof deserialized !== "number") {
      throw new DeserializationError("Cannot innit from type " + typeof deserialized);
    }

    return new Purse(deserialized);
  }

  canWithdraw(amount: number) {
    return this.ownedCurrency > amount;
  }

  withdraw(amount: number) {
    if (!this.canWithdraw(amount)) throw new ValueError("Not enough currency left");

    this.ownedCurrency -= amount;

    return amount;
  }

  deposit(amount: number) {
    this.ownedCurrency += amount;
  }

  serialize(): string {
    return JSON.stringify(this.ownedCurrency);
  }

  get content() {
    return this.ownedCurrency;
  }
}
