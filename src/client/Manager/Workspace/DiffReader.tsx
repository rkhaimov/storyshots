import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import ReactDiffViewer, {
  ReactDiffViewerProps,
} from 'react-diff-viewer-continued';

type Props = ReactDiffViewerProps & {
  single?: boolean;
};

export const DiffReader: React.FC<Props> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.single && ref.current) {
      hideFirstGutters();
    }
  });

  return (
    <ReaderPanel>
      <div ref={ref}>
        <ReactDiffViewer {...props} />
      </div>
    </ReaderPanel>
  );

  function hideFirstGutters() {
    const div = ref.current;
    if (!div) {
      return;
    }

    const gutters = div.querySelectorAll('table>tbody>tr>td:first-of-type');
    gutters.forEach((gutter) => {
      (gutter as HTMLElement).style.display = 'none';
    });
  }
};

const ReaderPanel = styled.div`
  margin: 0 auto;
  overflow: auto;
  width: calc(100% - 24px);
  border: 1px solid #cecece;
  border-radius: 4px;
  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
`;
