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
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    setLoading(true);

    try {
      // 1. Apuntar al backend real
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
      
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, contrasena })
      });

      // 2. Manejo robusto de la respuesta (evita el "Failed to fetch" si devuelve HTML)
      const textResponse = await response.text();

      if (!response.ok) {
          let errorMsg = `Error del servidor: ${response.status}`;
          try {
              const errData = JSON.parse(textResponse);
              errorMsg = errData.message || errData.error || errorMsg;
          } catch {
              if (response.status === 404) {
                 errorMsg = "Error 404: Ruta de login no encontrada.";
              } else {
                 errorMsg = "El servidor devolvió un error inesperado.";
              }
          }
          throw new Error(errorMsg);
      }

      const data = JSON.parse(textResponse);

      // 3. Extraer rol y validar que NO sea un Admin o Restaurantero colado
      const rol = data.user?.role || data.user?.id_rol || data.user?.rol || data.role || data.rol;
      
      if (rol === 1 || rol === 2) {
         throw new Error("Acceso denegado: Por favor usa el portal correspondiente a tu rol (Admin o Restaurantero).");
      }

      if (data.token) {
        // 🔥 Limpiamos cualquier rastro de sesiones anteriores
        localStorage.removeItem("userRole");
        localStorage.removeItem("user");

        // Guardamos explícitamente que es un usuario normal
        localStorage.setItem("sesionActiva", "usuario");
        localStorage.setItem("userRole", "usuario");
        localStorage.setItem("token", data.token);

        const usuarioData = data.user || data.client || { rol: "usuario" };
        localStorage.setItem("user", JSON.stringify(usuarioData));

        setCorreo('');
        setContrasena('');

        onLoginSuccess();
        onClose();
      } else {
         throw new Error("Respuesta inválida: No se recibió token.");
      }

    } catch (err: any) {
      console.error("Error de login:", err);
      // Mostramos el mensaje de rol denegado, o tu mensaje personalizado si es contraseña/correo incorrecto
      if (err.message.includes("Acceso denegado")) {
        setError(err.message);
      } else {
        setError("Correo no existente o contraseña incorrecta. Revise sus datos."); 
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.overlayShow : ''}`}>
      <section className={styles.modalBox}>

        <button className={styles.backButton} onClick={onBack} type="button">
          &#8592;
        </button>

        <button className={styles.closeButton} onClick={onClose} type="button">
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

          <button className={styles.submitButton} type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Iniciar sesión"}
          </button>

        </form>
      </section>
    </div>
  );
}