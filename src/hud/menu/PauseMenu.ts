import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("i-pause-menu")
export default class PauseMenu extends LitElement {
  static styles = css`
    :host {
      display: grid;
      position: absolute;

      box-sizing: border-box;

      grid: 100px 1fr / 1fr;

      background: #ccccccee;

      height: 500px;
      width: 700px;

      justify-content: center;
      padding: 0 150px;
    }

    h1 {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    #options {
      display: flex;
      flex-direction: column;

      justify-content: space-around;
      padding: 10% 0;
    }

    button {
      height: 50px;

      border: none;
      outline: none;
    }
  `;

  render() {
    return html`
      <h1>Game paused</h1>
      <div id="options">
        <button>Resume</button>
        <button>Options</button>
        <button>Save and Exit</button>
      </div>
    `;
  }
}
