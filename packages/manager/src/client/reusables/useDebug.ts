import { useEffect } from 'react';

export function useTrace(value: unknown) {
  useEffect(() => {
    console.log(value);
  }, [value]);
}
