import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ConfigD, ConfigManager } from "../../managers/OptionsManager";

@customElement("i-automatic-submenu")
export default class AutomaticSubmenu extends LitElement {
  @property()
  name = "AutomaticMenu";

  @property()
  settings?: [string, ConfigD[string][string], (value: any) => unknown, () => any][];

  render() {
    if (!this.settings) {
      return html``;
    }

    return html`
      <i-menu title=${this.name}>
        ${this.settings.map(([n, k, v, vv]) => {
          if (k.t === "boolean") {
            return html`<i-toggle-button
              @click=${() => v(false)}
              ?value=${vv()}
              falseText=${`${n}: Off`}
              trueText=${`${n}: On`}></i-toggle-button>`;
          }
        })}
      </i-menu>
    `;
  }
}
