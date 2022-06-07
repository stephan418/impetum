import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Group } from "../../interfaces/Storage";
import Item from "../../interfaces/Item";
import { ProductDefinition } from "../../inventory/store/store";

@customElement("i-store-slot")
export class StoreSlot extends LitElement {
  static styles = css`
    :host {
      display: grid;
      grid: 1fr / max-content 1fr;

      border: 2px solid #777777;

      background: #cccccccc;

      padding: 10px;
    }

    i-inventory-slot {
      margin: 0 10px;
    }

    #icon-container {
      display: flex;

      align-items: center;
      justify-content: center;
    }

    h1,
    h2,
    button {
      margin: 0;
    }

    h1 {
      font-size: 1.5rem;
    }

    h2 {
      font-size: 1.2rem;
      font-weight: normal;
    }

    button {
      font-size: 1rem;

      outline: none;
      border: 2px solid #777777;
      border-radius: 5px;

      background: white;

      margin-top: 20px;
      padding: 5px 20px;
    }

    .transaction-area {
      display: grid;

      grid: 1.2fr 1fr / 1fr;

      justify-items: center;
    }
  `;

  @property()
  definition?: ProductDefinition;

  render() {
    if (!this.definition) {
      return html``;
    }

    const group: Group<Item> = { item: this.definition.item, amount: this.definition.batchSize };

    return html`<div id="icon-container"><i-inventory-slot .group=${group}></i-inventory-slot></div>
      <div class="transaction-area">
        <h1>${this.definition.description}</h1>
        <h2>x ${this.definition.batchSize}</h2>

        <button>Buy for ${this.definition.batchPrize} shards</button>
      </div>`;
  }
}
