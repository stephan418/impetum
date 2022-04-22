import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

function slot(i: number) {
  return html` <div class="slot" id="${i}"></div> `;
}

@customElement("i-item-bar")
export default class ItemBar extends LitElement {
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
