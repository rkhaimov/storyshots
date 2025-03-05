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
      const summary = await runAll(stories, config);

      if (summary.errors.length > 0) {
        for (const error of summary.errors) {
          console.log('Error has happened:');
          console.log(`Story: ${error.id}`);
          console.log(`Device: ${error.device.name}`);
          console.log(`Message: ${error.message}`);
        }

        throw new Error('Failed to run tests, check reasons above');
      }

      if (summary.changes.length > 0) {
        console.log('Baseline changes has been detected, commiting...');
      }

      for (const change of summary.changes) {
        if (change.records) {
          await driver.acceptRecords({
            id: change.id,
            device: change.device,
            records: change.records,
          });
        }

        for (const screenshot of change.screenshots) {
          await driver.acceptScreenshot(screenshot);
        }
      }

      console.log('Done');
    },
  };
}
