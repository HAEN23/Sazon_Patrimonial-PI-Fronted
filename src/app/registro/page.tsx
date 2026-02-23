"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./Registro.module.css";

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    confirmar: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className={styles.registroContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Image
          src="/images/logo_sp_rojo.png"
          alt="Logo"
          width={100}
          height={100}
        />

        <h4>Registro de usuario</h4>

        <label>Nombre de usuario:</label>
        <input
          className={styles.controls}
          type="text"
          name="nombre"
          placeholder="Ingrese su nombre"
          value={formData.nombre}
          onChange={handleChange}
        />
        <span className={styles["error-msg"]}></span>

        <label>Correo electrónico:</label>
        <input
          className={styles.controls}
          type="email"
          name="correo"
          placeholder="Ingrese su correo"
          value={formData.correo}
          onChange={handleChange}
        />
        <span className={styles["error-msg"]}></span>

        <label>Contraseña:</label>
        <input
          className={styles.controls}
          type="password"
          name="contrasena"
          placeholder="Ingrese su contraseña"
          value={formData.contrasena}
          onChange={handleChange}
        />
        <span className={styles["error-msg"]}></span>

        <label>Confirmar contraseña:</label>
        <input
          className={styles.controls}
          type="password"
          name="confirmar"
          placeholder="Confirmar contraseña"
          value={formData.confirmar}
          onChange={handleChange}
        />
        <span className={styles["error-msg"]}></span>

        <button type="submit" className={styles.button}>
          Registrarse
        </button>
      </form>
    </div>
  );
}



