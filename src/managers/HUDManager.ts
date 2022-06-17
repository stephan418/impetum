import WoodenWall from "../building/Walls/WoodenWall";
import ElementNotFoundError from "../errors/ElementNotFoundError";
import Crosshair from "../hud/Crosshair";
import { InfoBox } from "../hud/InfoBox";
import { InventorySlot } from "../hud/inventory/InventorySlot";
import InventoryOverlay from "../hud/inventory/Overlay";
import ItemBar from "../hud/ItemBar";
import PauseMenu from "../hud/menu/PauseMenu";
import PermanentHudController from "../hud/permanent_hud/PermanentHudContainer";
import GeneralTurretItem from "../inventory/items/GeneralTurretItem";
import WoodenWallItem from "../inventory/items/WoodenWall";
import PlayerInventory from "../inventory/PlayerInventory";
import Store from "../inventory/store/store";
import GameStateManager from "./GameStateManager";
import InputManager from "./InputManager";
import WaveManager from "./WaveManager";

export default class HUDManager {
  private root: HTMLElement;
  private gameStateManager: GameStateManager;
  private inputManager;
  private waveManager;

  private playerInventory: PlayerInventory;
  private store: Store;

  private crossHair: Crosshair;
  private itemBar: ItemBar;
  private pauseMenu: PauseMenu;
  private inventoryOverlay: InventoryOverlay;
  private permanentHud: PermanentHudController;

  private movingSlot?: number;
  private slot?: InventorySlot;

  private stateMap = { inventoryOverlay: false, pauseMenu: false };

  constructor(
    rootId: string,
    gameStateManager: GameStateManager,
    inputManager: InputManager,
    playerInventory: PlayerInventory,
    waveManager: WaveManager
  ) {
    const root = document.getElementById(rootId);

    if (!root) {
      throw new ElementNotFoundError(`Could not find element with ID '${rootId}'`);
    }

    this.root = root;
    this.gameStateManager = gameStateManager;
    this.inputManager = inputManager;
    this.waveManager = waveManager;
    this.store = new Store([
      { batchPrize: 100, batchSize: 1, description: "General Turret", item: new GeneralTurretItem() },
      { batchPrize: 50, batchSize: 10, description: "Wooden Wall", item: new WoodenWallItem() },
      { batchPrize: 50, batchSize: 10, description: "Wooden Wall", item: new WoodenWallItem() },
    ]);

    this.playerInventory = playerInventory;

    this.crossHair = new Crosshair();
    this.itemBar = new ItemBar();
    this.pauseMenu = new PauseMenu();
    this.inventoryOverlay = new InventoryOverlay();
    this.permanentHud = new PermanentHudController();

    // TODO: stop propagation when menus are open (outside click)
    this.root.onclick = (e) => e.target !== this.permanentHud && e.stopImmediatePropagation();

    this.pauseMenu.addEventListener("unpause", () => this.hidePauseMenu());
    this.inventoryOverlay.addEventListener("slot-click", this.onSlotClick.bind(this));
    this.itemBar.addEventListener("slot-click", this.onSlotClick.bind(this));
    this.inventoryOverlay.addEventListener("not-enough-money", this.showNotEnoughMoneyInfo.bind(this));
    this.inventoryOverlay.inventory = playerInventory;
    this.inventoryOverlay.store = this.store;
    this.itemBar.inventory = playerInventory;
    this.permanentHud.waveManager = this.waveManager;
    this.permanentHud.inventory = this.playerInventory;

    this.gameStateManager.addEventListener("pause", () => this.showPauseMenu());

    this.inputManager.addKeyCallback("i", (e) => e && this.toggleInventory());
    this.inputManager.addKeyCallback("Escape", (e) => e && this.exitImmediateMenu());
    this.inputManager.addKeyCallback("p", (e) => e && this.togglePauseMenu());

    this.root.appendChild(this.permanentHud);
  }

  private showNotEnoughMoneyInfo() {
    const box = new InfoBox();
    box.message = "You do not have enough money to purchase this!";

    box.addEventListener("close", () => this.root.removeChild(box));

    this.root.appendChild(box);
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
      this.togglePauseMenu();
    }
  }

  private togglePauseMenu() {
    if (!this.stateMap.pauseMenu) {
      this.showPauseMenu();

      if (!this.gameStateManager.isPaused) {
        this.gameStateManager.pause();
      }
    } else {
      this.hidePauseMenu();
    }
  }

  private showPauseMenu() {
    // TODO: Unlock pointer

    if (!this.stateMap.inventoryOverlay && this.gameStateManager.isPaused) {
      this.stateMap.pauseMenu = true;
      this.root.appendChild(this.pauseMenu);
    }
  }

  private hidePauseMenu() {
    this.stateMap.pauseMenu = false;

    if (this.gameStateManager.isPaused) {
      this.gameStateManager.unpause();
    }

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

    const originalGroup = this.playerInventory.content[idx];

    this.slot.group = Object.assign(Object.create(Object.getPrototypeOf(originalGroup)), originalGroup);

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
