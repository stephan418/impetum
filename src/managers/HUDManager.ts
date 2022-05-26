import ElementNotFoundError from "../errors/ElementNotFoundError";
import Crosshair from "../hud/Crosshair";
import { InventorySlot } from "../hud/inventory/InventorySlot";
import InventoryOverlay from "../hud/inventory/Overlay";
import ItemBar from "../hud/ItemBar";
import PauseMenu from "../hud/menu/PauseMenu";
import PlayerInventory from "../inventory/PlayerInventory";
import GameStateManager from "./GameStateManager";
import structuredClone from "@ungap/structured-clone";
import InputManager from "./InputManager";

export default class HUDManager {
  private root: HTMLElement;
  private gameStateManager: GameStateManager;
  private inputManager;

  private playerInventory: PlayerInventory;

  private crossHair: Crosshair;
  private itemBar: ItemBar;
  private pauseMenu: PauseMenu;
  private inventoryOverlay: InventoryOverlay;

  private movingSlot?: number;
  private slot?: InventorySlot;

  private stateMap = { inventoryOverlay: false, pauseMenu: false };

  constructor(
    rootId: string,
    gameStateManager: GameStateManager,
    inputManager: InputManager,
    playerInventory: PlayerInventory
  ) {
    const root = document.getElementById(rootId);

    if (!root) {
      throw new ElementNotFoundError(`Could not find element with ID '${rootId}'`);
    }

    this.root = root;
    this.gameStateManager = gameStateManager;
    this.inputManager = inputManager;

    this.playerInventory = playerInventory;

    this.crossHair = new Crosshair();
    this.itemBar = new ItemBar();
    this.pauseMenu = new PauseMenu();
    this.inventoryOverlay = new InventoryOverlay();

    this.root.onclick = (e) => e.stopImmediatePropagation();

    this.pauseMenu.addEventListener("unpause", () => this.hidePauseMenu());
    this.inventoryOverlay.addEventListener("slot-click", this.onSlotClick.bind(this));
    this.itemBar.addEventListener("slot-click", this.onSlotClick.bind(this));
    this.inventoryOverlay.inventory = playerInventory;
    this.itemBar.inventory = playerInventory;

    this.gameStateManager.addEventListener("pause", () => this.showPauseMenu());

    this.inputManager.addKeyCallback("i", (e) => e && this.toggleInventory());
    this.inputManager.addKeyCallback("Escape", (e) => e && this.exitImmediateMenu());
    this.inputManager.addKeyCallback("p", (e) => e && this.togglePauseMenu());
  }

  public attach() {
    this.root.appendChild(this.crossHair);
    this.root.appendChild(this.itemBar);
  }

  private handlePause() {
    if (this.stateMap.inventoryOverlay) {
    } else {
      this.showPauseMenu();
    }
  }

  private handleUnpause() {
    if (this.stateMap.inventoryOverlay) {
    } else if (this.stateMap.pauseMenu) {
      this.hidePauseMenu();
    }
  }

  private exitImmediateMenu() {
    if (this.stateMap.inventoryOverlay) {
      this.hideInventory();
    } else {
      this.hidePauseMenu();
      this.gameStateManager.unpause();
    }
  }

  private togglePauseMenu() {
    if (!this.stateMap.pauseMenu) {
      this.showPauseMenu();
    } else {
      this.hidePauseMenu();
    }
  }

  private showPauseMenu() {
    this.stateMap.pauseMenu = true;
    // TODO: Unlock pointer

    this.root.appendChild(this.pauseMenu);
    this.gameStateManager.pause();
  }

  private hidePauseMenu() {
    this.stateMap.pauseMenu = false;
    this.gameStateManager.unpause();

    this.root.removeChild(this.pauseMenu);
  }

  private toggleInventory() {
    if (this.stateMap.inventoryOverlay) {
      this.hideInventory();
    } else {
      this.showInventory();
    }
  }

  private showInventory() {
    this.stateMap.inventoryOverlay = true;
    this.gameStateManager.pause();

    this.root.appendChild(this.inventoryOverlay);
  }

  private hideInventory() {
    this.gameStateManager.unpause();
    this.root.removeChild(this.inventoryOverlay);
    this.stateMap.inventoryOverlay = false;
  }

  private onSlotClick(e: any) {
    if (this.movingSlot === undefined) {
      if (this.playerInventory.getIndex(e.detail.idx)) {
        this.showMoveSlot(e.detail.idx, e.detail.mouse);
        this.movingSlot = e.detail.idx;
      }
    } else if (this.slot) {
      this.playerInventory.moveSlot(this.movingSlot, e.detail.idx, this.slot.group?.amount);
      this.movingSlot = undefined;

      this.root.removeChild(this.slot);
      this.slot = undefined;
    }
  }

  private showMoveSlot(idx: number, mouse: { pageY: number; pageX: number; button: "left" | "right" }) {
    this.slot = new InventorySlot();
    this.slot.group = structuredClone(this.playerInventory.content[idx]);

    if (mouse.button === "right" && this.slot.group) {
      this.slot.group.amount = Math.round(this.slot.group.amount / 2);
    }

    this.slot.style.position = "absolute";

    this.slot.style.left = mouse.pageX + "px";
    this.slot.style.top = mouse.pageY + "px";

    this.slot.style.transform = "translate(-50%, -50%) scale(0.6)";
    this.slot.style.pointerEvents = "none";

    document.addEventListener("mousemove", (e) => {
      if (this.slot) {
        this.slot.style.left = e.pageX + "px";
        this.slot.style.top = e.pageY + "px";
      }
    });

    this.root.appendChild(this.slot);
  }
}
