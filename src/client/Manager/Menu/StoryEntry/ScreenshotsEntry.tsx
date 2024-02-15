import { blue } from '@ant-design/colors';
import { PictureOutlined } from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';
import { ScreenshotName } from '../../../../reusables/types';
import { SuccessTestResult } from '../../behaviour/useTestResults/types';
import { ActiveEntryHeader } from '../reusables/EntryHeader';
import { EntryTitle } from '../reusables/EntryTitle';
import { Props as ParentProps } from './types';

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
                title={
                  <>
                    <PictureOutlined style={{ marginRight: 4 }} />
                    <span>{it.name}</span>
                  </>
                }
                status={{ type: it.result.type }}
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
            title={
              <>
                <PictureOutlined style={{ marginRight: 4 }} />
                <span>FINAL</span>
              </>
            }
            status={{ type: screenshots.final.type }}
          />
        </ActiveEntryHeader>
      </li>
    </ScreenshotsList>
  );

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
