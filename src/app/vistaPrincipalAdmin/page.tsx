"use client";

import Image from "next/image";
import styles from "./VistaPrincipalAdmin.module.css";
import { useState } from "react";

export default function VistaPrincipalAdmin() {
  const [vistaActiva, setVistaActiva] = useState("restaurantes");

  return (
    <div className={styles.vistaPrincipal}>
      {/* HEADER */}
      <header className={styles.headerPrincipal}>
        <div className={styles.headerContainer}>
          <div className={styles.logoContainer}>
            <Image
              src="/images/logo_sp_blanco.png"
              alt="Logo Sazón Patrimonial"
              width={120}
              height={50}
            />
            <div>Restaurantes San Cristóbal</div>
          </div>

          <button className={styles.logoutButton}>
            <Image
              src="/images/logout.png"
              alt="Cerrar sesión"
              width={20}
              height={20}
            />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </header>

      {/* PANEL ADMIN */}
      <div className={styles.adminPanel}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <button
            className={styles.sidebarItem}
            onClick={() => setVistaActiva("restaurantes")}
          >
            <Image
              src="/images/restaurantes.png"
              alt="Restaurantes"
              width={20}
              height={20}
            />
            <span>Restaurantes</span>
          </button>

          <button
            className={styles.sidebarItem}
            onClick={() => setVistaActiva("usuarios")}
          >
            <Image
              src="/images/usuarios.png"
              alt="Usuarios"
              width={20}
              height={20}
            />
            <span>Usuarios</span>
          </button>
        </aside>

        {/* CONTENIDO */}
        <main className={styles.contenido}>
          {vistaActiva === "restaurantes" && (
            <section>
              <h2>Administrar Restaurantes</h2>
              <table className={styles.tablaAdmin}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Propietario</th>
                    <th>Correo</th>
                    <th>Dirección</th>
                    <th>Horario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Aquí irán los datos dinámicos */}
                </tbody>
              </table>
            </section>
          )}

          {vistaActiva === "usuarios" && (
            <section>
              <h2>Administrar Usuarios</h2>
              <table className={styles.tablaAdmin}>
                <thead>
                  <tr>
                    <th>Restaurante</th>
                    <th>Propietario</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Horario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </section>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerContactos}>
          <h4>Contáctanos</h4>
          <p>sazonpatrimonial@gmail.com</p>
          <p>+52 961 652 2093</p>
          <p>@sazonpatrimonial</p>
        </div>

        <div className={styles.footerLogos}>
          <Image
            src="/images/logo_sp_blanco.png"
            alt="Logo SP"
            width={100}
            height={40}
          />
          <Image
            src="/images/devbox_logo.png"
            alt="Logo Devbox"
            width={80}
            height={40}
          />
          <Image
            src="/images/logo_uni.png"
            alt="Logo UP"
            width={80}
            height={40}
          />
        </div>
      </footer>
    </div>
  );
}
