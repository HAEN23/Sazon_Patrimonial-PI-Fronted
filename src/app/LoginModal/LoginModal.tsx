// src/components/LoginModal/LoginModal.tsx
'use client';

import React from 'react';
import styles from './LoginModal.module.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <div className={`${styles.overlay} ${isOpen ? styles.overlayShow : ''}`}>
      <section className={styles.choose}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar modal">
          &times;
        </button>
        
        <img 
          src="/images/logo_sp_rojo.png" 
          className={styles.logo} 
          width="100" 
          alt="Logo Sazón Patrimonial" 
        />
        <h4 className={styles.titulo}>Ingresar como</h4>
        
        <button className={styles.button} type="button">
          <img src="/images/admin_logo.png" alt="Administrador" />
          Administrador
        </button>
        
        <button className={styles.button} type="button">
          <img src="/images/rest_logo.png" alt="Restaurantero" />
          Restaurantero
        </button>

        <button className={styles.button} type="button">
          <img src="/images/usuario.png" alt="Usuario" />
          Usuario
        </button>
        
        <button className={styles.registerLink} type="button">
          Registrarse
        </button>
      </section>
    </div>
  );
}