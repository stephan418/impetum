import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Group } from "../interfaces/Storage";
import Item from "../inventory/Item";
import PlayerInventory from "../inventory/PlayerInventory";
import { config } from "../managers/OptionsManager";

const {
  hud: { hudScale },
} = config;

@customElement("i-item-bar")
export default class ItemBar extends LitElement {
  static styles = css`
    :host {
      display: flex;
      position: absolute;

      height: max-content;
      width: max-content;
      background: #cccccccc;

      gap: calc(5px * ${hudScale});
      padding: 5px;
    }
  `;

  @property({ attribute: "size", type: Number })
  size?: number = 9;

  @property()
  inventory?: PlayerInventory;

  connectedCallback(): void {
    super.connectedCallback();

    this.inventory?.addEventListener("change", async () => await this.requestUpdate());
  }

  handleSlotClick(idx: number, e: MouseEvent) {
    e.stopPropagation();

    const event = new CustomEvent("slot-click", { detail: { idx, mouse: { pageY: e.pageY, pageX: e.pageX } } });
    this.dispatchEvent(event);
  }

  render() {
    return html`
      ${this.inventory?.hotbarContent.map(
        (group, i) =>
          html`<i-inventory-slot
            @click=${(e: MouseEvent) => this.handleSlotClick(i, e)}
            .group=${group}></i-inventory-slot>`
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "i-item-bar": ItemBar;
  }
}
