"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./VistaRestaurante.module.css";

export default function VistaRestaurante() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const abrirModal = async () => {
    // Aquí luego puedes hacer fetch para prefetchCantidadDescargas
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
  };

  return (
    <div className={styles.vistaPrincipal}>
      {/* HEADER */}
      <header className={styles.headerPrincipal}>
        <div className={styles.logoContainer}>
          <Image
            src="/images/logo_sp_blanco.png"
            alt="Logo Sazón Patrimonial"
            width={120}
            height={50}
          />
          <div>Restaurantes San Cristóbal</div>
        </div>
      </header>

      {/* MAIN */}
      <main>
        <div className={styles.restauranteContainer}>
          {/* Botón regresar */}
          <button
            className={styles.btnBack}
            onClick={() => router.back()}
          >
            <Image
              src="/images/back.png"
              alt="Regresar"
              width={32}
              height={32}
            />
          </button>

          <h1 className={styles.restauranteNombre}>
            Nombre del Restaurante
          </h1>

          <hr className={styles.divider} />

          {/* GALERÍA */}
          <div className={styles.galeria}>
            <div className={styles.galeriaPrincipal}>
              <Image
                src="/images/fondo_inicio.png"
                alt="Foto principal"
                fill
                className={styles.imageCover}
              />
            </div>

            <div className={styles.galeriaSecundaria}>
              {/* Aquí luego puedes mapear imágenes */}
            </div>
          </div>

          {/* INFO */}
          <div className={styles.infoFlex}>
            <div className={styles.infoBox}>Características</div>
            <div className={styles.infoBox}>Horarios</div>
            <div className={styles.infoBox}>Contactos</div>
            <div className={styles.infoBox}>Ubicación</div>
          </div>

          {/* BOTÓN MENÚ */}
          <button
            className={styles.btnMenu}
            onClick={abrirModal}
          >
            <Image
              src="/images/download.png"
              alt="Menú"
              width={20}
              height={20}
            />
            Menú
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div>
          <h4>Contáctanos</h4>
          <p>sazonpatrimonial@gmail.com</p>
          <p>+52 961 652 2093</p>
        </div>
      </footer>

      {/* MODAL */}
      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeModal}
              onClick={cerrarModal}
            >
              &times;
            </button>

            <div>
              {/* Aquí irá tu encuesta dinámica */}
              Contenido de encuesta aquí
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
