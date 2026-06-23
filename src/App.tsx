import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { loadTheme, applyTheme } from '@/lib/theme';
import Timer from '@/pages/Timer';
import Setup from '@/pages/Setup';

export default function App() {
  useEffect(() => {
    applyTheme(loadTheme());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/timer" replace />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/setup" element={<Setup />} />
      </Routes>
    </BrowserRouter>
  );
}
