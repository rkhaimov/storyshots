import { JournalRecord } from '@storyshots/core';
import { IExternals } from '../../../../packages/manager/src/client/externals/types';
import { Props } from './types';

export function createRecordsHandler() {
  let getRecords = () => [] as JournalRecord[];

  return {
    onExternals: (externals: IExternals): IExternals => ({
      ...externals,
      driver: {
        ...externals.driver,
        actOnServerSide: async (at, payload) => {
          const result = await externals.driver.actOnServerSide(at, payload);

          if (result.type === 'error') {
            return result;
          }

          return {
            type: 'success',
            data: { ...result.data, records: getRecords() },
          };
        },
      },
    }),
    onPreviewProps: (props: Props): Props => ({
      ...props,
      externals: {
        ...props.externals,
        setRecordsSource: (records) => (getRecords = records),
      },
    }),
  };
}
