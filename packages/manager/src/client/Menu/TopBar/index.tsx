import { SlidersOutlined } from '@ant-design/icons';
import {
  Device,
  not,
  PresetName,
  PureStoryTree,
  TreeOP,
} from '@storyshots/core';
import { Checkbox, Form, Radio, Select } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { UseBehaviourProps } from '../../behaviour/types';
import { AutoPlaySelectionInitialized } from '../../behaviour/useAutoPlaySelection';
import { EntryAction } from '../reusables/EntryAction';
import { EntryActions } from '../reusables/EntryActions';
import { EntryTitle } from '../reusables/EntryTitle';
import { RunAction } from '../reusables/RunAction';
import { RunCompleteAction } from '../reusables/RunCompleteAction';

export type Props = UseBehaviourProps & {
  stories: PureStoryTree[];
  selection: AutoPlaySelectionInitialized;
};

export const TopBar: React.FC<Props> = ({
  run,
  runComplete,
  stories,
  selection,
  results,
  setConfig,
}) => {
  const [opened, setOpened] = useState(false);
  const nodes = TreeOP.toLeafsArray(stories);
  const { config, preview } = selection;

  return (
    <div>
      <StatusEntryHeader>
        <EntryTitle
          left={<></>}
          title="Stories"
          style={{ fontSize: 16, fontWeight: 600 }}
        />
        <EntryActions waiting={isPlayingOrRunning()}>
          <RunAction stories={nodes} selection={selection} run={run} />
          <RunCompleteAction
            stories={nodes}
            selection={selection}
            runComplete={runComplete}
          />
          <ToggleConfigPaneAction onToggle={() => setOpened(not)} />
        </EntryActions>
      </StatusEntryHeader>
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
                  ...config,
                  device: {
                    ...option.device,
                    emulated: config.device.emulated,
                  },
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
              checked={config.device.emulated}
              onChange={(it) =>
                setConfig({
                  ...config,
                  device: { ...config.device, emulated: it.target.checked },
                })
              }
            >
              Apply to preview
            </Checkbox>
          </Form.Item>
          {preview.presets.map((preset) => (
            <Form.Item key={preset.name} label={preset.name}>
              {preset.others.length === 1 ? (
                <Radio.Group
                  options={[preset.default, ...preset.others].map((it) => ({
                    value: it,
                    label: it,
                  }))}
                  onChange={(it) =>
                    setConfig({
                      ...config,
                      presets: {
                        ...config.presets,
                        [preset.name]: it.target.value,
                      },
                    })
                  }
                  value={config.presets[preset.name]}
                  optionType="button"
                  buttonStyle="solid"
                />
              ) : (
                <Select<PresetName, PresetOption>
                  options={[preset.default, ...preset.others].map((it) => ({
                    value: it,
                    label: it,
                  }))}
                  value={config.presets[preset.name]}
                  onChange={(it) =>
                    setConfig({
                      ...config,
                      presets: {
                        ...config.presets,
                        [preset.name]: it,
                      },
                    })
                  }
                />
              )}
            </Form.Item>
          ))}
        </PreviewConfigForm>
      )}
    </div>
  );

  function isPlayingOrRunning() {
    if (selection.type === 'story' && selection.playing) {
      return true;
    }

    return [...results.entries()].some(([, test]) => test.running);
  }
};

const StatusEntryHeader = styled.div`
  display: flex;
  align-items: center;
  padding-right: 2px;
  padding-left: 8px;
  height: 30px;
  border-bottom: 1px solid rgb(206, 206, 206);
`;

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

type PresetOption = {
  value: PresetName;
  label: PresetName;
};

const PreviewConfigForm = styled(Form)`
  background-color: #f7f7f7;
  padding: 8px;
  border-bottom: 1px solid rgb(206, 206, 206);
  
  .ant-form-item {
    margin-bottom: 10px;
  }
`;
