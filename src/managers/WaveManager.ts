import World from "../core/World";
import Wave from "../core/wave/Wave";
import THREE from "three";
import { ParameterizedEventManager } from "../inventory/utils/EventManager";

interface WaveManagerConfig {
  currentInterval?: number;
  intervalDeviation?: number;
  intervalMultiplier?: number;
  currentEnemyCount?: number;
  enemyCountDeviation?: number;
  enemyCountMultiplier?: number;
  enemySpawnRadius?: number;
}

function populateWaveManagerConfig(config: WaveManagerConfig): Required<WaveManagerConfig> {
  return {
    currentInterval: 1000 * 60 * 8,
    intervalDeviation: 0.1,
    intervalMultiplier: 0.95,
    currentEnemyCount: 5,
    enemyCountDeviation: 0.2,
    enemyCountMultiplier: 1.1,
    enemySpawnRadius: 100,
    ...config,
  };
}

export default class WaveManager {
  private config;
  private currentWaves: Wave[] = [];
  private world: World;
  private intervalId?: number;
  private nextInterval?: number;
  private stopTime?: number;
  private waveNr?: number;

  private eventManager: ParameterizedEventManager<{ wave: number; finish: Wave; update: never }>;
  public addEventListener;

  constructor(config: WaveManagerConfig, world: World, private target: THREE.Vector3, startImmediately = true) {
    this.config = populateWaveManagerConfig(config);
    this.world = world;

    this.eventManager = new ParameterizedEventManager();
    this.addEventListener = this.eventManager.addEventlistener.bind(this.eventManager);

    if (startImmediately) {
      this.initializeNextInterval();
    }
  }

  public start() {
    if (!this.nextInterval && !this.intervalId) {
      this.initializeNextInterval();
    }
  }

  private initializeNextInterval(forward = true) {
    const until = WaveManager.generateInterval(this.config.currentInterval, this.config.intervalDeviation);

    if (forward) {
      this.config.currentInterval *= this.config.intervalMultiplier; // REVIEW: Maybe move to startWave()?
    }

    this.nextInterval = new Date().getTime() + until;
    console.debug(`Next wave at ${new Date(this.nextInterval)}`);

    this.intervalId = setTimeout(() => this.startWave(), until); // TODO: Add ability to pause
  }

  private startWave() {
    this.waveNr = (this.waveNr ?? 0) + 1;

    this.eventManager.dispatchEvent("wave", this.waveNr);
    this.eventManager.dispatchEvent("update", undefined);

    const wave = new Wave(this.target, this.config.enemySpawnRadius, this.world, this.config.currentEnemyCount);

    wave.addToWorld(this.world);
    wave.startMoving(() => this.removeWaveFromArray(wave));

    this.currentWaves.push(wave);

    this.initializeNextInterval();
  }

  private removeWaveFromArray(wave: Wave) {
    const index = this.currentWaves.findIndex((w) => w === wave);

    if (index < 0) {
      return;
    }

    const w = this.currentWaves.splice(index, 1);

    this.eventManager.dispatchEvent("finish", w[0]);
    this.eventManager.dispatchEvent("update", undefined);

    return w;
  }

  public pause() {
    if (!this.intervalId) {
      console.warn("The WaveManager can only be paused when waves are scheduled");
      return;
    }

    this.stopTime = new Date().getTime();

    clearTimeout(this.intervalId);
    this.intervalId = undefined;
  }

  public unpause() {
    if (!this.stopTime || !this.nextInterval) {
      return;
    }

    const until = this.nextInterval - this.stopTime;

    this.nextInterval = new Date().getTime() + until;

    this.intervalId = setTimeout(() => this.startWave(), until);

    console.log(`New wave at ${new Date(this.nextInterval)}`);
  }

  private static generateInterval(interval: number, deviation: number) {
    const min = interval - interval * deviation;
    const max = interval + interval * deviation;

    console.log(min, max, interval);

    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  get waveNumber() {
    return this.waveNr;
  }

  get totalEnemyCount() {
    return this.currentWaves.reduce((p, c) => p + c.totalEnemyCount, 0);
  }

  get aliveEnemyCount() {
    return this.currentWaves.reduce((p, c) => p + c.aliveEnemyCount, 0);
  }

  get waveCount() {
    return this.currentWaves.length;
  }
}
