import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Group } from "../../interfaces/Storage";
import Item from "../../inventory/Item";

@customElement("i-inventory-slot")
export class InventorySlot extends LitElement {
  static styles = css`
    :host {
      display: flex;
      position: relative;
      border: 2.5px solid #777777;

      height: 50px;
      width: 50px;
    }

    img {
      height: 80%;
      width: 80%;

      position: absolute;
      top: 50%;
      left: 50%;

      transform: translate(-50%, -50%);
    }

    span {
      font-family: sans-serif;
      position: absolute;
      bottom: 5%;
      right: 5%;

      font-size: 0.8rem;
    }
  `;

  @property()
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
