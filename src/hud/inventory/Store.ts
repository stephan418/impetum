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
    }
  `;

  @property()
  store?: InternalStore;

  render() {
    console.log(this.store);

    return this.store?.productRange.map(
      (definition, idx) => html`<i-store-slot .definition=${definition}></i-store-slot>`
    );
  }
}
