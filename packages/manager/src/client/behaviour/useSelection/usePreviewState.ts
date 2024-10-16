import { useState } from 'react';
import { PreviewState } from '@storyshots/core';

export function usePreviewState() {
  const [preview, setPreview] = useState<PreviewState>();

  return {
    preview,
    onStateChange: setPreview,
  };
}
