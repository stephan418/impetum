import DeserializationError from "../errors/DeserializationError";

/**
 *
 * @param func Function which does the deserialization (The function is expected to throw SyntaxErrors and DeserializationErrors only)
 * @returns Function return value
 * @throws DeserializationError
 */
export default function safeDeserialize<T, A>(func: (...args: A[]) => T): T {
  try {
    return func();
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new DeserializationError(e.message, e);
    }

    throw e;
  }
}
