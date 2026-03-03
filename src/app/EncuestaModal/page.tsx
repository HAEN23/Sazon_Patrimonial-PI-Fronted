'use client';

import React, { useState } from 'react';
import styles from './EncuestaModal.module.css';

export default function Page() {
  const [atraccion, setAtraccion] = useState('');
  const [origen, setOrigen] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!atraccion || !origen) {
      alert("Por favor selecciona todas las opciones");
      return;
    }

    console.log("Encuesta enviada:", { atraccion, origen });

    // Aquí después puedes conectar la API

    setAtraccion('');
    setOrigen('');
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