'use client';

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./RegistroModal.module.css";

interface RegistroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onLoginSuccess: () => void;
}

export default function RegistroModal({
  isOpen,
  onClose,
  onBack,
  onLoginSuccess
}: RegistroModalProps) {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    confirmar: "",
    tipo: "usuario" // Valores: 'usuario' | 'restaurantero'
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1. Validar contraseñas
    if (formData.contrasena !== formData.confirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      // 2. Determinar el ID del Rol
      const rolId = formData.tipo === "restaurantero" ? 2 : 3;

      // 3. Petición REAL al Backend
      const response = await fetch('http://localhost:3003/api/auth/client/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          correo: formData.correo,
          contrasena: formData.contrasena,
          id_rol: rolId, 
        }),
      });

      // Leer respuesta como texto primero para evitar errores de parseo
      const textResponse = await response.text();

      if (!response.ok) {
        let errorMsg = `Error del servidor: ${response.status}`;
        try {
          const errData = JSON.parse(textResponse);
          errorMsg = errData.message || errData.error || errorMsg;
        } catch {
          if (response.status === 404) {
            errorMsg = "Error 404: Ruta de registro no encontrada en el backend.";
          } else {
            errorMsg = "El servidor devolvió un error inesperado.";
          }
        }
        throw new Error(errorMsg);
      }

      // Si todo salió bien, convertir a JSON
      const data = JSON.parse(textResponse);

      // 4. Si todo salió bien
      alert("Registro exitoso en la base de datos");
      
      if (data.data?.token) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }

      // Limpiar formulario
      setFormData({
        nombre: "",
        correo: "",
        contrasena: "",
        confirmar: "",
        tipo: "usuario"
      });

      // 5. Redirección
      if (formData.tipo === "restaurantero") {
        onClose();
        router.push("/vistaPrincipalRestaurantero");
      } else {
        onLoginSuccess();
        onClose();
      }

    } catch (err: any) {
      console.error("Error de registro:", err);
      alert(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.overlayShow : ''}`}>
      <section className={styles.modalBox}>

        <button className={styles.backButton} onClick={onBack} type="button">
          &#8592;
        </button>

        <button className={styles.closeButton} onClick={onClose} type="button">
          &times;
        </button>

        <div className={styles.viewContainer}>
          <Image
            src="/images/logo_sp_rojo.png"
            alt="Logo"
            width={100}
            height={100}
            className={styles.logo}
          />

          <h4 className={styles.titulo}>Registro de usuario</h4>

          <form className={styles.formContainer} onSubmit={handleSubmit} style={{width: '100%'}}>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nombre:</label>
              <input
                className={styles.controls}
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingrese su nombre"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Correo:</label>
              <input
                className={styles.controls}
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="Ingrese su correo"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Tipo de cuenta:</label>
              <select
                className={styles.controls}
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
              >
                <option value="usuario">Usuario</option>
                <option value="restaurantero">Restaurantero</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Contraseña:</label>
              <input
                className={styles.controls}
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                placeholder="Ingrese su contraseña"
                required
                minLength={6}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Confirmar contraseña:</label>
              <input
                className={styles.controls}
                type="password"
                name="confirmar"
                value={formData.confirmar}
                onChange={handleChange}
                placeholder="Confirmar contraseña"
                required
                minLength={6}
              />
            </div>

            {error && <p style={{color: '#912F2F', textAlign: 'center', marginTop: '10px'}}>{error}</p>}

            {/* Este botón usa una clase diferente en tus capturas, parece ser 'botonRegistrar' o similar */}
            {/* Si no tienes esa clase específica en tu CSS actual, usa este estilo inline para igualar el color */}
            <button 
              className={styles.roleButton} 
              type="submit" 
              disabled={loading}
              style={{
                marginTop: '20px',
                backgroundColor: '#742A2A', /* Color marrón oscuro de la imagen */
                color: 'white',
                width: '100%',
                borderRadius: '8px',
                padding: '12px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}