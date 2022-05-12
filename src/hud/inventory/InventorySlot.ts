import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Group } from "../../interfaces/Storage";
import Item from "../../inventory/Item";

@customElement("i-inventory-slot")
class InventorySlot extends LitElement {
  static styles = css`
    :host {
      display: flex;
      position: relative;
      border: 2.5px solid #777777;

      height: 100%;
      width: 100%;
    }
  `;

  @property({ attribute: "group" })
  group?: Group<Item>;

  render() {
    if (!this.group) {
      return html``;
    }

    return html`<img src=${"icon"} /><span>${this.group.amount}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "i-inventory-slot": InventorySlot;
  }
}
