// src/pages/DayPuzzle.jsx

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { IconArrowLeft, IconFlame, IconPuzzle, IconPuzzle2 } from '@tabler/icons-react';
import { fotos } from '../data/galeria';
import { fPuzzles } from '../data/freepuzzles';
import styles from '../styles/DayPuzzle.module.css';

// ─── CONSTANTES ───────────────────────────────────────────────────────────────
const DIFICULDADES = [
  { label: 'fácil',  grid: 4 },
  { label: 'médio',  grid: 5 },
  { label: 'difícil',grid: 6 },
  { label: 'insano', grid: 7 },
];

const hojeStr = () => new Date().toISOString().split('T')[0];

// Hash determinístico por data
const seedDoDia = () => {
  const hoje = hojeStr();
  let hash = 0;
  for (let i = 0; i < hoje.length; i++) {
    hash = ((hash << 5) - hash) + hoje.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % fotos.length;
};

const fotoHoje = fotos[seedDoDia()] ?? fotos[0];

// Embaralha array (Fisher-Yates)
const embaralhar = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Gera estado inicial das peças para um grid NxN
// Cada peça: { id: índice_correto, pos: índice_atual, travada: bool }
const gerarPecas = (grid) => {
  const total = grid * grid;
  const ids = Array.from({ length: total }, (_, i) => i);
  return embaralhar(ids).map((id, pos) => ({ id, pos, travada: false }));
};

// ─── DAY PUZZLE ───────────────────────────────────────────────────────────────
export default function DayPuzzle() {
  const navigate = useNavigate();

  const [fase, setFase]           = useState('dificuldade'); // 'dificuldade' | 'jogando' | 'completo'
  const [grid, setGrid]           = useState(5);
  const [pecas, setPecas]         = useState([]);
  const [streak, setStreak]       = useState(0);
  const [celebrando, setCelebrando] = useState(false);
  const [dragIdx, setDragIdx]     = useState(null);
  const [dragOver, setDragOver]   = useState(null);

  const pecasRef = useRef(pecas);
  pecasRef.current = pecas;

  // ── Salvar progresso (também chamado no beforeunload) ──
  const salvarProgresso = useCallback((estadoPecas, completo = false, gridAtual = grid) => {
    localStorage.setItem('puzzle_progresso', JSON.stringify({
      data: hojeStr(),
      grid: gridAtual,
      estado: estadoPecas,
      completo,
    }));
  }, [grid]);

  // ── Mount: restaurar progresso e streak ──
  useEffect(() => {
    const salvo = JSON.parse(localStorage.getItem('puzzle_progresso') || 'null');
    const st    = JSON.parse(localStorage.getItem('puzzle_streak') || '{"streak":0,"ultimo":""}');
    setStreak(st.streak);

    if (salvo?.data === hojeStr()) {
      if (salvo.completo) {
        setFase('completo');
      } else if (salvo.estado && salvo.grid) {
        setGrid(salvo.grid);
        setPecas(salvo.estado);
        setFase('jogando');
      }
    }
  }, []);

  // ── beforeunload: salva progresso ao sair ──
  useEffect(() => {
    const handler = () => {
      if (fase === 'jogando') salvarProgresso(pecasRef.current, false);
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [fase, salvarProgresso]);

  // ── Iniciar jogo com dificuldade escolhida ──
  const iniciar = (g) => {
    const novasPecas = gerarPecas(g);
    setGrid(g);
    setPecas(novasPecas);
    setFase('jogando');
    salvarProgresso(novasPecas, false, g);
  };

  // ── Ao completar ──
  const aoCompletar = useCallback(() => {
    salvarProgresso(pecasRef.current, true);

    const hoje = hojeStr();
    const ontem = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const st = JSON.parse(localStorage.getItem('puzzle_streak') || '{"streak":0,"ultimo":""}');
    let novoStreak = 1;
    if (st.ultimo === ontem)  novoStreak = st.streak + 1;
    else if (st.ultimo === hoje) novoStreak = st.streak;
    localStorage.setItem('puzzle_streak', JSON.stringify({ streak: novoStreak, ultimo: hoje }));
    setStreak(novoStreak);

    setCelebrando(true);
    setTimeout(() => {
      setCelebrando(false);
      setFase('completo');
    }, 4000);
  }, [salvarProgresso]);

  // ── Drag and drop ──
  const onDragStart = (idx) => {
    if (pecas[idx].travada) return;
    setDragIdx(idx);
  };

  const onDragOver = (e, idx) => {
    e.preventDefault();
    setDragOver(idx);
  };

  const onDrop = (e, idxDestino) => {
    e.preventDefault();
    setDragOver(null);
    if (dragIdx === null || dragIdx === idxDestino) return;
    if (pecas[idxDestino].travada) return;

    setPecas(prev => {
      const novas = [...prev];
      // Troca as peças de posição
      [novas[dragIdx], novas[idxDestino]] = [novas[idxDestino], novas[dragIdx]];

      // Verifica se as peças trocadas estão na posição correta
      const checa = (idx) => novas[idx].id === idx;
      if (checa(idxDestino)) novas[idxDestino] = { ...novas[idxDestino], travada: true };
      if (checa(dragIdx))    novas[dragIdx]    = { ...novas[dragIdx],    travada: true };

      // Salva progresso após cada movimento
      salvarProgresso(novas, false);

      // Verifica se completou
      const tudoTravado = novas.every(p => p.travada);
      if (tudoTravado) setTimeout(aoCompletar, 300);

      return novas;
    });

    setDragIdx(null);
  };

  // ── Estilo de cada peça ──
  const estilosPeca = (peca, gridN) => {
    const col = peca.id % gridN;
    const row = Math.floor(peca.id / gridN);
    const posX = gridN === 1 ? 0 : (col / (gridN - 1)) * 100;
    const posY = gridN === 1 ? 0 : (row / (gridN - 1)) * 100;
    return {
      backgroundImage: `url(${fotoHoje.src})`,
      backgroundSize: `${gridN * 100}% ${gridN * 100}%`,
      backgroundPosition: `${posX}% ${posY}%`,
    };
  };

  // ── Fotos do modo livre ──
  const [fotoLivre, setFotoLivre] = useState('');

  const iniciarLivre = () => {
    const foto = fPuzzles[Math.floor(Math.random() * fPuzzles.length)];
    setFotoLivre(foto);
    const novasPecas = gerarPecas(grid || 5);
    setPecas(novasPecas);
    setFase('livre');
  };

  const estilosPecaLivre = (peca, gridN) => {
    const col = peca.id % gridN;
    const row = Math.floor(peca.id / gridN);
    const posX = gridN === 1 ? 0 : (col / (gridN - 1)) * 100;
    const posY = gridN === 1 ? 0 : (row / (gridN - 1)) * 100;
    return {
      backgroundImage: `url("${fotoLivre}")`,
      backgroundSize: `${gridN * 100}% ${gridN * 100}%`,
      backgroundPosition: `${posX}% ${posY}%`,
    };
  };

  const onDropLivre = (e, idxDestino) => {
    e.preventDefault();
    setDragOver(null);
    if (dragIdx === null || dragIdx === idxDestino) return;
    if (pecas[idxDestino].travada) return;
    setPecas(prev => {
      const novas = [...prev];
      [novas[dragIdx], novas[idxDestino]] = [novas[idxDestino], novas[dragIdx]];
      const checa = (idx) => novas[idx].id === idx;
      if (checa(idxDestino)) novas[idxDestino] = { ...novas[idxDestino], travada: true };
      if (checa(dragIdx))    novas[dragIdx]    = { ...novas[dragIdx],    travada: true };
      if (novas.every(p => p.travada)) setTimeout(() => alert('Mandou bem! 🎉'), 300);
      return novas;
    });
    setDragIdx(null);
  };

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <button
          className={styles.voltarBtn}
          onClick={() => fase === 'livre' ? setFase('completo') : navigate('/')}
        >
          <IconArrowLeft size={18} /> voltar  <IconPuzzle size={14} />
        </button>
        <div className={styles.streak}>
          <IconFlame size={16} color="rgba(255,150,50,0.7)" />
          {streak} {streak === 1 ? 'dia' : 'dias'}
        </div>
      </div>

      {/* ── SELETOR DE DIFICULDADE ── */}
      {fase === 'dificuldade' && (
        <div className={styles.dificuldadeWrap}>
          <div className={styles.dificuldadeTitulo}>escolha a dificuldade</div>
          <div className={styles.dificuldadeBtns}>
            {DIFICULDADES.map(d => (
              <button
                key={d.label}
                className={styles.difBtn}
                onClick={() => iniciar(d.grid)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── GRADE DO PUZZLE ── */}
      {fase === 'jogando' && pecas.length > 0 && (
        <div className={styles.gradeWrap}>
          <div
            className={styles.grade}
            style={{ gridTemplateColumns: `repeat(${grid}, 1fr)` }}
          >
            {pecas.map((peca, idx) => (
              <div
                key={idx}
                className={[
                  styles.peca,
                  peca.travada  ? styles.pecaTravada  : '',
                  dragOver === idx && !peca.travada ? styles.pecaDragOver : '',
                ].join(' ')}
                style={estilosPeca(peca, grid)}
                draggable={!peca.travada}
                onDragStart={() => onDragStart(idx)}
                onDragOver={(e) => onDragOver(e, idx)}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => onDrop(e, idx)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── JA COMPLETO HOJE ── */}
      {fase === 'completo' && (
        <div className={styles.jaCompletoWrap}>
          <img src={fotoHoje.src} alt="" className={styles.jaCompletoFoto} />
          <div className={styles.jaCompletoMsg}>
            Você já montou o puzzle de hoje! Volta amanhã mo. 🧩
          </div>
          <div className={styles.streak}>
            <IconFlame size={16} color="rgba(255,150,50,0.7)" />
            {streak} {streak === 1 ? 'dia seguido' : 'dias seguidos'}!
          </div>
          <div className={styles.livreWrap}>
            <button
              className={styles.livreBtn}
              onClick={() => iniciarLivre()}
            >
              <IconPuzzle2 stroke={1} /> modo livre
            </button>
            <a
              href="https://www.jigsawplanet.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.livreBtn}
            >
              🧩 jigsawplanet
            </a>
          </div>
        </div>
      )}

      {/* ── MODO LIVRE ── */}
      {fase === 'livre' && pecas.length > 0 && (
        <div className={styles.gradeWrap}>
          <div
            className={styles.grade}
            style={{ gridTemplateColumns: `repeat(${grid}, 1fr)` }}
          >
            {pecas.map((peca, idx) => (
              <div
                key={idx}
                className={[
                  styles.peca,
                  peca.travada  ? styles.pecaTravada  : '',
                  dragOver === idx && !peca.travada ? styles.pecaDragOver : '',
                ].join(' ')}
                style={estilosPecaLivre(peca, grid)}
                draggable={!peca.travada}
                onDragStart={() => onDragStart(idx)}
                onDragOver={(e) => onDragOver(e, idx)}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => onDropLivre(e, idx)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── CELEBRAÇÃO ── */}
      <AnimatePresence>
        {celebrando && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={fotoHoje.src}
              alt=""
              className={styles.overlayFoto}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            />
            <motion.p
              className={styles.overlayMsg}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Ebaaaaaaa! Amassou mo!
            </motion.p>
            <motion.p
              className={styles.overlayStreak}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              🔥 {streak} {streak === 1 ? 'dia seguido' : 'dias seguidos'}!
            </motion.p>
            <motion.button
              className={styles.overlayBtn}
              onClick={() => { setCelebrando(false); setFase('completo'); }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              fechar
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}