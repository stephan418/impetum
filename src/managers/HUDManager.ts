import ElementNotFoundError from "../errors/ElementNotFoundError";
import Crosshair from "../hud/Crosshair";
import { InventorySlot } from "../hud/inventory/InventorySlot";
import InventoryOverlay from "../hud/inventory/Overlay";
import ItemBar from "../hud/ItemBar";
import PauseMenu from "../hud/menu/PauseMenu";
import PlayerInventory from "../inventory/PlayerInventory";
import GameStateManager from "./GameStateManager";

export default class HUDManager {
  private root: HTMLElement;
  private gameStateManager: GameStateManager;

  private playerInventory: PlayerInventory;

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

    this.playerInventory = playerInventory;

    this.crossHair = new Crosshair();
    this.itemBar = new ItemBar();
    this.pauseMenu = new PauseMenu();
    this.inventoryOverlay = new InventoryOverlay();

    this.pauseMenu.addEventListener("unpause", () => this.gameStateManager.unpause());
    this.inventoryOverlay.addEventListener("slot-click", (e: any) => this.showMoveSlot(e.detail.idx, e.detail.mouse));
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

  private showMoveSlot(idx: number, mouse: { pageY: number; pageX: number }) {
    const slot = new InventorySlot();
    slot.group = this.playerInventory.content[idx];

    slot.style.position = "absolute";

    slot.style.left = mouse.pageX + "px";
    slot.style.top = mouse.pageY + "px";

    slot.style.transform = "translate(-50%, -50%) scale(0.6)";

    document.addEventListener("mousemove", (e) => {
      slot.style.left = e.pageX + "px";
      slot.style.top = e.pageY + "px";
    });

    this.root.appendChild(slot);
  }
}
