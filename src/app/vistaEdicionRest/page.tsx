"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./EdicionRest.module.css";
import { useRouter } from "next/navigation";

export default function EdicionRestaurante() {
  const router = useRouter();

  // 1. ESTADO DEL FORMULARIO
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    horario: "",
    telefono: "",
    facebook: "",
    instagram: "",
    etiqueta1: "",
    etiqueta2: "",
    etiqueta3: "",
  });

  const [modalAviso, setModalAviso] = useState(false);
  const [mensajeRechazo, setMensajeRechazo] = useState<string | null>(null);

  const [imagenes, setImagenes] = useState<(string | null)[]>([null, null, null]);
  const [menuPDF, setMenuPDF] = useState<File | string | null>(null);

  // 2. CARGAR DATOS
  useEffect(() => {
    const cargarDatos = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api'}/mi-restaurante`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success && data.data) {
          const info = data.data;
          const etiquetasArr = info.etiquetas ? info.etiquetas.split(',') : ["","",""];

          setFormData({
            nombre: info.nombre_propuesto_restaurante || "",
            direccion: info.direccion || "",
            horario: info.horario_atencion || "",
            telefono: info.telefono || "",
            facebook: info.facebook || "",
            instagram: info.instagram || "",
            etiqueta1: etiquetasArr[0] || "",
            etiqueta2: etiquetasArr[1] || "",
            etiqueta3: etiquetasArr[2] || "",
          });

          // Carga las 3 imágenes desde la BD
          setImagenes([
            info.foto_portada || null, 
            info.foto_2 || null, 
            info.foto_3 || null
          ]);
          
          if (info.menu_pdf) setMenuPDF(info.menu_pdf);

          if (info.estado === 'Rechazado') {
             setMensajeRechazo("Tu solicitud fue rechazada. Por favor revisa los datos y vuelve a enviar.");
          }
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    cargarDatos();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. GUARDAR DATOS
  const handleAplicarCambios = async () => {
    try {
        const token = localStorage.getItem("token");
        
        // 1. Creamos un objeto FormData en lugar de un JSON simple
        const formDataToSend = new FormData();

        // 2. Agregamos los campos de texto
        formDataToSend.append("nombre", formData.nombre);
        formDataToSend.append("direccion", formData.direccion);
        formDataToSend.append("horario", formData.horario);
        formDataToSend.append("telefono", formData.telefono);
        formDataToSend.append("facebook", formData.facebook);
        formDataToSend.append("instagram", formData.instagram);
        
        const etiquetasUnidas = [formData.etiqueta1, formData.etiqueta2, formData.etiqueta3]
            .filter(e => e !== "")
            .join(",");
        formDataToSend.append("etiquetas", etiquetasUnidas);

        // 3. Agregamos los archivos (solo si son objetos de tipo File)
        // Imagen 1 (foto_portada)
        if (imagenes[0] && typeof imagenes[0] !== "string") {
            // Nota: El backend esperará el nombre 'foto_portada'
            const response = await fetch(imagenes[0]);
            const blob = await response.blob();
            formDataToSend.append("foto_portada", blob, "portada.jpg");
        }

        // Imagen 2
        if (imagenes[1] && typeof imagenes[1] !== "string") {
            const response = await fetch(imagenes[1]);
            const blob = await response.blob();
            formDataToSend.append("foto_2", blob, "foto2.jpg");
        }

        // Imagen 3
        if (imagenes[2] && typeof imagenes[2] !== "string") {
            const response = await fetch(imagenes[2]);
            const blob = await response.blob();
            formDataToSend.append("foto_3", blob, "foto3.jpg");
        }

        // PDF del Menú
        if (menuPDF && typeof menuPDF !== "string") {
            formDataToSend.append("menu_pdf", menuPDF);
        }

        // 4. Realizamos la petición (IMPORTANTE: No poner 'Content-Type' manualmente)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api'}/mi-restaurante`, {
            method: 'PUT',
            headers: { 
                Authorization: `Bearer ${token}` 
                // No incluyas 'Content-Type': 'application/json' aquí
            },
            body: formDataToSend
        });

        const data = await res.json();
        
        if (data.success) {
            setMensajeRechazo(null);
            setModalAviso(true);
        } else {
            alert("Error al guardar: " + (data.error || "Error desconocido"));
        }

    } catch (error: any) {
        console.error("Error guardando:", error);
        alert("Error de conexión: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    router.push("/");
  };
  
  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>, index:number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const nuevasImagenes = [...imagenes];
    nuevasImagenes[index] = url;
    setImagenes(nuevasImagenes);
  };
  
  const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMenuPDF(file);
  };

  // --- FUNCIÓN PARA VER ARCHIVOS ---
  const verArchivo = (archivo: string | File | null, e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (!archivo) return;

    if (typeof archivo === "string") {
      // Si detectamos que es nuestro enlace falso de prueba
      if (archivo === "url-simulada-pdf.pdf" || archivo.includes("simulada")) {
        alert("Este es un PDF simulado. Selecciona un archivo PDF real desde tu computadora para poder previsualizarlo.");
        return;
      }
      
      // Si es un enlace real de internet (Cloudinary, S3, etc.)
      if (archivo.startsWith("http")) {
        window.open(archivo, "_blank");
      } else {
        alert("El archivo guardado no tiene una URL válida para mostrarse.");
      }
    } else {
      // Si es un archivo real que el usuario acaba de elegir de su PC
      const url = URL.createObjectURL(archivo);
      window.open(url, "_blank"); 
    }
  };

  return (
    <div className={styles.vistaPrincipal}>
      <header className={styles.headerPrincipal}>
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            <Image src="/images/logo_sp_blanco.png" alt="Logo" width={80} height={80} />
            <span>Restaurantes San Cristóbal</span>
          </div>
          <div className={styles.headerActions}>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <Image src="/images/logout.png" alt="logout" width={20} height={20} />
              Cerrar sesión
            </button>
            <Image src="/images/restaurantero.png" alt="icono" width={50} height={50} />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <button className={styles.btnBack} onClick={() => router.push("/vistaPrincipalRestaurantero")}>
          <Image src="/images/back.png" alt="back" width={25} height={25} />
        </button>

        <h1>Mi Restaurante</h1>

        {mensajeRechazo && (
          <div className={styles.alertaRechazo}>
            <strong>⚠️ ATENCIÓN:</strong> {mensajeRechazo}
          </div>
        )}

        <hr />

        <section className={styles.section}>
          <h3>Galería de Imágenes</h3>
          <div className={styles.galeria}>
            {[0,1,2].map((num) => (
              <label key={num} className={styles.imagenSlot} style={{ position: 'relative' }}>
                <input type="file" hidden accept="image/png, image/jpeg" onChange={(e)=>handleImagenChange(e,num)} />
                {imagenes[num] ? (
                  <>
                    <Image 
                        src={imagenes[num]!} 
                        alt={`Subir Imagen ${num + 1}`} 
                        width={200} 
                        height={150} 
                        className={styles.previewImagen} 
                    />
                    <button 
                        onClick={(e) => verArchivo(imagenes[num], e)}
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            backgroundColor: 'rgba(106, 30, 30, 0.85)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem'
                        }}
                        title={`Ver Imagen ${num + 1}`}
                    >
                        👁️
                    </button>
                  </>
                ) : (
                  <div className={styles.imagenPlaceholder}>Subir Imagen {num + 1}</div>
                )}
              </label>
            ))}
          </div>
        </section>

        {/* --- SECCIÓN UNIFICADA Y ALINEADA --- */}
        <section className={styles.sectionFlex}>
          
          {/* COLUMNA IZQUIERDA */}
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '25px'}}>
            
            {/* 1. PDF */}
            <div style={{ width: '100%' }}>
              <h4>Menú en PDF</h4>
              <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <label 
                  className={styles.fileBtn} 
                  style={{
                    flex: 1, 
                    boxSizing: 'border-box', 
                    height: '45px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '0 15px',
                    overflow: 'hidden'
                  }}
                >
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textAlign: 'left' }}>
                    {menuPDF 
                      ? (typeof menuPDF === 'string' ? "📄 Menú Guardado" : `📄 ${menuPDF.name}`) 
                      : "Seleccionar archivo PDF"}
                  </span>
                  <input type="file" hidden accept="application/pdf" onChange={handlePDFChange} />
                </label>

                {/* BOTÓN PARA VER PDF */}
                {menuPDF && (
                  <button 
                    onClick={(e) => verArchivo(menuPDF, e)}
                    style={{
                      backgroundColor: '#912F2F',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      width: '45px',
                      height: '45px',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.2s'
                    }}
                    title="Ver PDF"
                  >
                    👁️
                  </button>
                )}
              </div>
            </div>

            {/* 2. HORARIOS */}
            <div>
              <h4>Horarios</h4>
              <input 
                  type="text" 
                  name="horario"
                  placeholder="Ingrese el horario" 
                  className={styles.input}
                  style={{width: '100%', height: '45px'}}
                  value={formData.horario}
                  onChange={handleInputChange}
              />
            </div>

          </div>

          {/* COLUMNA DERECHA */}
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '25px'}}>
            
            {/* 1. UBICACIÓN (LINK MAPS) */}
            <div>
              <h4>Ubicación (Link Google Maps)</h4>
              <input 
                  type="text" 
                  name="direccion"
                  placeholder="Pegue aquí el enlace de Google Maps" 
                  className={styles.input}
                  style={{width: '100%', height: '45px'}}
                  value={formData.direccion}
                  onChange={handleInputChange}
              />
            </div>

            {/* 2. NOMBRE RESTAURANTE */}
            <div>
              <h4 style={{color: '#6A1E1E'}}>Nombre del Restaurante</h4>
              <input 
                  type="text" 
                  name="nombre"
                  placeholder="Escribe el nombre de tu negocio" 
                  className={styles.input}
                  style={{width: '100%', height: '45px'}}
                  value={formData.nombre}
                  onChange={handleInputChange}
              />
            </div>

          </div>
        </section>

        {/* CONTACTOS + ETIQUETAS */}
        <section className={styles.sectionFlex}>
          <div>
            <h4>Contactos</h4>
            <input 
                type="text" 
                name="telefono"
                placeholder="Número celular" 
                className={styles.input}
                value={formData.telefono}
                onChange={handleInputChange}
            />
            <input 
                type="text" 
                name="facebook"
                placeholder="Facebook" 
                className={styles.input}
                value={formData.facebook}
                onChange={handleInputChange}
            />
            <input 
                type="text" 
                name="instagram"
                placeholder="Instagram" 
                className={styles.input}
                value={formData.instagram}
                onChange={handleInputChange}
            />
          </div>

          <div>
            <h4>Etiquetas</h4>
            
            <select name="etiqueta1" className={styles.select} value={formData.etiqueta1} onChange={handleInputChange}>
                <option value="">Seleccionar</option>
                <option value="Delivery">Delivery</option>
                <option value="WiFi Gratuito">WiFi Gratuito</option>
                <option value="Estacionamiento">Estacionamiento</option>
                <option value="Familiar">Familiar</option>
                <option value="Pet Friendly">Pet Friendly</option>
                <option value="Terraza">Terraza</option>
                <option value="Comida Rápida">Comida Rápida</option>
                <option value="Gourmet">Gourmet</option>
                <option value="Vegetariano">Vegetariano</option>
                <option value="Económico">Económico</option>
            </select>

            <select name="etiqueta2" className={styles.select} value={formData.etiqueta2} onChange={handleInputChange}>
                <option value="">Seleccionar</option>
                <option value="Delivery">Delivery</option>
                <option value="WiFi Gratuito">WiFi Gratuito</option>
                <option value="Estacionamiento">Estacionamiento</option>
                <option value="Familiar">Familiar</option>
                <option value="Pet Friendly">Pet Friendly</option>
                <option value="Terraza">Terraza</option>
                <option value="Comida Rápida">Comida Rápida</option>
                <option value="Gourmet">Gourmet</option>
                <option value="Vegetariano">Vegetariano</option>
                <option value="Económico">Económico</option>
            </select>

            <select name="etiqueta3" className={styles.select} value={formData.etiqueta3} onChange={handleInputChange}>
                <option value="">Seleccionar</option>
                <option value="Delivery">Delivery</option>
                <option value="WiFi Gratuito">WiFi Gratuito</option>
                <option value="Estacionamiento">Estacionamiento</option>
                <option value="Familiar">Familiar</option>
                <option value="Pet Friendly">Pet Friendly</option>
                <option value="Terraza">Terraza</option>
                <option value="Comida Rápida">Comida Rápida</option>
                <option value="Gourmet">Gourmet</option>
                <option value="Vegetariano">Vegetariano</option>
                <option value="Económico">Económico</option>
            </select>

          </div>
        </section>

        <button onClick={handleAplicarCambios} className={styles.btnAplicar}>
          <Image src="/images/aplicarCambios.png" alt="cambios" width={20} height={20} />
          Aplicar Cambios
        </button>

      </main>

      <footer className={styles.footer}>
        <div>
          <h4>Contáctanos</h4>
          <p>sazonpatrimonial@gmail.com</p>
          <p>+52 961 652 2093</p>
        </div>
        <div className={styles.footerLogos}>
          <Image src="/images/logo_sp_blanco.png" alt="logo" width={70} height={70} />
          <Image src="/images/devbox_logo.png" alt="devbox" width={70} height={70} />
          <Image src="/images/logo_uni.png" alt="uni" width={70} height={70} />
        </div>
      </footer>

      {modalAviso && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button onClick={() => setModalAviso(false)} className={styles.closeModal}>&times;</button>
            <p>Datos guardados y enviados a revisión con éxito.</p>
          </div>
        </div>
      )}
    </div>
  );
}