import { blue } from '@ant-design/colors';
import { PictureOutlined } from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';
import {
  ScreenshotComparisonResult,
  ScreenshotResult,
  TestResultDetails,
} from '../../../reusables/runner/types';

import { ActiveEntryHeader } from '../reusables/EntryHeader';
import { HighlightableEntry } from '../reusables/EntryStatus';
import { Props as ParentProps } from './types';

type Props = {
  details: TestResultDetails;
} & Pick<ParentProps, 'setScreenshot' | 'story' | 'level' | 'selection'>;

export const ScreenshotsEntry: React.FC<Props> = ({
  story,
  level,
  details,
  selection,
  setScreenshot,
}) => {
  return (
    <ScreenshotsList>
      {details.screenshots.map((it) => (
        <li
          key={it.name}
          role="menuitem"
          aria-label={it.name}
          onClick={() => setScreenshot(story.id, it.name, details.device.name)}
        >
          <ActiveEntryHeader
            $level={level}
            $offset={24}
            $color={blue[0]}
            $active={isActive(it)}
          >
            <HighlightableEntry
              status={renderStatus(it)}
              left={<PictureOutlined style={{ marginRight: 4 }} />}
              title={it.name}
            />
          </ActiveEntryHeader>
        </li>
      ))}
    </ScreenshotsList>
  );

  function renderStatus(
    screenshot: ScreenshotResult,
  ): ScreenshotComparisonResult['type'] {
    if (screenshot.result.type === 'fail') {
      return 'fail';
    }

    if (screenshot.result.type === 'fresh') {
      return 'fresh';
    }

    return 'pass';
  }

  function isActive(screenshot: ScreenshotResult) {
    return (
      selection.type === 'screenshot' &&
      selection.story.id === story.id &&
      selection.device === details.device.name &&
      selection.name === screenshot.name
    );
  }
};

const ScreenshotsList = styled.ul`
  padding: 0;
  text-decoration: none;
`;
