'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import LoginModal from './LoginModal/LoginModal';
import LoginAdmin from './LoginAdmin/LoginAdmin';
import LoginRest from './LoginRest/LoginRest';
import LoginUser from './LoginUser/LoginUser';
import RegistroModal from './RegistroModal/RegistroModal';

export default function Home() {

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRegistroOpen, setIsRegistroOpen] = useState(false);

  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) setIsLogged(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    setIsLogged(false);
  };

  const handleBackToLogin = () => {
    setIsAdminModalOpen(false);
    setIsRestModalOpen(false);
    setIsUserModalOpen(false);
    setIsRegistroOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <div className={styles['vista-principal']}>

      {/* HEADER */}
      <header className={styles['header-principal']}>
        <div className={styles['rectangle-parent']}>

          <div className={styles['logo-blanco-parent']}>
            <img
              className={styles['logo-blanco']}
              alt="Logo Sazón Patrimonial"
              src="/images/logo_sp_blanco.png"
            />
            <div className={styles['catlogo-de-restaurantes']}>
              Restaurantes San Cristóbal
            </div>
          </div>

          <nav className={styles['acciones-usuario']}>

            {!isLogged && (
              <>
                <button
                  className={styles['registro-usuario-parent']}
                  type="button"
                  onClick={() => setIsRegistroOpen(true)}
                >
                  <img
                    className={styles['registro']}
                    alt="Registrarse"
                    src="/images/agregar-usuario.png"
                  />
                  <span className={styles['registrarse']}>Registrarse</span>
                </button>

                <button
                  className={styles['log-in-parent']}
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  <img
                    className={styles['registro']}
                    alt="Iniciar sesión"
                    src="/images/usuario.png"
                  />
                  <span className={styles['iniciar-sesin']}>
                    Iniciar sesión
                  </span>
                </button>
              </>
            )}

            {isLogged && (
              <button
                className={styles['log-in-parent']}
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            )}

          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main>
        <section className={styles['calles-con-encanto-scaled-parent']}>

          <img
            className={styles['calles-con-encanto-scaled-icon']}
            alt=""
            src="/images/fondo_inicio.png"
            style={{ display: 'block' }}
          />

          <div className={styles['contenido-superpuesto']}>
            <div className={styles['descubre-la-magia']}>
              Descubre la Magia Culinaria de <br />
              San Cristóbal
            </div>

            <div className={styles['explora-los-mejores']}>
              Explora los mejores sabores de esta tierra
            </div>

            <div className={styles['barra-busqueda']}>
              <img
                className={styles['busqueda-icono']}
                alt=""
                src="/images/buscar.png"
              />
              <input
                type="text"
                placeholder="Buscar restaurantes"
              />
              <button className={styles['buscar']}>
                Buscar
              </button>
            </div>
          </div>

          {/* FILTROS */}
          <div className={`${styles['barra-filtros-horizontal']} ${styles['filtros-abajo']}`}>

            <div className={styles['filtro-item']}>
              <img src="/images/menu.png" className={styles['icono-filtro']} />
              <select className={styles['filtro-select']}>
                <option value="">Tipo de comida</option>
                <option value="Comida Rápida">Comida Rápida</option>
                <option value="Gourmet">Gourmet</option>
                <option value="Vegetariano">Vegetariano</option>
                <option value="Económico">Económico</option>
              </select>
            </div>

            <div className={styles['filtro-item']}>
              <img src="/images/restaurante.png" className={styles['icono-filtro']} />
              <select className={styles['filtro-select']}>
                <option value="">Ambiente</option>
                <option value="Familiar">Familiar</option>
                <option value="Pet Friendly">Pet Friendly</option>
                <option value="Terraza">Terraza</option>
              </select>
            </div>

            <div className={styles['filtro-item']}>
              <img src="/images/coctel.png" className={styles['icono-filtro']} />
              <select className={styles['filtro-select']}>
                <option value="">Servicios</option>
                <option value="Delivery">Delivery</option>
                <option value="WiFi Gratuito">WiFi Gratuito</option>
                <option value="Estacionamiento">Estacionamiento</option>
              </select>
            </div>

            <button className={styles['btn-filtrar']}>
              <img src="/images/borrar.png" className={styles['icono-boton']} />
              Limpiar Filtros
            </button>

          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className={styles['rectangle-container']}>
        <div className={styles['footer-contactos-redes']}>

          <div className={styles['contctanos']}>Contáctanos</div>

          <div className={styles['contactos-grid']}>

            <div className={styles['gmail-1-1-parent']}>
              <img className={styles['llamada-telefonica-2-icon']} src="/images/gmail_logo.png" />
              <div className={styles['sazonpatrimonialgmailcom']}>
                sazonpatrimonial@gmail.com
              </div>
            </div>

            <div className={styles['llamada-telefonica-2-parent']}>
              <img className={styles['llamada-telefonica-2-icon']} src="/images/call_logo.png" />
              <div className={styles['sazonpatrimonialgmailcom']}>
                +52 961 652 2093
              </div>
            </div>

            <div className={styles['logotipo-de-instagram-2-parent']}>
              <img className={styles['llamada-telefonica-2-icon']} src="/images/insta_logo.png" />
              <div className={styles['sazonpatrimonialgmailcom']}>
                @sazonpatrimonial
              </div>
            </div>

            <div className={styles['facebook-1-1-parent']}>
              <img className={styles['llamada-telefonica-2-icon']} src="/images/face_logo.png" />
              <div className={styles['sazonpatrimonialgmailcom']}>
                @sazonpatrimonial
              </div>
            </div>

          </div>
        </div>
      </footer>

      {/* MODALES */}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onOpenAdmin={() => {
          setIsLoginModalOpen(false);
          setIsAdminModalOpen(true);
        }}
        onOpenRest={() => {
          setIsLoginModalOpen(false);
          setIsRestModalOpen(true);
        }}
        onOpenUser={() => {
          setIsLoginModalOpen(false);
          setIsUserModalOpen(true);
        }}
        onOpenRegistro={() => {
          setIsLoginModalOpen(false);
          setIsRegistroOpen(true);
        }}
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

      <RegistroModal
        isOpen={isRegistroOpen}
        onClose={() => setIsRegistroOpen(false)}
        onBack={() => {
          setIsRegistroOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

    </div>
  );
}