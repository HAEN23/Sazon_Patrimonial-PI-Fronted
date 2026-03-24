"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Importamos Link para la navegación
import styles from "../page.module.css"; 

export default function VistaPrincipalRestaurantero() {
  const router = useRouter();

  const [busqueda, setBusqueda] = useState("");
  const [tipoComida, setTipoComida] = useState("");
  const [ambiente, setAmbiente] = useState("");
  const [servicio, setServicio] = useState("");

  const [restaurantes, setRestaurantes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarRestaurantes = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
        
        // Consultamos la ruta
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
            
            // LÓGICA DE ETIQUETAS ACTUALIZADA
            const etiquetasCompletas = rest.etiquetas || ""; 
            const etiquetasArr = etiquetasCompletas.split(',').map((e:string) => e.trim()).filter((e:string) => e !== "");

            return {
              id: rest.id || rest.id_restaurante,
              nombre: rest.name || rest.nombre || rest.restaurante || rest.nombre_propuesto_restaurante || "Restaurante sin nombre",
              etiquetas: etiquetasCompletas, // Para el filtrado interno
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

  // LÓGICA DE FILTRADO POR ETIQUETAS ACTUALIZADA
  const restaurantesFiltrados = restaurantes.filter((rest) => {
    const coincideBusqueda = rest.nombre ? rest.nombre.toLowerCase().includes(busqueda.toLowerCase()) : true;
    
    // Ponemos todas las etiquetas en minúsculas para facilitar la comparación
    const etiquetasRestaurante = rest.etiquetas ? rest.etiquetas.toLowerCase() : "";

    const coincideTipo = tipoComida === "" || etiquetasRestaurante.includes(tipoComida.toLowerCase());
    const coincideAmbiente = ambiente === "" || etiquetasRestaurante.includes(ambiente.toLowerCase());
    const coincideServicio = servicio === "" || etiquetasRestaurante.includes(servicio.toLowerCase());

    return coincideBusqueda && coincideTipo && coincideAmbiente && coincideServicio;
  });

  const irMiRestaurante = () => {
    router.push("/vistaEdicionRest");
  };

  const cerrarSesion = () => {
    // 1. Limpiamos TODA la memoria del navegador relacionada con la sesión
    localStorage.removeItem("userRole");
    localStorage.removeItem("token"); 
    localStorage.removeItem("user");
    localStorage.removeItem("sesionActiva");
    
    // 2. FORZAMOS la recarga para evitar el bug del doble clic
    window.location.href = "/";
  };

  return (
    <div className={styles["vista-principal"]}>

      <header className={styles["header-principal"]}>
        <div className={styles["rectangle-parent"]}>
          <div className={styles["logo-blanco-parent"]}>
            <img className={styles["logo-blanco"]} src="/images/logo_sp_blanco.png" alt="Logo" />
            <div className={styles["catlogo-de-restaurantes"]}>Restaurantes Chiapa de Corzo</div>
          </div>
          <nav className={styles["acciones-usuario"]}>
            <button className={styles["registro-usuario-parent"]} onClick={irMiRestaurante}>
              <img src="/images/miRestaurante.png" alt="Mi restaurante" /><span>Mi restaurante</span>
            </button>
            <button className={styles["log-in-parent"]} onClick={cerrarSesion}>
              <img src="/images/logout.png" alt="Cerrar sesión" /><span>Cerrar sesión</span>
            </button>
          </nav>
        </div>
      </header>

      <main>
        <section className={styles["calles-con-encanto-scaled-parent"]}>
          <img className={styles["calles-con-encanto-scaled-icon"]} src="/images/fondo_inicio.png" alt="" />
          <div className={styles["contenido-superpuesto"]}>
            <div className={styles["descubre-la-magia"]}>Descubre la Magia Culinaria de <br />Chiapa de Corzo</div>
            <div className={styles["explora-los-mejores"]}>Explora los mejores sabores de esta tierra</div>
            <div className={styles["barra-busqueda"]}>
              <img className={styles["busqueda-icono"]} src="/images/buscar.png" alt="" />
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
              // TARJETA ACTUALIZADA CON LINK Y ETIQUETAS
              <Link 
                key={rest.id || index} 
                href={`/vistaRestaurante?id=${rest.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className={styles['card-restaurante']} style={{ cursor: 'pointer' }}>
                  <img src={rest.imagen} alt={rest.nombre} className={styles['imagen-restaurante']} style={{ objectFit: 'cover' }} />
                  <h3>{rest.nombre}</h3>
                  <p style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>• {rest.etiqueta1}</p>
                  {rest.etiqueta2 && <p style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>• {rest.etiqueta2}</p>}
                  {rest.etiqueta3 && <p style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>• {rest.etiqueta3}</p>}
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

    </div>
  );
}