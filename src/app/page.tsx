'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import LoginModal from './LoginModal/LoginModal';
import LoginAdmin from './LoginAdmin/LoginAdmin';
import LoginRest from './LoginRest/LoginRest';
import LoginUser from './LoginUser/LoginUser';
import RegistroModal from './RegistroModal/RegistroModal';
import Link from 'next/link';

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

  // Nuevos estados para el Filtro de Favoritos
  const [favoritosIds, setFavoritosIds] = useState<number[]>([]);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

  const handleLoginSuccess = () => {
    setIsLogged(true);
  };

  useEffect(() => {
    const sesion = localStorage.getItem("sesionActiva");
    if (sesion) setIsLogged(true);

    const cargarRestaurantes = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
        
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
            
            // Extraemos el string completo de etiquetas para los filtros
            const etiquetasCompletas = rest.etiquetas || ""; 
            
            // Lo separamos en un arreglo para mostrarlo en las tarjetas
            const etiquetasArr = etiquetasCompletas.split(',').map((e:string) => e.trim()).filter((e:string) => e !== "");

            return {
              id: rest.id || rest.id_restaurante,
              nombre: rest.name || rest.nombre || rest.restaurante || rest.nombre_propuesto_restaurante || "Restaurante sin nombre",
              etiquetas: etiquetasCompletas, // Guardamos el texto crudo para filtrar
              etiqueta1: etiquetasArr[0] || "General",
              etiqueta2: etiquetasArr[1] || "",
              etiqueta3: etiquetasArr[2] || "",
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

  // Efecto para cargar los restaurantes favoritos del usuario
  const cargarFavoritos = async () => {
    const userRole = localStorage.getItem("userRole");
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (userRole === "usuario" && userStr && token) {
      try {
        const user = JSON.parse(userStr);
        // Cubrimos todas las posibles formas en las que se guarde el ID del usuario
        const userId = user.id_usuario || user.id || user.userId; 
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
        
        const res = await fetch(`${apiUrl}/clients/${userId}/favorites`, {
          headers: { 'Authorization': `Bearer ${token}` },
          cache: 'no-store' // <--- Evita que el navegador guarde memoria vieja
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            // Forzamos a que TODOS los IDs sean de tipo Number (Matemático)
            const ids = data.data.map((fav: any) => 
              Number(fav.id_restaurante || fav.restaurantId || fav.restaurante?.id_restaurante)
            );
            console.log("🔥 Mis Favoritos descargados:", ids); // <--- Te ayudará a ver si funciona en F12
            setFavoritosIds(ids);
          }
        }
      } catch (error) {
        console.error("Error cargando favoritos:", error);
      }
    }
  };

  useEffect(() => {
    if (isLogged) {
      cargarFavoritos();
    }
  }, [isLogged, mostrarFavoritos]); // <--- Agregamos mostrarFavoritos para que re-descargue al darle clic

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

  // NUEVA LÓGICA DE FILTRADO POR ETIQUETAS
  const restaurantesFiltrados = restaurantes.filter((rest) => {
    // Si el botón de favoritos está activo, solo mostramos los que coincidan con los IDs
    if (mostrarFavoritos) {
      // Forzamos rest.id a número para que coincida perfecto con favoritosIds
      return favoritosIds.includes(Number(rest.id));
    }
    
    const coincideBusqueda = rest.nombre ? rest.nombre.toLowerCase().includes(busqueda.toLowerCase()) : true;
    
    // Ponemos todas las etiquetas en minúsculas para facilitar la comparación
    const etiquetasRestaurante = rest.etiquetas ? rest.etiquetas.toLowerCase() : "";

    const coincideTipo = tipoComida === "" || etiquetasRestaurante.includes(tipoComida.toLowerCase());
    const coincideAmbiente = ambiente === "" || etiquetasRestaurante.includes(ambiente.toLowerCase());
    const coincideServicio = servicio === "" || etiquetasRestaurante.includes(servicio.toLowerCase());

    return coincideBusqueda && coincideTipo && coincideAmbiente && coincideServicio;
  });

  return (
    <div className={styles['vista-principal']}>

      <header className={styles['header-principal']}>
        <div className={styles['rectangle-parent']}>
          <div className={styles['logo-blanco-parent']}>
            <img className={styles['logo-blanco']} alt="Logo" src="/images/logo_sp_blanco.png" />
            <div className={styles['catlogo-de-restaurantes']}>Restaurantes Chiapa de Corzo</div>
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
              <button className={styles['log-in-parent']} onClick={handleLogout}>
                <img src="/images/logout.png" alt="Cerrar sesión" />
                <span>Cerrar sesión</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className={styles['calles-con-encanto-scaled-parent']}>
          <img className={styles['calles-con-encanto-scaled-icon']} src="/images/fondo_inicio.png" />
          <div className={styles['contenido-superpuesto']}>
            <div className={styles['descubre-la-magia']}>Descubre la Magia Culinaria de <br />Chiapa de Corzo</div>
            <div className={styles['explora-los-mejores']}>Explora los mejores sabores de esta tierra</div>
            <div className={styles['barra-busqueda']}>
              <img className={styles['busqueda-icono']} src="/images/buscar.png" />
              <input type="text" placeholder="Buscar restaurantes" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
              <button className={styles['buscar']}>Buscar</button>
            </div>
          </div>

          <div className={`${styles['barra-filtros-horizontal']} ${styles['filtros-abajo']}`}>
            {/* Botón Exclusivo de Mis Favoritos (Solo para usuarios normales) */}
            {isLogged && localStorage.getItem("userRole") === "usuario" && (
              <button 
                className={mostrarFavoritos ? styles.btnFavoritosActivo : styles.btnFavoritosInactivo} 
                onClick={() => {
                  setMostrarFavoritos(!mostrarFavoritos);
                }}
              >
                ❤️ Mis Favoritos
              </button>
            )}
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
            <button className={styles['btn-filtrar']} onClick={() => { setBusqueda(""); setTipoComida(""); setAmbiente(""); setServicio(""); setMostrarFavoritos(false); }}>
              <img src="/images/borrar.png" className={styles['icono-boton']} /> Limpiar Filtros
            </button>
          </div>
        </section>

        <div className={styles['contenedor-restaurantes']}>
          {loading ? (
            // Contenedor centrado para "Cargando"
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh', width: '100%' }}>
              <p style={{ fontSize: '1.5rem', color: 'black', fontWeight: 'bold', textAlign: 'center' }}>
                Cargando restaurantes...
              </p>
            </div>
          ) : restaurantesFiltrados.length === 0 ? (
            // Contenedor centrado para "No se encontraron"
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh', width: '100%' }}>
              <p style={{ fontSize: '1.5rem', color: 'black', fontWeight: 'bold', textAlign: 'center' }}>
                No se encontraron restaurantes con estos filtros.
              </p>
            </div>
          ) : (
            restaurantesFiltrados.map((rest, index) => (
              <Link 
                key={rest.id || index} 
                href={`/vistaRestaurante?id=${rest.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className={styles['card-restaurante']} style={{ cursor: 'pointer' }}>
                  <img src={rest.imagen} alt={rest.nombre} className={styles['imagen-restaurante']} style={{ objectFit: 'cover' }} />
                  <h3>{rest.nombre}</h3>
                  <p>• {rest.etiqueta1}</p>
                  {rest.etiqueta2 && <p>• {rest.etiqueta2}</p>}
                  {rest.etiqueta3 && <p>• {rest.etiqueta3}</p>}
                </div>
              </Link>
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