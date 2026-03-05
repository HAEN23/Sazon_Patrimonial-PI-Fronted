"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./EdicionRest.module.css";
import { useRouter } from "next/navigation";

export default function EdicionRestaurante() {

  const router = useRouter();

  const [modalAviso, setModalAviso] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    router.push("/");
  };

  const handleAplicarCambios = () => {
    setModalAviso(true);
  };

  return (
    <div className={styles.vistaPrincipal}>

      {/* HEADER */}
      <header className={styles.headerPrincipal}>

        <div className={styles.headerContent}>

          <div className={styles.logoSection}>
            <Image
              src="/images/logo_sp_blanco.png"
              alt="Logo"
              width={80}
              height={80}
            />

            <span>Restaurantes San Cristóbal</span>
          </div>

          <div className={styles.headerActions}>

            <button
              onClick={handleLogout}
              className={styles.logoutBtn}
            >
              <Image
                src="/images/logout.png"
                alt="logout"
                width={20}
                height={20}
              />
              Cerrar sesión
            </button>

            <Image
              src="/images/restaurantero.png"
              alt="icono"
              width={50}
              height={50}
            />

          </div>

        </div>

      </header>

      {/* MAIN */}
      <main className={styles.main}>

        <button
          className={styles.btnBack}
          onClick={() => router.push("/vistaPrincipalRestaurantero")}
        >
          <Image
            src="/images/back.png"
            alt="back"
            width={25}
            height={25}
          />
        </button>

        <h1>Mi Restaurante</h1>

        <hr />

        {/* GALERÍA */}
        <section className={styles.section}>

          <h3>Galería de Imágenes</h3>

          <div className={styles.galeria}>

            {[1, 2, 3].map((num) => (

              <label key={num} className={styles.imagenSlot}>

                <input
                  type="file"
                  hidden
                  accept="image/png, image/jpeg"
                />

                <div className={styles.imagenPlaceholder}>
                  Subir Imagen {num}
                </div>

              </label>

            ))}

          </div>

        </section>

        {/* MENÚ + UBICACIÓN + HORARIO */}
        <section className={styles.sectionFlex}>

          <div>

            <h4>Menú en PDF</h4>

            <label className={styles.fileBtn}>
              Seleccionar archivo PDF

              <input
                type="file"
                hidden
                accept="application/pdf"
              />

            </label>

          </div>

          <div>

            <h4>Ubicación</h4>

            <input
              type="text"
              placeholder="Ingrese la dirección"
              className={styles.input}
            />

          </div>

          <div>

            <h4>Horarios</h4>

            <input
              type="text"
              placeholder="Ingrese el horario"
              className={styles.input}
            />

          </div>

        </section>

        {/* CONTACTO + ETIQUETAS */}
        <section className={styles.sectionFlex}>

          <div>

            <h4>Contactos</h4>

            <input
              type="text"
              placeholder="Número celular"
              className={styles.input}
            />

            <input
              type="text"
              placeholder="Facebook"
              className={styles.input}
            />

            <input
              type="text"
              placeholder="Instagram"
              className={styles.input}
            />

          </div>

          <div>

            <h4>Etiquetas</h4>

            {[1, 2, 3].map((i) => (

              <select key={i} className={styles.select}>

                <option value="">Seleccionar</option>
                <option>Etiqueta 1</option>
                <option>Etiqueta 2</option>
                <option>Etiqueta 3</option>

              </select>

            ))}

          </div>

        </section>

        {/* BOTÓN */}
        <button
          onClick={handleAplicarCambios}
          className={styles.btnAplicar}
        >

          <Image
            src="/images/aplicarCambios.png"
            alt="cambios"
            width={20}
            height={20}
          />

          Aplicar Cambios

        </button>

      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>

        <div>

          <h4>Contáctanos</h4>

          <p>sazonpatrimonial@gmail.com</p>

          <p>+52 961 652 2093</p>

        </div>

        <div className={styles.footerLogos}>

          <Image
            src="/images/logo_sp_blanco.png"
            alt="logo"
            width={70}
            height={70}
          />

          <Image
            src="/images/devbox_logo.png"
            alt="devbox"
            width={70}
            height={70}
          />

          <Image
            src="/images/logo_uni.png"
            alt="uni"
            width={70}
            height={70}
          />

        </div>

      </footer>

      {/* MODAL */}
      {modalAviso && (

        <div className={styles.modalOverlay}>

          <div className={styles.modalContent}>

            <button onClick={() => setModalAviso(false)}>
              &times;
            </button>

            <p>
              Solicitud enviada con éxito.
              Validaremos tu información pronto :)
            </p>

          </div>

        </div>

      )}

    </div>
  );
}