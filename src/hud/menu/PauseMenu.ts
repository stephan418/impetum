import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("i-pause-menu")
export default class PauseMenu extends LitElement {
  static styles = css`
    :host {
      position: absolute;

      background: #ccccccee;

      height: 500px;
      width: 700px;
    }

    .content {
      display: grid;

      width: 100%;
      height: 100%;

      box-sizing: border-box;

      grid: 100px 1fr / 1fr;

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

  handleUnpauseClick() {
    const event = new CustomEvent("unpause");

    this.dispatchEvent(event);
  }

  render() {
    return html`
      <div @click=${this.onInnerClick} class="content">
        <h1>Game paused</h1>
        <div id="options">
          <button @click=${this.handleUnpauseClick} id="resume">Resume</button>
          <button>Options</button>
          <button>Save and Exit</button>
        </div>
      </div>
    `;
  }

  onInnerClick(e: MouseEvent) {
    e.stopPropagation();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "i-pause-menu": PauseMenu;
  }
}
