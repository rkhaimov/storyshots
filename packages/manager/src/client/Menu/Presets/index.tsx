import React from 'react';
import { Collapse, Select } from 'antd';
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
                return (
                  <PresetItem key={preset.name}>
                    <span>{preset.name}</span>
                    <Select
                      onChange={(name) => handleChange(preset.name, name)}
                      value={
                        selection.selectedPresets &&
                        selection.selectedPresets[preset.name]
                          ? selection.selectedPresets[preset.name]
                          : preset.default
                      }
                      options={[
                        {
                          value: preset.default,
                          label: <span>{preset.default}</span>,
                        },
                        ...preset.additional.map((presetName) => {
                          return {
                            value: presetName,
                            label: <span>{presetName}</span>,
                          };
                        }),
                      ]}
                    />
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
`;
