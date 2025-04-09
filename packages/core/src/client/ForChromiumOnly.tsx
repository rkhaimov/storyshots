import { createJournal, Device, find, StoryID } from '@core';
import { assertNotEmpty } from '@lib';
import React from 'react';
import { RouteComponentProps, useSearchParams } from 'wouter';
import { Preview, usePreviewSync } from './reusables/ConnectedPreview';

type Props = RouteComponentProps<{
  story: string;
}>;

export const ForChromiumOnly: React.FC<Props> = (props) => {
  const [params] = useSearchParams();

  const preview = usePreviewSync({
    identity: 'CONSTANT_PREVIEW',
    onPreviewLoaded: (stories) => {
      const story = find(props.params.story as StoryID, stories);

      assertNotEmpty(story);

      const journal = createJournal();

      // Exposing records for server
      window.getJournalRecords = () => journal.__read();

      return {
        story,
        config: {
          device: getRequiredValue<Device>(params, 'device'),
          journal,
          testing: true,
        },
      };
    },
  });

  return <Preview {...preview} />;
};

// TODO: Duplication with useManagerConfig
function getRequiredValue<T>(params: URLSearchParams, key: string): T {
  const value = params.get(key);

  assertNotEmpty(value, `Expected ${key} to be defined in query`);

  return JSON.parse(value) as T;
}
