import { blue } from '@ant-design/colors';
import { PictureOutlined } from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';

import { ScreenshotName } from '../../../../reusables/screenshot';
import {
  ScreenshotComparisonResult,
  ScreenshotsComparisonResultsByMode,
  SuccessTestResult,
} from '../../behaviour/useTestResults/types';
import { ActiveEntryHeader } from '../reusables/EntryHeader';
import { EntryStatus } from '../reusables/EntryStatus';
import { EntryTitle } from '../reusables/EntryTitle';
import { Props as ParentProps } from './types';
import { isNil } from '../../../../reusables/utils';

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
  const screenshots = results.screenshots.primary.results;

  return (
    <ScreenshotsList>
      {screenshots.others.map((it) => {
        return (
          <li key={it.name} onClick={() => setScreenshot(story.id, it.name)}>
            <ActiveEntryHeader
              $level={level}
              $offset={24}
              $color={blue[0]}
              $active={isActive(it.name)}
            >
              <EntryTitle
                left={
                  <>
                    <EntryStatus
                      status={{ type: aggregateStatus(results, it.name) }}
                    />
                    <PictureOutlined style={{ marginRight: 4 }} />
                  </>
                }
                title={it.name}
              />
            </ActiveEntryHeader>
          </li>
        );
      })}
      <li key="final" onClick={() => setScreenshot(story.id, undefined)}>
        <ActiveEntryHeader
          $level={level}
          $offset={24}
          $color={blue[0]}
          $active={isActive(undefined)}
        >
          <EntryTitle
            left={
              <>
                <EntryStatus
                  status={{ type: aggregateStatus(results, undefined) }}
                />
                <PictureOutlined style={{ marginRight: 4 }} />
              </>
            }
            title="FINAL"
          />
        </ActiveEntryHeader>
      </li>
    </ScreenshotsList>
  );

  function aggregateStatus(
    results: SuccessTestResult,
    name: ScreenshotName | undefined,
  ): ScreenshotComparisonResult['type'] {
    const statuses: ScreenshotComparisonResult['type'][] = [];

    function extractStatus(device: ScreenshotsComparisonResultsByMode) {
      if (isNil(name)) {
        return device.results.final.type;
      }

      for (const screenshot of device.results.others) {
        if (screenshot.name === name) {
          return screenshot.result.type;
        }
      }
    }

    const primaryStatus = extractStatus(results.screenshots.primary);
    if (!isNil(primaryStatus)) {
      statuses.push(primaryStatus);
    }

    for (const device of results.screenshots.additional) {
      const status = extractStatus(device);

      if (!isNil(status)) {
        statuses.push(status);
      }
    }

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