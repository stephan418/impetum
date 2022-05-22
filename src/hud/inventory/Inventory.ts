import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import PlayerInventory from "../../inventory/PlayerInventory";
import { slotClickEvent } from "./common";

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

  connectedCallback(): void {
    super.connectedCallback();

    this.inventory?.addEventListener("change", async () => await this.requestUpdate());
  }

  handleSlotClick(idx: number, e: MouseEvent) {
    const event = slotClickEvent(e, idx);

    if (!event) return;

    e.preventDefault();
    e.stopPropagation();

    this.dispatchEvent(event);

    return false;
  }

  @property()
  inventory?: PlayerInventory;

  render() {
    return this.inventory?.backContent.map(
      (group, idx) =>
        html`<i-inventory-slot
          @click=${(e: MouseEvent) => this.handleSlotClick(idx, e)}
          @contextmenu=${(e: MouseEvent) => this.handleSlotClick(idx, e)}
          .group=${group ? { item: group.item, amount: group.amount } : undefined}></i-inventory-slot>`
    );
  }
}
