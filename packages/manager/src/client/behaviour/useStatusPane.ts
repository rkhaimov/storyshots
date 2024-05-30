import { not } from '@storyshots/core';
import { useState } from 'react';

export function useStatusPane() {
  const [open, setIsOpen] = useState(false);

  return {
    statusPaneOpen: open,
    toggleStatusPane: () => setIsOpen(not),
  };
}
