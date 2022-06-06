export default class PausableInterval {
  private intervalId?: number;
  private lastDispatch: number;
  private remaining?: number;
  private every: number;
  private func: Function;

  constructor(func: Function, every: number) {
    this.func = func;
    this.every = every;

    this.lastDispatch = new Date().getTime();
    this.intervalId = setTimeout(this.dispatch.bind(this), every);
  }

  private dispatch() {
    this.intervalId = setTimeout(this.dispatch.bind(this), this.every);

    this.lastDispatch = new Date().getTime();
    this.func();
  }

  pause() {
    if (this.intervalId) {
      clearTimeout(this.intervalId);

      this.remaining = this.every - (new Date().getTime() - this.lastDispatch);

      this.intervalId = undefined;
    }
  }

  unpause() {
    if (this.intervalId == undefined) {
      this.intervalId = setTimeout(this.dispatch.bind(this), this.remaining);
      this.remaining = undefined;
    }
  }
}
