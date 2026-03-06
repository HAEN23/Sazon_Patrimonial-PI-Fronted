'use client';

import React from 'react';
import styles from './LoginUser.module.css';

interface LoginUserProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onLoginSuccess: () => void;
}

export default function LoginUser({ isOpen, onClose, onBack, onLoginSuccess }: LoginUserProps) {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // guardar sesión
    localStorage.setItem("sesionActiva", "usuario");

    // avisar al index
    onLoginSuccess();

    // cerrar modal
    onClose();
  };

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.overlayShow : ''}`}>
      <section className={styles.modalBox}>

        <button className={styles.backButton} onClick={onBack}>
          &#8592;
        </button>

        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <form className={styles.viewContainer} onSubmit={handleSubmit}>

          <img
            src="/images/logo_sp_rojo.png"
            className={styles.logo}
            width="100"
          />

          <h4 className={styles.titulo}>Iniciar sesión</h4>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Correo electrónico:</label>
            <input
              className={styles.controls}
              type="email"
              placeholder="Ingrese su correo"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Contraseña:</label>
            <input
              className={styles.controls}
              type="password"
              placeholder="Ingrese su contraseña"
              required
            />
          </div>

          <button className={styles.submitButton} type="submit">
            Iniciar sesión
          </button>

        </form>
      </section>
    </div>
  );
}