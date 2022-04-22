import ElementNotFoundError from "../errors/ElementNotFoundError";
import Crosshair from "../hud/Crosshair";
import ItemBar from "../hud/ItemBar";
import PauseMenu from "../hud/menu/PauseMenu";
import GameStateManager from "./GameStateManager";
import InputManager from "./InputManager";

export default class HUDManager {
  private root: HTMLElement;
  private gameStateManager: GameStateManager;

  private crossHair: Crosshair;
  private itemBar: ItemBar;
  private pauseMenu: PauseMenu;

  constructor(rootId: string, gameStateManager: GameStateManager) {
    const root = document.getElementById(rootId);

    if (!root) {
      throw new ElementNotFoundError(`Could not find element with ID '${rootId}'`);
    }

    this.root = root;
    this.gameStateManager = gameStateManager;

    this.crossHair = new Crosshair();
    this.itemBar = new ItemBar();
    this.pauseMenu = new PauseMenu();

    this.gameStateManager.addEventListener("pause", () => this.showPauseMenu());
    this.gameStateManager.addEventListener("unpause", () => this.hidePauseMenu());
  }

  public attach() {
    this.root.appendChild(this.crossHair);
    this.root.appendChild(this.itemBar);
  }

  private showPauseMenu() {
    this.root.appendChild(this.pauseMenu);
  }

  private hidePauseMenu() {
    this.root.removeChild(this.pauseMenu);
  }
}
