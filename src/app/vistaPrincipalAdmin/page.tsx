"use client";

import Image from "next/image";
import styles from "./VistaPrincipalAdmin.module.css";
import { useState, useEffect } from "react";

// 1. Interfaz modificada para que coincida con el backend
interface Solicitud {
  id_solicitud: number;
  restaurante: string;
  propietario: string;
  correo: string;
  telefono: string;
  direccion: string;
  horario: string;
  foto_portada?: string; 
  foto_2?: string;  
  foto_3?: string;  
  pdf_url?: string; 
}

export default function VistaPrincipalAdmin() {
  const [vistaActiva, setVistaActiva] = useState("usuarios");
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(false);
  
  // ESTADOS PARA LOS MODALES
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);
  const [pdfSeleccionado, setPdfSeleccionado] = useState<string | null>(null); // <-- NUEVO ESTADO PARA EL PDF

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

  // Función para abrir la Imagen en el Modal
  const handleAbrirImagen = (url: string | undefined, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); 
    if (!url || url.includes("simulada") || url.includes("link_de_cloudinary")) {
      alert("Esta es una imagen de prueba (simulada) o el enlace está vacío.");
      return;
    }
    setImagenSeleccionada(url); 
  };

  // NUEVA FUNCIÓN: Para abrir el PDF en el Modal
  const handleAbrirPdf = (url: string | undefined, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); 
    if (!url || url === "url-simulada-pdf.pdf" || url.includes("simulada") || url.includes("link_de_cloudinary")) {
      alert("Este es un archivo de prueba (simulado) o el enlace está vacío. El usuario no ha subido un archivo real todavía.");
      return;
    }
    setPdfSeleccionado(url); 
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
                          <td>
                             {sol.direccion ? (
                               <a href={sol.direccion} target="_blank" rel="noopener noreferrer" style={{color: '#912F2F', textDecoration: 'underline'}}>Ver Mapa</a>
                             ) : '-'}
                          </td>
                          <td>{sol.horario}</td>
                          
                          {/* COLUMNA DE IMÁGENES */}
                          <td style={{textAlign: 'center'}}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
                                {sol.foto_portada ? (
                                  <a href="#" className={styles.btnVerArchivo} onClick={(e) => handleAbrirImagen(sol.foto_portada, e)}>📷 Img 1</a>
                                ) : null}
                                
                                {sol.foto_2 ? (
                                  <a href="#" className={styles.btnVerArchivo} onClick={(e) => handleAbrirImagen(sol.foto_2, e)}>📷 Img 2</a>
                                ) : null}

                                {sol.foto_3 ? (
                                  <a href="#" className={styles.btnVerArchivo} onClick={(e) => handleAbrirImagen(sol.foto_3, e)}>📷 Img 3</a>
                                ) : null}

                                {!sol.foto_portada && !sol.foto_2 && !sol.foto_3 && <span className={styles.vacio}>-</span>}
                            </div>
                          </td>

                          {/* COLUMNA DE PDF ACTUALIZADA PARA ABRIR MODAL */}
                          <td style={{textAlign: 'center'}}>
                            {sol.pdf_url ? (
                              <a href="#" className={styles.btnVerArchivo} onClick={(e) => handleAbrirPdf(sol.pdf_url, e)}>📄 Ver Menú</a>
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

      {/* MODAL DE VISTA PREVIA DE IMAGEN */}
      {imagenSeleccionada && (
        <div 
          onClick={() => setImagenSeleccionada(null)} 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
            <button 
              onClick={() => setImagenSeleccionada(null)} 
              style={{
                position: 'absolute', top: '-40px', right: '0',
                background: 'none', border: 'none', color: 'white', fontSize: '35px', 
                cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              &times;
            </button>
            <img 
              src={imagenSeleccionada} 
              alt="Vista previa del restaurante" 
              style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }} 
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}

      {/* MODAL DE VISTA PREVIA DE PDF */}
      {pdfSeleccionado && (
        <div 
          onClick={() => setPdfSeleccionado(null)} 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}
        >
          {/* Contenedor blanco para darle forma al visor de PDF */}
          <div 
            style={{ 
              position: 'relative', width: '80%', height: '90%', 
              backgroundColor: '#fff', borderRadius: '8px', padding: '10px' 
            }}
            onClick={(e) => e.stopPropagation()} 
          >
            <button 
              onClick={() => setPdfSeleccionado(null)} 
              style={{
                position: 'absolute', top: '-40px', right: '0',
                background: 'none', border: 'none', color: 'white', fontSize: '35px', 
                cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              &times;
            </button>
            <iframe 
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfSeleccionado)}&embedded=true`}
              title="Vista previa del PDF"
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: '4px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}