import ValueError from "../errors/ValueError";

export default class Purse {
  private ownedCurrency: number;

  constructor(initCurrency?: number) {
    this.ownedCurrency = initCurrency ?? 0;
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
}
