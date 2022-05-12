import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Group } from "../../interfaces/Storage";
import Item from "../../inventory/Item";

@customElement("i-inventory-slot")
class InventorySlot extends LitElement {
  static styles = css`
    :host {
      display: flex;
      position: relative;

      height: 100%;
      width: 100%;
    }
  `;

  @property({ attribute: "group" })
  group?: Group<Item>;

  render() {
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "i-inventory-slot": InventorySlot;
  }
}
