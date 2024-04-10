import { JournalRecord } from '@storyshots/core';
import React from 'react';
import { IExternals } from '../../../packages/manager/src/client/externals/types';
import type { App } from '../../../packages/preview/react/src/App';

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
    onPreviewProps: (
      props: React.ComponentProps<typeof App>,
    ): React.ComponentProps<typeof App> => ({
      ...props,
      externals: {
        ...props.externals,
        setRecordsSource: (records) => (getRecords = records),
      },
    }),
  };
}
