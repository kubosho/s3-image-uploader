// https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
import { useRef } from 'react';

const UNINITIALIZED = Symbol('useInstance_uninitialized');

export const useInstance = <T>(initialFunction: () => T): T => {
  const ref = useRef<T | typeof UNINITIALIZED>(UNINITIALIZED);
  if (ref.current === UNINITIALIZED) {
    ref.current = initialFunction();
  }
  return ref.current;
};
