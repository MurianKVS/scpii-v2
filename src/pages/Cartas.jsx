// src/pages/Cartas.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { IconArrowLeft, IconHeart, IconX } from '@tabler/icons-react';
import { cartas } from '../data/cartas';
import styles from '../styles/Cartas.module.css';

export default function Cartas() {
  const navigate = useNavigate();
  const [cartaAberta, setCartaAberta] = useState(null);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>
          <IconArrowLeft size={16} />
          voltar
        </button>

        <div className={styles.title}>Pra ler quando...</div>
      </div>

      <div className={styles.grid}>
        {cartas.map((carta) => (
          <div
            key={carta.id}
            className={styles.wrap}
            onClick={() => setCartaAberta(carta)}
          >
            <div className={styles.label}>{carta.complemento}</div>

            <div className={styles.envelope}>
              <div
                className={styles.body}
                style={{ background: carta.cor.body }}
              />

              <div
                className={styles.aba}
                style={{ borderTop: `58px solid ${carta.cor.aba}` }}
              />

              <div
                className={styles.dobraEsq}
                style={{ borderBottomColor: carta.cor.dobra }}
              />

              <div
                className={styles.dobraDir}
                style={{ borderBottomColor: carta.cor.dobra }}
              />

              <div
                className={styles.lacre}
                style={{ background: carta.cor.lacre }}
              >
                <IconHeart size={11} color="rgba(255,220,225,0.8)" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {cartaAberta && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartaAberta(null)}
          >
            <motion.div
              className={styles.card}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.lines} />

              <button
                className={styles.close}
                onClick={() => setCartaAberta(null)}
              >
                <IconX size={16} />
              </button>

              <p className={styles.cardLabel}>
                {cartaAberta.complemento}
              </p>

              <p className={styles.text}>
                {cartaAberta.texto}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}