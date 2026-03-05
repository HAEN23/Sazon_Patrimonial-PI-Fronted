"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css"; // reutilizamos el CSS del index

export default function VistaPrincipalRestaurantero() {

  const router = useRouter();

  const [busqueda, setBusqueda] = useState("");
  const [precio, setPrecio] = useState("");
  const [horario, setHorario] = useState("");
  const [tipo, setTipo] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  const handleBuscar = () => {
    console.log("Buscando:", busqueda);
  };

  const handleFiltrar = () => {
    console.log({
      precio,
      horario,
      tipo,
      ubicacion
    });
  };

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

              <button
                className={styles["buscar"]}
                onClick={handleBuscar}
              >
                Buscar
              </button>

            </div>
          </div>

          {/* FILTROS */}
          <div className={`${styles["barra-filtros-horizontal"]} ${styles["filtros-abajo"]}`}>

            <div className={styles["filtro-item"]}>
            <img src="/images/menu.png" className={styles['icono-filtro']} />
              <select
                className={styles["filtro-select"]}
                onChange={(e) => setPrecio(e.target.value)}
              >
                <option value="">Precio</option>
                <option value="bajo">Bajo</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
              </select>
            </div>

            <div className={styles["filtro-item"]}>
            <img src="/images/menu.png" className={styles['icono-filtro']} />
              <select
                className={styles["filtro-select"]}
                onChange={(e) => setHorario(e.target.value)}
              >
                <option value="">Horario</option>
                <option value="manana">Mañana</option>
                <option value="tarde">Tarde</option>
                <option value="noche">Noche</option>
              </select>
            </div>

            <div className={styles["filtro-item"]}>
            <img src="/images/menu.png" className={styles['icono-filtro']} />
              <select
                className={styles["filtro-select"]}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="">Tipo de comida</option>
                <option value="mexicana">Mexicana</option>
                <option value="cafe">Café</option>
                <option value="internacional">Internacional</option>
              </select>
            </div>

            <div className={styles["filtro-item"]}>
            <img src="/images/menu.png" className={styles['icono-filtro']} />
              <select
                className={styles["filtro-select"]}
                onChange={(e) => setUbicacion(e.target.value)}
              >
                <option value="">Ubicación</option>
                <option value="centro">Centro</option>
                <option value="norte">Norte</option>
                <option value="sur">Sur</option>
              </select>
            </div>

            <button
              className={styles["btn-filtrar"]}
              onClick={handleFiltrar}
            >
              Limpiar filtros
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

    </div>
  );
}
