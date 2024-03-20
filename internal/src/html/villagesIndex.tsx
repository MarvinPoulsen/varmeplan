import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../pages/Villages';
import '../index.scss';

const MOUNT_NODE = document.getElementById('villages');
const root = createRoot(MOUNT_NODE as Element);
root.render(<App />);
