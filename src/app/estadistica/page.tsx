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
    // AHORA SON 6 CEROS (Agregamos espacio para limpieza)
    statsAspectos: [0, 0, 0, 0, 0, 0],
    votosAspectos: [0, 0, 0, 0, 0, 0], 
    statsOrigen: [0, 0],
    votosOrigen: [0, 0],
    statsRecomendacion: [0, 0, 0, 0, 0]
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

        const resMiRest = await fetch(`${apiUrl}/mi-restaurante`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dataMiRest = await resMiRest.json();

        const idRestauranteReal = dataMiRest.data?.id_restaurante;

        if (!idRestauranteReal) {
           console.log("No se encontró el ID real del restaurante.");
           return; 
        }

        const res = await fetch(`${apiUrl}/restaurants/${idRestauranteReal}/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
          setEstadisticasReales({
             ...data.data,
             // Aseguramos que si el backend manda 5, rellenamos con un 6to (hasta que actualices el backend)
             votosAspectos: data.data.votosAspectos?.length === 6 ? data.data.votosAspectos : [...(data.data.votosAspectos || [0,0,0,0,0]), 0],
             statsAspectos: data.data.statsAspectos?.length === 6 ? data.data.statsAspectos : [...(data.data.statsAspectos || [0,0,0,0,0]), 0]
          });
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
    plugins: { 
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const index = context.dataIndex;
            const votos = estadisticasReales.votosAspectos[index] || 0;
            return ` ${votos} persona${votos === 1 ? '' : 's'} eligieron esto`;
          }
        }
      }
    },
    scales: { y: { beginAtZero: true, max: 100, ticks: { precision: 0 } } }
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
    // AGREGAMOS 'Limpieza' al final
    labels: ['Comida', 'Ubicación', 'Recomend.', 'Horario', 'Vista', 'Limpieza'],
    datasets: [{ 
      label: 'Porcentaje', 
      data: estadisticasReales.statsAspectos, 
      // AGREGAMOS UN SEXTO COLOR ('#f2dfdf') para la nueva barra
      backgroundColor: ['#6b1e1e', '#a83232', '#d65c5c', '#e88e8e', '#f5c6c6', '#f2dfdf'], 
      borderRadius: 4 
    }],
  };

  const configRecomendacion = {
    labels: ['Def. Sí', 'Prob. Sí', 'No sé', 'Prob. No', 'Def. No'],
    datasets: [{ label: 'Votos', data: estadisticasReales.statsRecomendacion, backgroundColor: '#6b1e1e', borderRadius: 4 }],
  };

  const localesVal = estadisticasReales.statsOrigen?.[0] || 0;
  const extranjerosVal = estadisticasReales.statsOrigen?.[1] || 0;
  const totalOrigen = localesVal + extranjerosVal;
  
  const pctLocales = totalOrigen > 0 ? Math.round((localesVal / totalOrigen) * 100) : 0;
  const pctExtranjeros = totalOrigen > 0 ? (100 - pctLocales) : 0;

  const configOrigen = {
    labels: ['Locales', 'Extranjeros'],
    datasets: [{
      data: totalOrigen > 0 ? [pctLocales, pctExtranjeros] : [100, 0], 
      backgroundColor: totalOrigen > 0 ? ['#6b1e1e', '#e07878'] : ['#e0e0e0', '#e0e0e0'],
      borderColor: ['#ffffff', '#ffffff'],
      borderWidth: (pctLocales === 0 || pctExtranjeros === 0) ? 0 : 2
    }],
  };

  const opcionesPie = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            if (totalOrigen === 0) return " Sin datos aún";
            const index = context.dataIndex;
            const votos = estadisticasReales.votosOrigen[index] || 0;
            return ` ${votos} visitante${votos === 1 ? '' : 's'}`;
          }
        }
      }
    }
  };

  const hayEstadisticas = estadisticasReales.likes > 0 || 
                          estadisticasReales.descargasMenu > 0 || 
                          estadisticasReales.respuestasEncuesta > 0;

  return (
    <div className={styles.contenedor}>
      <button className={styles.btnBack} onClick={() => router.push('/vistaEdicionRest')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>

      <div className={styles.headerTitulo}>
        <h1 className={styles.titulo}>Estadísticas de su restaurante</h1>
        <div className={styles.lineaSeparadora}></div>
      </div>

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
        <div className={styles.gridTarjetas}>
        
        {/* Tarjeta 1: ASPECTOS DESTACADOS */}
        <div className={`${styles.tarjeta} ${styles['efecto-brillante']}`}>
          <img src="/images/aspectos.png" alt="Aspectos" className={styles['icono-tarjeta']} />
          <h3>ASPECTOS DESTACADOS</h3>
          <div className={styles['barras-aspectos']}>
            <Bar data={configAspectos} options={opcionesAspectos} />
          </div>
          <div className={styles['leyenda-aspectos']}>
            <p><span style={{color: '#6b1e1e'}}>■</span> Comida {estadisticasReales.statsAspectos?.[0] || 0}%</p>
            <p><span style={{color: '#a83232'}}>■</span> Ubicación {estadisticasReales.statsAspectos?.[1] || 0}%</p>
            <p><span style={{color: '#d65c5c'}}>■</span> Recomendación {estadisticasReales.statsAspectos?.[2] || 0}%</p>
            <p><span style={{color: '#e88e8e'}}>■</span> Horario {estadisticasReales.statsAspectos?.[3] || 0}%</p>
            <p><span style={{color: '#f5c6c6'}}>■</span> Vista {estadisticasReales.statsAspectos?.[4] || 0}%</p>
            {/* AGREGAMOS LA LEYENDA PARA LIMPIEZA */}
            <p><span style={{color: '#f2dfdf'}}>■</span> Limpieza {estadisticasReales.statsAspectos?.[5] || 0}%</p>
          </div>
        </div>

        {/* Tarjeta 2: DESCARGAS */}
        <div className={`${styles.tarjeta} ${styles['efecto-brillante']}`}>
          <img src="/images/descargas-menu.png" alt="Descargas" className={styles['icono-tarjeta']} />
          <h3>DESCARGAS DE MENÚ</h3>
          <div className={styles['descargas-info']}>
            <p>Esta semana <span className={styles['numero-fuerte']}>{estadisticasReales.descargasMenu}</span></p>
            <p>Total acumulados <span className={styles['numero-fuerte']}>{estadisticasReales.descargasMenu}</span></p>
          </div>
          <div className={styles['aumento-container']}>
            <img src="/images/aumento.png" className={styles['icono-aumento']} alt="Aumento" />
            <span className={styles['porcentaje-subida']}>En vivo</span>
          </div>
        </div>

        {/* Tarjeta 3: ORIGEN */}
        <div className={`${styles.tarjeta} ${styles['efecto-brillante']}`}>
          <img src="/images/visitas.png" alt="Origen" className={styles['icono-tarjeta']} />
          <h3>INTERÉS POR ORIGEN</h3>
          <div className={styles['leyenda-origen']}>
            <p><span className={styles.locales}>● Locales {pctLocales}%</span></p>
            <p><span className={styles.extranjeros}>● Extranjeros {pctExtranjeros}%</span></p>
          </div>
          <div className={styles['grafico-pastel']}>
            <Pie data={configOrigen} options={opcionesPie} />
          </div>
        </div>

        {/* Tarjeta 4: LIKES */}
        <div className={`${styles.tarjeta} ${styles['efecto-brillante']} ${styles.tarjetaCentrada}`}>
          <img src="/images/rest_logo.png" alt="Likes" className={styles['icono-tarjeta']} />
          <h3>LIKES RECIBIDOS</h3>
          <div className={styles['descargas-info']}>
            <p>Total acumulados <span className={styles['numero-fuerte']}>{estadisticasReales.likes}</span></p>
          </div>
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