export type ModuleArgs = typeof import('react') &
  typeof import('@storyshots/core') &
  typeof import('@storyshots/react-preview');

export function createModuleCode(run: (args: ModuleArgs) => void): string {
  return `
    import React from 'react';
    import * as core from '@storyshots/core';
    import * as preview from '@storyshots/react-preview';
    
    const _jsxRuntime = {
      jsx: React.createElement,
      jsxs: React.createElement,
    };
    
    (${run.toString()})({ ...React, ...core, ...preview });
  `;
}
