import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("i-toggle-button")
export default class ToggleButton extends LitElement {
  static styles = css`
    button {
      height: 50px;
      border: none;
      outline: none;
      width: 100%;
    }
  `;

  @property()
  value = false;

  @property()
  set default(d: boolean) {
    this.value = d;
  }

  @property()
  trueText = "true";

  @property()
  falseText = "false";

  render() {
    return html`
      <button @click=${() => (this.value = !this.value)}>${this.value ? this.trueText : this.falseText}</button>
    `;
  }
}
