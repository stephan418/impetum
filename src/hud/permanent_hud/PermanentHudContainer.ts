import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("i-permanent-hud")
export default class PermanentHudController extends LitElement {
  static styles = css`
    :host {
      position: absolute;

      top: 0;
      left: 0;

      width: 100vw;
      height: 100vh;
    }
  `;

  render() {
    return html`<i-wave-info></i-wave-info>`;
  }
}
