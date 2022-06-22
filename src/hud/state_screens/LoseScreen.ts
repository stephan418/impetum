import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("i-lose-screen")
export class LoseScreen extends LitElement {
  static styles = css`
    :host {
      position: absolute;

      background: #000000cc;

      top: 0;
      bottom: 0;
      left: 0;
      right: 0;

      z-index: 5;

      animation: forwards 1s fade-in;
    }

    h1 {
      color: red;
    }

    h2 {
      color: white;
    }

    :host > h1,
    :host > h2 {
      display: block;
      width: fit-content;
      margin: 0;

      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-49%, -50%);
      font-size: 1.5em;

      transform-origin: center;

      animation: ease-in-out forwards 3s animate-up;
    }

    i-button {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      opacity: 0;
      animation: forwards 500ms fade-in;
      animation-delay: 3s;
    }

    @keyframes animate-up {
      0% {
        font-size: 2.5em;
      }

      50% {
        font-size: 2.5em;
      }

      70% {
        font-size: 1.8em;
        top: 50%;
      }

      80% {
        font-size: 1.8em;
        top: 50%;
      }

      100% {
        font-size: 1.8em;
        top: 10%;
      }
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }
  `;

  render() {
    return html`
      <h1>The enemies destroyed the last crystal</h1>
      <h2>There goes the last bit of hope...</h2>
      <i-button @click=${() => location.reload()}>Restart</i-button>
    `;
  }
}
