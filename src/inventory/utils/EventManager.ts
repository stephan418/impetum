export function mutation(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
  const oFunction = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const result = oFunction.apply(this, args);

    (this as any).eventManager.dispatchEvent("change");

    return result;
  };

  return descriptor;
}

type EventHandlers<E extends string> = {
  [K in E]: Function[];
};

type Pluralized<T> = {
  [K in keyof T]: T[K][];
};

type EventsType<T> = {
  [K in keyof T]: T[K] extends never ? (event: K) => unknown : (event: K, payload: T[K]) => unknown;
};

export class ParameterizedEventManager<D, T extends EventsType<D> = EventsType<D>> {
  private eventHandlers: Partial<Pluralized<T>>;

  constructor() {
    this.eventHandlers = {};
  }

  private getHandlers(event: keyof T) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }

    return this.eventHandlers[event] as T[any][];
  }

  addEventlistener<E extends keyof T>(event: E, handler: T[E]) {
    this.getHandlers(event).push(handler);
  }

  dispatchEvent<E extends keyof D>(event: E, p: D[E] extends never ? undefined : D[E]) {
    this.getHandlers(event).forEach((e) => e(event, p as D[E]));
  }
}

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

    const handlerIndex = handlers.findIndex((c) => c === handler);

    if (handlerIndex < 0) {
      console.error("The handler could not be removed because it does not exist");
      return false;
    }

    if (handlers) {
      return Boolean(handlers.splice(handlerIndex, 1));
    }

    return false;
  }

  dispatchEvent(event: E) {
    this.eventHandlers[event].forEach((h) => h());
  }
}
