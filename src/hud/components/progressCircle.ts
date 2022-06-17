import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("i-progress-circle")
export class ProgressCircle extends LitElement {
  static styles = css`
    :host {
      position: relative;
      aspect-ratio: 1;
      display: block;

      transform: translate(-50%);
    }

    div {
      height: 100%;
      width: 100%;

      box-sizing: border-box;

      border-radius: 50%;
      border-bottom-color: transparent;
      border-left-color: transparent;
    }
  `;

  @property({ type: Number })
  percentage = 0;

  @property({ type: String })
  color = "black";

  @property({ type: Number })
  weight = 2;

  render() {
    return html`
      <style>
        div {
          transform: rotate(calc(45deg + ${this.percentage * 1.8}deg));

          border: ${this.weight}px solid ${this.color};
        }
      </style>
      <div></div>
    `;
  }
}
