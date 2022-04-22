import "./style.css";
import World from "./core/World";
import "./hud/HUD";

let world = new World("view");
world.tick();
