"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./EdicionRest.module.css";
import { useRouter } from "next/navigation";

export default function EdicionRestaurante() {
  const router = useRouter();

  // 1. ESTADO DEL FORMULARIO TEXTUAL
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
  
  // NUEVO: Estado para saber si el restaurante ya fue aprobado
  const [esAprobado, setEsAprobado] = useState(false);

  // Separamos los Archivos reales (Files) de las URLs (Strings para previsualizar)
  const [imagenesFiles, setImagenesFiles] = useState<(File | null)[]>([null, null, null]);
  const [imagenesUrls, setImagenesUrls] = useState<(string | null)[]>([null, null, null]);

  const [menuPDFFile, setMenuPDFFile] = useState<File | null>(null);
  const [menuPDFUrl, setMenuPDFUrl] = useState<string | null>(null);

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

          // Carga las URLs desde la BD para mostrarlas en pantalla
          setImagenesUrls([
            info.foto_portada || null, 
            info.foto_2 || null, 
            info.foto_3 || null
          ]);
          
          if (info.menu_pdf) setMenuPDFUrl(info.menu_pdf);

          if (info.estado === 'Rechazado') {
             setMensajeRechazo("Tu solicitud fue rechazada. Por favor revisa los datos y vuelve a enviar.");
          }

          // ✅ CORRECCIÓN AQUÍ: Verificamos de forma más estricta si está aprobado
          // Si dice "Aprobado" o si la BD ya le asignó un ID de restaurante real
          if (info.estado === 'Aprobado' || info.id_restaurante) {
             setEsAprobado(true);
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

  // --- MANEJO CORRECTO DE ARCHIVOS PARA VISUALIZAR Y ENVIAR ---
  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>, index:number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Guardamos el File real para el Backend
    const nuevosFiles = [...imagenesFiles];
    nuevosFiles[index] = file;
    setImagenesFiles(nuevosFiles);

    // Creamos la URL temporal para que el usuario la vea
    const url = URL.createObjectURL(file);
    const nuevasUrls = [...imagenesUrls];
    nuevasUrls[index] = url;
    setImagenesUrls(nuevasUrls);
  };
  
  const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMenuPDFFile(file);
    setMenuPDFUrl(URL.createObjectURL(file));
  };

  const verArchivo = (url: string | null, e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (!url) return;
    window.open(url, "_blank"); 
  };

  // 3. GUARDAR DATOS (AHORA USANDO FORMDATA)
  const handleAplicarCambios = async () => {
    try {
        const token = localStorage.getItem("token");
        const etiquetasUnidas = [formData.etiqueta1, formData.etiqueta2, formData.etiqueta3]
            .filter(e => e !== "")
            .join(",");

        // Usamos FormData para mezclar textos con archivos como lo exige el Backend
        const formDataToSend = new FormData();
        formDataToSend.append('nombre', formData.nombre);
        formDataToSend.append('direccion', formData.direccion); 
        formDataToSend.append('horario', formData.horario);
        formDataToSend.append('telefono', formData.telefono);
        formDataToSend.append('facebook', formData.facebook);
        formDataToSend.append('instagram', formData.instagram);
        formDataToSend.append('etiquetas', etiquetasUnidas);

        // Adjuntar archivos si existen, si no, adjuntar la URL antigua para no borrarla
        if (imagenesFiles[0]) formDataToSend.append('foto_portada', imagenesFiles[0]);
        else if (imagenesUrls[0]) formDataToSend.append('foto_portada', imagenesUrls[0]);

        if (imagenesFiles[1]) formDataToSend.append('foto_2', imagenesFiles[1]);
        else if (imagenesUrls[1]) formDataToSend.append('foto_2', imagenesUrls[1]);

        if (imagenesFiles[2]) formDataToSend.append('foto_3', imagenesFiles[2]);
        else if (imagenesUrls[2]) formDataToSend.append('foto_3', imagenesUrls[2]);

        if (menuPDFFile) formDataToSend.append('menu_pdf', menuPDFFile);
        else if (menuPDFUrl) formDataToSend.append('menu_pdf', menuPDFUrl);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api'}/mi-restaurante`, {
            method: 'PUT',
            headers: { 
                Authorization: `Bearer ${token}` 
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
    // 1. Limpiamos TODA la memoria del navegador relacionada con la sesión
    localStorage.removeItem("userRole");
    localStorage.removeItem("token"); 
    localStorage.removeItem("user");
    localStorage.removeItem("sesionActiva");
    
    // 2. FORZAMOS la recarga redirigiendo a la raíz, igual que en la otra vista
    window.location.href = "/";
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
                {imagenesUrls[num] && imagenesUrls[num] !== '' ? (
                  <>
                    <img 
                        src={imagenesUrls[num]!} 
                        alt={`Subir Imagen ${num + 1}`} 
                        width={200} 
                        height={150} 
                        className={styles.previewImagen}
                        style={{ objectFit: 'cover' }}
                    />
                    <button 
                        onClick={(e) => verArchivo(imagenesUrls[num], e)}
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

        <section className={styles.sectionFlex}>
          
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '25px'}}>
            
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
                    {menuPDFFile 
                      ? `📄 ${menuPDFFile.name}` 
                      : menuPDFUrl
                        ? "📄 Menú Guardado"
                        : "Seleccionar archivo PDF"}
                  </span>
                  <input type="file" hidden accept="application/pdf" onChange={handlePDFChange} />
                </label>

                {menuPDFUrl && (
                  <button 
                    onClick={(e) => verArchivo(menuPDFUrl, e)}
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

          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '25px'}}>
            
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
                <option value="Tradicional">Tradicional</option>
                <option value="Típica">Típica</option>
            </select>

            <select name="etiqueta2" className={styles.select} value={formData.etiqueta2} onChange={handleInputChange}>
                <option value="">Seleccionar</option>
                <option value="Delivery">Delivery</option>
                <option value="WiFi Gratuito">WiFi Gratuito</option>
                <option value="Estacionamiento">Estacionamiento</option>
                <option value="Familiar">Familiar</option>
                <option value="Pet Friendly">Pet Friendly</option>
                <option value="Terraza">Terraza</option>
                <option value="Tradicional">Tradicional</option>
                <option value="Típica">Típica</option>
            </select>

            <select name="etiqueta3" className={styles.select} value={formData.etiqueta3} onChange={handleInputChange}>
                <option value="">Seleccionar</option>
                <option value="Delivery">Delivery</option>
                <option value="WiFi Gratuito">WiFi Gratuito</option>
                <option value="Estacionamiento">Estacionamiento</option>
                <option value="Familiar">Familiar</option>
                <option value="Pet Friendly">Pet Friendly</option>
                <option value="Terraza">Terraza</option>
                <option value="Tradicional">Tradicional</option>
                <option value="Típica">Típica</option>
            </select>

          </div>
        </section>

        {/* CONTENEDOR DE BOTONES */}
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
          
          <button onClick={handleAplicarCambios} className={styles.btnAplicar}>
            <Image src="/images/aplicarCambios.png" alt="cambios" width={20} height={20} />
            Aplicar Cambios
          </button>

          {/* ESTE BOTÓN SOLO APARECE SI EL RESTAURANTE YA ESTÁ APROBADO */}
          {esAprobado && (
            <button 
              onClick={() => router.push("/estadistica")} 
              className={styles.btnAplicar}
              style={{ backgroundColor: '#2b2b2b' }} // Un color diferente para destacarlo
            >
              <Image src="/images/estadisticas.png" alt="estadisticas" width={20} height={20} />
              Estadísticas
            </button>
          )}

        </div>

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
            <p>Datos guardados con éxito.</p>
          </div>
        </div>
      )}
    </div>
  );
}