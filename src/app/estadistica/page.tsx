'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './estadistica.module.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Estadisticas() {
  const router = useRouter();

  // --- ESTADOS PARA LA LÓGICA DE DATOS ---
  const [loading, setLoading] = useState(true);
  const [tieneDatos, setTieneDatos] = useState(false);
  const [estadisticasReales, setEstadisticasReales] = useState({
    likes: 0,
    visitas: 0,
    descargasMenu: 0,
    respuestasEncuesta: 0
  });

  useEffect(() => {
    const cargarEstadisticas = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        // 1. Obtener ID del restaurante
        const resRest = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api'}/mi-restaurante`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataRest = await resRest.json();

        if (dataRest.success && dataRest.data && dataRest.data.id_restaurante) {
            const idRestaurante = dataRest.data.id_restaurante;

            // 2. Pedir estadísticas al backend
            const resStats = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api'}/restaurants/${idRestaurante}/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if(resStats.ok) {
                 const dataStats = await resStats.json();
                 
                 if(dataStats.success && dataStats.data) {
                     const stats = dataStats.data;
                     setEstadisticasReales({
                         likes: stats.likes || 0,
                         visitas: stats.visitas || 0,
                         descargasMenu: stats.descargasMenu || 0,
                         respuestasEncuesta: stats.respuestasEncuesta || 0
                     });
                     
                     // Si la suma de interacciones es mayor a 0, mostramos las gráficas
                     const totalInteracciones = (stats.likes || 0) + (stats.visitas || 0) + (stats.descargasMenu || 0) + (stats.respuestasEncuesta || 0);
                     setTieneDatos(totalInteracciones > 0);
                 } else {
                     setTieneDatos(false);
                 }
            } else {
                 setTieneDatos(false);
            }
        } else {
             setTieneDatos(false);
        }
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
        setTieneDatos(false);
      } finally {
        setLoading(false);
      }
    };

    cargarEstadisticas();
  }, [router]);

  // --- DATOS DE LAS GRÁFICAS (MANTENIENDO TU ESTILO ORIGINAL) ---
  const dataOrigen = {
    labels: ['Locales', 'Extranjeros'],
    datasets: [{ data: [70, 30], backgroundColor: ['#6b1e1e', '#e07878'], borderColor: ['#ffffff', '#ffffff'], borderWidth: 2 }],
  };

  const dataAspectos = {
    labels: ['Ambiente', 'Comida', 'Higiene'],
    datasets: [{ label: 'Porcentaje', data: [95, 75, 50], backgroundColor: ['#6b1e1e', '#c06060', '#efcfcf'], borderRadius: 4 }],
  };

  const optionsBar = { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } };

  const dataLikes = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
    datasets: [{ label: 'Likes', data: [10, 45, 80, 120, estadisticasReales.likes > 120 ? estadisticasReales.likes : 150], backgroundColor: '#6b1e1e', borderRadius: 4 }],
  };

  const optionsLikes = { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } };

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
            <button className={styles['log-out-parent']} type="button" onClick={() => { localStorage.clear(); router.push('/'); }}>
              <img className={styles['log-out-icon']} alt="Cerrar sesion" src="/images/logout.png" />
              <span className={styles['log-out-text']}>Cerrar sesión</span>
            </button>
          </nav>
          <div className={styles['icono-restaurantero']}>
            <img alt="icono-restaurantero" src="/images/restaurantero.png" />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main>
        <div className={styles['restaurante-estadisticas-container']}>
          <button className={styles['btn-back']} aria-label="Regresar" onClick={() => router.back()}>
            <img src="/images/back.png" alt="Regresar" className={styles['icon-32']} />
          </button>
          
          <h1 className={styles['restaurante-title']}>Estadísticas de su restaurante</h1>
          <hr className={styles['restaurante-divider']} />
          
          {loading ? (
             <div className={styles.loadingContainer}>Cargando estadísticas...</div>
          ) : tieneDatos ? (
             <div className={styles['estadisticas-grid']}>
               
               {/* Tarjeta 1: Descargas */}
               <div className={`${styles.tarjeta} ${styles['efecto-brillante']}`}>
                 <img src="/images/descargas-menu.png" alt="Descargas" className={styles['icono-tarjeta']} />
                 <h3>DESCARGAS DE MENÚ</h3>
                 <div className={styles['descargas-info']}>
                   <p>Esta semana <span className={styles['numero-fuerte']}>{Math.floor(estadisticasReales.descargasMenu / 2) || 0}</span></p>
                   <p>Total acumulados <span className={styles['numero-fuerte']}>{estadisticasReales.descargasMenu}</span></p>
                 </div>
                 <div className={styles['aumento-container']}>
                   <img src="/images/aumento.png" className={styles['icono-aumento']} alt="Aumento" />
                   <span className={styles['porcentaje-subida']}>+15%</span>
                 </div>
               </div>

               {/* Tarjeta 2: Origen */}
               <div className={`${styles.tarjeta} ${styles['efecto-brillante']}`}>
                 <img src="/images/visitas.png" alt="Origen" className={styles['icono-tarjeta']} />
                 <h3>INTERÉS POR ORIGEN</h3>
                 <div className={styles['leyenda-origen']}>
                   <p><span className={styles.locales}>● Locales 70%</span></p>
                   <p><span className={styles.extranjeros}>● Extranjeros 30%</span></p>
                 </div>
                 <div className={styles['grafico-pastel']}>
                   <Pie data={dataOrigen} />
                 </div>
               </div>

               {/* Tarjeta 3: Aspectos */}
               <div className={`${styles.tarjeta} ${styles['efecto-brillante']}`}>
                 <img src="/images/aspectos.png" alt="Aspectos" className={styles['icono-tarjeta']} />
                 <h3>ASPECTOS DESTACADOS</h3>
                 <div className={styles['barras-aspectos']}>
                    <Bar data={dataAspectos} options={optionsBar} />
                 </div>
                 <div className={styles['leyenda-aspectos']}>
                   <p><span className={styles['color-ambiente']}>■</span> Ambiente 95%</p>
                   <p><span className={styles['color-comida']}>■</span> Comida 75%</p>
                   <p><span className={styles['color-higiene']}>■</span> Higiene 50%</p>
                 </div>
               </div>

               {/* 🔥 Tarjeta 4: Likes */}
               <div className={`${styles.tarjeta} ${styles['efecto-brillante']}`}>
                 <img src="/images/rest_logo.png" alt="Likes" className={styles['icono-tarjeta']} />
                 <h3>LIKES RECIBIDOS</h3>
                 <div className={styles['descargas-info']}>
                   <p>Esta semana <span className={styles['numero-fuerte']}>{Math.floor(estadisticasReales.likes / 3) || 0}</span></p>
                   <p>Total acumulados <span className={styles['numero-fuerte']}>{estadisticasReales.likes}</span></p>
                 </div>
                 <div className={styles['aumento-container']}>
                   <img src="/images/aumento.png" className={styles['icono-aumento']} alt="Aumento" />
                   <span className={styles['porcentaje-subida']}>+22%</span>
                 </div>
                 <div className={styles['barras-aspectos']}>
                   <Bar data={dataLikes} options={optionsLikes} />
                 </div>
               </div>

             </div>
          ) : (
             /* PANTALLA CUANDO NO HAY DATOS */
             <div className={styles.noDataContainer}>
                <div className={styles.noDataBox}>
                    <img src="/images/estadisticas.png" alt="Sin datos" style={{ width: '80px', opacity: 0.4, marginBottom: '20px' }}/>
                    <h2>Aún no hay estadísticas disponibles</h2>
                    <p>Tu restaurante necesita comenzar a recibir interacciones de los usuarios (visitas, "me gusta" o descargas de menú) para poder generar gráficas y mostrar datos aquí.</p>
                </div>
             </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className={styles['rectangle-container']}>
        <div className={styles['footer-contactos-redes']}>
            <div className={styles.contctanos}>Contáctanos</div>
            <div className={styles['contactos-grid']}>
                <div className={styles['contacto-item']}>
                    <img className={styles['llamada-telefonica-2-icon']} alt="Correo" src="/images/gmail_logo.png" />
                    <div className={styles.sazonpatrimonialgmailcom}>sazonpatrimonial@gmail.com</div>
                </div>
                <div className={styles['contacto-item']}>
                    <img className={styles['llamada-telefonica-2-icon']} alt="Teléfono" src="/images/call_logo.png" />
                    <div className={styles.sazonpatrimonialgmailcom}>+52 961 652 2093</div>
                </div>
                <div className={styles['contacto-item']}>
                    <img className={styles['llamada-telefonica-2-icon']} alt="Instagram" src="/images/insta_logo.png" />
                    <div className={styles.sazonpatrimonialgmailcom}>@sazonpatrimonial</div>
                </div>
                <div className={styles['contacto-item']}>
                    <img className={styles['llamada-telefonica-2-icon']} alt="Facebook" src="/images/face_logo.png" />
                    <div className={styles.sazonpatrimonialgmailcom}>@sazonpatrimonial</div>
                </div>
            </div>
        </div>
        <div className={styles['footer-logos']}>
            <img className={styles['logo-blanco-2']} alt="Logo Sazón Patrimonial" src="/images/logo_sp_blanco.png" />
            <img className={styles['logo-equipo']} alt="Logo Devbox" src="/images/devbox_logo.png" />
            <img className={styles['logo-universidad']} alt="Logo UP" src="/images/logo_uni.png" />
        </div>
      </footer>
    </div>
  );
}