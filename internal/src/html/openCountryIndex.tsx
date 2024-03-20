import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../pages/OpenCountry';
import '../index.scss';

const MOUNT_NODE = document.getElementById('open-country');
const root = createRoot(MOUNT_NODE as Element);
root.render(<App />);
