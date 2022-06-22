import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import cfgMgr from "../../managers/OptionsManager";

@customElement("i-options")
export default class Options extends LitElement {
  render() {
    console.log("test");
    return html` <i-automatic-menu .configManager=${cfgMgr} .config=${cfgMgr.definition}></i-automatic-menu> `;
  }
}
