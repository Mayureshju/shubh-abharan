/** Strip non-JSON values so server actions can return to the client. */
export function toPlain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
