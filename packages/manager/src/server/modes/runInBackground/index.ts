import { driver } from '../../../reusables/runner/driver';
import { ManagerConfig } from '../../types';
import { createStoryEngine } from '../createStoryEngine';
import { getStories } from './getStories';
import { runAll } from './runAll';

export async function runInBackground(config: ManagerConfig) {
  const app = await createStoryEngine(config);

  return {
    ...app,
    run: async () => {
      const stories = await getStories(config);
      const { records, errors, screenshots } = await runAll(stories, config);

      if (errors.size > 0) {
        for (const [id, error] of Array.from(errors.entries())) {
          console.log(id, error.message);
        }

        throw new Error('Failed to run tests, check reasons above');
      }

      for (const record of records) {
        await driver.acceptRecords(record.id, {
          records: record.result.actual,
          device: record.details.device,
        });
      }

      for (const screenshot of screenshots) {
        await driver.acceptScreenshot({ actual: screenshot.result.actual });
      }

      console.log('Done');
    },
  };
}
