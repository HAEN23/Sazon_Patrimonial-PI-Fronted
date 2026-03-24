'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './estadistica.module.css';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function EstadisticasPage() {
  const router = useRouter();
  const [estadisticasReales, setEstadisticasReales] = useState({
    likes: 0,
    descargasMenu: 0,
    respuestasEncuesta: 0,
    statsAspectos: [0, 0, 0, 0, 0, 0],
    votosAspectos: [0, 0, 0, 0, 0, 0], 
    statsOrigen: [0, 0],
    votosOrigen: [0, 0],
    votosPlatillos: [0, 0, 0, 0, 0],
    votosMejoras: [0, 0, 0, 0, 0]
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

        const resMiRest = await fetch(`${apiUrl}/mi-restaurante`, { headers: { 'Authorization': `Bearer ${token}` }});
        const dataMiRest = await resMiRest.json();
        const idRestauranteReal = dataMiRest.data?.id_restaurante;

        if (!idRestauranteReal) return;

        const res = await fetch(`${apiUrl}/restaurants/${idRestauranteReal}/stats`, { headers: { 'Authorization': `Bearer ${token}` }});
        const data = await res.json();
        
        if (data.success) {
          setEstadisticasReales({
             ...estadisticasReales,
             ...data.data,
             votosPlatillos: data.data.votosPlatillos || [0,0,0,0,0],
             votosMejoras: data.data.votosMejoras || [0,0,0,0,0]
          });
        }
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      }
    };
    fetchStats();
  }, []);

  // Configuraciones comunes
  const opcionesGeneral = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
  };

  const opcionesTooltip = (datos: number[], suffix: string) => ({
    responsive: true, maintainAspectRatio: false, plugins: { 
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx: any) => ` ${datos[ctx.dataIndex] || 0} ${suffix}` } }
    },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
  });

  // Gráficas existentes
  const configLikes = { labels: ['Total'], datasets: [{ label: 'Likes', data: [estadisticasReales.likes], backgroundColor: '#6b1e1e', borderRadius: 4 }] };
  const configDescargas = { labels: ['Total'], datasets: [{ label: 'Descargas', data: [estadisticasReales.descargasMenu], backgroundColor: '#e69b35', borderRadius: 4 }] };
  const configAspectos = {
    labels: ['Comida', 'Ubicación', 'Recomend.', 'Horario', 'Vista', 'Limpieza'],
    datasets: [{ data: estadisticasReales.statsAspectos, backgroundColor: ['#6b1e1e', '#a83232', '#d65c5c', '#e88e8e', '#f5c6c6', '#f2dfdf'], borderRadius: 4 }],
  };

  const totalOrigen = (estadisticasReales.statsOrigen?.[0] || 0) + (estadisticasReales.statsOrigen?.[1] || 0);
  const pctLocales = totalOrigen > 0 ? Math.round(((estadisticasReales.statsOrigen?.[0] || 0) / totalOrigen) * 100) : 0;
  const pctExtranjeros = totalOrigen > 0 ? (100 - pctLocales) : 0;

  const configOrigen = {
    labels: ['Locales', 'Extranjeros'],
    datasets: [{
      data: totalOrigen > 0 ? [pctLocales, pctExtranjeros] : [100, 0], 
      backgroundColor: totalOrigen > 0 ? ['#6b1e1e', '#e07878'] : ['#e0e0e0', '#e0e0e0'],
      borderWidth: 0
    }],
  };

  // NUEVAS GRÁFICAS
  const configPlatillos = {
    labels: ['Tostadas', 'Garnachas', 'Empanadas', 'Gorditas', 'Pozol'],
    datasets: [{ data: estadisticasReales.votosPlatillos, backgroundColor: '#c85a5a', borderRadius: 4 }],
  };

  const configMejoras = {
    labels: ['Limpieza', 'Tiempo', 'Comida', 'Etiquetas', 'Atención'],
    datasets: [{ data: estadisticasReales.votosMejoras, backgroundColor: ['#5c1a1a', '#8f2929', '#c23b3b', '#e66565', '#f29b9b'], borderWidth: 0 }],
  };

  const hayEstadisticas = estadisticasReales.likes > 0 || estadisticasReales.descargasMenu > 0 || estadisticasReales.respuestasEncuesta > 0;

  return (
    <div className={styles.contenedor}>
      <button className={styles.btnBack} onClick={() => router.push('/vistaEdicionRest')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>

      <div className={styles.headerTitulo}>
        <h1 className={styles.titulo}>Estadísticas de su restaurante</h1>
        <div className={styles.lineaSeparadora}></div>
      </div>

      {!hayEstadisticas ? (
        <div className={styles.estadisticasVacias}>
          <h2>Aún no hay estadísticas disponibles</h2>
        </div>
      ) : (
        <div className={styles.gridTarjetas}>
        
        {/* TARJETAS ORIGINALES (Aspectos y Origen) */}
        <div className={`${styles.tarjeta} ${styles['efecto-brillante']}`}>
          <img src="/images/aspectos.png" alt="Aspectos" className={styles['icono-tarjeta']} />
          <h3>ASPECTOS DESTACADOS</h3>
          <div className={styles['barras-aspectos']}><Bar data={configAspectos} options={{...opcionesTooltip(estadisticasReales.votosAspectos, 'votos'), scales: { y: { max: 100 }}}} /></div>
        </div>

        <div className={`${styles.tarjeta} ${styles['efecto-brillante']}`}>
          <img src="/images/visitas.png" alt="Origen" className={styles['icono-tarjeta']} />
          <h3>INTERÉS POR ORIGEN</h3>
          <div className={styles['grafico-pastel']}><Pie data={configOrigen} /></div>
        </div>

        {/* TARJETAS RESTAURADAS (Likes y Descargas de menú) */}
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

        {/* NUEVAS TARJETAS (Platillos y Mejoras) */}
        <div className={`${styles.tarjeta} ${styles['efecto-brillante']}`}>
          <img src="/images/coctel.png" alt="Platillos" className={styles['icono-tarjeta']} />
          <h3 style={{fontSize: '12px'}}>PLATILLOS/BEBIDAS FAVORITAS</h3>
          <div className={styles['barras-aspectos']}>
            <Bar data={configPlatillos} options={opcionesTooltip(estadisticasReales.votosPlatillos, 'votos')} />
          </div>
        </div>

        <div className={`${styles.tarjeta} ${styles['efecto-brillante']}`}>
          <img src="/images/estadisticas.png" alt="Mejoras" className={styles['icono-tarjeta']} />
          <h3 style={{fontSize: '12px'}}>ÁREAS DE OPORTUNIDAD</h3>
          <div className={styles['grafico-pastel']}>
            <Pie data={configMejoras} />
          </div>
        </div>

      </div>
      )}
    </div>
  );
}