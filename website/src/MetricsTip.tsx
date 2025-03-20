import React from 'react';

export enum Metric {
  RegressionProtection = 'RegressionProtection',
  RefactoringAllowance = 'RefactoringAllowance',
  Maintainability = 'Maintainability',
  Speed = 'Speed',
}

type Props = { improves: Metric[]; positive?: boolean };

export const MetricsTip: React.FC<Props> = (props) => {
  const improves = props.improves.map((metric) => METRIC_TO_ICON[metric]);

  const degrades = Object.values(Metric)
    .filter((metric) => !props.improves.includes(metric))
    .map((metric) => METRIC_TO_ICON[metric]);

  return (
    <div>
      <div style={{ color: 'green' }}>{improves} Улучшает</div>
      {props.positive ? null : (
        <div style={{ color: 'red' }}>{degrades} Ухудшает</div>
      )}
      <br />
    </div>
  );
};

const METRIC_TO_ICON: Record<Metric, React.ReactNode> = {
  [Metric.RegressionProtection]: (
    <a href="/metrics#%EF%B8%8F-защита-от-регресса" title="Защита от регресса">
      🛡
    </a>
  ),
  [Metric.RefactoringAllowance]: (
    <a
      href="/metrics#-независимость-от-рефакторинга"
      title="Независимость от рефакторинга"
    >
      🔧
    </a>
  ),
  [Metric.Maintainability]: (
    <a href="/metrics#-поддерживаемость" title="Поддерживаемость">
      📈
    </a>
  ),
  [Metric.Speed]: (
    <a href="/metrics#-быстродействие" title="Быстродействие">
      ⚡
    </a>
  ),
};
