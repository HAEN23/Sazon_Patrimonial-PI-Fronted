'use client';

import React, { useState } from 'react';
import styles from './LoginAdmin.module.css';
import { useRouter } from "next/navigation";

interface LoginAdminProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

export default function LoginAdmin({ isOpen, onClose, onBack }: LoginAdminProps) {

  const router = useRouter();
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
      // INTENTAR CONEXIÓN AL BACKEND (puerto 8080 por defecto para Spring Boot)
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("El backend no está respondiendo. Verifica que esté corriendo en http://localhost:8080");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Credenciales incorrectas");
      }

      // Extraer rol del usuario (puede venir como 'rol', 'role' o 'id_rol')
      const rolUsuario = data.rol || data.role || data.user?.rol || data.user?.id_rol || data.user?.role;

      if (rolUsuario !== 1) {
        throw new Error("Acceso denegado: No tienes permisos de administrador.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userRole", "admin");

      alert(`Bienvenido Administrador: ${data.user.nombre}`);
      
      onClose();
      window.location.href = "/vistaPrincipalAdmin";

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

        <form className={styles.viewContainer} onSubmit={handleSubmit}>

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
            {loading ? "Validando..." : "Iniciar sesión"}
          </button>

        </form>
      </section>
    </div>
  );
}