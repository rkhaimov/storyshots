import { useEffect, useRef } from 'react';

export function usePrevious<T>(value: T): T {
  const prev = useRef(value);

  useEffect(() => {
    prev.current = value;
  }, [value]);

  return prev.current;
}
