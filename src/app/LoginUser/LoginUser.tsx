// src/app/LoginUser/LoginUser.tsx
'use client';

import React from 'react';
import styles from './LoginUser.module.css';
import { useRouter } from "next/navigation";

interface LoginUserProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void; // Para regresar al modal de selección de rol
}

export default function LoginUser({ isOpen, onClose, onBack }: LoginUserProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Iniciando sesión como Usuario...");
    // Aquí irá tu lógica de validación para usuarios normales
  };
  const router = useRouter();

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.overlayShow : ''}`}>
      <section className={styles.modalBox}>
        {/* Botón para regresar al modal anterior */}
        <button className={styles.backButton} onClick={onBack} aria-label="Regresar">
          &#8592;
        </button>

        <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar modal">
          &times;
        </button>

        <form className={styles.viewContainer} id="loginForm" onSubmit={handleSubmit}>
          <img src="/images/logo_sp_rojo.png" className={styles.logo} width="100" alt="Logo Sazón Patrimonial" />
          <h4 className={styles.titulo}>Iniciar sesión</h4>
          
          <div className={styles.inputGroup}>
            <label htmlFor="correo" className={styles.label}>Correo electrónico:</label>
            <input 
              className={styles.controls} 
              type="email" 
              name="correo" 
              id="correo" 
              placeholder="Ingrese su correo" 
            />
            <span className={styles.errorMsg} id="error-correo"></span>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="contrasena" className={styles.label}>Contraseña:</label>
            <input 
              className={styles.controls} 
              type="password" 
              name="contrasena" 
              id="contrasena" 
              placeholder="Ingrese su contraseña" 
            />
            <span className={styles.errorMsg} id="error-contrasena"></span>
          </div>

          <button className={styles.submitButton} type="submit">
            Iniciar sesión
          </button>
        </form>
      </section>
    </div>
  );
}