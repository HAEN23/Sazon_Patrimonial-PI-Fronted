'use client';

import React, { useState } from 'react';
import styles from './EncuestaModal.module.css';

export default function Page() {
  const [atraccion, setAtraccion] = useState('');
  const [origen, setOrigen] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!atraccion || !origen) {
      alert("Por favor selecciona todas las opciones");
      return;
    }

    // Obtenemos el ID del restaurante (Asegúrate de cómo lo estás guardando cuando abres el modal)
    // Usualmente lo guardas en localStorage o lo pasas en la URL. 
    // Por ahora buscaré si está en la URL (ej. ?id=1) o usaré uno por defecto si estás probando.
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('id') || localStorage.getItem('restauranteActivoId') || 1; 

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

      const response = await fetch(`${apiUrl}/restaurants/${restaurantId}/survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ atraccion, origen })
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Gracias por tu respuesta! Encuesta guardada.");
        setAtraccion('');
        setOrigen('');
        // Aquí podrías cerrar el modal o redirigir
      } else {
        alert("Error: " + (data.error || data.message));
      }
    } catch (error) {
      console.error("Error enviando encuesta:", error);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", padding: "40px 20px" }}>
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        
        <img 
          src="/images/logo_sp_rojo.png" 
          className={styles.logo} 
          width="100" 
          alt="Logo Sazón Patrimonial" 
          style={{ display: "block", margin: "0 auto 20px" }}
        />

        <h2 className={styles.titulo} style={{ textAlign: "center" }}>
          ¿Qué te atrajo del restaurante?
        </h2>

        <form className={styles.formContainer} onSubmit={handleSubmit}>
          
          <div className={styles['select-container']} style={{ marginBottom: "20px" }}>
            <select
              className={styles['selec-filtro']}
              value={atraccion}
              onChange={(e) => setAtraccion(e.target.value)}
            >
              <option value="" disabled>Selecciona una opción</option>
              <option value="comida">La comida</option>
              <option value="ubicacion">La ubicación</option>
              <option value="recomendacion">Recomendación</option>
              <option value="horario">El horario</option>
              <option value="vista">La vista</option>
            </select>
          </div>

          <h2 className={styles.titulo} style={{ textAlign: "center" }}>
            ¿De dónde nos visitas?
          </h2>

          <div className={styles['select-container']} style={{ marginBottom: "20px" }}>
            <select
              className={styles['selec-filtro']}
              value={origen}
              onChange={(e) => setOrigen(e.target.value)}
            >
              <option value="" disabled>Selecciona una opción</option>
              <option value="nacional">Nacional</option>
              <option value="extranjero">Extranjero</option>
            </select>
          </div>

          <button 
            type="submit" 
            className={styles.button}
            style={{ width: "100%" }}
          >
            Enviar
          </button>

        </form>
      </div>
    </div>
  );
}