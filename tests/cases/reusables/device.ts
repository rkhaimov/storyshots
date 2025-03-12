import { Background } from '../../reusables/background';
import { UI, ui } from '../../reusables/ui';

export function desktop(on: UI | Background = ui) {
  return on
    .devices([
      {
        type: 'size-only',
        name: 'desktop',
        config: { width: 1480, height: 920 },
      },
    ])
    .preview();
}

export function devices() {
  return ui
    .devices([
      {
        type: 'size-only',
        name: 'desktop',
        config: { width: 1480, height: 920 },
      },
      {
        type: 'emulated',
        name: 'mobile',
        config: {
          userAgent:
            'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
          width: 414,
          height: 896,
          deviceScaleFactor: 3,
        },
      },
    ])
    .preview();
}
