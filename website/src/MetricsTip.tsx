import Link from '@docusaurus/Link';
import React from 'react';

export enum Metric {
  RegressionProtection = 'RegressionProtection',
  RefactoringAllowance = 'RefactoringAllowance',
  Maintainability = 'Maintainability',
  Speed = 'Speed',
}

export const BalancedMetricsTip: React.FC<{ improves: Metric[] }> = ({
  improves,
}) => (
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
        <div style={{ color: 'green' }}>{_improves} Улучшает</div>
      )}
      {_degrades.length > 0 && (
        <div style={{ color: 'red' }}>{_degrades} Ухудшает</div>
      )}
      <br />
    </div>
  );
};

const METRIC_TO_ICON: Record<Metric, React.ReactNode> = {
  [Metric.RegressionProtection]: (
    <Link
      to="/specification/metrics#%EF%B8%8F-защита-от-регресса"
      title="Защита от регресса"
    >
      🛡
    </Link>
  ),
  [Metric.RefactoringAllowance]: (
    <Link
      to="/specification/metrics#-независимость-от-рефакторинга"
      title="Независимость от рефакторинга"
    >
      🔧
    </Link>
  ),
  [Metric.Maintainability]: (
    <Link
      to="/specification/metrics#-поддерживаемость"
      title="Поддерживаемость"
    >
      📈
    </Link>
  ),
  [Metric.Speed]: (
    <Link to="/specification/metrics#-быстродействие" title="Быстродействие">
      ⚡
    </Link>
  ),
};
