'use client';

import React, { useState } from 'react';
import styles from './LoginRest.module.css';
import { useRouter } from "next/navigation";
import Image from "next/image";

interface LoginRestProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onLoginSuccess?: () => void;
}

export default function LoginRest({ isOpen, onClose, onBack, onLoginSuccess }: LoginRestProps) {

  // const router = useRouter(); // NO lo usaremos para evitar bugs de SPA
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api'}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Credenciales inválidas");
      }

      // Guardar sesión
      if (data.data?.token) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        
        const rol = data.data.user.rol; // 1=Admin, 2=Rest, 3=User

        console.log("LOGIN EXITOSO - ROL DETECTADO:", rol); // Debug

        onClose();

        // 3. REDIRECCIÓN FORZADA (Infalible)
        if (rol === 1) {
            localStorage.setItem("userRole", "admin");
            // Usamos window.location.href en lugar de router.push
            window.location.href = "/vistaPrincipalAdmin"; 
        } else if (rol === 2) {
            localStorage.setItem("userRole", "restaurantero");
            window.location.href = "/vistaPrincipalRestaurantero";
        } else {
            localStorage.setItem("userRole", "usuario");
            if (onLoginSuccess) onLoginSuccess();
            // Para usuarios normales a veces solo queremos cerrar el modal,
            // o recargar el home:
            // window.location.href = "/";
        }
      }

    } catch (err: any) {
      console.error("Error de login:", err);
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
          <Image 
            src="/images/logo_sp_rojo.png" 
            className={styles.logo} 
            width={100} 
            height={100} 
            alt="Logo Sazón Patrimonial" 
          />

          <h4 className={styles.titulo}>Acceso</h4>
          
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

            {error && <p style={{color: '#912F2F', textAlign: 'center', marginTop: '10px'}}>{error}</p>}

            <button className={styles.submitButton} type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}