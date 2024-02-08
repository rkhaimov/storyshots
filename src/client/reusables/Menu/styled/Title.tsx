import styled from 'styled-components';

export const Title = styled.span.attrs<{
  fontSize?: number;
  fontWeight?: number;
}>((props) => ({
  fontSize: props.fontSize,
  fontWeight: props.fontWeight,
}))`
  flex: 1 1 auto;
  font-size: ${(props) => props.fontSize ?? 14}px;
  font-weight: ${(props) => props.fontWeight ?? 'normal'};
  padding: 0 4px;
  user-select: none;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  & > span:nth-of-type(1),
  & > span:nth-of-type(2) {
    margin-right: 4px;
  }
`;
