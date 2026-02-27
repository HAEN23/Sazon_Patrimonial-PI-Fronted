'use client'; 
import { useState } from 'react';
import styles from './page.module.css';
import LoginModal from './LoginModal/LoginModal';
import LoginAdmin from './LoginAdmin/LoginAdmin';
import LoginRest from './LoginRest/LoginRest';
import LoginUser from './LoginUser/LoginUser';

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

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

      {/* MAIN */}
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
        </section>
      </main>

      {/* FOOTER */}
      <footer className={styles['rectangle-container']}>
        <div className={styles['footer-contactos-redes']}>
          <div className={styles.contctanos}>Contáctanos</div>
        </div>
      </footer>

      {/* MODALES */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onOpenAdmin={handleOpenAdmin} 
        onOpenRest={handleOpenRest}
        onOpenUser={handleOpenUser}
      />

      <LoginAdmin 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)} 
        onBack={handleBackToLogin} 
      />

      <LoginRest 
        isOpen={isRestModalOpen} 
        onClose={() => setIsRestModalOpen(false)} 
        onBack={handleBackToLogin} 
      />

      <LoginUser 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)} 
        onBack={handleBackToLogin} 
      />
    </div>
  );
}