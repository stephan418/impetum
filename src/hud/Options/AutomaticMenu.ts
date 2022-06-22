import { html, LitElement, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ConfigD, ConfigManager } from "../../managers/OptionsManager";
import AutomaticSubmenu from "./AutomaticSubMenu";

@customElement("i-automatic-menu")
export default class AutomaticMenu extends LitElement {
  @property()
  config?: ConfigD;

  @property()
  configManager?: ConfigManager;

  @state()
  subMenu?: TemplateResult;

  setSubMenu(k: string) {
    const v = this.config?.[k];

    if (!v) {
      throw new Error("Cannot find settings group");
    }

    const settings = Object.entries(v).map(
      ([ik, iv]) =>
        [
          ik,
          iv,
          (a: any) => this.configManager?.updateSetting(k as any, ik, a),
          () => this.configManager?.getSetting(k as any, ik),
        ] as const
    );

    this.subMenu = html`<i-automatic-submenu name=${k} .settings=${settings}></i-automatic-submenu>`;
  }

  render() {
    if (!this.config) {
      return html``;
    }

    if (this.subMenu) {
      return this.subMenu;
    }

    return html`<i-menu
      >${Object.entries(this.config).map(
        ([k, v]) => html`<button @click=${() => this.setSubMenu(k)}>${k}</button>`
      )}</i-menu
    >`;
  }
}
