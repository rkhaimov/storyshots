import { useSearchParams } from 'wouter';

export function useEmulated() {
  const [params, setParams] = useSearchParams();

  return {
    emulated: params.get('emulated') === 'true',
    setEmulated: (emulated: boolean) =>
      setParams((prev) => {
        prev.set('emulated', `${emulated}`);

        return prev;
      }),
  };
}
