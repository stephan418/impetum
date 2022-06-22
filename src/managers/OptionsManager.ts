type ConfigD = {
  [K: string]: {
    [k: string]:
      | { t: "key"; default: string }
      | {
          t: "boolean";
          default: boolean;
        }
      | { t: "range"; c: { low: number; high: number }; default: number }
      | { t: "number"; default: number };
  };
};

const ConfigDescription = {
  keys: {
    setFullscreen: { t: "key", default: "f" },
    movementForward: { t: "key", default: "w" },
    movementBackward: { t: "key", default: "s" },
    movementLeft: { t: "key", default: "a" },
    movementRight: { t: "key", default: "d" },
    jump: { t: "key", default: " " },
  },

  graphics: {
    shadows: { t: "boolean", default: false },
    shadowsize: { t: "range", c: { low: 512, high: 2048 }, default: 1024 },
  },

  game: {
    creativeMode: { t: "boolean", default: false },
  },
  building: {
    ghostTimeDelay: { t: "range", c: { low: 0, high: 1 }, default: 0.02 },
  },
  hud: {
    hudScale: { t: "number", default: 1 },
  },
  inventory: {
    hotbarSlots: { t: "number", default: 9 },
    backSlots: { t: "number", default: 36 },
  },
} as const;

type Widen<T> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : never;

type ConcreteConfigD = typeof ConfigDescription;

type X<T extends ConfigD> = {
  [K in keyof T]: {
    [k in keyof T[K]]: Widen<T[K][k]["default"]>;
  };
};

export class ConfigManager {
  private static instance?: ConfigManager;

  _config: X<ConcreteConfigD> = {
    keys: {
      setFullscreen: "f",

      movementForward: "w",
      movementBackward: "s",
      movementLeft: "a",
      movementRight: "d",
      jump: " ",
    },
    graphics: {
      shadows: true,
      shadowsize: 1024,
    },
    game: {
      creativeMode: false,
    },
    building: {
      ghostTimeDelay: 0.02,
    },
    hud: {
      hudScale: 1,
    },
    inventory: {
      hotbarSlots: 9,
      backSlots: 36,
    },
  };

  private constructor() {
    if (ConfigManager.instance) {
      throw new Error("Instance already exists");
    }

    ConfigManager.instance = this;
  }

  static get() {
    if (ConfigManager.instance) {
      return ConfigManager.instance;
    }

    return new ConfigManager();
  }

  get config() {
    return this._config;
  }

  get definition() {
    return ConfigDescription;
  }
}

const cfgMgr = ConfigManager.get();

export const config: Readonly<typeof cfgMgr.config> = cfgMgr.config;
export default cfgMgr;
