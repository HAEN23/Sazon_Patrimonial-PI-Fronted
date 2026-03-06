'use client';

import { useState } from "react";
import Image from "next/image";
import styles from "./RegistroModal.module.css";
import { useRouter } from "next/navigation";

interface RegistroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

export default function RegistroModal({
  isOpen,
  onClose,
  onBack
}: RegistroModalProps) {

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    confirmar: "",
    tipo: "usuario"
  });

  const router = useRouter();

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

    console.log("Datos de registro:", formData);

    // VALIDAR CONTRASEÑAS
    if (formData.contrasena !== formData.confirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // OBTENER USUARIOS EXISTENTES
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios") || "[]");

    // VALIDAR CORREO DUPLICADO
    const correoExiste = usuariosGuardados.find(
      (user: any) => user.correo === formData.correo
    );

    if (correoExiste) {
      alert("Este correo ya está registrado");
      return;
    }

    // CREAR NUEVO USUARIO
    const nuevoUsuario = {
      nombre: formData.nombre,
      correo: formData.correo,
      contrasena: formData.contrasena,
      tipo: formData.tipo
    };

    // GUARDAR USUARIO
    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));

    alert("Registro exitoso");

    // LIMPIAR FORMULARIO
    setFormData({
      nombre: "",
      correo: "",
      contrasena: "",
      confirmar: "",
      tipo: "usuario"
    });

    // CERRAR MODAL
    onClose();
  };

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.overlayShow : ''}`}>
      <section className={styles.modalBox}>

        {/* Botón regresar */}
        <button
          className={styles.backButton}
          onClick={onBack}
          aria-label="Regresar"
        >
          &#8592;
        </button>

        {/* Botón cerrar */}
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          &times;
        </button>

        <form className={styles.viewContainer} onSubmit={handleSubmit}>

          <Image
            src="/images/logo_sp_rojo.png"
            alt="Logo Sazón Patrimonial"
            width={100}
            height={100}
            className={styles.logo}
          />

          <h4 className={styles.titulo}>Registro de usuario</h4>

          {/* Nombre */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Nombre de usuario:</label>
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

          {/* Correo */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Correo electrónico:</label>
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

          {/* NUEVO CAMPO ROL */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Tipo de cuenta:</label>
            <select
              className={styles.controls}
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
            >
              <option value="usuario">Usuario</option>
              <option value="restaurantero">Restaurantero</option>
            </select>
          </div>

          {/* Contraseña */}
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

          {/* Confirmar contraseña */}
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

          <button
            type="submit"
            className={styles.submitButton}
          >
            Registrarse
          </button>

        </form>
      </section>
    </div>
  );
}