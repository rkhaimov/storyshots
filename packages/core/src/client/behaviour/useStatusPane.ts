import { useState } from 'react';

export function useStatusPane() {
  const [open, setIsOpen] = useState(false);

  return {
    statusPaneOpen: open,
    toggleStatusPane: () => setIsOpen((prev) => !prev),
  };
}
