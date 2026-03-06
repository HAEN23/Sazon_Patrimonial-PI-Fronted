"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css"; // reutilizamos el CSS del index

export default function VistaPrincipalRestaurantero() {

  const router = useRouter();

  const [busqueda, setBusqueda] = useState("");
  const [tipoComida, setTipoComida] = useState("");
  const [ambiente, setAmbiente] = useState("");
  const [servicio, setServicio] = useState("");

  const restaurantes = [
    {
      nombre: "Taquería El Fogón",
      tipo: "Comida Rápida",
      ambiente: "Familiar",
      servicio: "Delivery",
      imagen: "/images/rest1.jpg"
    },
    {
      nombre: "La Terraza Gourmet",
      tipo: "Gourmet",
      ambiente: "Terraza",
      servicio: "WiFi Gratuito",
      imagen: "/images/rest2.jpg"
    },
    {
      nombre: "Veggie Chiapas",
      tipo: "Vegetariano",
      ambiente: "Pet Friendly",
      servicio: "WiFi Gratuito",
      imagen: "/images/rest3.jpg"
    },
    {
      nombre: "Comedor Doña Lupita",
      tipo: "Económico",
      ambiente: "Familiar",
      servicio: "Estacionamiento",
      imagen: "/images/rest4.jpg"
    }
  ];

  const restaurantesFiltrados = restaurantes.filter((rest) => {

    const coincideBusqueda =
      rest.nombre.toLowerCase().includes(busqueda.toLowerCase());

    const coincideTipo =
      tipoComida === "" || rest.tipo === tipoComida;

    const coincideAmbiente =
      ambiente === "" || rest.ambiente === ambiente;

    const coincideServicio =
      servicio === "" || rest.servicio === servicio;

    return coincideBusqueda && coincideTipo && coincideAmbiente && coincideServicio;
  });

  const irMiRestaurante = () => {
    router.push("/vistaEdicionRest");
  };

  const cerrarSesion = () => {
    localStorage.removeItem("userRole");
    router.push("/");
  };

  return (
    <div className={styles["vista-principal"]}>

      {/* HEADER */}
      <header className={styles["header-principal"]}>
        <div className={styles["rectangle-parent"]}>

          <div className={styles["logo-blanco-parent"]}>
            <img
              className={styles["logo-blanco"]}
              src="/images/logo_sp_blanco.png"
              alt="Logo"
            />

            <div className={styles["catlogo-de-restaurantes"]}>
              Restaurantes San Cristóbal
            </div>
          </div>

          <nav className={styles["acciones-usuario"]}>

            <button
              className={styles["registro-usuario-parent"]}
              onClick={irMiRestaurante}
            >
              <img
                src="/images/miRestaurante.png"
                alt="Mi restaurante"
              />
              <span>Mi restaurante</span>
            </button>

            <button
              className={styles["log-in-parent"]}
              onClick={cerrarSesion}
            >
              <img
                src="/images/logout.png"
                alt="Cerrar sesión"
              />
              <span>Cerrar sesión</span>
            </button>

          </nav>
        </div>
      </header>

      {/* HERO */}
      <main>
        <section className={styles["calles-con-encanto-scaled-parent"]}>

          <img
            className={styles["calles-con-encanto-scaled-icon"]}
            src="/images/fondo_inicio.png"
            alt=""
          />

          <div className={styles["contenido-superpuesto"]}>

            <div className={styles["descubre-la-magia"]}>
              Descubre la Magia Culinaria de <br />
              San Cristóbal
            </div>

            <div className={styles["explora-los-mejores"]}>
              Explora los mejores sabores de esta tierra
            </div>

            {/* BUSQUEDA */}
            <div className={styles["barra-busqueda"]}>

              <img
                className={styles["busqueda-icono"]}
                src="/images/buscar.png"
                alt=""
              />

              <input
                type="text"
                placeholder="Buscar restaurantes"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
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

              <select
                className={styles['filtro-select']}
                value={tipoComida}
                onChange={(e) => setTipoComida(e.target.value)}
              >
                <option value="">Tipo de comida</option>
                <option value="Comida Rápida">Comida Rápida</option>
                <option value="Gourmet">Gourmet</option>
                <option value="Vegetariano">Vegetariano</option>
                <option value="Económico">Económico</option>
              </select>
            </div>

            <div className={styles['filtro-item']}>
              <img src="/images/restaurante.png" className={styles['icono-filtro']} />

              <select
                className={styles['filtro-select']}
                value={ambiente}
                onChange={(e) => setAmbiente(e.target.value)}
              >
                <option value="">Ambiente</option>
                <option value="Familiar">Familiar</option>
                <option value="Pet Friendly">Pet Friendly</option>
                <option value="Terraza">Terraza</option>
              </select>
            </div>

            <div className={styles['filtro-item']}>
              <img src="/images/coctel.png" className={styles['icono-filtro']} />

              <select
                className={styles['filtro-select']}
                value={servicio}
                onChange={(e) => setServicio(e.target.value)}
              >
                <option value="">Servicios</option>
                <option value="Delivery">Delivery</option>
                <option value="WiFi Gratuito">WiFi Gratuito</option>
                <option value="Estacionamiento">Estacionamiento</option>
              </select>
            </div>

            <button
              className={styles['btn-filtrar']}
              onClick={() => {
                setBusqueda("");
                setTipoComida("");
                setAmbiente("");
                setServicio("");
              }}
            >
              <img src="/images/borrar.png" className={styles['icono-boton']} />
              Limpiar Filtros
            </button>

          </div>

        </section>

        <div className={styles['contenedor-restaurantes']}>

            {restaurantesFiltrados.length === 0 && (
              <p>No se encontraron restaurantes</p>
            )}

            {restaurantesFiltrados.map((rest, index) => (

              <div key={index} className={styles['card-restaurante']}>

                <img
                  src={rest.imagen}
                  alt={rest.nombre}
                  className={styles['imagen-restaurante']}
                />

                <h3>{rest.nombre}</h3>
                <p>{rest.tipo}</p>
                <p>{rest.ambiente}</p>
                <p>{rest.servicio}</p>

              </div>

            ))}

          </div>
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

    </div>
  );
}
