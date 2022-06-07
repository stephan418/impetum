import "./style.css";
import World from "./core/World";
import "./hud/HUD";

let world = new World("view");

(window as any).world = world;

world.tick();
