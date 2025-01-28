import { repeat } from '../../../../reusables/repeat';
import { createIsolatedContextWorker } from './createIsolatedContextWorker';
import { BusyWorker, FreeWorker, Job, Worker, WorkerState } from './types';

export const workers = {
  create: (agentsCount: number): Promise<WorkerState[]> =>
    Promise.all(
      repeat(agentsCount, () =>
        createIsolatedContextWorker().then((it) => ({
          type: 'free' as const,
          instance: it,
        })),
      ),
    ),
  available: (workers: WorkerState[]) =>
    workers.find((it): it is FreeWorker => it.type === 'free'),
  handle: async (workers: WorkerState[], worker: FreeWorker, job: Job) => {
    const busy = asBusy(workers, worker);

    await work(busy, job);

    asFree(workers, busy);
  },
  destroy: (workers: WorkerState[]) =>
    Promise.all(workers.map((worker) => worker.instance.destroy())),
};

async function work(busy: BusyWorker, job: Job) {
  const resource = await busy.instance.allocate(job.story);

  const result = await job.task(resource.page);

  await resource.cleanup();

  job.onDone(result);
}

function asBusy(workers: WorkerState[], worker: FreeWorker): BusyWorker {
  const busy: BusyWorker = { type: 'busy', instance: worker.instance };

  workers.forEach((it, index) => {
    if (it.instance === worker.instance) {
      workers[index] = busy;
    }
  });

  return busy;
}

function asFree(workers: WorkerState[], worker: BusyWorker): FreeWorker {
  const free: FreeWorker = { type: 'free', instance: worker.instance };

  workers.forEach((it, index) => {
    if (it.instance === worker.instance) {
      workers[index] = free;
    }
  });

  return free;
}
