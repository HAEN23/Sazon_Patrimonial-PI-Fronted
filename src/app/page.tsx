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

  const [busqueda, setBusqueda] = useState("");
  const [tipoComida, setTipoComida] = useState("");
  const [ambiente, setAmbiente] = useState("");
  const [servicio, setServicio] = useState("");

  const [restaurantes, setRestaurantes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLoginSuccess = () => {
    setIsLogged(true);
  };

  useEffect(() => {
    const sesion = localStorage.getItem("sesionActiva");
    if (sesion) setIsLogged(true);

    const cargarRestaurantes = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
        
        // Consultamos la ruta (ajusta si usas /restaurants en lugar de /restaurantes)
        const res = await fetch(`${apiUrl}/restaurantes`);
        const textResponse = await res.text();
        
        if (!res.ok) {
          setRestaurantes([]);
          return;
        }
        
        let data;
        try {
          data = JSON.parse(textResponse);
        } catch (parseError) {
          setRestaurantes([]);
          return;
        }

        if (data.success && data.data) {
          const restaurantesReales = data.data.map((rest: any) => {
            
            let primerEtiqueta = "General";
            if (rest.tags && Array.isArray(rest.tags) && rest.tags.length > 0) {
              primerEtiqueta = rest.tags[0]; 
            } else if (rest.etiquetas) {
              primerEtiqueta = rest.etiquetas.split(',')[0].trim(); 
            }

            return {
              id: rest.id || rest.id_restaurante,
              // ✅ CORRECCIÓN CLAVE: Agregamos 'rest.restaurante' a la búsqueda del nombre
              nombre: rest.name || rest.nombre || rest.restaurante || rest.nombre_propuesto_restaurante || "Restaurante sin nombre",
              tipo: primerEtiqueta,
              ambiente: rest.address || rest.zona || "General",
              servicio: rest.schedule || rest.horario_atencion || "En local",
              imagen: rest.foto_portada || "/images/rest1.jpg" 
            };
          });
          
          setRestaurantes(restaurantesReales);
        }
      } catch (error) {
        console.error("Error cargando restaurantes:", error);
        setRestaurantes([]);
      } finally {
        setLoading(false);
      }
    };

    cargarRestaurantes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("sesionActiva");
    setIsLogged(false);
  };

  const handleBackToLogin = () => {
    setIsAdminModalOpen(false);
    setIsRestModalOpen(false);
    setIsUserModalOpen(false);
    setIsRegistroOpen(false);
    setIsLoginModalOpen(true);
  };

  const restaurantesFiltrados = restaurantes.filter((rest) => {
    const coincideBusqueda =
      rest.nombre ? rest.nombre.toLowerCase().includes(busqueda.toLowerCase()) : true;

    const coincideTipo =
      tipoComida === "" || (rest.tipo && rest.tipo.toLowerCase().includes(tipoComida.toLowerCase()));

    const coincideAmbiente =
      ambiente === "" || (rest.ambiente && rest.ambiente.toLowerCase().includes(ambiente.toLowerCase()));

    const coincideServicio =
      servicio === "" || (rest.servicio && rest.servicio.toLowerCase().includes(servicio.toLowerCase()));

    return coincideBusqueda && coincideTipo && coincideAmbiente && coincideServicio;
  });

  return (
    <div className={styles['vista-principal']}>

      <header className={styles['header-principal']}>
        <div className={styles['rectangle-parent']}>
          <div className={styles['logo-blanco-parent']}>
            <img className={styles['logo-blanco']} alt="Logo" src="/images/logo_sp_blanco.png" />
            <div className={styles['catlogo-de-restaurantes']}>Restaurantes San Cristóbal</div>
          </div>
          <nav className={styles['acciones-usuario']}>
            {!isLogged && (
              <>
                <button className={styles['registro-usuario-parent']} onClick={() => setIsRegistroOpen(true)}>
                  <img className={styles['registro']} src="/images/agregar-usuario.png" />
                  <span className={styles['registrarse']}>Registrarse</span>
                </button>
                <button className={styles['log-in-parent']} onClick={() => setIsLoginModalOpen(true)}>
                  <img className={styles['registro']} src="/images/usuario.png" />
                  <span className={styles['iniciar-sesin']}>Iniciar sesión</span>
                </button>
              </>
            )}
            {isLogged && (
              <button className={styles['log-in-parent']} onClick={handleLogout}>Cerrar sesión</button>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className={styles['calles-con-encanto-scaled-parent']}>
          <img className={styles['calles-con-encanto-scaled-icon']} src="/images/fondo_inicio.png" />
          <div className={styles['contenido-superpuesto']}>
            <div className={styles['descubre-la-magia']}>Descubre la Magia Culinaria de <br />San Cristóbal</div>
            <div className={styles['explora-los-mejores']}>Explora los mejores sabores de esta tierra</div>
            <div className={styles['barra-busqueda']}>
              <img className={styles['busqueda-icono']} src="/images/buscar.png" />
              <input type="text" placeholder="Buscar restaurantes" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
              <button className={styles['buscar']}>Buscar</button>
            </div>
          </div>

          <div className={`${styles['barra-filtros-horizontal']} ${styles['filtros-abajo']}`}>
            <div className={styles['filtro-item']}>
              <img src="/images/menu.png" className={styles['icono-filtro']} />
              <select className={styles['filtro-select']} value={tipoComida} onChange={(e) => setTipoComida(e.target.value)}>
                <option value="">Tipo de comida</option>
                <option value="Comida Rápida">Comida Rápida</option>
                <option value="Gourmet">Gourmet</option>
                <option value="Vegetariano">Vegetariano</option>
                <option value="Económico">Económico</option>
              </select>
            </div>
            <div className={styles['filtro-item']}>
              <img src="/images/restaurante.png" className={styles['icono-filtro']} />
              <select className={styles['filtro-select']} value={ambiente} onChange={(e) => setAmbiente(e.target.value)}>
                <option value="">Ambiente</option>
                <option value="Familiar">Familiar</option>
                <option value="Pet Friendly">Pet Friendly</option>
                <option value="Terraza">Terraza</option>
              </select>
            </div>
            <div className={styles['filtro-item']}>
              <img src="/images/coctel.png" className={styles['icono-filtro']} />
              <select className={styles['filtro-select']} value={servicio} onChange={(e) => setServicio(e.target.value)}>
                <option value="">Servicios</option>
                <option value="Delivery">Delivery</option>
                <option value="WiFi Gratuito">WiFi Gratuito</option>
                <option value="Estacionamiento">Estacionamiento</option>
              </select>
            </div>
            <button className={styles['btn-filtrar']} onClick={() => { setBusqueda(""); setTipoComida(""); setAmbiente(""); setServicio(""); }}>
              <img src="/images/borrar.png" className={styles['icono-boton']} /> Limpiar Filtros
            </button>
          </div>
        </section>

        <div className={styles['contenedor-restaurantes']}>
          {loading ? (
            <p style={{ textAlign: 'center', width: '100%', padding: '40px', fontSize: '1.2rem' }}>Cargando restaurantes...</p>
          ) : restaurantesFiltrados.length === 0 ? (
            <p style={{ textAlign: 'center', width: '100%', padding: '40px', fontSize: '1.2rem' }}>No se encontraron restaurantes.</p>
          ) : (
            restaurantesFiltrados.map((rest, index) => (
              <div key={rest.id || index} className={styles['card-restaurante']}>
                <img src={rest.imagen} alt={rest.nombre} className={styles['imagen-restaurante']} style={{ objectFit: 'cover' }} />
                <h3>{rest.nombre}</h3>
                <p>{rest.tipo}</p>
                <p>{rest.ambiente}</p>
                <p>{rest.servicio}</p>
              </div>
            ))
          )}
        </div>
      </main>

      <footer className={styles['rectangle-container']}>
        <div className={styles['footer-contactos-redes']}>
          <div className={styles['contctanos']}>Contáctanos</div>
          <div className={styles['contactos-grid']}>
            <div className={styles['gmail-1-1-parent']}><img className={styles['llamada-telefonica-2-icon']} src="/images/gmail_logo.png" /><div className={styles['sazonpatrimonialgmailcom']}>sazonpatrimonial@gmail.com</div></div>
            <div className={styles['llamada-telefonica-2-parent']}><img className={styles['llamada-telefonica-2-icon']} src="/images/call_logo.png" /><div className={styles['sazonpatrimonialgmailcom']}>+52 961 652 2093</div></div>
            <div className={styles['logotipo-de-instagram-2-parent']}><img className={styles['llamada-telefonica-2-icon']} src="/images/insta_logo.png" /><div className={styles['sazonpatrimonialgmailcom']}>@sazonpatrimonial</div></div>
            <div className={styles['facebook-1-1-parent']}><img className={styles['llamada-telefonica-2-icon']} src="/images/face_logo.png" /><div className={styles['sazonpatrimonialgmailcom']}>@sazonpatrimonial</div></div>
          </div>
        </div>
      </footer>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onOpenAdmin={() => { setIsLoginModalOpen(false); setIsAdminModalOpen(true); }} onOpenRest={() => { setIsLoginModalOpen(false); setIsRestModalOpen(true); }} onOpenUser={() => { setIsLoginModalOpen(false); setIsUserModalOpen(true); }} onOpenRegistro={() => { setIsLoginModalOpen(false); setIsRegistroOpen(true); }} />
      <LoginAdmin isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} onBack={handleBackToLogin} />
      <LoginRest isOpen={isRestModalOpen} onClose={() => setIsRestModalOpen(false)} onBack={handleBackToLogin} />
      <LoginUser isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onBack={handleBackToLogin} onLoginSuccess={handleLoginSuccess} />
      <RegistroModal isOpen={isRegistroOpen} onClose={() => setIsRegistroOpen(false)} onBack={() => { setIsRegistroOpen(false); setIsLoginModalOpen(true); }} onLoginSuccess={handleLoginSuccess} />

    </div>
  );
}