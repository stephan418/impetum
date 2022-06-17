import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("i-purse-info")
export default class PurseInfo extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      top: calc(min(4%, 4rem) + 5rem + 1rem);
      height: 5rem;
      min-width: 10rem;
      width: fit-content;

      background: #cccccccc;

      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
    }

    h2,
    h3 {
      margin: 0;
    }
  `;

  @property({ type: Number })
  purseAmount = 0;

  render() {
    return html`
      <h2>${this.purseAmount}</h2>
      <h3>Shards</h3>
    `;
  }
}
