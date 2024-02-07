import styled from 'styled-components';

export const Title = styled.span`
  flex: 1 1 auto;
  font-size: 14px;
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
