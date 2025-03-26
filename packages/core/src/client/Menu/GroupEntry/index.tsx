import { UpOutlined } from '@ant-design/icons';
import { Group } from '@core';
import React from 'react';
import styled from 'styled-components';
import { MenuHavingStories } from '../MenuHavingStories';
import { AcceptAction } from '../reusables/AcceptAction';
import { EntryActions } from '../reusables/EntryActions';
import { EntryHeader } from '../reusables/EntryHeader';
import { getStatusFromSummary } from '../reusables/getStatusFromSummary';
import { HighlightableEntry } from '../reusables/HighlightableEntry';
import { RunAction } from '../reusables/RunAction';
import { RunCompleteAction } from '../reusables/RunCompleteAction';
import { Props } from '../types';
import { getGroupEntrySummary } from './getGroupEntrySummary';

export const GroupEntry: React.FC<
  Props & {
    group: Group;
  }
> = (props) => {
  const { group, selection, ...others } = props;
  const expanded = others.expanded.has(group.id);

  if (selection.type === 'initializing') {
    return;
  }

  const summary = getGroupEntrySummary(group, props);
  const status = getStatusFromSummary(summary);

  return (
    <li aria-label={group.title}>
      <EntryHeader
        $offset={8}
        $level={others.level}
        onClick={() => others.toggleExpanded(group)}
        role="menuitem"
      >
        <Fold open={expanded} />
        <HighlightableEntry
          status={status}
          title={group.title}
          style={{ fontSize: 16, fontWeight: 600 }}
        />
        <EntryActions status={status}>
          <AcceptAction
            accept={props.accept}
            accepting={props.accepting}
            changes={summary.changes}
          />
          <RunAction stories={group.children} run={others.run} />
          <RunCompleteAction
            stories={group.children}
            runComplete={others.runComplete}
          />
        </EntryActions>
      </EntryHeader>
      {expanded && (
        <MenuHavingStories
          {...others}
          stories={group.children}
          selection={selection}
          level={others.level + 1}
        />
      )}
    </li>
  );
};

const Fold = styled(UpOutlined)`
  margin-right: 2px;
  transform: rotate(${({ open }) => `${open ? '180' : '90'}deg`});
`;
