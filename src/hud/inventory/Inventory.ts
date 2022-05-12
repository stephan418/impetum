import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators";
import PlayerInventory from "../../inventory/PlayerInventory";

@customElement("i-inventory")
export class Inventory extends LitElement {
  @property()
  inventory?: PlayerInventory;

  render() {
    return this.inventory?.backContent.map((group) => html`<i-inventory-slot .group=${group}></i-inventory-slot>`);
  }
}
