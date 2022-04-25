import Item from "./Item";

export interface Group<C extends Item> {
  item: C;
  amount: number;
}

export default interface Storage<C extends Item> {
  open(): readonly (Readonly<Group<C>> | undefined)[];

  retrieve(id: C["id"], amount: number): Group<C> | null;
  store(c: C, amount: number): void;
}
