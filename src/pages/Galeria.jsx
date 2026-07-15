// src/pages/Galeria.jsx

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Masonry from 'react-masonry-css';
import {
  IconArrowLeft,
  IconPhotoCircle,
  IconLayoutGrid,
  IconStar,
  IconMoodSmile,
  IconFlame,
  IconPlane,
  IconX,
} from '@tabler/icons-react';
import { fotos } from '../data/galeria';
import styles from '../styles/Galeria.module.css';

const TAGS = [
  { label: 'todas',    icon: IconLayoutGrid, valor: 'todas'    },
  { label: 'favorita', icon: IconStar,       valor: 'favorita' },
  { label: 'idiota',   icon: IconMoodSmile,  valor: 'idiota'   },
  { label: 'gostosos',  icon: IconFlame,      valor: 'gostosos'  },
  { label: 'viagem',   icon: IconPlane,      valor: 'viagem'   },
];

const ICON_POR_TAG = {
  favorita: IconStar,
  idiota:   IconMoodSmile,
  gostosos:  IconFlame,
  viagem:   IconPlane,
};

// 5 colunas em telas grandes, diminui conforme a viewport
const BREAKPOINTS = { default: 5, 1400: 4, 1100: 3, 700: 2, 500: 1 };

// ─── FOTO CARD ────────────────────────────────────────────────────────────────
function FotoCard({ foto, index, onClick }) {
  const PrimeiraTagIcon = foto.tags.length > 0 ? ICON_POR_TAG[foto.tags[0]] : null;

  return (
    <motion.div
      className={styles.fotoCard}
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: (index % 5) * 0.06 }}
    >
      <img src={foto.src} alt="" loading="lazy" />
      {foto.favorita && <div className={styles.ponteFavorita} />}
      {PrimeiraTagIcon && (
        <div className={styles.tagHoverBadge}>
          <PrimeiraTagIcon size={13} />
        </div>
      )}
    </motion.div>
  );
}

// ─── GALERIA ──────────────────────────────────────────────────────────────────
export default function Galeria() {
  const navigate = useNavigate();
  const [tagAtiva, setTagAtiva] = useState('todas');
  const [fotoModal, setFotoModal] = useState(null);

  const fotosOrdenadas = useMemo(() => {
    const favoritas = fotos.filter(f => f.favorita);
    const resto = fotos.filter(f => !f.favorita);
    return [...favoritas, ...[...resto].sort(() => Math.random() - 0.5)];
  }, []);

  const fotosFiltradas = tagAtiva === 'todas'
    ? fotosOrdenadas
    : fotosOrdenadas.filter(f => f.tags.includes(tagAtiva));

  return (
    <div className={styles.pagina}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <button className={styles.voltarBtn} onClick={() => navigate('/')}>
          <IconArrowLeft size={18} />
           voltar  
          <IconPhotoCircle size={14}/>
        </button>

        <img src="/images/baleias/b1.png" alt="" className={`${styles.baleia} ${styles.baleiaB1}`} />
        <img src="/images/baleias/b2.png" alt="" className={`${styles.baleia} ${styles.baleiaB2}`} />
        <img src="/images/baleias/b3.png" alt="" className={`${styles.baleia} ${styles.baleiaB3}`} />
        <img src="/images/baleias/b4.png" alt="" className={`${styles.baleia} ${styles.baleiaB4}`} />

        <div className={styles.heroTituloWrap}>
          <h1 className={styles.heroTitulo}>Nossas Foto no Bagui</h1>
          <p className={styles.heroSubtitulo}>os momentos que nois quer lembrar...</p>
        </div>
      </section>

      {/* ── FILTROS ── */}
      <div className={styles.filtrosArea}>
        <div className={styles.filtrosGrupo}>
          {TAGS.map(({ label, icon: Icon, valor }) => (
            <button
              key={valor}
              className={`${styles.tag} ${tagAtiva === valor ? styles.tagAtiva : ''}`}
              onClick={() => setTagAtiva(valor)}
            >
              <Icon size={15} stroke={1.5} />
              {label}
            </button>
          ))}
        </div>
        <span className={styles.contagem}>{fotosFiltradas.length} momentos</span>
      </div>

      {/* ── GRADE MASONRY ── */}
      <Masonry
        breakpointCols={BREAKPOINTS}
        className="masonry-grid"
        columnClassName="masonry-col"
      >
        {fotosFiltradas.map((foto, i) => (
          <FotoCard
            key={foto.id}
            foto={foto}
            index={i}
            onClick={() => setFotoModal(foto)}
          />
        ))}
      </Masonry>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {fotoModal && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', zIndex: 100 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFotoModal(null)}
            />

            {/* Wrapper centraliza via flexbox — sem transform conflitando */}
            <div className={styles.modalWrap}>
              <motion.div
                key="modal"
                className={styles.modalConteudo}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              >
                <img
                  className={styles.modalImg}
                  src={fotoModal.src}
                  alt=""
                />
                <button
                  className={styles.modalFecharBtn}
                  onClick={() => setFotoModal(null)}
                  aria-label="Fechar"
                >
                  <IconX size={22} />
                </button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}