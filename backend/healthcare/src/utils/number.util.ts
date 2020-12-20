export function isBetween(value: number, min: number, max: number) {
  if (!Number.isInteger(value) || !Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error("One of arguments is not a valid integer");
  }
  return value > min && value < max;
}
