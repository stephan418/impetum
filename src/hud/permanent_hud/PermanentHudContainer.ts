import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import PlayerInventory from "../../inventory/PlayerInventory";
import WaveManager from "../../managers/WaveManager";

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

  connectedCallback() {
    super.connectedCallback();

    this.inventory?.addEventListener("change", async () => await this.requestUpdate());
    this.waveManager?.addEventListener("wave", async () => await this.requestUpdate());
  }

  @property()
  inventory?: PlayerInventory;

  @property()
  waveManager?: WaveManager;

  render() {
    return html`<i-wave-info></i-wave-info>`;
  }
}
