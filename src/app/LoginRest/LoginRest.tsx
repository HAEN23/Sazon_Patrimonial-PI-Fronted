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