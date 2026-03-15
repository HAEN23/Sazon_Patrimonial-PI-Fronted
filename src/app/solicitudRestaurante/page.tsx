"use client";

import { useState } from "react";
import styles from "./Solicitud.module.css";
import Image from "next/image";

export default function SolicitudPage() {
  const [modalOpen, setModalOpen] = useState(false);
  
  // 1. Estados para capturar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    facebook: '',
    instagram: '',
    direccion: '',
    horario: ''
  });

  // 2. Estados para los archivos
  const [fotoPortada, setFotoPortada] = useState<File | null>(null);
  const [foto2, setFoto2] = useState<File | null>(null);
  const [foto3, setFoto3] = useState<File | null>(null);
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [menuPdf, setMenuPdf] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
      const token = localStorage.getItem('token');

      if (!token) {
        alert("Debes iniciar sesión para enviar una solicitud.");
        return;
      }

      // 3. Crear el FormData
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('telefono', formData.telefono);
      formDataToSend.append('facebook', formData.facebook);
      formDataToSend.append('instagram', formData.instagram);
      formDataToSend.append('direccion', formData.direccion);
      formDataToSend.append('horario', formData.horario);
      // Puedes enviar etiquetas vacías por ahora si tu backend lo requiere, o agregar un input
      formDataToSend.append('etiquetas', ''); 

      // 4. Agregar archivos si existen
      if (fotoPortada) formDataToSend.append('foto_portada', fotoPortada);
      if (foto2) formDataToSend.append('foto_2', foto2);
      if (foto3) formDataToSend.append('foto_3', foto3);
      if (menuPdf) formDataToSend.append('menu_pdf', menuPdf);
      // OJO: Tu controlador updateRestaurant no parece procesar el 'comprobante_domicilio', 
      // pero lo puedes mandar si lo agregas en el backend luego.

      // 5. Enviar al backend
      const response = await fetch(`${apiUrl}/mi-restaurante`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`
          // No incluyas 'Content-Type': 'application/json' cuando envíes FormData
        },
        body: formDataToSend,
      });

      if (response.ok) {
        setModalOpen(true);
      } else {
        const errData = await response.json();
        alert("Error: " + (errData.error || errData.message));
      }

    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      alert("Error de conexión al enviar la solicitud.");
    }
  };

  return (
    <div className={styles.vistaPrincipal}>
      {/* HEADER */}
      <header className={styles.headerPrincipal}>
        <div className={styles.logoContainer}>
          <Image
            src="/logo_sp_blanco.png"
            alt="Logo"
            width={120}
            height={120}
            className={styles.logoBlanco}
          />
          <div className={styles.catlogo}>
            Restaurantes San Cristóbal
          </div>
        </div>
      </header>

      <main>
        <div className={styles.registroContainer}>
          <button
            className={styles.btnBack}
            onClick={() => window.history.back()}
          >
            <Image
              src="/back.png"
              alt="Regresar"
              width={32}
              height={32}
            />
          </button>

          <section className={styles.formSection}>
            <form onSubmit={handleSubmit}>
              <h4>Solicitud de validación</h4>
              <p className={styles.subText}>
                Proporciona la siguiente información para verificar tu restaurante
              </p>

              <label>Restaurante</label>
              <input className={styles.controls} type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required />

              <label>Número de celular</label>
              <input className={styles.controls} type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} required />

              <label>Facebook</label>
              <input className={styles.controls} type="text" name="facebook" value={formData.facebook} onChange={handleInputChange} />

              <label>Instagram</label>
              <input className={styles.controls} type="text" name="instagram" value={formData.instagram} onChange={handleInputChange} />

              <label>Dirección</label>
              <input className={styles.controls} type="text" name="direccion" value={formData.direccion} onChange={handleInputChange} required />

              <label>Horarios</label>
              <input className={styles.controls} type="text" name="horario" value={formData.horario} onChange={handleInputChange} required />

              <label>Imágenes (JPG o PNG)</label>
              <div className={styles.imagenesGroup}>
                <label className={styles.inputFile}>
                  Imagen principal
                  <input type="file" hidden accept="image/png, image/jpeg" onChange={(e) => setFotoPortada(e.target.files?.[0] || null)} />
                </label>

                <label className={styles.inputFile}>
                  Imagen secundaria
                  <input type="file" hidden accept="image/png, image/jpeg" onChange={(e) => setFoto2(e.target.files?.[0] || null)} />
                </label>

                <label className={styles.inputFile}>
                  Imagen de platillo
                  <input type="file" hidden accept="image/png, image/jpeg" onChange={(e) => setFoto3(e.target.files?.[0] || null)} />
                </label>
              </div>

              <label>Archivos (PDF)</label>
              <div className={styles.imagenesGroup}>
                <label className={styles.inputFile}>
                  Comprobante de domicilio
                  <input type="file" hidden accept="application/pdf" onChange={(e) => setComprobante(e.target.files?.[0] || null)} />
                </label>

                <label className={styles.inputFile}>
                  Menú del restaurante
                  <input type="file" hidden accept="application/pdf" onChange={(e) => setMenuPdf(e.target.files?.[0] || null)} />
                </label>
              </div>

              <button className={styles.button} type="submit">
                Enviar solicitud
              </button>
            </form>
          </section>

          <section className={styles.imageSection}>
            <Image
              src="/registro.jpeg"
              alt="Restaurante"
              width={500}
              height={600}
              className={styles.registroImg}
            />
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        {/* ... tu footer igual ... */}
      </footer>

      {modalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContenido}>
            <span
              className={styles.cerrar}
              onClick={() => {
                setModalOpen(false);
                // Opcional: Redirigir al inicio o panel después del éxito
                window.location.href = "/vistaPrincipalRestaurantero";
              }}
            >
              &times;
            </span>
            <p>
              ¡Su solicitud ha sido enviada con éxito!
              <br />
              La información será validada muy pronto.
              <br />
            </p>
          </div>
        </div>
      )}
    </div>
  );
}