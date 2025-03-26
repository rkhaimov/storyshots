import Clock, { FakeTimerInstallOpts } from '@sinonjs/fake-timers';
import MockDate from 'mockdate';

import 'mock-local-storage';

type InstallConfig = {
  date: Date;
  clock?: FakeTimerInstallOpts;
};

export function install(config: InstallConfig) {
  MockDate.set(config.date);

  const clock = Clock.install({
    shouldAdvanceTime: true,
    toFake: ['setTimeout', 'clearTimeout'],
    ...config.clock,
  });

  window.tick = (ms) => clock.tick(ms);
}

declare global {
  interface Window {
    tick(ms: number): void;
  }
}
