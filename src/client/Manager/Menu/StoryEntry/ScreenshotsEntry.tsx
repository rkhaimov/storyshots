import { blue } from '@ant-design/colors';
import { FileImageOutlined } from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';
import { ScreenshotName } from '../../../../reusables/types';
import { Status } from '../../../reusables/Status';
import { SuccessTestResult } from '../../behaviour/useTestResults/types';
import { Props as ParentProps } from './types';
import { Title } from './styled/Title';
import { Header } from './styled/Header';

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
          <li key={it.name} onClick={() => setScreenshot(story, it.name)}>
            <Header
              level={level}
              levelMargin={24}
              activeColor={blue[0]}
              active={isActive(it.name)}
            >
              <Title title={it.name}>
                <Status type={it.result.type} />
                <FileImageOutlined style={{ marginRight: 4 }} />
                {it.name}
              </Title>
            </Header>
          </li>
        );
      })}
      <li key="final" onClick={() => setScreenshot(story, undefined)}>
        <Header
          level={level}
          levelMargin={24}
          activeColor={blue[0]}
          active={isActive(undefined)}
        >
          <Title title="FINAL">
            <Status type={screenshots.final.type} />
            <FileImageOutlined />
            FINAL
          </Title>
        </Header>
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
