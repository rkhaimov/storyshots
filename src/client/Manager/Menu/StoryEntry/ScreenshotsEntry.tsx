import { blue } from '@ant-design/colors';
import { FileImageOutlined } from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';
import { ScreenshotName } from '../../../../reusables/types';
import { Fail, Fresh, Pass } from '../../../reusables/Statuses';
import {
  ScreenshotComparisonResult,
  SuccessTestResult,
} from '../../behaviour/useTestResults/types';
import { Props as ParentProps } from './types';

type Props = { results: SuccessTestResult } & Pick<
  ParentProps,
  'setScreenshot' | 'story' | 'level' | 'selection'
>;

export const ScreenshotsEntry: React.FC<Props> = ({
  story,
  level,
  results,
  selection,
  setScreenshot,
}) => {
  const screenshots = results.screenshots;

  return (
    <ScreenshotsList>
      {screenshots.others.map((it) => (
        <li key={it.name} onClick={() => setScreenshot(story, it.name)}>
          <ScreenshotHeader level={level} active={isActive(it.name)}>
            {renderType(it.result.type)}
            <ScreenshotTitle title={it.name}>
              <FileImageOutlined />
              {it.name}
            </ScreenshotTitle>
          </ScreenshotHeader>
        </li>
      ))}
      <li key="final" onClick={() => setScreenshot(story, undefined)}>
        <ScreenshotHeader level={level} active={isActive(undefined)}>
          {renderType(screenshots.final.type)}
          <ScreenshotTitle title="FINAL">
            <FileImageOutlined />
            FINAL
          </ScreenshotTitle>
        </ScreenshotHeader>
      </li>
    </ScreenshotsList>
  );

  function renderType(type: ScreenshotComparisonResult['type']) {
    if (type === 'fail') {
      return <Fail />;
    }

    if (type === 'fresh') {
      return <Fresh />;
    }

    return <Pass />;
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
  text-decoration: 'none';
`;

const ScreenshotHeader = styled.div.attrs<{ level: number; active: boolean }>(
  (props) => ({
    level: props.level,
    active: props.active,
  }),
)`
  height: 25px;
  display: flex;
  align-items: center;
  padding: 2px;
  padding-left: ${(props) => `${props.level * 40 + 8}px`};
  background: ${({ active }) => (active ? blue[0] : '')};
  transition: 0.2s ease-in-out;
  cursor: pointer;

  &:hover,
  &:focus {
    background: ${({ active }) => active ? blue[0] : '#fafafa'};
  }
`;

const ScreenshotTitle = styled.span`
  margin-left: 6px;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  & svg {
    margin-right: 4px;
  }
`;
