// src/pages/Frases.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { IconArrowLeft, IconAnchor, IconFish } from '@tabler/icons-react';
import styles from '../styles/Frases.module.css';

const PARTICULAS = [
  { width: 3, height: 3, left: '12%',  bottom: '10%', duration: '9s',  delay: '0s'   },
  { width: 2, height: 2, left: '35%',  bottom: '20%', duration: '12s', delay: '2s'   },
  { width: 4, height: 4, left: '58%',  bottom: '8%',  duration: '8s',  delay: '1s'   },
  { width: 2, height: 2, left: '75%',  bottom: '30%', duration: '13s', delay: '3.5s' },
  { width: 3, height: 3, left: '88%',  bottom: '15%', duration: '10s', delay: '0.5s' },
];

function tamanhoFrase(str) {
  if (!str) return 'fraseCurta';
  if (str.length <= 40)  return 'fraseCurta';
  if (str.length <= 120) return 'fraseMedia';
  return 'fraseLonga';
}

export default function Frases() {
  const navigate = useNavigate();

  const [frases, setFrases]           = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [jaExibidos, setJaExibidos]   = useState([]);
  const [carregado, setCarregado]     = useState(false);

  useEffect(() => {
    fetch('/frases.json')
      .then(r => r.json())
      .then(data => {
        setFrases(data);
        const idx = Math.floor(Math.random() * data.length);
        setIndiceAtual(idx);
        setJaExibidos([idx]);
        setCarregado(true);
      });
  }, []);

  const pescarOutra = () => {
    const disponiveis = frases.map((_, i) => i).filter(i => !jaExibidos.includes(i));
    const pool = disponiveis.length === 0
      ? frases.map((_, i) => i).filter(i => i !== indiceAtual)
      : disponiveis;
    const novo = pool[Math.floor(Math.random() * pool.length)];
    setIndiceAtual(novo);
    setJaExibidos(prev => disponiveis.length === 0 ? [novo] : [...prev, novo]);
  };

  const frase = frases[indiceAtual];
  const tamanho = tamanhoFrase(frase);

  return (
    <div className={styles.frasesPage}>

      {/* ── CÉU ── */}
      <div className={styles.ceu}>

        {/* Voltar */}
        <button className={styles.voltarBtn} onClick={() => navigate('/')}>
          <IconArrowLeft size={18} />
           voltar  
          <IconAnchor size={14} />
        </button>

        {/* Barco — z-index 3, na frente do SVG */}
        <div className={styles.barcoArea}>
          <img
            src="/images/baleias/bpesca.png"
            alt="baleia pescadora"
            className={styles.barcoImg}
          />
        </div>

      </div>

      {/* ── FUNDO DO MAR ── */}
      <div className={styles.marCorpo}>

        {PARTICULAS.map((p, i) => (
          <div
            key={i}
            className={styles.p}
            style={{
              width: p.width,
              height: p.height,
              left: p.left,
              bottom: p.bottom,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          />
        ))}

        {carregado && (
          <div className={styles.fraseContainer}>
            <AnimatePresence mode="wait">
              <motion.div
                key={indiceAtual}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: '-80px' }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <p className={`${styles.fraseTexto} ${styles[tamanho]}`}>
                  {frase?.split(' ').map((palavra, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: i * 0.07, duration: 0.35 }}
                      style={{ display: 'inline-block', marginRight: '0.25em' }}
                    >
                      {palavra}
                    </motion.span>
                  ))}
                </p>
              </motion.div>
            </AnimatePresence>

            <motion.button
              className={styles.pescarBtn}
              onClick={pescarOutra}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.5 }}
            >
              <IconFish size={16} />
              pescar outra
            </motion.button>
          </div>
        )}

      </div>

    </div>
  );
}