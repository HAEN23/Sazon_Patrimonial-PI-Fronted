'use client';

import React, { useState } from 'react';
import styles from './LoginUser.module.css';

interface LoginUserProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onLoginSuccess: () => void;
}

export default function LoginUser({ isOpen, onClose, onBack, onLoginSuccess }: LoginUserProps) {
  // 1. Estados para capturar el correo, la contraseña y posibles errores
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpiamos errores anteriores
    setLoading(true);

    try {
      // 2. Apuntar al backend real
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
      
      const res = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, contrasena })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // 3. ¡ÉXITO! Guardamos la sesión y el Token real en el navegador
        localStorage.setItem("sesionActiva", "usuario");
        localStorage.setItem("token", data.token);

        setCorreo('');
        setContrasena('');

        onLoginSuccess();
        onClose();
      } else {
        // ✅ AQUÍ PONEMOS TU MENSAJE PERSONALIZADO
        setError("Correo no existente, revisa bien sus datos ingresados");
      }
    } catch (err: any) {
      console.error("Error de login:", err);
      // ✅ REEMPLAZAMOS EL ERROR TÉCNICO POR TU MENSAJE PERSONALIZADO
      setError("Correo no existente, revisa bien sus datos ingresados"); 
    } finally {
      setLoading(false);
    }
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
            alt="Logo Sazón Patrimonial"
          />

          <h4 className={styles.titulo}>Iniciar sesión</h4>

          {/* Mostrar mensaje de error si falla el login */}
          {error && (
            <div style={{ color: '#d32f2f', textAlign: 'center', fontSize: '0.9rem', marginBottom: '10px', fontWeight: 'bold' }}>
              {error}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.label}>Correo electrónico:</label>
            <input
              className={styles.controls}
              type="email"
              placeholder="Ingrese su correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Contraseña:</label>
            <input
              className={styles.controls}
              type="password"
              placeholder="Ingrese su contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
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