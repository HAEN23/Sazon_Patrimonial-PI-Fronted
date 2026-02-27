'use client';

import React, { useState } from 'react';
import styles from './EncuestaModal.module.css';

interface EncuestaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EncuestaModal({ isOpen, onClose }: EncuestaModalProps) {
  const [atraccion, setAtraccion] = useState('');
  const [origen, setOrigen] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aquí puedes agregar tu validación antes de enviar
    if(!atraccion || !origen) {
        alert("Por favor selecciona todas las opciones");
        return;
    }

    console.log("Encuesta enviada:", { atraccion, origen });
    
    // Limpiamos el formulario y cerramos el modal
    setAtraccion('');
    setOrigen('');
    onClose();
  };

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.overlayShow : ''}`}>
      <section className={styles.form}>
        {/* Botón para cerrar la encuesta */}
        <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar modal">
          &times;
        </button>

        <img src="/images/logo_sp_rojo.png" className={styles.logo} width="100" alt="Logo Sazón Patrimonial" />
        
        {/* En tu HTML decía h2, pero en tu CSS lo estilizaste como h4, usaremos h2 con tu estilo */}
        <h2 className={styles.titulo}>¿Qué te atrajo del restaurante?</h2>
        
        <form id="encuestaForm" className={styles.formContainer} onSubmit={handleSubmit}>
          
          <div className={styles['select-container']}>
            <select 
              id="atraccion" 
              name="atraccion" 
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
            <span className={styles['error-message']} id="error-atraccion"></span>
          </div>

          <h2 className={styles.titulo}>¿De dónde nos visitas?</h2>
          
          <div className={styles['select-container']}>
            <select 
              id="origen" 
              name="origen" 
              className={styles['selec-filtro']}
              value={origen}
              onChange={(e) => setOrigen(e.target.value)}
            >
              <option value="" disabled>Selecciona una opción</option>
              <option value="nacional">Nacional</option>
              <option value="extranjero">Extranjero</option>
            </select>
            <span className={styles['error-message']} id="error-origen"></span>
          </div>

          <button type="submit" className={styles.button}>Enviar</button>
        </form>
      </section>
    </div>
  );
}