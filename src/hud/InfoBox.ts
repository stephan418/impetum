import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("i-info-box")
export class InfoBox extends LitElement {
  static styles = css`
    :host {
      width: fit-content;
      height: fit-content;
      padding: 20px;

      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      gap: 10px;

      background: #bbbbbb;
    }
  `;

  handleClose() {
    this.dispatchEvent(new CustomEvent("close"));
  }

  @property({ type: String })
  message?: string;

  render() {
    return html`
      ${this.message ?? "Info"}
      <button @click=${this.handleClose}>Close</button>
    `;
  }
}
