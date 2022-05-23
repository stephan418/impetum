import ValueError from "../../errors/ValueError";
import Item from "../../interfaces/Item";
import { Group } from "../../interfaces/Storage";

interface PaymentMethod {
  withdraw(amount: number): number;
  deposit(amount: number): void;
}

export interface ProductDefinition {
  item: Item;
  description: string;
  batchSize: number;
  batchPrize: number;
}

export default class Store {
  private productRange: ProductDefinition[];
  private saleMultiplier: number;

  constructor(productRange: ProductDefinition[], saleMultiplier = 0.5) {
    this.productRange = productRange;
    this.saleMultiplier = saleMultiplier;
  }

  buyIndex(index: number, paymentMethod: PaymentMethod): Group<Item> {
    const product = this.productRange[index];

    if (!product) throw RangeError("Product out of range");

    const payment = paymentMethod.withdraw(product.batchPrize);

    if (payment < product.batchPrize) {
      throw new ValueError("Payment is not high enough");
    }

    return { item: product.item, amount: product.batchSize };
  }

  salePrice(group: Group<Item>, product?: ProductDefinition) {
    if (!product) product = this.productRange.find((product) => group.item.id === product.item.id);

    if (!product) throw new ValueError("The requested item cannot be sold here!");

    return Math.floor((product.batchPrize / product.batchSize) * this.saleMultiplier * group.amount);
  }

  sell(group: Group<Item>, paymentMethod: PaymentMethod) {
    const product = this.productRange.find((product) => group.item.id === product.item.id);

    if (!product) throw new ValueError("The requested item cannot be sold here!");

    const salesPrice = this.salePrice(group, product);
    paymentMethod.deposit(salesPrice);

    return salesPrice;
  }
}
