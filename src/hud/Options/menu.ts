import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("i-menu")
export default class Menu extends LitElement {
  static styles = css`
    :host {
      position: absolute;

      background: #ccccccee;

      height: 500px;
      width: 700px;

      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      display: grid;
      grid: 100px 1fr / 1fr;
      box-sizing: border-box;
      justify-content: center;
      padding: 0 150px;
    }

    #items {
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      padding: 10% 0;
    }

    ::slotted(button) {
      height: 50px;
      border: none;
      outline: none;
    }

    h1 {
      display: flex;
      justify-content: center;
      justify-items: center;
    }
  `;

  @property()
  name?: string;

  render() {
    return html`
      <h1>${this.name}</h1>
      <div id="items">
        <slot></slot>
      </div>
    `;
  }
}
