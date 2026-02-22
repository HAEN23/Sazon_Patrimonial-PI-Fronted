// src/app/page.tsx
'use client'; // <-- 1. Agregamos use client para poder usar estados
import { useState } from 'react'; // <-- 2. Importamos useState
import styles from './page.module.css';
import LoginModal from './LoginModal/LoginModal';
export default function Home() {
  // <-- 4. Creamos el estado para controlar si el modal se ve o no
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className={styles['vista-principal']}>
      {/* HEADER */}
      <header className={styles['header-principal']}>
        <div className={styles['rectangle-parent']}>
          <div className={styles['logo-blanco-parent']}>
            <img className={styles['logo-blanco']} alt="Logo Sazón Patrimonial" src="/images/logo_sp_blanco.png" />
            <div className={styles['catlogo-de-restaurantes']}>Restaurantes San Cristóbal</div>
          </div>
          <nav className={styles['acciones-usuario']}>
            <button className={styles['registro-usuario-parent']} type="button">
              <img className={styles.registro} alt="Registrarse" src="/images/agregar-usuario.png" />
              <span className={styles.registrarse}>Registrarse</span>
            </button>
            
            {/* <-- 5. Le agregamos el evento onClick al botón de Iniciar sesión */}
            <button 
              className={styles['log-in-parent']} 
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
            >
              <img className={styles.registro} alt="Iniciar sesión" src="/images/usuario.png" />
              <span className={styles['iniciar-sesin']}>Iniciar sesión</span>
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main>
        <section className={styles['calles-con-encanto-scaled-parent']}>
          <img className={styles['calles-con-encanto-scaled-icon']} alt="" src="/images/fondo_inicio.png" />
          <div className={styles['contenido-superpuesto']}>
            <div className={styles['descubre-la-magia']}>
              Descubre la Magia Culinaria de <br />San Cristóbal
            </div>
            <div className={styles['explora-los-mejores']}>
              Explora los mejores sabores de esta tierra
            </div>
            <div className={styles['barra-busqueda']}>
              <img className={styles['busqueda-icono']} alt="" src="/images/buscar.png" />
              <input type="text" placeholder="Buscar restaurantes" />
              <button className={styles.buscar}>Buscar</button>
            </div>
          </div>
          
          {/* FILTROS */}
          <div className={`${styles['barra-filtros-horizontal']} ${styles['filtros-abajo']}`}>
            <div className={styles['filtro-item']}>
              <img src="/images/menu.png" alt="Tipo de comida" className={styles['icono-filtro']} />
              <select className={styles['filtro-select']} id="filtroTipoComida" defaultValue="">
                <option value="" disabled>Tipo de comida</option>
                <option value="Comida Rápida">Comida Rápida</option>
                <option value="Gourmet">Gourmet</option>
                <option value="Vegetariano">Vegetariano</option>
                <option value="Económico">Económico</option>
              </select>
            </div>

            <div className={styles['filtro-item']}>
              <img src="/images/restaurante.png" alt="Ambiente" className={styles['icono-filtro']} />
              <select className={styles['filtro-select']} id="filtroAmbiente" defaultValue="">
                <option value="" disabled>Ambiente</option>
                <option value="Familiar">Familiar</option>
                <option value="Pet Friendly">Pet Friendly</option>
                <option value="Terraza">Terraza</option>
              </select>
            </div>

            <div className={styles['filtro-item']}>
              <img src="/images/coctel.png" alt="Servicios" className={styles['icono-filtro']} />
              <select className={styles['filtro-select']} id="filtroServicios" defaultValue="">
                <option value="" disabled>Servicios</option>
                <option value="Delivery">Delivery</option>
                <option value="WiFi Gratuito">WiFi Gratuito</option>
                <option value="Estacionamiento">Estacionamiento</option>
              </select>
            </div>

            <button className={styles['btn-filtrar']} id="btnLimpiarFiltros">
              <img src="/images/borrar.png" className={styles['icono-boton']} alt="Borrar" /> Limpiar Filtros
            </button>
          </div>
        </section>

        <div className={styles['contenido-principal']}>
          <section className={styles['line-parent']}>
              {/* Aquí se renderizarán las tarjetas de los restaurantes más adelante */}
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className={styles['rectangle-container']}>
        <div className={styles['footer-contactos-redes']}>
            <div className={styles.contctanos}>Contáctanos</div>
            <div className={styles['contactos-grid']}>
                <div className={styles['gmail-1-1-parent']}>
                    <img className={styles['llamada-telefonica-2-icon']} alt="Correo" src="/images/gmail_logo.png" />
                    <div className={styles.sazonpatrimonialgmailcom}>sazonpatrimonial@gmail.com</div>
                </div>
                <div className={styles['llamada-telefonica-2-parent']}>
                    <img className={styles['llamada-telefonica-2-icon']} alt="Teléfono" src="/images/call_logo.png" />
                    <div className={styles.sazonpatrimonialgmailcom}>+52 961 652 2093</div>
                </div>
                <div className={styles['logotipo-de-instagram-2-parent']}>
                    <img className={styles['llamada-telefonica-2-icon']} alt="Instagram" src="/images/insta_logo.png" />
                    <div className={styles.sazonpatrimonialgmailcom}>@sazonpatrimonial</div>
                </div>
                <div className={styles['facebook-1-1-parent']}>
                    <img className={styles['llamada-telefonica-2-icon']} alt="Facebook" src="/images/face_logo.png" />
                    <div className={styles.sazonpatrimonialgmailcom}>@sazonpatrimonial</div>
                </div>
            </div>
        </div>
        <div className={styles['footer-logos']}>
            <img className={styles['logo-blanco-2']} alt="Logo Sazón Patrimonial" src="/images/logo_sp_blanco.png" />
            <img className={styles['logo-equipo']} alt="Logo Devbox" src="/images/devbox_logo.png" />
            <img className={styles['logo-universidad']} alt="Logo UP" src="/images/logo_uni.png" />
        </div>
      </footer>

      {/* <-- 6. Agregamos el componente del Modal justo antes de cerrar el div principal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
}