'use client';

import React, { useState } from 'react';
import styles from './LoginAdmin.module.css';

interface LoginAdminProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

export default function LoginAdmin({ isOpen, onClose, onBack }: LoginAdminProps) {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    correo: "",
    contrasena: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Usar variable de entorno para la URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

      // 2. Petición al Backend usando la variable
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // 3. Manejo robusto de la respuesta
      const textResponse = await response.text();

      if (!response.ok) {
          let errorMsg = `Error del servidor: ${response.status}`;
          try {
              const errData = JSON.parse(textResponse);
              errorMsg = errData.message || errData.error || errorMsg;
          } catch {
              if (response.status === 404) {
                 errorMsg = "Error 404: Ruta de login no encontrada en el backend. Revisa la URL.";
              } else {
                 errorMsg = "El servidor devolvió un error inesperado (formato incorrecto).";
              }
          }
          throw new Error(errorMsg);
      }

      const data = JSON.parse(textResponse);

      // Extraer rol del usuario
      const rolUsuario = data.user?.role || data.user?.id_rol || data.user?.rol || data.role || data.rol;

      // 4. Validación estricta: Solo puede entrar si es Admin (Rol 1)
      if (rolUsuario !== 1) {
        throw new Error("Acceso denegado: No tienes permisos de administrador.");
      }

      if (data.token) {
        // 5. Guardar la sesión y el token
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // 🔥 CLAVE: Para que el frontend detecte la sesión
        localStorage.setItem("sesionActiva", "usuario");
        localStorage.setItem("userRole", "admin");

        alert(`Bienvenido Administrador: ${data.user.nombre}`);
        
        onClose();
        
        // Redirección forzada
        window.location.href = "/vistaPrincipalAdmin";
      } else {
        throw new Error("Respuesta inválida del servidor: No se recibió token.");
      }

    } catch (err: any) {
      console.error("Error login admin:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.overlayShow : ''}`}>
      <section className={styles.modalBox}>

        <button className={styles.backButton} onClick={onBack} aria-label="Regresar" type="button">
          &#8592;
        </button>

        <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar modal" type="button">
          &times;
        </button>

        <div className={styles.viewContainer}>
          <img src="/images/logo_sp_rojo.png" className={styles.logo} width="100" alt="Logo Sazón Patrimonial" />

          <h4 className={styles.titulo}>Iniciar sesión</h4>
          
          <form className={styles.formContainer} onSubmit={handleSubmit} style={{width: '100%'}}>
            <div className={styles.inputGroup}>
              <label htmlFor="correo" className={styles.label}>Correo electrónico:</label>
              <input 
                className={styles.controls} 
                type="email" 
                name="correo" 
                id="correo" 
                placeholder="Ingrese su correo"
                value={formData.correo}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="contrasena" className={styles.label}>Contraseña:</label>
              <input 
                className={styles.controls} 
                type="password" 
                name="contrasena" 
                id="contrasena" 
                placeholder="Ingrese su contraseña"
                value={formData.contrasena}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p style={{color: '#d32f2f', textAlign: 'center', marginTop: '10px', fontSize: '0.9rem', fontWeight: 'bold'}}>{error}</p>}

            <button className={styles.submitButton} type="submit" disabled={loading}>
              {loading ? "Validando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}