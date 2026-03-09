'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './estadistica.module.css';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function EstadisticasPage() {
  const router = useRouter();
  const [estadisticasReales, setEstadisticasReales] = useState({
    likes: 0,
    descargasMenu: 0,
    respuestasEncuesta: 0,
    statsAspectos: [0, 0, 0, 0, 0],
    statsRecomendacion: [0, 0, 0, 0, 0]
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);
        const idRestaurante = user.id_restaurante || user.id;

        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

        const res = await fetch(`${apiUrl}/restaurants/${idRestaurante}/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setEstadisticasReales(data.data);
        }
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      }
    };
    fetchStats();
  }, []);

  const opcionesGeneral = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
  };

  const opcionesAspectos = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, max: 100, ticks: { precision: 0 } } } // Max 100 para porcentajes
  };

  const configLikes = {
    labels: ['Total'],
    datasets: [{ label: 'Likes', data: [estadisticasReales.likes], backgroundColor: '#6b1e1e', borderRadius: 4 }],
  };

  const configDescargas = {
    labels: ['Total'],
    datasets: [{ label: 'Descargas', data: [estadisticasReales.descargasMenu], backgroundColor: '#e69b35', borderRadius: 4 }],
  };

  const configAspectos = {
    labels: ['Ambiente', 'Comida', 'Higiene'],
    datasets: [{ 
      label: 'Porcentaje', 
      data: [95, 75, 50], // Valores de diseño (se pueden conectar a BD después)
      backgroundColor: ['#6b1e1e', '#c06060', '#efcfcf'], // Degradado de rojos como en la imagen
      borderRadius: 4 
    }],
  };

  const configRecomendacion = {
    labels: ['Def. Sí', 'Prob. Sí', 'No sé', 'Prob. No', 'Def. No'],
    datasets: [{ label: 'Votos', data: estadisticasReales.statsRecomendacion, backgroundColor: '#6b1e1e', borderRadius: 4 }],
  };

  // 🔥 GRÁFICO CIRCULAR PARA ORIGEN (Diseño de la imagen)
  const configOrigen = {
    labels: ['Locales', 'Extranjeros'],
    datasets: [{
      data: [70, 30], // Diseño de muestra (se puede conectar a BD después)
      backgroundColor: ['#6b1e1e', '#e07878'],
      borderColor: ['#ffffff', '#ffffff'],
      borderWidth: 2
    }],
  };

  const opcionesPie = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };

  // Verificar si hay estadísticas disponibles
  const hayEstadisticas = estadisticasReales.likes > 0 || 
                          estadisticasReales.descargasMenu > 0 || 
                          estadisticasReales.respuestasEncuesta > 0;

  return (
    <div className={styles.contenedor}>
      {/* Botón de regreso en la esquina superior izquierda */}
      <button className={styles.btnBack} onClick={() => router.push('/vistaEdicionRest')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>

      {/* Título principal con línea */}
      <div className={styles.headerTitulo}>
        <h1 className={styles.titulo}>Estadísticas de su restaurante</h1>
        <div className={styles.lineaSeparadora}></div>
      </div>

      {/* Mostrar mensaje vacío si no hay estadísticas */}
      {!hayEstadisticas ? (
        <div className={styles.estadisticasVacias}>
          <h2>Aún no hay estadísticas disponibles</h2>
          <p>
            Tu restaurante necesita comenzar a recibir interacciones de los usuarios 
            (visitas, "me gusta" o descargas de menú) para poder generar gráficas y 
            mostrar datos aquí.
          </p>
        </div>
      ) : (
        /* Grid de tarjetas con gráficas */
        <div className={styles.gridTarjetas}>
        
        {/* Tarjeta 1: ASPECTOS DESTACADOS (GRÁFICO DE BARRAS) */}
        <div className={`${styles.tarjeta} ${styles['efecto-brillante']}`}>
          <img src="/images/aspectos.png" alt="Aspectos" className={styles['icono-tarjeta']} />
          <h3>ASPECTOS DESTACADOS</h3>
          <div className={styles['barras-aspectos']}>
            <Bar data={configAspectos} options={opcionesAspectos} />
          </div>
          <div className={styles['leyenda-aspectos']}>
            <p><span className={styles['color-ambiente']}>■</span> Ambiente 95%</p>
            <p><span className={styles['color-comida']}>■</span> Comida 75%</p>
            <p><span className={styles['color-higiene']}>■</span> Higiene 50%</p>
          </div>
        </div>

        {/* Tarjeta 2: DESCARGAS (SIN GRÁFICO - Diseño de la imagen) */}
        <div className={`${styles.tarjeta} ${styles['efecto-brillante']}`}>
          <img src="/images/descargas-menu.png" alt="Descargas" className={styles['icono-tarjeta']} />
          <h3>DESCARGAS DE MENÚ</h3>
          <div className={styles['descargas-info']}>
            <p>Esta semana <span className={styles['numero-fuerte']}>{Math.floor(estadisticasReales.descargasMenu / 2) || 87}</span></p>
            <p>Total acumulados <span className={styles['numero-fuerte']}>{estadisticasReales.descargasMenu || 1450}</span></p>
          </div>
          <div className={styles['aumento-container']}>
            <img src="/images/aumento.png" className={styles['icono-aumento']} alt="Aumento" />
            <span className={styles['porcentaje-subida']}>+15%</span>
          </div>
        </div>

        {/* Tarjeta 3: ORIGEN (GRÁFICO CIRCULAR - Diseño de la imagen) */}
        <div className={`${styles.tarjeta} ${styles['efecto-brillante']}`}>
          <img src="/images/visitas.png" alt="Origen" className={styles['icono-tarjeta']} />
          <h3>INTERÉS POR ORIGEN</h3>
          <div className={styles['leyenda-origen']}>
            <p><span className={styles.locales}>● Locales 70%</span></p>
            <p><span className={styles.extranjeros}>● Extranjeros 30%</span></p>
          </div>
          <div className={styles['grafico-pastel']}>
            <Pie data={configOrigen} options={opcionesPie} />
          </div>
        </div>

        {/* Tarjeta 4: LIKES - CENTRADO EN SEGUNDA FILA */}
        <div className={`${styles.tarjeta} ${styles['efecto-brillante']} ${styles.tarjetaCentrada}`}>
          <img src="/images/rest_logo.png" alt="Likes" className={styles['icono-tarjeta']} />
          <h3>LIKES RECIBIDOS</h3>
          <div className={styles['descargas-info']}>
            <p>Total acumulados <span className={styles['numero-fuerte']}>{estadisticasReales.likes}</span></p>
          </div>
          {/* 🔥 AQUÍ RESTAURÉ EL ICONO "EN VIVO" QUE DABA EL ESPACIADO CORRECTO */}
          <div className={styles['aumento-container']}>
            <img src="/images/aumento.png" className={styles['icono-aumento']} alt="Aumento" />
            <span className={styles['porcentaje-subida']}>En vivo</span>
          </div>
          <div className={styles['barras-aspectos']}>
            <Bar data={configLikes} options={opcionesGeneral} />
          </div>
        </div>

      </div>
      )}
    </div>
  );
}