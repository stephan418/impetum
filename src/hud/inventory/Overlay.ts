import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import PlayerInventory from "../../inventory/PlayerInventory";

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

  render() {
    return html`
      <div id="inventory">
        <h1>Inventory</h1>
        <div>{{inventory content}}</div>
      </div>
      <div id="store">
        <h1>Store</h1>
        <div>{{store content}}</div>
      </div>
    `;
  }
}
