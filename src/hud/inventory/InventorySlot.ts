import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Group } from "../../interfaces/Storage";
import IItem from "../../interfaces/Item";
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

      box-sizing: border-box;
    }

    :host([selected]) {
      border: 4px solid #444444;
    }

    img,
    div {
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
  group?: Group<IItem>;

  @property()
  selected?: boolean;

  render() {
    if (this.selected !== undefined) {
      this.classList.add("selected");
    }

    if (!this.group) {
      return html``;
    }

    if (this.group.item instanceof Item) {
      return html`<img src=${this.group.item.icon} /><span>${this.group.amount}</span>`;
    }

    return html`<div>${this.group.item.id}</div>
      <span>${this.group.amount}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "i-inventory-slot": InventorySlot;
  }
}
