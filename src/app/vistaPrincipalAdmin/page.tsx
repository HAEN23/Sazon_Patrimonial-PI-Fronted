"use client";

import Image from "next/image";
import styles from "./VistaPrincipalAdmin.module.css";
import { useState, useEffect } from "react";

interface Solicitud {
  id_solicitud: number;
  restaurante: string;
  propietario: string;
  correo: string;
  telefono: string;
  direccion: string;
  horario: string;
  img_url?: string;
  pdf_url?: string;
}

export default function VistaPrincipalAdmin() {
  const [vistaActiva, setVistaActiva] = useState("usuarios");
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar solicitudes reales del backend
  const cargarSolicitudes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api'}/solicitudes/estado/Pendiente`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setSolicitudes(data.data);
      }
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
    }
  };

  useEffect(() => {
    if (vistaActiva === "usuarios") {
      cargarSolicitudes();
    }
  }, [vistaActiva]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleAceptar = async (id: number) => {
    if (!confirm("¿Estás seguro de APROBAR esta solicitud?\nEsto creará el restaurante visible para todos.")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api'}/solicitudes/${id}/aprobar`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        alert("✅ Restaurante aprobado y publicado exitosamente.");
        cargarSolicitudes(); // Recargar tabla
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Error de conexión al aprobar.");
    }
  };

  const handleRechazar = async (id: number) => {
    if (!confirm("¿Estás seguro de RECHAZAR esta solicitud?\nEl restaurantero será notificado.")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api'}/solicitudes/${id}/rechazar`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        alert("❌ Solicitud rechazada.");
        cargarSolicitudes(); // Recargar tabla
      }
    } catch (error) {
      alert("Error de conexión al rechazar.");
    }
  };

  return (
    <div className={styles.vistaPrincipal}>
      <header className={styles.headerPrincipal}>
        <div className={styles.headerContainer}>
          <div className={styles.logoContainer}>
            <Image src="/images/logo_sp_blanco.png" alt="Logo" width={120} height={50} />
            <div>Restaurantes San Cristóbal</div>
          </div>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <Image src="/images/logout.png" alt="Cerrar" width={20} height={20} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </header>

      <div className={styles.adminPanel}>
        <aside className={styles.sidebar}>
          <button className={`${styles.sidebarItem} ${vistaActiva === "restaurantes" ? styles.active : ""}`} onClick={() => setVistaActiva("restaurantes")}>
            <Image src="/images/restaurantes.png" alt="Restaurantes" width={20} height={20} />
            <span>Restaurantes</span>
          </button>
          <button className={`${styles.sidebarItem} ${vistaActiva === "usuarios" ? styles.active : ""}`} onClick={() => setVistaActiva("usuarios")}>
            <Image src="/images/usuarios.png" alt="Usuarios" width={20} height={20} />
            <span>Solicitudes</span>
          </button>
        </aside>

        <main className={styles.contenido}>
          {vistaActiva === "usuarios" && (
            <section>
              <h2 className={styles.tituloSeccion}>Revisión de Solicitudes</h2>
              <div className={styles.tablaContainer}>
                <table className={styles.tablaAdmin}>
                  <thead>
                    <tr>
                      <th>Restaurante</th>
                      <th>Propietario</th>
                      <th>Correo</th>
                      <th>Teléfono</th>
                      <th>Dirección</th>
                      <th>Horario</th>
                      <th>Imágenes</th>
                      <th>PDF</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solicitudes.length === 0 ? (
                      <tr><td colSpan={9} style={{textAlign:'center'}}>No hay solicitudes pendientes.</td></tr>
                    ) : (
                      solicitudes.map((sol) => (
                        <tr key={sol.id_solicitud}>
                          <td style={{fontWeight:'bold'}}>{sol.restaurante}</td>
                          <td>{sol.propietario}</td>
                          <td>{sol.correo}</td>
                          <td>{sol.telefono || '-'}</td>
                          <td>{sol.direccion || '-'}</td>
                          <td>{sol.horario}</td>
                          
                          <td style={{textAlign: 'center'}}>
                            {sol.img_url ? (
                              <a href={sol.img_url} target="_blank" className={styles.btnVerArchivo}>📷 Ver</a>
                            ) : <span className={styles.vacio}>-</span>}
                          </td>

                          <td style={{textAlign: 'center'}}>
                            {sol.pdf_url ? (
                              <a href={sol.pdf_url} target="_blank" className={styles.btnVerArchivo}>📄 PDF</a>
                            ) : <span className={styles.vacio}>-</span>}
                          </td>

                          <td>
                            <div className={styles.accionesGrid}>
                              <button className={styles.btnAceptar} onClick={() => handleAceptar(sol.id_solicitud)} title="Aprobar">✓</button>
                              <button className={styles.btnRechazar} onClick={() => handleRechazar(sol.id_solicitud)} title="Rechazar">✕</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          {vistaActiva === "restaurantes" && (
            <section>
              <h2 className={styles.tituloSeccion}>Restaurantes Activos</h2>
              <p>Aquí verás los restaurantes que ya aceptaste.</p>
            </section>
          )}
        </main>
      </div>
      <footer className={styles.footer}>
        <div className={styles.footerContactos}>
          <h4>Contáctanos</h4>
          <p>sazonpatrimonial@gmail.com</p>
        </div>
      </footer>
    </div>
  );
}