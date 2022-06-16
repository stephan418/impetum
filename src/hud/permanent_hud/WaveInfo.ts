import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("i-wave-info")
class WaveInfo extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      top: min(4%, 4rem);
      height: 5rem;
      min-width: 10rem;

      background: red;
    }
  `;

  render() {
    return html``;
  }
}
