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

  connectedCallback(): void {
    super.connectedCallback();

    this.inventory?.addEventListener("change", async () => await this.requestUpdate());
  }

  handleSlotClick(idx: number, e: MouseEvent) {
    e.stopPropagation();

    const event = new CustomEvent("slot-click", { detail: { idx, mouse: { pageY: e.pageY, pageX: e.pageX } } });
    this.dispatchEvent(event);
  }

  @property()
  inventory?: PlayerInventory;

  render() {
    return this.inventory?.backContent.map(
      (group, idx) =>
        html`<i-inventory-slot
          @click=${(e: MouseEvent) => this.handleSlotClick(idx, e)}
          .group=${group}></i-inventory-slot>`
    );
  }
}
