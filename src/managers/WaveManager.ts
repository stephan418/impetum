import World from "../core/World";
import Wave from "../core/wave/Wave";
import THREE from "three";

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

  constructor(config: WaveManagerConfig, world: World, private target: THREE.Vector3) {
    this.config = populateWaveManagerConfig(config);
    this.world = world;

    this.initializeNextInterval();
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
    const wave = new Wave(this.target, this.config.enemySpawnRadius, this.config.currentEnemyCount);

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

    return this.currentWaves.splice(index, 1);
  }

  private static generateInterval(interval: number, deviation: number) {
    const min = interval - interval * deviation;
    const max = interval + interval * deviation;

    console.log(min, max, interval);

    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
