import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { config } from "../managers/OptionsManager";

const {
  hud: { hudScale },
} = config;

function slot(i: number) {
  return html` <div class="slot" id="${i}"></div> `;
}

@customElement("i-item-bar")
export default class ItemBar extends LitElement {
  static styles = css`
    :host {
      display: flex;
      position: absolute;

      height: max-content;
      width: max-content;
      background: #cccccccc;

      gap: calc(5px * ${hudScale});
      padding: 5px;
    }

    .slot {
      border: calc(2.5px * ${hudScale}) solid #777777;

      height: calc(50px * ${hudScale});
      width: calc(50px * ${hudScale});
    }
  `;

  @property({ attribute: "size", type: Number })
  size?: number = 9;

  render() {
    return html`
      ${Array(this.size)
        .fill(0)
        .map((_, i) => slot(i))}
    `;
  }
}
