import { IWebDriver } from '../../reusables/types';
import { IPreview } from './env/types';

export interface IExternals {
  driver: IWebDriver;
  preview: IPreview;
}
