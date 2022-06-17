import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("i-wave-info")
class WaveInfo extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      top: min(4%, 4rem);
      height: 5rem;
      min-width: 10rem;
      width: fit-content;

      display: flex;

      background: #cccccccc;

      overflow: hidden;
    }

    h1,
    h2,
    h3 {
      margin: 0;
    }

    #progress-indicator {
      position: relative;

      height: 100%;
      width: min-content;
    }

    #progress-indicator > h2 {
      position: absolute;
      top: 50%;
      left: 0.5rem;

      transform: translateY(-50%);
    }

    i-progress-circle {
      height: 100%;
    }

    i-progress-circle:nth-of-type(2) {
      position: absolute;
      top: -2.5%;

      height: calc(105%);
    }

    div:not(#progress-indicator) {
      margin-right: 2rem;

      display: flex;
      flex-direction: column;

      justify-content: space-evenly;
      align-items: center;
    }
  `;

  @property()
  waveNr: number = 0;

  @property()
  waveCount = 0;

  @property()
  totalEnemies = 1;

  @property()
  enemiesAlive = 1;

  render() {
    return html` <div id="progress-indicator">
        <i-progress-circle
          percentage="${100 - (this.enemiesAlive / this.totalEnemies) * 100}"
          color="red"
          weight="4"></i-progress-circle
        ><i-progress-circle color="#000000aa"></i-progress-circle>
        <h2>${this.enemiesAlive}</h2>
      </div>
      <div id="active">
        <h2>${this.waveCount}</h2>
        <h3>Active</h3>
      </div>
      <div id="level">
        <h2>${this.waveNr}</h2>
        <h3>Level</h3>
      </div>`;
  }
}
