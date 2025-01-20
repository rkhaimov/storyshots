import { singleton } from './singleton';
import { Runner } from './types';

type ClusterOptions = {
  agentsCount: number;
};

export function cluster({ agentsCount }: ClusterOptions): Runner {
  if (agentsCount <= 1) {
    return singleton();
  }

  return {
    agentsCount,
    run: repeat(agentsCount).map(singleton).reduce(join).run,
  };
}

function join(left: Runner, right: Runner): Runner {
  return {
    agentsCount: left.agentsCount + right.agentsCount,
    run: async () => {
      const lrun = await left.run();
      const rrun = await right.run();

      return {
        busy: () => lrun.busy() && rrun.busy(),
        allocate: (story, task) =>
          lrun.busy() ? rrun.allocate(story, task) : lrun.allocate(story, task),
        close: () => {
          lrun.close();
          rrun.close();
        },
      };
    },
  };
}

function repeat(n: number): undefined[] {
  return new Array(n).fill(undefined);
}
