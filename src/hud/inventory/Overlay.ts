import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import ValueError from "../../errors/ValueError";
import PlayerInventory from "../../inventory/PlayerInventory";
import InternalStore from "../../inventory/store/store";

@customElement("i-inventory-overlay")
export default class InventoryOverlay extends LitElement {
  static styles = css`
    :host {
      position: absolute;

      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      display: grid;
      grid: 1fr / 1fr 1fr;

      background: #cccccccc;
      height: clamp(400px, 70vh, 700px);
      width: clamp(500px, 80vw, 800px);
    }

    :host::before {
      content: "";
      position: absolute;
      background: #777777;
      width: 2px;
      height: 70%;

      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    :host > div {
      display: grid;

      grid: 20% 1fr / 1fr;
      justify-items: center;

      height: 100%;

      overflow: auto;
    }

    #inventory {
      overflow: hidden;
    }

    :host > div > div {
      margin-bottom: 10%;
      width: 90%;
    }
  `;

  private _inventory?: PlayerInventory;

  private onInventoryChange() {}

  @property({
    type: PlayerInventory,
  })
  set inventory(v: PlayerInventory) {
    v.addEventListener("change", this.onInventoryChange.bind(this));

    this._inventory = v;
  }

  @property()
  store?: InternalStore;

  handleNotEnoughMoney() {
    this.dispatchEvent(new CustomEvent("not-enough-money"));
  }

  handleSlotClick(idx: number, e: CustomEvent) {
    this.dispatchEvent(new CustomEvent("slot-click", { detail: { idx, mouse: e.detail.mouse } }));
  }

  handleStoreBuy(e: CustomEvent<{ index: number }>) {
    if (this.store && this._inventory) {
      try {
        const boughtItem = this.store.buyIndex(e.detail.index, this._inventory.pursePaymentMethod);

        this._inventory.collect(boughtItem.item, boughtItem.amount);
      } catch (e) {
        if (e instanceof ValueError) {
          return this.handleNotEnoughMoney();
        }
      }
      throw e;
    }
  }

  render() {
    return html`
      <div id="inventory">
        <h1>Inventory</h1>
        <i-inventory
          @slot-click=${(e: CustomEvent) =>
            this.handleSlotClick(e.detail.idx + this._inventory?.hotbarContent.length, e)}
          .inventory=${this._inventory}></i-inventory>
      </div>
      <div id="store">
        <h1>Store</h1>
        <i-store @store-buy=${this.handleStoreBuy} .store=${this.store}></i-store>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "i-inventory-overlay": InventoryOverlay;
  }
}
