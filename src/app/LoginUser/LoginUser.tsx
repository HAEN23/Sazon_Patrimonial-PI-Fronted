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
  
  // NUEVO: Estado para visualizar la contraseña
  const [showPassword, setShowPassword] = useState(false);

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

          {/* CONTRASEÑA CON BOTÓN DE OJO */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Contraseña:</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                className={styles.controls}
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese su contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                style={{ paddingRight: '40px' }} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex' }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          </div>

          <button className={styles.submitButton} type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Iniciar sesión"}
          </button>

        </form>
      </section>
    </div>
  );
}