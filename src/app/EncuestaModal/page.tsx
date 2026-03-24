'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './EncuestaModal.module.css';

function EncuestaForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const [atraccion, setAtraccion] = useState('');
  const [origen, setOrigen] = useState('');
  
  // NUEVOS ESTADOS
  const [platillos, setPlatillos] = useState<string[]>([]);
  const [mejora, setMejora] = useState('');
  
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    const idFromUrl = searchParams.get('restauranteId');
    if (idFromUrl) {
      setRestaurantId(idFromUrl);
    } else {
      const idFromStorage = localStorage.getItem('restauranteActivoId');
      setRestaurantId(idFromStorage || '1');
    }
  }, [searchParams]);

  // Manejar el límite de 2 platillos
  const handlePlatilloChange = (platillo: string) => {
    if (platillos.includes(platillo)) {
      setPlatillos(platillos.filter(p => p !== platillo)); // Desmarcar
    } else {
      if (platillos.length < 2) {
        setPlatillos([...platillos, platillo]); // Marcar
      } else {
        alert("Solo puedes seleccionar un máximo de 2 opciones.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!atraccion || !origen || platillos.length === 0 || !mejora) {
      alert("Por favor responde todas las preguntas");
      return;
    }

    if (!restaurantId) return;

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

      // ENVIAMOS LAS 4 RESPUESTAS
      const response = await fetch(`${apiUrl}/restaurants/${restaurantId}/survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          atraccion, 
          origen, 
          platillos: platillos.join(','), // Convertimos array a "Tostadas,Pozol"
          mejora 
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Gracias por tu respuesta! Encuesta guardada.");
        router.push(`/vistaRestaurante?id=${restaurantId}`); 
      } else {
        alert("Error: " + (data.error || data.message));
      }
    } catch (error) {
      console.error("Error enviando encuesta:", error);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <img src="/images/logo_sp_rojo.png" className={styles.logo} width="100" alt="Logo Sazón Patrimonial" style={{ display: "block", margin: "0 auto 20px" }} />
      
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        
        {/* PREGUNTA 1: MEJORAS */}
        <h2 className={styles.titulo} style={{ textAlign: "center", fontSize: '20px', fontWeight: 'bold' }}>¿Qué aspecto puede mejorar el establecimiento?</h2>
        <div className={styles['select-container']} style={{ marginBottom: "20px" }}>
          <select 
            className={styles['selec-filtro']} 
            value={mejora} 
            onChange={(e) => setMejora(e.target.value)}
            style={{ fontSize: '16px', fontWeight: 'bold', padding: '10px' }}
          >
            <option value="" disabled>Selecciona una opción</option>
            <option value="limpieza">La limpieza</option>
            <option value="tiempo">Tiempo de espera de la comida</option>
            <option value="comida">La comida</option>
            <option value="etiquetas">Cumplir con las etiquetas asignadas</option>
            <option value="atencion">Atención al comensal</option>
          </select>
        </div>

        {/* PREGUNTA 2: ATRACCIÓN */}
        <h2 className={styles.titulo} style={{ textAlign: "center", fontSize: '20px', fontWeight: 'bold' }}>¿Qué te atrajo más del lugar?</h2>
        <div className={styles['select-container']} style={{ marginBottom: "20px" }}>
          <select 
            className={styles['selec-filtro']} 
            value={atraccion} 
            onChange={(e) => setAtraccion(e.target.value)}
            style={{ fontSize: '16px', fontWeight: 'bold', padding: '10px' }}
          >
            <option value="" disabled>Selecciona una opción</option>
            <option value="comida">La comida</option>
            <option value="ubicacion">La ubicación</option>
            <option value="recomendacion">Recomendación</option>
            <option value="horario">El horario</option>
            <option value="vista">La vista</option>
            <option value="limpieza">La limpieza</option>
          </select>
        </div>

        {/* PREGUNTA 3: ORIGEN */}
        <h2 className={styles.titulo} style={{ textAlign: "center", fontSize: '20px', fontWeight: 'bold' }}>¿De dónde nos visitas?</h2>
        <div className={styles['select-container']} style={{ marginBottom: "20px" }}>
          <select 
            className={styles['selec-filtro']} 
            value={origen} 
            onChange={(e) => setOrigen(e.target.value)}
            style={{ fontSize: '16px', fontWeight: 'bold', padding: '10px' }}
          >
            <option value="" disabled>Selecciona una opción</option>
            <option value="nacional">Nacional</option>
            <option value="extranjero">Extranjero</option>
          </select>
        </div>

        {/* PREGUNTA 4: PLATILLOS (Movida al final) */}
        <h2 className={styles.titulo} style={{ textAlign: "center", fontSize: '20px', fontWeight: 'bold' }}>¿Qué platillo o bebida te llamó la atención? (Elige máxima 2 opciones)</h2>
        <div style={{ marginBottom: "20px", display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 10px' }}>
          {['Tostadas', 'Garnachas', 'Empanadas', 'Gorditas', 'Pozol'].map(item => (
            <label key={item} style={{ cursor: 'pointer', fontSize: '18px', color: '#333', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <input 
                type="checkbox" 
                checked={platillos.includes(item)}
                onChange={() => handlePlatilloChange(item)}
                style={{ marginRight: '12px', width: '22px', height: '22px', accentColor: '#742A2A', cursor: 'pointer' }}
              />
              {item}
            </label>
          ))}
        </div>

        <button type="submit" className={styles.button} style={{ width: "100%", marginTop: '10px', fontSize: '18px', fontWeight: 'bold', padding: '12px' }}>
          Enviar Respuestas
        </button>
      </form>
    </div>
  );
}

export default function Page() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", padding: "40px 20px" }}>
      <Suspense fallback={<div style={{ textAlign: 'center' }}>Cargando encuesta...</div>}>
        <EncuestaForm />
      </Suspense>
    </div>
  );
}