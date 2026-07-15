// src/pages/Timemark.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { IconArrowLeft, IconInfinity } from '@tabler/icons-react';
import LightRays from '../components/LightRays/LightRays';
import styles from '../styles/Timemark.module.css';

const START = new Date('2024-01-12T15:00:00');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const pad = n => String(n).padStart(2, '0');

function calcContador() {
  const agora = new Date();
  const diff = agora - START;
  const s = Math.floor(diff / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  const anos = Math.floor(d / 365);
  const meses = Math.floor((d % 365) / 30);
  const dias = (d % 365) % 30;
  return { anos, meses, dias, horas: h % 24, minutos: m % 60, segundos: s % 60 };
}

export default function Timemark() {
  const navigate = useNavigate();
  const [fase, setFase] = useState('entrada');
  const [dia, setDia] = useState(null);
  const [mes, setMes] = useState(null);
  const [contador, setContador] = useState({ anos: 0, meses: 0, dias: 0, horas: 0, minutos: 0, segundos: 0 });

  useEffect(() => {
    async function animar() {
        sleep(150);
      for (let i = 1; i <= 12; i++) {
        setDia(i);
        await sleep(750);
      }
      await sleep(400);
      // Mês conta de 0 até 1
      for (let i = 0; i <= 1; i++) {
        setMes(i);
        await sleep(500);
      }
      await sleep(400);
      setFase('final');
      setContador(calcContador());
      const interval = setInterval(() => setContador(calcContador()), 1000);
      return () => clearInterval(interval);
    }
    animar();
  }, []);

  return (
    <div className={styles.page}>

      {/* Botão voltar — sempre visível */}
      <button className={styles.voltarBtn} onClick={() => navigate('/')}>
        <IconArrowLeft size={18} />
         voltar  
        <IconInfinity size={14} />
      </button>

      <AnimatePresence>

        {/* ── FASE 1 ── */}
        {fase === 'entrada' && (
          <motion.div
            key="fase1"
            className={styles.fase1}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            {/* LightRays absoluto — não interfere no flex */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
              <LightRays raysOrigin="top-center" />
            </div>

            <div className={styles.dataEntrada}>
              <span className={dia ? styles.dataSegmento : styles.dataSegmentoVazio}>
                {dia ? pad(dia) : '__'}
              </span>
              <span className={styles.dataSeparador}>/</span>
              <span className={mes !== null ? styles.dataSegmento : styles.dataSegmentoVazio}>
                {mes !== null ? pad(mes) : '__'}
              </span>
              <span className={styles.dataSeparador}>/</span>
              <span>24</span>
            </div>
          </motion.div>
        )}

        {/* ── FASE 2 ── */}
        {fase === 'final' && (
          <motion.div
            key="fase2"
            className={styles.fase2}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >

            {/* LADO ESQUERDO — CONTADOR */}
            <div className={styles.ladoEsquerdo}>

              <div className={styles.grid}>
                {[['anos', contador.anos], ['meses', contador.meses], ['dias', contador.dias]].map(([label, val]) => (
                  <div key={label} className={styles.celula}>
                    <span className={styles.numero}>{pad(val)}</span>
                    <span className={styles.label}>{label}</span>
                  </div>
                ))}
              </div>

              <div className={styles.separadorH} />

              <div className={styles.grid}>
                {[['horas', contador.horas], ['minutos', contador.minutos], ['segundos', contador.segundos]].map(([label, val]) => (
                  <div key={label} className={styles.celula}>
                    <span className={styles.numero}>{pad(val)}</span>
                    <span className={styles.label}>{label}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* DIVISOR VERTICAL */}
            <div className={styles.divisorV}>
              <span className={styles.coracao}>♥</span>
            </div>

            {/* LADO DIREITO — DATA */}
            <div className={styles.ladoDireito}>
              <span className={styles.desdeLabel}>desde</span>
              <div className={styles.dataFinal}>
                12<span className={styles.dataFinalSep}>/</span>
                01<span className={styles.dataFinalSep}>/</span>
                24
              </div>
              <span className={styles.desdeSubtitulo}>i vai pra sempre agora..</span>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}