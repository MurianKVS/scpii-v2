// src/pages/Home.jsx

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  IconPhoto, IconFishHook, IconCalendarTime,
  IconPuzzle, IconLock, IconNotebook, IconMail, IconHelp,
} from '@tabler/icons-react';
import styles from '../styles/Home.module.css';

const POLAROIDS = [
  { id: 'galeria',     label: 'Galeria',       icon: IconPhoto,     bg: '#2a1e2e', color: 'rgba(255,182,193,0.85)', rotate: '-4deg',  route: '/galeria' },
  { id: 'frases',      label: 'Frases fraseadas',      icon: IconFishHook,    bg: '#1a1e30', color: 'rgba(120,198,247,0.85)', rotate: '2deg',   route: '/frases' },
  { id: 'timemark',    label: 'Nosso tempo',       icon: IconCalendarTime,  bg: '#0d1520', color: 'rgba(100,160,255,0.85)', rotate: '5deg',   route: '/timemark' },
  { id: 'daypuzzle', label: 'Day Puzzle',      icon: IconPuzzle,      bg: '#28101a', color: 'rgba(255,100,150,0.85)', rotate: '-2deg',  route: '/daypuzzle' },
  { id: 'o-dia',       label: 'O dia em que tudo começou..',      icon: IconNotebook ,      bg: '#181008', color: 'rgba(200,160,70,0.85)',  rotate: '-6deg',  route: '/o-dia' },
  { id: 'cartas',      label: 'cartas',        icon: IconMail,       bg: '#180e0c', color: 'rgba(210,120,100,0.85)', rotate: '4deg',   route: '/cartas' },
  { id: 'segredo',     label: '✦ segredo',     icon: IconLock,       bg: '#0c0c10', color: 'rgba(160,140,255,0.65)', rotate: '3deg',   route: '/segredo' },
  { id: 'quiz',        label: '1ª prova',      icon: IconHelp,       bg: '#111111', color: 'rgba(255,255,255,0.2)', rotate: '-2deg',  route: null },
];

// Largura de referência que a v1 foi desenhada
const V1_WIDTH = 1280;
const V1_HEIGHT = 800;

function Polaroid({ data, onClick }) {
  const Icon = data.icon;
  const isQuiz = data.route === null;

  return (
    <div
      className={`${styles.pol} ${isQuiz ? styles.polQuiz : ''}`}
      style={{ transform: `rotate(${data.rotate})` }}
      onClick={isQuiz ? undefined : onClick}
      role={isQuiz ? undefined : 'button'}
      tabIndex={isQuiz ? -1 : 0}
      onKeyDown={isQuiz ? undefined : (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      <div className={styles.polIcon} style={{ background: data.bg }}>
        <Icon size={24} color={data.color} stroke={1.5} />
      </div>
      <div className={styles.polLegenda}>{data.label}</div>
    </div>
  );
}

export default function Home() {
  const [expandido, setExpandido] = useState(false);
  const [iframeScale, setIframeScale] = useState(0.7);
  const quadroRef = useRef(null);
  const navigate = useNavigate();

  // Calcula o scale do iframe com base no tamanho real do quadro
  useEffect(() => {
    if (!quadroRef.current) return;

    const calcScale = () => {
      const { offsetWidth, offsetHeight } = quadroRef.current;
      const scaleX = offsetWidth / V1_WIDTH;
      const scaleY = offsetHeight / V1_HEIGHT;
      setIframeScale(Math.min(scaleX, scaleY));
    };

    calcScale();
    const ro = new ResizeObserver(calcScale);
    ro.observe(quadroRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={styles.sala}>

      {/* ── PAREDE ── */}
      <div className={styles.paredeArea}>
        <motion.div
          ref={quadroRef}
          layoutId="quadro-v1"
          className={styles.quadroMoldura}
          onClick={() => setExpandido(true)}
          whileHover={{ scale: 1.008 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <iframe
            src="/v1/scrapbook.html"
            title="Scrapii v1"
            sandbox="allow-scripts allow-same-origin"
            scrolling="no"
            className={styles.quadroIframe}
            style={{
              width: `${V1_WIDTH}px`,
              height: `${V1_HEIGHT}px`,
              transform: `scale(${iframeScale})`,
            }}
          />
        </motion.div>
      </div>

      {/* ── FOOTER DE POLAROIDS ── */}
      <div className={styles.navbar}>
        {POLAROIDS.map((pol) => (
          <Polaroid
            key={pol.id}
            data={pol}
            onClick={() => navigate(pol.route)}
          />
        ))}
      </div>

      {/* ── QUADRO EXPANDIDO ── */}
      <AnimatePresence>
        {expandido && (
          <>
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setExpandido(false)}
            />
            <motion.div
              layoutId="quadro-v1"
              className={styles.quadroExpandido}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            >
              <iframe
                src="/v1/scrapbook.html"
                title="Scrapii v1 expandido"
                sandbox="allow-scripts allow-same-origin"
                className={styles.quadroExpandidoIframe}
              />
              <button
                className={styles.fecharBtn}
                onClick={() => setExpandido(false)}
                aria-label="Fechar"
              >
                ×
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}