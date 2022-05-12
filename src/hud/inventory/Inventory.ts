import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import PlayerInventory from "../../inventory/PlayerInventory";

@customElement("i-inventory")
export class Inventory extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      max-width: 100%;
      margin-bottom: 10%;

      justify-content: center;

      display: grid;

      grid-template-columns: repeat(auto-fill, 50px);
      grid-template-rows: repeat(auto-fill, 50px);

      gap: 10px;
    }
  `;

  @property()
  inventory?: PlayerInventory;

  render() {
    return this.inventory?.backContent.map((group) => html`<i-inventory-slot .group=${group}></i-inventory-slot>`);
  }
}
