import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("i-pause-menu")
export default class PauseMenu extends LitElement {
  handleUnpauseClick() {
    const event = new CustomEvent("unpause");

    this.dispatchEvent(event);
  }

  handleOptionsClick() {
    const event = new CustomEvent("options-click");

    this.dispatchEvent(event);
  }

  render() {
    return html`
      <i-menu name="Game paused">
        <button @click=${this.handleUnpauseClick} id="resume">Resume</button>
        <button @click=${this.handleOptionsClick}>Options</button>
        <button>Save and Exit</button>
      </i-menu>
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
