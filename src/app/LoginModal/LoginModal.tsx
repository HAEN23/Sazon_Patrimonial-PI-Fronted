// src/app/LoginModal/LoginModal.tsx
'use client';

import React from 'react';
import styles from './LoginModal.module.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin: () => void;
  onOpenRest: () => void;
  onOpenUser: () => void;
}

export default function LoginModal({ isOpen, onClose, onOpenAdmin, onOpenRest, onOpenUser }: LoginModalProps) {
  return (
    <div className={`${styles.overlay} ${isOpen ? styles.overlayShow : ''}`}>
      <section className={styles.modalBox}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar modal">
          &times;
        </button>
        
        <div className={styles.viewContainer}>
          <img src="/images/logo_sp_rojo.png" className={styles.logo} width="100" alt="Logo Sazón Patrimonial" />
          <h4 className={styles.titulo}>Ingresar como</h4>
          
          <button className={styles.roleButton} type="button" onClick={onOpenAdmin}>
            <img src="/images/admin_logo.png" alt="Administrador" />
            Administrador
          </button>
          
          <button className={styles.roleButton} type="button" onClick={onOpenRest}>
            <img src="/images/rest_logo.png" alt="Restaurantero" />
            Restaurantero
          </button>

          <button className={styles.roleButton} type="button" onClick={onOpenUser}>
            <img src="/images/usuario.png" alt="Usuario" />
            Usuario
          </button>
          
          <button className={styles.registerLink} type="button">
            Registrarse
          </button>
        </div>
      </section>
    </div>
  );
}