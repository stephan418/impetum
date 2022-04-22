import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("i-crosshair")
class Crosshair extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 10px;
      height: 10px;
      position: absolute;
    }

    span {
      background: #ddd;
      position: absolute;
      overflow: hidde;
    }

    #vertical {
      height: 10px;
      width: 2px;
      left: 50%;
      top: calc(50% - 4px);
    }

    #horizontal {
      height: 2px;
      width: 10px;
      left: calc(50% - 4px);
      top: 50%;
    }
  `;

  render() {
    return html`<span id="horizontal"></span> <span id="vertical"></span>`;
  }
}
