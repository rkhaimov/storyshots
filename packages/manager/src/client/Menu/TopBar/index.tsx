import { EyeOutlined, SlidersOutlined } from '@ant-design/icons';
import { Device, PureStoryTree, TreeOP } from '@storyshots/core';
import { Checkbox, Form, Select } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { isOnRun } from '../../../reusables/runner/isOnRun';
import { UseBehaviourProps } from '../../behaviour/types';
import { ReadySelection } from '../../behaviour/useSelection/types';
import { EntryAction } from '../reusables/EntryAction';
import { getStoryEntryStatus } from '../reusables/getStoryEntryStatus';
import { RunAction } from '../reusables/RunAction';
import { RunCompleteAction } from '../reusables/RunCompleteAction';
import { EntryActions } from './EntryActions';
import { EntryHeader } from './EntryHeader';
import { StopAction } from './StopAction';

export type Props = UseBehaviourProps & {
  stories: PureStoryTree[];
  selection: ReadySelection;
};

export const TopBar: React.FC<Props> = ({
  run,
  runComplete,
  stopAll,
  stories,
  selection,
  results,
  setConfig,
  highlight,
  toggleStatusPane,
}) => {
  const [opened, setOpened] = useState(false);
  const nodes = TreeOP.toLeafsArray(stories);
  const { preview, config } = selection;

  return (
    <div aria-label="Status">
      <EntryHeader>
        <a
          href="#"
          aria-label="Progress"
          style={{ flex: 1 }}
          onClick={toggleStatusPane}
        >
          {renderStatusText(results, selection, stories)}
        </a>
        <EntryActions
          onRunNode={hasAnyOnRun(results) && <StopAction stopAll={stopAll} />}
        >
          <RunAction stories={nodes} selection={selection} run={run} />
          <RunCompleteAction
            stories={nodes}
            selection={selection}
            runComplete={runComplete}
          />
          <PickLocatorAction onPick={highlight.toggle} />
          <ToggleConfigPaneAction onToggle={() => setOpened((prev) => !prev)} />
        </EntryActions>
      </EntryHeader>
      {opened && (
        <PreviewConfigForm layout="vertical" size="small">
          <Form.Item label="Device">
            <Select<DeviceOption['value'], DeviceOption>
              value={config.device.name}
              onChange={(_, option) => {
                if (Array.isArray(option)) {
                  return;
                }

                setConfig({
                  device: option.device.name,
                  emulated: config.emulated,
                });
              }}
              options={preview.devices.map((it) => ({
                value: it.name,
                label: it.name,
                device: it,
              }))}
            />
          </Form.Item>
          <Form.Item>
            <Checkbox
              checked={config.emulated}
              onChange={(it) =>
                setConfig({
                  device: config.device.name,
                  emulated: it.target.checked,
                })
              }
            >
              Apply to preview
            </Checkbox>
          </Form.Item>
        </PreviewConfigForm>
      )}
    </div>
  );
};

function hasAnyOnRun(results: Props['results']) {
  return Array.from(results.entries()).some(([, result]) => isOnRun(result));
}

function renderStatusText(
  results: Props['results'],
  selection: Props['selection'],
  stories: Props['stories'],
): string {
  const total = results.size;

  if (total === 0) {
    return 'Status';
  }

  const passed = TreeOP.toLeafsArray(stories)
    .map((story) => getStoryEntryStatus(results, selection, story))
    .filter((status) => status?.type === 'pass').length;

  return `${passed}/${total} passed (${((passed / total) * 100).toFixed()}%)`;
}

const PickLocatorAction: React.FC<{ onPick(): void }> = ({ onPick }) => (
  <EntryAction
    label="Pick locator"
    icon={<EyeOutlined />}
    action={onPick}
  />
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
