import { EyeOutlined, SlidersOutlined } from '@ant-design/icons';
import { Device, StoryTree } from '@core';
import { assert } from '@lib';
import { Checkbox, Form, Select } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { createSummary } from '../../../reusables/summary';
import { Summary } from '../../../reusables/summary/types';
import { UseBehaviourProps } from '../../behaviour/types';
import { ReadySelection } from '../../behaviour/useSelection/types';
import { EntryAction } from '../reusables/EntryAction';
import { RunAction } from '../reusables/RunAction';
import { RunCompleteAction } from '../reusables/RunCompleteAction';
import { EntryActions, IdleActions } from './EntryActions';
import { EntryHeader } from './EntryHeader';
import { StopAction } from './StopAction';

export type Props = UseBehaviourProps & {
  stories: StoryTree;
  selection: ReadySelection;
};

export const TopBar: React.FC<Props> = (props) => {
  const { results, toggleStatusPane } = props;
  const [opened, setOpened] = useState(false);
  const summary = createSummary(results);

  return (
    <div aria-label="Status">
      <EntryHeader>
        <a
          href="#"
          aria-label="Progress"
          style={{ flex: 1 }}
          onClick={toggleStatusPane}
        >
          {renderStatusText(summary)}
        </a>
        <EntryActions>
          <StopAction stopAll={props.stopAll} summary={summary} />
          <IdleActions summary={summary}>
            <RunAction stories={props.stories} run={props.run} />
            <RunCompleteAction
              stories={props.stories}
              runComplete={props.runComplete}
            />
            <PickLocatorAction onPick={props.toggleHighlighting} />
            <ToggleConfigPaneAction
              onToggle={() => setOpened((prev) => !prev)}
            />
          </IdleActions>
        </EntryActions>
      </EntryHeader>
      {opened && (
        <PreviewConfigForm layout="vertical" size="small">
          <Form.Item label="Device">
            <Select<DeviceOption['value'], DeviceOption>
              value={props.device.selected.name}
              onChange={(_, option) => {
                assert(!Array.isArray(option));

                props.setDevice(option.device);
              }}
              options={props.devices.map((it) => ({
                value: it.name,
                label: it.name,
                device: it,
              }))}
            />
          </Form.Item>
          <Form.Item>
            <Checkbox
              checked={props.emulated}
              onChange={(it) => props.setEmulated(it.target.checked)}
            >
              Apply to preview
            </Checkbox>
          </Form.Item>
        </PreviewConfigForm>
      )}
    </div>
  );
};

function renderStatusText({ pass, total }: Summary): string {
  if (total === 0) {
    return 'Status';
  }

  return `${pass}/${total} passed (${((pass / total) * 100).toFixed()}%)`;
}

const PickLocatorAction: React.FC<{ onPick(): void }> = ({ onPick }) => (
  <EntryAction label="Pick locator" icon={<EyeOutlined />} action={onPick} />
);

const ToggleConfigPaneAction: React.FC<{ onToggle(): void }> = ({
  onToggle,
}) => (
  <EntryAction
    label="Toggle config pane"
    icon={<SlidersOutlined />}
    action={onToggle}
  />
);

type DeviceOption = {
  value: string;
  label: string;
  device: Device;
};

const PreviewConfigForm = styled(Form)`
  background-color: #f7f7f7;
  padding: 8px;
  border-bottom: 1px solid rgb(206, 206, 206);

  .ant-form-item {
    margin-bottom: 10px;
  }
`;
