type EventHandlers<E extends string> = {
  [K in E]: Function[];
};

export default class EventManager<E extends string> {
  private eventHandlers: EventHandlers<E>;

  constructor(events: Array<E>) {
    this.eventHandlers = Object.assign({}, ...events.map((event) => ({ [event]: [] })));
  }

  addEventListener(event: E, handler: Function) {
    this.eventHandlers[event].push(handler);
  }

  removeEventListener(event: E, handler: Function): boolean {
    const handlers = this.eventHandlers[event];

    if (handlers) {
      return Boolean(
        handlers.splice(
          handlers.findIndex((c) => c === handler),
          0
        )
      );
    }

    return false;
  }

  dispatchEvent(event: E) {
    this.eventHandlers[event].forEach((h) => h());
  }
}

const a = new EventManager(["Test", "test"]);
