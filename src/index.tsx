import React from 'react';
import ReactDOM from 'react-dom/client';

import { DatePicker } from 'antd';

const div = document.createElement('div');

div.setAttribute('id', 'root');

document.body.appendChild(div);

console.log(12220202);
ReactDOM.createRoot(div).render(<DatePicker />);
