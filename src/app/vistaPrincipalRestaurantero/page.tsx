"use client";

import Image from "next/image";
import styles from "./vistaRestaurantero.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VistaPrincipalRestaurantero() {
  const router = useRouter();

  const [busqueda, setBusqueda] = useState("");
  const [precio, setPrecio] = useState("");
  const [horario, setHorario] = useState("");
  const [tipo, setTipo] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  // BUSCAR RESTAURANTE
  const handleBuscar = () => {
    console.log("Buscando:", busqueda);
    // Aquí después conectarás con tu API
  };

  // FILTRAR RESTAURANTES
  const handleFiltrar = () => {
    const filtros = {
      precio,
      horario,
      tipo,
      ubicacion,
    };

    console.log("Filtros aplicados:", filtros);
    // Aquí después conectarás con tu API
  };

  // IR A MI RESTAURANTE
  const irMiRestaurante = () => {
    router.push("/vistaResturante"); // puedes cambiar esta ruta luego
  };

  // CERRAR SESIÓN
  const cerrarSesion = () => {
    console.log("Cerrando sesión...");
    router.push("/"); // regresa al index
  };

  return (
    <div className={styles.vistaPrincipal}>
      {/* HEADER */}
      <header className={styles.headerPrincipal}>
        <div className={styles.headerContainer}>
          <div className={styles.logoContainer}>
            <Image
              src="/images/logo_sp_blanco.png"
              alt="Logo Sazón Patrimonial"
              width={120}
              height={50}
            />
            <div>Restaurantes San Cristóbal</div>
          </div>

          <nav className={styles.accionesUsuario}>
            <button
              className={styles.botonHeader}
              onClick={irMiRestaurante}
            >
              <Image
                src="/images/miRestaurante.png"
                alt="Mi restaurante"
                width={20}
                height={20}
              />
              <span>Mi restaurante</span>
            </button>

            <button
              className={styles.botonHeader}
              onClick={cerrarSesion}
            >
              <Image
                src="/images/logout.png"
                alt="Cerrar sesión"
                width={20}
                height={20}
              />
              <span>Cerrar sesión</span>
            </button>
          </nav>

          <div>
            <Image
              src="/images/restaurantero.png"
              alt="Icono restaurantero"
              width={40}
              height={40}
            />
          </div>
        </div>
      </header>

      {/* HERO */}
      <main>
        <section className={styles.heroSection}>
          <Image
            src="/images/fondo_inicio.png"
            alt="Fondo principal"
            fill
            className={styles.heroImage}
          />

          <div className={styles.heroContenido}>
            <h1>
              Descubre la Magia Culinaria de <br />
              San Cristóbal
            </h1>

            <p>Explora los mejores sabores de esta tierra</p>

            {/* Barra búsqueda */}
            <div className={styles.barraBusqueda}>
              <Image
                src="/images/buscar.png"
                alt="Buscar"
                width={20}
                height={20}
              />

              <input
                type="text"
                placeholder="Buscar restaurantes"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              <button onClick={handleBuscar}>Buscar</button>
            </div>
          </div>

          {/* FILTROS */}
          <div className={styles.barraFiltros}>
            <select onChange={(e) => setPrecio(e.target.value)}>
              <option value="">Precio</option>
              <option value="bajo">Bajo</option>
              <option value="medio">Medio</option>
              <option value="alto">Alto</option>
            </select>

            <select onChange={(e) => setHorario(e.target.value)}>
              <option value="">Horario</option>
              <option value="manana">Mañana</option>
              <option value="tarde">Tarde</option>
              <option value="noche">Noche</option>
            </select>

            <select onChange={(e) => setTipo(e.target.value)}>
              <option value="">Tipo de comida</option>
              <option value="mexicana">Mexicana</option>
              <option value="cafe">Café</option>
              <option value="internacional">Internacional</option>
            </select>

            <select onChange={(e) => setUbicacion(e.target.value)}>
              <option value="">Ubicación</option>
              <option value="centro">Centro</option>
              <option value="norte">Norte</option>
              <option value="sur">Sur</option>
            </select>

            <button
              className={styles.btnFiltrar}
              onClick={handleFiltrar}
            >
              <Image
                src="/images/buscar_blanco.png"
                alt="Filtrar"
                width={20}
                height={20}
              />
              Filtrar
            </button>
          </div>
        </section>

        {/* CONTENIDO PRINCIPAL */}
        <div className={styles.contenidoPrincipal}>
          {/* Aquí después cargarás las cards dinámicas */}
        </div>
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div>
          <h4>Contáctanos</h4>
          <p>sazonpatrimonial@gmail.com</p>
          <p>+52 961 652 2093</p>
          <p>@sazonpatrimonial</p>
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
    </div>
  );
}
