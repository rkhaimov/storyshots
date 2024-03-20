import { blue } from '@ant-design/colors';
import { PictureOutlined } from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';

import {
  ScreenshotComparisonResult,
  SingleConfigScreenshotResult,
  SuccessTestResult,
} from '../../behaviour/useTestResults/types';
import { ActiveEntryHeader } from '../reusables/EntryHeader';
import { EntryStatus } from '../reusables/EntryStatus';
import { EntryTitle } from '../reusables/EntryTitle';
import { Props as ParentProps } from './types';
import { ScreenshotName } from '@storyshots/core';

type Props = {
  results: SuccessTestResult;
} & Pick<ParentProps, 'setScreenshot' | 'story' | 'level' | 'selection'>;

export const ScreenshotsEntry: React.FC<Props> = ({
  story,
  level,
  results,
  selection,
  setScreenshot,
}) => {
  const screenshots = flattenTestResults(results);

  return (
    <ScreenshotsList>
      {screenshots.map((it) => {
        return (
          <li
            key={it.name ?? 'final'}
            onClick={() => setScreenshot(story.id, it.name)}
          >
            <ActiveEntryHeader
              $level={level}
              $offset={24}
              $color={blue[0]}
              $active={isActive(it.name)}
            >
              <EntryTitle
                left={
                  <>
                    <EntryStatus status={{ type: aggregateStatus(it) }} />
                    <PictureOutlined style={{ marginRight: 4 }} />
                  </>
                }
                title={it.name ?? 'FINAL'}
              />
            </ActiveEntryHeader>
          </li>
        );
      })}
    </ScreenshotsList>
  );

  function aggregateStatus(
    results: MenuScreenshotGroup,
  ): ScreenshotComparisonResult['type'] {
    const statuses: ScreenshotComparisonResult['type'][] = results.configs.map(
      (config) => config.result.type,
    );

    if (statuses.includes('fail')) {
      return 'fail';
    }

    if (statuses.includes('fresh')) {
      return 'fresh';
    }

    return 'pass';
  }

  function isActive(name: ScreenshotName | undefined) {
    return (
      selection.type === 'screenshot' &&
      selection.story.id === story.id &&
      selection.name === name
    );
  }
};

const ScreenshotsList = styled.ul`
  padding: 0;
  text-decoration: none;
`;

type MenuScreenshotGroup = {
  name: ScreenshotName | undefined;
  configs: SingleConfigScreenshotResult[];
};

function flattenTestResults(results: SuccessTestResult): MenuScreenshotGroup[] {
  return [
    ...results.screenshots.others,
    { name: undefined, configs: results.screenshots.final },
  ];
}
