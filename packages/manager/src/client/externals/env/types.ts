import { ManagerState, PreviewState } from '@storyshots/core';
import React from 'react';

export interface IPreview {
  Frame: React.FC<{ src: string; id: string; hidden: boolean }>;

  usePreviewBuildHash(): string;

  createPreviewConnection(manager: ManagerState): Promise<PreviewState>;
}
