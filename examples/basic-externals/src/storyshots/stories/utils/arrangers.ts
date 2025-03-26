import { createArrangers } from '@storyshots/arrangers';
import { IExternals } from '../../../externals/types';

export const { arrange, set, record } = createArrangers<IExternals>();
