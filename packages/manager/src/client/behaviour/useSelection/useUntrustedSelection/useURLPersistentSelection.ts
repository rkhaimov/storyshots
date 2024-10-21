import { useEffect, useState } from 'react';
import { UntrustedSelection } from './types';

export function useURLPersistentSelection() {
  const [selection, setSelection] = useState(
    () => getFromURL() ?? createNoSelection(),
  );

  useEffect(() => {
    if (selection.type === 'story') {
      setToURL(selection);
    }
  }, [selection]);

  return [selection, setSelection] as const;
}

function getFromURL(): UntrustedSelection | undefined {
  const url = new URL(location.href);

  const selection = url.searchParams.get('selection');

  if (selection === null) {
    return undefined;
  }

  return JSON.parse(selection) as UntrustedSelection;
}

function setToURL(selection: UntrustedSelection) {
  const url = new URL(location.href);

  url.searchParams.set('selection', JSON.stringify(selection));

  history.pushState(null, '', url);
}

function createNoSelection(): UntrustedSelection {
  return {
    type: 'no-selection',
    config: {
      emulated: false,
    },
  };
}
