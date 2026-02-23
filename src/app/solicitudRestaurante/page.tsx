"use client";

import { useState } from "react";
import styles from "./Solicitud.module.css";
import Image from "next/image";

export default function SolicitudPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  return (
    <div className={styles.vistaPrincipal}>
      {/* HEADER */}
      <header className={styles.headerPrincipal}>
        <div className={styles.logoContainer}>
          <Image
            src="/logo_sp_blanco.png"
            alt="Logo"
            width={120}
            height={120}
            className={styles.logoBlanco}
          />
          <div className={styles.catlogo}>
            Restaurantes San Cristóbal
          </div>
        </div>
      </header>

      <main>
        <div className={styles.registroContainer}>
          <button
            className={styles.btnBack}
            onClick={() => window.history.back()}
          >
            <Image
              src="/back.png"
              alt="Regresar"
              width={32}
              height={32}
            />
          </button>

          <section className={styles.formSection}>
            <form onSubmit={handleSubmit}>
              <h4>Solicitud de validación</h4>
              <p className={styles.subText}>
                Proporciona la siguiente información para verificar tu restaurante
              </p>

              <label>Restaurante</label>
              <input className={styles.controls} type="text" />

              <label>Número de celular</label>
              <input className={styles.controls} type="tel" />

              <label>Facebook</label>
              <input className={styles.controls} type="text" />

              <label>Instagram</label>
              <input className={styles.controls} type="text" />

              <label>Dirección</label>
              <input className={styles.controls} type="text" />

              <label>Horarios</label>
              <input className={styles.controls} type="text" />

              <label>Imágenes (JPG o PNG)</label>
              <div className={styles.imagenesGroup}>
                <label className={styles.inputFile}>
                  Imagen principal
                  <input type="file" hidden accept="image/png, image/jpeg" />
                </label>

                <label className={styles.inputFile}>
                  Imagen secundaria
                  <input type="file" hidden accept="image/png, image/jpeg" />
                </label>

                <label className={styles.inputFile}>
                  Imagen de platillo
                  <input type="file" hidden accept="image/png, image/jpeg" />
                </label>
              </div>

              <label>Archivos (PDF)</label>
              <div className={styles.imagenesGroup}>
                <label className={styles.inputFile}>
                  Comprobante de domicilio
                  <input type="file" hidden accept="application/pdf" />
                </label>

                <label className={styles.inputFile}>
                  Menú del restaurante
                  <input type="file" hidden accept="application/pdf" />
                </label>
              </div>

              <button className={styles.button} type="submit">
                Enviar solicitud
              </button>
            </form>
          </section>

          <section className={styles.imageSection}>
            <Image
              src="/registro.jpeg"
              alt="Restaurante"
              width={500}
              height={600}
              className={styles.registroImg}
            />
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContactos}>
          <h4>Contáctanos</h4>
          <p>sazonpatrimonial@gmail.com</p>
          <p>+52 961 652 2093</p>
          <p>@sazonpatrimonial</p>
        </div>

        <div className={styles.footerLogos}>
          <Image src="/logo_sp_blanco.png" alt="logo" width={80} height={80} />
          <Image src="/devbox_logo.png" alt="devbox" width={80} height={80} />
          <Image src="/logo_uni.png" alt="uni" width={80} height={80} />
        </div>
      </footer>

      {modalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContenido}>
            <span
              className={styles.cerrar}
              onClick={() => setModalOpen(false)}
            >
              &times;
            </span>
            <p>
              ¡Su solicitud ha sido enviada con éxito!
              <br />
              La información será validada muy pronto.
              <br /> :)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
