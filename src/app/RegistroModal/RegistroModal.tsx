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

  // Estado para el checkbox
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

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

    // NUEVO: Alerta si no marcan la casilla de términos
    if (!aceptaTerminos) {
      alert("Debes aceptar los Términos y Condiciones para poder registrarte.");
      return;
    }

    setLoading(true);

    try {
      // 2. Determinar el ID del Rol
      const rolId = formData.tipo === "restaurantero" ? 2 : 3;

      // 3. Petición REAL al Backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

      const response = await fetch(`${apiUrl}/client/register`, { 
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
      if (data.success) {
        // Limpiamos cualquier sesión fantasma anterior
        localStorage.removeItem("userRole");
        localStorage.removeItem("user");

        // Guardamos la nueva sesión explícitamente como 'usuario'
        localStorage.setItem("sesionActiva", "usuario");
        localStorage.setItem("userRole", "usuario");
        localStorage.setItem("token", data.token || data.data?.token);

        // Guardamos el objeto user por si otras vistas lo necesitan
        const usuarioData = data.user || data.data?.user || { rol: "usuario" };
        localStorage.setItem("user", JSON.stringify(usuarioData));

        // Limpiar formulario y checkbox
        setFormData({
          nombre: "",
          correo: "",
          contrasena: "",
          confirmar: "",
          tipo: "usuario"
        });
        setAceptaTerminos(false);

        // Mensaje de éxito
        alert("Registro exitoso");

        // Redirección
        if (formData.tipo === "restaurantero") {
          onClose();
          router.push("/vistaPrincipalRestaurantero");
        } else {
          onLoginSuccess();
          onClose();
        }
      } else {
        setError(data.message || data.error || 'Error al registrar usuario.');
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

            {/* Cuadro de Términos y Condiciones */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '10px' }}>
              <input
                type="checkbox"
                id="terminos"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                /* Se quita el 'required' de HTML para que el form intente enviarse y podamos lanzar el alert() personalizado */
                style={{ marginTop: '3px', cursor: 'pointer' }}
              />
              <label htmlFor="terminos" style={{ fontSize: '12px', textAlign: 'justify', lineHeight: '1.4', cursor: 'pointer' }}>
                He leído y acepto los <strong>Términos y Condiciones</strong>. Consiento que mis datos personales sean tratados conforme a la <em>Ley de Protección de Datos Personales</em>.
              </label>
            </div>

            {error && <p style={{color: '#912F2F', textAlign: 'center', marginTop: '10px'}}>{error}</p>}

            {/* Botón original sin alteraciones */}
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