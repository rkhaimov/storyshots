import React from 'react';
import ReactDOM from 'react-dom/client';
import styled from 'styled-components';

const div = document.createElement('div');

div.setAttribute('id', 'root');

document.body.appendChild(div);

const Button = styled.a`
  --accent-color: white;

  /* This renders the buttons above... Edit me! */
  background: transparent;
  border-radius: 3px;
  border: 1px solid var(--accent-color);
  color: var(--accent-color);
  display: inline-block;
  margin: 0.5rem 1rem;
  padding: 0.5rem 0;
  transition: all 200ms ease-in-out;
  width: 11rem;

  &:hover {
    filter: brightness(0.85);
  }
`;

ReactDOM.createRoot(div).render(<Button>CLICK</Button>);
