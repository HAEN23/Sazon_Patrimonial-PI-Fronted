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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Expresión regular: Mínimo 8 caracteres, al menos 1 letra, 1 número y 1 carácter especial
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(formData.contrasena)) {
      setError("La contraseña debe tener mínimo 8 caracteres, incluir letras, números y al menos un carácter especial (ej. @$!%*?&).");
      return;
    }

    if (formData.contrasena !== formData.confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setShowTermsModal(true);
  };

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
        
        setShowTermsModal(false);
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

              {/* CONTRASEÑA CON BOTÓN DE OJO CORREGIDO */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Contraseña:</label>
                {/* Contenedor flex para alinear perfectamente el icono con el input */}
                <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                  <input 
                    className={styles.controls} 
                    type={showPassword ? "text" : "password"} 
                    name="contrasena" 
                    value={formData.contrasena} 
                    onChange={handleChange} 
                    placeholder="Ingrese su contraseña" 
                    required 
                    minLength={8} 
                    style={{ width: '100%', paddingRight: '45px', margin: 0 }} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* CONFIRMAR CONTRASEÑA CON BOTÓN DE OJO CORREGIDO */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Confirmar contraseña:</label>
                <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                  <input 
                    className={styles.controls} 
                    type={showConfirmPassword ? "text" : "password"} 
                    name="confirmar" 
                    value={formData.confirmar} 
                    onChange={handleChange} 
                    placeholder="Confirmar contraseña" 
                    required 
                    minLength={8} 
                    style={{ width: '100%', paddingRight: '45px', margin: 0 }} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
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