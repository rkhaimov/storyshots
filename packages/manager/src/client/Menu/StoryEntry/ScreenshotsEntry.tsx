import { blue } from '@ant-design/colors';
import { PictureOutlined } from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';

import {
  ScreenshotComparisonResult,
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
  const screenshots = invertTestResultsByScreenshotName(results);

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
    results: ScreenshotNamedGroup,
  ): ScreenshotComparisonResult['type'] {
    const statuses: ScreenshotComparisonResult['type'][] = [];

    statuses.push(results.devices.primary.result.type);

    for (const device of results.devices.additional) {
      statuses.push(device.result.type);
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

type ScreenshotNamedGroup = {
  name: ScreenshotName | undefined;
  devices: {
    primary: DeviceScreenshotResult;
    additional: DeviceScreenshotResult[];
  };
};

type DeviceScreenshotResult = {
  name: string;
  result: ScreenshotComparisonResult;
};

function invertTestResultsByScreenshotName(
  results: SuccessTestResult,
): ScreenshotNamedGroup[] {
  const groups: ScreenshotNamedGroup[] = [];

  results.screenshots.primary.results.others.map((screenshot, index) => {
    groups.push({
      name: screenshot.name,
      devices: {
        primary: {
          name: results.screenshots.primary.device.name,
          result: screenshot.result,
        },
        additional: results.screenshots.additional.map((device) => ({
          name: device.device.name,
          result: device.results.others[index].result,
        })),
      },
    });
  });

  groups.push({
    name: undefined,
    devices: {
      primary: {
        name: results.screenshots.primary.device.name,
        result: results.screenshots.primary.results.final,
      },
      additional: results.screenshots.additional.map((device) => ({
        name: device.device.name,
        result: device.results.final,
      })),
    },
  });

  return groups;
}
