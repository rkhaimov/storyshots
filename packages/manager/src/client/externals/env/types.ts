import { ManagerState, PreviewState } from '@storyshots/core';
import React, { IframeHTMLAttributes } from 'react';

export interface IPreview {
  Frame: React.FC<IframeHTMLAttributes<unknown>>;

  usePreviewBuildHash(): string;

  createPreviewConnection(manager: ManagerState): Promise<PreviewState>;
}
