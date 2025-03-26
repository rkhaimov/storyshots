import { blue } from '@ant-design/colors';
import { PictureOutlined } from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';
import { ScreenshotComparisonResult } from '../../../reusables/runner/types';

import { ActiveEntryHeader } from '../reusables/EntryHeader';
import { HighlightableEntry } from '../reusables/HighlightableEntry';
import { DeviceToTestRunResult, Props as ParentProps } from './types';

type Props = {
  result: DeviceToTestRunResult;
} & Pick<ParentProps, 'setScreenshot' | 'story' | 'level' | 'selection'>;

export const ScreenshotsEntry: React.FC<Props> = ({
  story,
  level,
  result,
  selection,
  setScreenshot,
}) => {
  return (
    <ScreenshotsList>
      {result.details.screenshots.map((it) => (
        <li
          key={it.name}
          role="menuitem"
          aria-label={it.name}
          onClick={() => setScreenshot(story.id, it.name, result.device.name)}
        >
          <ActiveEntryHeader
            $level={level}
            $offset={24}
            $color={blue[0]}
            $active={isActive(it)}
          >
            <HighlightableEntry
              status={it.type}
              left={<PictureOutlined style={{ marginRight: 4 }} />}
              title={it.name}
            />
          </ActiveEntryHeader>
        </li>
      ))}
    </ScreenshotsList>
  );

  function isActive(screenshot: ScreenshotComparisonResult) {
    return (
      selection.type === 'screenshot' &&
      selection.story.id === story.id &&
      selection.device === result.device &&
      selection.name === screenshot.name
    );
  }
};

const ScreenshotsList = styled.ul`
  padding: 0;
  text-decoration: none;
`;
