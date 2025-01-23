import { Frame } from 'playwright';

export function captureBase(preview: Frame) {
  return preview
    .page()
    .screenshot({ type: 'png', caret: 'hide', animations: 'disabled' });
}
