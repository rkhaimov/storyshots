import styled, { css } from 'styled-components';
import { EntryActions } from './EntryActions';
import { not } from '@storyshots/core';

type Props = {
  $level: number;
  $offset: number;
};

export const EntryHeader = styled.div<Props>`
  cursor: pointer;
  height: 25px;
  display: flex;
  align-items: center;
  padding-right: 2px;
  padding-left: ${(props) => `${props.$level * 24 + props.$offset}px`};

  ${EntryActions} {
    display: none;
  }

  &:hover,
  &:focus {
    ${EntryActions} {
      display: inherit;
    }
  }
`;

export const ActiveEntryHeader = styled(EntryHeader)<{
  $active: boolean;
  $color: string;
}>`
  background: ${({ $active, $color }) => ($active ? $color : 'none')};

  ${({ $active }) =>
    not($active) &&
    css`
      &:hover,
      &:focus {
        background: #fafafa;
      }
    `};
`;
