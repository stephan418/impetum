import ElementNotFoundError from "../errors/ElementNotFoundError";
import Crosshair from "../hud/Crosshair";
import InventoryOverlay from "../hud/inventory/Overlay";
import ItemBar from "../hud/ItemBar";
import PauseMenu from "../hud/menu/PauseMenu";
import PlayerInventory from "../inventory/PlayerInventory";
import GameStateManager from "./GameStateManager";

export default class HUDManager {
  private root: HTMLElement;
  private gameStateManager: GameStateManager;

  private crossHair: Crosshair;
  private itemBar: ItemBar;
  private pauseMenu: PauseMenu;
  private inventoryOverlay: InventoryOverlay;

  constructor(rootId: string, gameStateManager: GameStateManager, playerInventory: PlayerInventory) {
    const root = document.getElementById(rootId);

    if (!root) {
      throw new ElementNotFoundError(`Could not find element with ID '${rootId}'`);
    }

    this.root = root;
    this.gameStateManager = gameStateManager;

    this.crossHair = new Crosshair();
    this.itemBar = new ItemBar();
    this.pauseMenu = new PauseMenu(() => gameStateManager.unpause());
    this.inventoryOverlay = new InventoryOverlay();

    this.inventoryOverlay.inventory = playerInventory;

    this.gameStateManager.addEventListener("pause", () => this.showPauseMenu());
    this.gameStateManager.addEventListener("unpause", () => this.hidePauseMenu());
  }

  public attach() {
    this.root.appendChild(this.crossHair);
    this.root.appendChild(this.itemBar);
    this.root.appendChild(this.inventoryOverlay);
  }

  private showPauseMenu() {
    this.root.appendChild(this.pauseMenu);
  }

  private hidePauseMenu() {
    this.root.removeChild(this.pauseMenu);
  }
}
