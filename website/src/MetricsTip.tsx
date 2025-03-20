import React from 'react';

export enum Metric {
  RegressionProtection = 'RegressionProtection',
  RefactoringAllowance = 'RefactoringAllowance',
  Maintainability = 'Maintainability',
  Speed = 'Speed',
}

export const BalancedMetricsTip: React.FC<{ improves: Metric[] }> = ({ improves }) => (
  <MetricsTip
    improves={improves}
    degrades={Object.values(Metric).filter(
      (metric) => !improves.includes(metric),
    )}
  />
);

export const MetricsTip: React.FC<{
  improves?: Metric[];
  degrades?: Metric[];
}> = ({ improves = [], degrades = [] }) => {
  const _improves = improves.map((metric) => METRIC_TO_ICON[metric]);
  const _degrades = degrades.map((metric) => METRIC_TO_ICON[metric]);

  return (
    <div>
      {_improves.length > 0 && (
        <div style={{ color: 'green' }}>{improves} Улучшает</div>
      )}
      {_degrades.length > 0 && (
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
