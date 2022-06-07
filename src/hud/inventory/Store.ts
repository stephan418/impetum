import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import InternalStore from "../../inventory/store/store";

@customElement("i-store")
export class Store extends LitElement {
  static styles = css`
    :host {
      position: relative;
      box-sizing: border-box;

      width: 100%;
      max-width: 100%;
      padding: 0 20px;
      margin-bottom: 10%;

      display: flex;
      flex-direction: column;

      gap: 10px;

      overflow-y: auto;
    }
  `;

  constructor() {
    super();

    this.addEventListener("wheel", (e) => e.stopPropagation());
  }

  @property()
  store?: InternalStore;

  handleBuyClick(idx: number) {
    const event = new CustomEvent("store-buy", { detail: { index: idx } });

    this.dispatchEvent(event);
  }

  render() {
    return this.store?.productRange.map(
      (definition, idx) =>
        html`<i-store-slot @buy-click=${() => this.handleBuyClick(idx)} .definition=${definition}></i-store-slot>`
    );
  }
}
