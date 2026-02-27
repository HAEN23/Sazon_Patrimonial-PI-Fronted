"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./vistaRestaurante.module.css";

export default function VistaRestaurante() {
  const router = useRouter();
  
  // Estados para los modales y favoritos
  const [modalMenuOpen, setModalMenuOpen] = useState(false);
  const [modalEncuestaOpen, setModalEncuestaOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Nuevo estado para mostrar/ocultar etiquetas extra
  const [mostrarMasTags, setMostrarMasTags] = useState(false);

  // Simulación de etiquetas extra que podrían venir de tu base de datos. 
  // Si dejas este arreglo vacío [], el botón "Ver más" desaparecerá automáticamente.
  const etiquetasExtra = ["Pet Friendly", "Terraza al aire libre"];

  const abrirModalMenu = () => setModalMenuOpen(true);
  const cerrarModalMenu = () => setModalMenuOpen(false);

  const abrirModalEncuesta = () => setModalEncuestaOpen(true);
  const cerrarModalEncuesta = () => setModalEncuestaOpen(false);

  const toggleFavorite = () => setIsFavorite(!isFavorite);
  const toggleTags = () => setMostrarMasTags(!mostrarMasTags);

  return (
    <div className={styles.vistaPrincipal}>
      {/* HEADER */}
      <header className={styles.headerPrincipal}>
        <div className={styles.logoContainer}>
          <Image
            src="/images/logo_sp_blanco.png"
            alt="Logo Sazón Patrimonial"
            width={50}
            height={50}
          />
          <div>
            Catálogo de Restaurantes<br />
            en Chiapa de Corzo
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className={styles.mainContent}>
        
        {/* Título y Regresar */}
        <div className={styles.headerTitle}>
          <button className={styles.btnBack} onClick={() => router.back()}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className={styles.restauranteNombre}>La mansión</h1>
        </div>

        {/* GALERÍA */}
        <div className={styles.galeria}>
          <div className={styles.galeriaPrincipal}>
            <Image src="/images/fondo_inicio.png" alt="Patio" fill className={styles.imageCover} />
          </div>
          <div className={styles.galeriaSecundaria}>
            <div className={styles.imagenSecundaria}>
              <Image src="/images/fondo_inicio.png" alt="Barra" fill className={styles.imageCover} />
            </div>
            <div className={styles.imagenSecundaria}>
              <Image src="/images/fondo_inicio.png" alt="Comida" fill className={styles.imageCover} />
            </div>
          </div>
        </div>

        {/* INFO GRID (3 Columnas) */}
        <div className={styles.infoGrid}>
          
          {/* COLUMNA 1: Horarios y Ubicación */}
          <div className={styles.infoSection}>
            <h3>Horarios</h3>
            <div className={styles.horariosBox}>
              <p><strong>Lunes a viernes</strong><br/>8:00-20:00</p>
              <p><strong>Sábado y domingo</strong><br/>10:00-20:00</p>
            </div>
            
            <div className={styles.ubicacionBox}>
              <h3>Ubicación</h3>
              <p>Av. 4 de junio N°20</p>
            </div>
          </div>

          {/* COLUMNA 2: Contactos y Acciones */}
          <div className={styles.infoSection}>
            <h3>Contactos</h3>
            <ul className={styles.contactList}>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +52 123 467 2543
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                @LaMansion
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                @la_mansion
              </li>
            </ul>

            <div className={styles.actionRow}>
              <button className={styles.btnMenu} onClick={abrirModalMenu}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                Menú
              </button>
              
              <button className={styles.btnFav} onClick={toggleFavorite}>
                {isFavorite ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="#6b1e1e" stroke="#6b1e1e" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                )}
                Favoritos
              </button>
            </div>
          </div>

          {/* COLUMNA 3: Etiquetas e Íconos */}
          <div className={styles.infoSection}>
            <div className={styles.tagsWrapper}>
              
              {/* Fila 1 */}
              <div className={styles.tagRow}>
                <div className={styles.iconContainer}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                </div>
                <span className={styles.tagPill}>Libre de gluten</span>
              </div>

              {/* Fila 2 - Con botón dinámico "Ver más" */}
              <div className={styles.tagRow}>
                <div className={styles.iconContainer}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                </div>
                <span className={styles.tagPill}>Comida local</span>
                
                {/* Renderizado condicional del botón Ver más */}
                {etiquetasExtra.length > 0 && (
                  <button 
                    className={`${styles.tagPill} ${styles.tagDark} ${styles.tagButton}`} 
                    onClick={toggleTags}
                  >
                    {mostrarMasTags ? "Ocultar" : `+${etiquetasExtra.length} Ver más`}
                  </button>
                )}
              </div>

              {/* Etiquetas Adicionales Expandibles */}
              {mostrarMasTags && etiquetasExtra.map((tag, index) => (
                <div key={index} className={styles.tagRow}>
                  <div className={styles.iconContainer}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                  </div>
                  <span className={styles.tagPill}>{tag}</span>
                </div>
              ))}

              {/* Fila 3 - Botón Encuesta */}
              <div className={styles.tagRow}>
                <div className={styles.iconContainer}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                </div>
                <button 
                className={`${styles.tagPill} ${styles.tagDark} ${styles.tagButton}`} 
                onClick={() => router.push("/EncuestaNodal")}
                >
                Encuesta
              </button>
              </div>

            </div>

            <h3>Fotos de Usuarios</h3>
            <div className={styles.fotosUsuariosRow}>
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className={styles.fotoMini}>
                  <Image src="/images/fondo_inicio.png" alt="Usuario" fill className={styles.imageCover} />
                </div>
              ))}
              <button className={styles.btnSubirFoto}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                Subir Foto
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerCol}>
          <h4>Contáctanos</h4>
          <p>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
             sazonpatrimonial@gmail.com
          </p>
          <p>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
             +52 961 208 5412
          </p>
        </div>
        
        <div className={styles.footerCol}>
           <p>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
             @sazonpatrimonial
           </p>
           <p>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
             @sazonpatrimonial
           </p>
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

      {/* MODAL MENÚ */}
      {modalMenuOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeModal} onClick={cerrarModalMenu}>&times;</button>
            <div style={{ padding: "20px", color: "#6b1e1e" }}>
              <h2>Menú</h2>
              <p>Contenido del menú aquí...</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ENCUESTA */}
      {modalEncuestaOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeModal} onClick={cerrarModalEncuesta}>&times;</button>
            <div style={{ padding: "20px", color: "#6b1e1e" }}>
              <h2>Encuesta de Satisfacción</h2>
              <p>¡Ayúdanos a mejorar! Aquí irá tu formulario de encuesta dinámica.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}