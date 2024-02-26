import styled, { css } from 'styled-components';
import { not } from '../../../../reusables/utils';
import { EntryActions } from './EntryActions';

type Props = {
  $level: number;
  $offset: number;
};

export const EntryHeader = styled.div<Props>`
  cursor: pointer;
  height: 25px;
  display: flex;
  align-items: center;
  transition: 0.2s ease-in-out;
  padding-right: 2px;
  padding-left: ${(props) => `${props.$level * 24 + props.$offset}px`};

  &:hover,
  &:focus {
    ${EntryActions} {
      opacity: 1;
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