export default function nullToUndefined(obj: any): any {
  if (obj === null) {
    return undefined;
  }

  if (Array.isArray(obj)) {
    return obj.map((value) => nullToUndefined(value));
  }

  if (typeof obj === "object") {
    const res: any = {};

    for (const key of Object.keys(obj)) {
      let value = obj[key];

      if (value === null) value = undefined;

      res[key] = value;
    }

    return res;
  }
}
