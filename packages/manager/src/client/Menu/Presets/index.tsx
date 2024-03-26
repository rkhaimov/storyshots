import React from 'react';
import { Collapse, Radio, Select } from 'antd';
import styled from 'styled-components';

import { AutoPlaySelectionInitialized } from '../../behaviour/useAutoPlaySelection';
import { UseBehaviourProps } from '../../behaviour/types';

type Props = {
  selection: AutoPlaySelectionInitialized;
  setPresets: UseBehaviourProps['setPresets'];
};

export const Presets: React.FC<Props> = ({
  selection,
  setPresets,
}): React.ReactNode => {
  if (selection.config.presets.length === 0) {
    return;
  }

  const handleChange = (presetName: string, presetValue: string) => {
    setPresets({
      ...selection.selectedPresets,
      [presetName]: presetValue,
    });
  };

  return (
    <Wrapper
      size="small"
      items={[
        {
          label: 'Presets',
          children: (
            <PresetList>
              {selection.config.presets.map((preset) => {
                const id = `select-${preset.name}`;
                const onChange = (name: string) =>
                  handleChange(preset.name, name);
                const value =
                  selection.selectedPresets &&
                  selection.selectedPresets[preset.name]
                    ? selection.selectedPresets[preset.name]
                    : preset.default;
                const options = [
                  {
                    value: preset.default,
                    label: preset.default,
                  },
                  ...preset.additional.map((presetName) => {
                    return {
                      value: presetName,
                      label: presetName,
                    };
                  }),
                ];

                return (
                  <PresetItem key={preset.name}>
                    <PresetLabel htmlFor={id}>{preset.name}</PresetLabel>
                    {options.length > 2 ? (
                      <PresetSelect
                        id={id}
                        onChange={onChange}
                        value={value}
                        options={options}
                      />
                    ) : (
                      <PresetRadio
                        options={options}
                        onChange={(e) => onChange(e.target.value)}
                        value={value}
                        optionType="button"
                        buttonStyle="solid"
                      />
                    )}
                  </PresetItem>
                );
              })}
            </PresetList>
          ),
        },
      ]}
    />
  );
};

const Wrapper = styled(Collapse)``;

const PresetList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const PresetItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const PresetLabel = styled.label`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 30%;
  display: inline-block;
`;

const PresetSelect = styled(Select)`
  max-width: 70%;
`;

const PresetRadio = styled(Radio.Group)`
  overflow: hidden;
  display: flex;
  width: 70%;

  label {
    width: 50%;

    span:last-child {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 100%;
      display: inline-block;
      text-align: center;
    }
  }
`;
