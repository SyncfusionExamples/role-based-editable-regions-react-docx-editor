import { createRoot } from 'react-dom/client';
import { registerLicense } from '@syncfusion/ej2-base';
import App from './App';
import './index.css';

const license = import.meta.env.VITE_SYNCFUSION_LICENSE;
if (license) {
  registerLicense(license);
}

createRoot(document.getElementById('root')!).render(<App />);
