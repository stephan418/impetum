export default interface FrequencyUpdatable {
  updateFrequencyMedium(deltaTime: number): unknown; // called every 100ms
  updateFrequencyLow(deltaTime: number): unknown; // called every 1s
}

export function isFrequencyUpdatable(arg: any): arg is FrequencyUpdatable {
  return arg.updateFrequencyMedium !== undefined && arg.updateFrequencyLow !== undefined;
}
