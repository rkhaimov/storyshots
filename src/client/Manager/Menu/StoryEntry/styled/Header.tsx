import styled from 'styled-components';

export const Header = styled.div.attrs<{
  level: number;
  active: boolean;
  activeColor: string;
  levelMargin: number;
}>((props) => ({
  level: props.level,
  active: props.active,
  levelMargin: props.levelMargin,
  activeColor: props.activeColor,
}))`
  cursor: pointer;
  height: 25px;
  display: flex;
  align-items: center;
  transition: 0.2s ease-in-out;
  padding-left: ${(props) => `${props.level * 24 + props.levelMargin}px`};
  background: ${({ active, activeColor }) => (active ? activeColor : '')};

  &:hover,
  &:focus {
    background: ${({ active, activeColor }) =>
      active ? activeColor : '#fafafa'};
  }
`;
