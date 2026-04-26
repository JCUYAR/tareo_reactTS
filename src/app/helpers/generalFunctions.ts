const isDiferent = (a: any, b: any) => {
  if (a === b) return false;

  if (
    typeof a !== "object" || a === null ||
    typeof b !== "object" || b === null
  ) {
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return true;

  for (let key of keysA) {
    if (!keysB.includes(key)) return true;
    if (isDiferent(a[key], b[key])) return true;
  }

  return false;
}

export {
    isDiferent
}