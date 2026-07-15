// src/App.jsx

import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Galeria from './pages/Galeria';
import Frases from './pages/Frases';
import DayPuzzle from './pages/DayPuzzle';
import Timemark from './pages/Timemark';
import Odia from './pages/Odia';
import Cartas from './pages/Cartas';

// Placeholders — substituir pelos componentes reais quando especificados
const Placeholder = ({ nome }) => (
  <div style={{
    minHeight: '100vh',
    background: '#0e0d0c',
    color: '#f5f0e8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'EB Garamond', serif",
    fontSize: '2rem',
  }}>
    {nome}
  </div>
);

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/galeria"     element={<Galeria />} />
        <Route path="/frases"      element={<Frases />} />
        <Route path="/timemark"    element={<Timemark />} />
        <Route path="/daypuzzle"  element={<DayPuzzle />} />
        <Route path="/segredo"     element={<Placeholder nome="Galeria Secreta" />} />
        <Route path="/o-dia"       element={<Odia />} />
        <Route path="/cartas"      element={<Cartas />} />
      </Routes>
    </HashRouter>
  );
}