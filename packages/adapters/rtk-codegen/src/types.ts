import { generateEndpoints } from '@rtk-query/codegen-openapi';

export type Settings = Parameters<typeof generateEndpoints>[0] & {
  outputFile: string;
};
