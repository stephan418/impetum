export const slotClickEvent = (e: MouseEvent, idx: number) => {
  let button;

  if (e.button === 0) {
    button = "left";
  } else if (e.button === 2) {
    button = "right";
  } else {
    return;
  }

  const event = new CustomEvent("slot-click", { detail: { idx, mouse: { pageY: e.pageY, pageX: e.pageX, button } } });

  return event;
};
