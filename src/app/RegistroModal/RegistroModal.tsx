'use client';

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // 1. Importar useRouter
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

  const router = useRouter(); // 2. Inicializar router

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    confirmar: "",
    tipo: "usuario"
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.contrasena !== formData.confirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const correoExiste = usuariosGuardados.find(
      (user: any) => user.correo === formData.correo
    );

    if (correoExiste) {
      alert("Este correo ya está registrado");
      return;
    }

    const nuevoUsuario = {
      nombre: formData.nombre,
      correo: formData.correo,
      contrasena: formData.contrasena,
      tipo: formData.tipo
    };

    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));

    // guardar sesión activa
    localStorage.setItem("sesionActiva", formData.tipo);

    alert("Registro exitoso");

    // Limpiar formulario
    setFormData({
      nombre: "",
      correo: "",
      contrasena: "",
      confirmar: "",
      tipo: "usuario"
    });

    // 3. LÓGICA DE REDIRECCIÓN SEGÚN EL ROL
    if (formData.tipo === "restaurantero") {
      onClose(); // Cerramos el modal
      router.push("/vistaPrincipalRestaurantero"); // Redirigimos al panel del restaurante
    } else {
      // Si es un usuario normal, solo avisamos al index y cerramos el modal
      onLoginSuccess();
      onClose();
    }
  };

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.overlayShow : ''}`}>
      {/* ... (Todo el resto de tu código del return se queda exactamente igual) ... */}
      <section className={styles.modalBox}>

        <button
          className={styles.backButton}
          onClick={onBack}
        >
          &#8592;
        </button>

        <button
          className={styles.closeButton}
          onClick={onClose}
        >
          &times;
        </button>

        <form className={styles.viewContainer} onSubmit={handleSubmit}>

          <Image
            src="/images/logo_sp_rojo.png"
            alt="Logo"
            width={100}
            height={100}
            className={styles.logo}
          />

          <h4 className={styles.titulo}>Registro de usuario</h4>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Nombre:</label>
            <input
              className={styles.controls}
              type="text"
              name="nombre"
              placeholder="Ingrese su nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Correo:</label>
            <input
              className={styles.controls}
              type="email"
              name="correo"
              placeholder="Ingrese su correo"
              value={formData.correo}
              onChange={handleChange}
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
              placeholder="Ingrese su contraseña"
              value={formData.contrasena}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirmar contraseña:</label>
            <input
              className={styles.controls}
              type="password"
              name="confirmar"
              placeholder="Confirmar contraseña"
              value={formData.confirmar}
              onChange={handleChange}
              required
            />
          </div>

          <button className={styles.submitButton} type="submit">
            Registrarse
          </button>

        </form>
      </section>
    </div>
  );
}