import { createArrangers } from '../../../../../../packages/arrangers';
import { IExternals } from '../../../externals/types';

export const { arrange, set, record } = createArrangers<IExternals>();
