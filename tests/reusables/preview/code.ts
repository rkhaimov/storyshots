import { CreateExternalsFactory } from './externals';
import { callback, merge } from './pure-function-factory';
import { createModuleCode } from './module';
import { CreateStories } from './stories';

export function createCode(
  externals: CreateExternalsFactory<unknown>,
  stories: CreateStories<unknown>,
): string {
  return createModuleCode(
    callback(merge(externals, stories), ([module, merged]) => {
      const [externals, stories] = merged();
      const preview = module.createPreviewApp(externals(void 0));

      return preview.run(stories({ ...module, ...preview }));
    }),
  );
}
