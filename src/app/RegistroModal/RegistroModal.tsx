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

  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 AQUÍ AGREGAMOS LA VALIDACIÓN DE CONTRASEÑA SEGURA
  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Expresión regular: Mínimo 8 caracteres, al menos 1 letra, 1 número y 1 carácter especial
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(formData.contrasena)) {
      setError("La contraseña debe tener mínimo 8 caracteres, incluir letras, números y al menos un carácter especial (ej. @$!%*?&).");
      return;
    }

    // Validar que las contraseñas coincidan
    if (formData.contrasena !== formData.confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Si todo está bien, mostramos el mini modal de términos y condiciones
    setShowTermsModal(true);
  };

  // Esta es la función que realmente envía los datos al backend si aceptan los términos
  const confirmRegistration = async () => {
    setLoading(true);

    try {
      const rolId = formData.tipo === "restaurantero" ? 2 : 3;
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

      const data = JSON.parse(textResponse);

      if (data.success) {
        localStorage.removeItem("userRole");
        localStorage.removeItem("user");

        localStorage.setItem("sesionActiva", "usuario");
        localStorage.setItem("userRole", "usuario");
        localStorage.setItem("token", data.token || data.data?.token);

        const usuarioData = data.user || data.data?.user || { rol: "usuario" };
        localStorage.setItem("user", JSON.stringify(usuarioData));

        setFormData({
          nombre: "",
          correo: "",
          contrasena: "",
          confirmar: "",
          tipo: "usuario"
        });
        
        setShowTermsModal(false); // Cerramos el mini modal
        alert("Registro exitoso");

        if (formData.tipo === "restaurantero") {
          onClose();
          router.push("/vistaPrincipalRestaurantero");
        } else {
          onLoginSuccess();
          onClose();
        }
      } else {
        setError(data.message || data.error || 'Error al registrar usuario.');
        setShowTermsModal(false);
      }

    } catch (err: any) {
      console.error("Error de registro:", err);
      setError(err.message);
      setShowTermsModal(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
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

            <form className={styles.formContainer} onSubmit={handleInitialSubmit} style={{width: '100%'}}>
              
              <div className={styles.inputGroup}>
                <label className={styles.label}>Nombre:</label>
                <input className={styles.controls} type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ingrese su nombre" required />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Correo:</label>
                <input className={styles.controls} type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="Ingrese su correo" required />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Tipo de cuenta:</label>
                <select className={styles.controls} name="tipo" value={formData.tipo} onChange={handleChange}>
                  <option value="usuario">Usuario</option>
                  <option value="restaurantero">Restaurantero</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Contraseña:</label>
                {/* Cambiamos el minLength a 8 */}
                <input className={styles.controls} type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} placeholder="Ingrese su contraseña" required minLength={8} />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Confirmar contraseña:</label>
                {/* Cambiamos el minLength a 8 */}
                <input className={styles.controls} type="password" name="confirmar" value={formData.confirmar} onChange={handleChange} placeholder="Confirmar contraseña" required minLength={8} />
              </div>

              {error && <p style={{color: '#912F2F', textAlign: 'center', marginTop: '10px', fontSize: '13px', fontWeight: 'bold'}}>{error}</p>}

              <button 
                className={styles.roleButton} 
                type="submit" 
                style={{
                  marginTop: '20px',
                  backgroundColor: '#742A2A',
                  color: 'white',
                  width: '100%',
                  borderRadius: '8px',
                  padding: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Registrarse
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* MINI MODAL DE TÉRMINOS Y CONDICIONES */}
      {showTermsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999 
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            textAlign: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            <h3 style={{ color: '#742A2A', marginBottom: '15px', marginTop: 0 }}>Aviso de Privacidad</h3>
            
            <p style={{ fontSize: '14px', color: '#444', textAlign: 'justify', lineHeight: '1.5', marginBottom: '25px' }}>
              Para completar tu registro, es necesario que aceptes nuestros <strong>Términos y Condiciones</strong>. <br/><br/>
              Al continuar, consientes que tus datos personales sean tratados conforme a la <em>Ley de Protección de Datos Personales</em>, con la finalidad exclusiva de gestionar tu acceso y perfil dentro de la plataforma.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowTermsModal(false)}
                disabled={loading}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#e0e0e0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                Cancelar
              </button>
              
              <button 
                onClick={confirmRegistration}
                disabled={loading}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#742A2A',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                {loading ? "Procesando..." : "Aceptar y Continuar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}