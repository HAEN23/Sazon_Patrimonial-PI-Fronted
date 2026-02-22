// src/app/page.tsx
'use client'; 
import { useState } from 'react';
import styles from './page.module.css';
import LoginModal from './LoginModal/LoginModal';
import LoginAdmin from './LoginAdmin/LoginAdmin';
import LoginRest from './LoginRest/LoginRest';
import LoginUser from './LoginUser/LoginUser'; // Importamos el nuevo modal de usuario

export default function Home() {
  // Estados para controlar qué modal está abierto
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Funciones para abrir cada formulario específico
  const handleOpenAdmin = () => {
    setIsLoginModalOpen(false);
    setIsAdminModalOpen(true);
  };

  const handleOpenRest = () => {
    setIsLoginModalOpen(false);
    setIsRestModalOpen(true);
  };

  const handleOpenUser = () => {
    setIsLoginModalOpen(false);
    setIsUserModalOpen(true);
  };

  // Función global para que la flecha de regreso cierre cualquier form y vuelva al menú
  const handleBackToLogin = () => {
    setIsAdminModalOpen(false);
    setIsRestModalOpen(false);
    setIsUserModalOpen(false);
    setIsLoginModalOpen(true);
  };

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
            
            {/* Botón que abre el modal principal de selección de roles */}
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

      {/* ZONA DE MODALES */}
      
      {/* 1. Modal selector de roles */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onOpenAdmin={handleOpenAdmin} 
        onOpenRest={handleOpenRest}
        onOpenUser={handleOpenUser}
      />

      {/* 2. Modal Administrador */}
      <LoginAdmin 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)} 
        onBack={handleBackToLogin} 
      />

      {/* 3. Modal Restaurantero */}
      <LoginRest 
        isOpen={isRestModalOpen} 
        onClose={() => setIsRestModalOpen(false)} 
        onBack={handleBackToLogin} 
      />
      
      {/* 4. Modal Usuario */}
      <LoginUser 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)} 
        onBack={handleBackToLogin} 
      />
    </div>
  );
}