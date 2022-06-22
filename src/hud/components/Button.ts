import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("i-button")
export default class Button extends LitElement {
  static styles = css`
    button {
      font-size: 1rem;

      outline: none;
      border: 2px solid #777777;
      border-radius: 5px;

      background: white;

      padding: 5px 20px;
    }
  `;

  render() {
    return html` <button><slot></slot></button> `;
  }
}
