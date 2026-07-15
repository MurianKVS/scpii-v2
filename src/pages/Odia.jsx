// src/pages/ODia.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { IconArrowLeft, IconFeather } from '@tabler/icons-react';
import { paginas } from '../data/odia';
import styles from '../styles/Odia.module.css';

// ─── VARIANTES DE ANIMAÇÃO ────────────────────────────────────────────────────
const variants = {
  enter:  (d) => ({ opacity: 0, x: d > 0 ?  30 : -30 }),
  center:       ({ opacity: 1, x: 0 }),
  exit:   (d) => ({ opacity: 0, x: d > 0 ? -30 :  30 }),
};

// ─── CAPA ─────────────────────────────────────────────────────────────────────
function Capa() {
  return (
    <div className={styles.capaWrap}>
      <img
        src="/images/odia12-capa.png"
        alt="capa"
        className={styles.capaImg}
        onError={e => { e.target.style.display = 'none'; }}
      />
      <div className={styles.capaOrnamento}>✦ ✦ ✦</div>
      <div className={styles.capaLinha} />
      <div className={styles.capaTitulo}>
        O Dia que<br />Tudo Começou
      </div>
      <div className={styles.capaLinha} />
      <div className={styles.capaSubtitulo}>por um aventureiro apaixonado</div>
    </div>
  );
}

// ─── CAPÍTULO ─────────────────────────────────────────────────────────────────
function Capitulo({ pagina }) {
  const paragrafos = pagina.texto
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);

  return (
    <>
      <div className={styles.capHeader}>
        <span className={styles.capNum}>{pagina.num}</span>
        <div className={styles.capTitulo}>{pagina.titulo}</div>
        <div className={styles.capOrnamento}>✦ · ✦</div>
      </div>

      <div className={styles.capTexto}>
        {paragrafos.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {pagina.numPagina && (
        <div className={styles.numPagina}>{pagina.numPagina}</div>
      )}
    </>
  );
}

// ─── CONTRACAPA ───────────────────────────────────────────────────────────────
function Contracapa() {
  return (
    <div className={styles.contracapaWrap}>
      <div className={styles.capaLinha} />
      <div className={styles.capaOrnamento}>✦</div>
      <div className={styles.contracapaTitulo}>eu te amo.</div>
      <div className={styles.capaOrnamento}>✦</div>
      <div className={styles.capaLinha} />
    </div>
  );
}

// ─── O DIA ────────────────────────────────────────────────────────────────────
export default function ODia() {
  const navigate = useNavigate();
  const [atual, setAtual]     = useState(0);
  const [direcao, setDirecao] = useState(1);

  const mudarPagina = (dir) => {
    const prox = atual + dir;
    if (prox < 0 || prox >= paginas.length) return;
    setDirecao(dir);
    setAtual(prox);
  };

  const pagina = paginas[atual];
  const ehPrimeira = atual === 0;
  const ehUltima   = atual === paginas.length - 1;

  return (
    <div className={styles.odiaPage}>

      {/* Botão voltar */}
      <button className={styles.voltarBtn} onClick={() => navigate('/')}>
        <IconArrowLeft size={18} />
         voltar  
        <IconFeather size={14} />
      </button>

      {/* Indicador de posição */}
      <div className={styles.tabs}>
        {paginas.map((_, i) => (
          <div
            key={i}
            className={`${styles.tab} ${i === atual ? styles.tabAtiva : ''}`}
          />
        ))}
      </div>

      {/* Páginas animadas */}
      <AnimatePresence mode="wait" custom={direcao}>
        <motion.div
          key={atual}
          className={styles.pagina}
          custom={direcao}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {pagina.tipo === 'capa'       && <Capa />}
          {pagina.tipo === 'capitulo'   && <Capitulo pagina={pagina} />}
          {pagina.tipo === 'contracapa' && <Contracapa />}
        </motion.div>
      </AnimatePresence>

      {/* Navegação */}
      <div className={styles.navLivro}>
        <button
          className={`${styles.navBtn} ${ehPrimeira ? styles.navBtnHidden : ''}`}
          onClick={() => mudarPagina(-1)}
        >
          ← anterior
        </button>

        <button
          className={`${styles.navBtn} ${ehUltima ? styles.navBtnHidden : ''}`}
          onClick={() => mudarPagina(1)}
        >
          próximo →
        </button>
      </div>

    </div>
  );
}