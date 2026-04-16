'use client';

import React, { useState } from 'react';
import styles from './LoginRest.module.css';
import Image from "next/image";

interface LoginRestProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onLoginSuccess?: () => void;
}

export default function LoginRest({ isOpen, onClose, onBack, onLoginSuccess }: LoginRestProps) {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // NUEVO: Estado para visualizar la contraseña
  const [showPassword, setShowPassword] = useState(false);

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

      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const textResponse = await response.text();

      // Manejar errores
      if (!response.ok) {
          let errorMsg = `Error del servidor: ${response.status}`;
          try {
              const errData = JSON.parse(textResponse);
              errorMsg = errData.message || errData.error || errorMsg;
          } catch {
              if (response.status === 404) {
                 errorMsg = "Error 404: Ruta no encontrada. Revisa la URL.";
              } else {
                 errorMsg = "El servidor devolvió un error inesperado.";
              }
          }
          throw new Error(errorMsg);
      }

      // Si todo salió bien, convertimos a JSON
      const data = JSON.parse(textResponse);

      // 🔥 CORRECCIÓN: Extracción robusta del rol (igual que en Admin)
      const rol = data.user?.role || data.user?.id_rol || data.user?.rol || data.role || data.rol;
      
      // Validación: Solo Restauranteros (Rol 2)
      if (rol !== 2) {
        throw new Error("Acceso denegado: Este portal es solo para dueños de restaurantes.");
      }

      if (data.token) {
        // 2. GUARDAMOS EL TOKEN Y LA SESIÓN
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("sesionActiva", "usuario");
        localStorage.setItem("userRole", "restaurantero");

        console.log("LOGIN EXITOSO - ROL DETECTADO:", rol);

        onClose();

        // 3. REDIRECCIÓN FORZADA
        window.location.href = "/vistaPrincipalRestaurantero";
        
      } else {
          throw new Error("Respuesta inválida: No se recibió token.");
      }

    } catch (err: any) {
      console.error("Error de login:", err);
      // Mostramos el error real si es de permisos, si no, mostramos el tuyo
      if (err.message.includes("Acceso denegado")) {
        setError(err.message);
      } else {
        setError("Correo no existente o contraseña incorrecta. Revise sus datos."); 
      }
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
          <Image 
            src="/images/logo_sp_rojo.png" 
            className={styles.logo} 
            width={100} 
            height={100} 
            alt="Logo Sazón Patrimonial" 
          />

          <h4 className={styles.titulo}>Acceso Restaurantero</h4>
          
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

            {/* CONTRASEÑA CON BOTÓN DE OJO */}
            <div className={styles.inputGroup}>
              <label htmlFor="contrasena" className={styles.label}>Contraseña:</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input 
                  className={styles.controls} 
                  type={showPassword ? "text" : "password"} 
                  name="contrasena" 
                  id="contrasena" 
                  placeholder="Ingrese su contraseña" 
                  value={formData.contrasena}
                  onChange={handleChange}
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

            {error && (
              <p style={{ color: '#d32f2f', textAlign: 'center', marginTop: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                {error}
              </p>
            )}

            <button className={styles.submitButton} type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}