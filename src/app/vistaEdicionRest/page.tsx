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
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);

  // 2. CARGAR DATOS AL INICIAR
  useEffect(() => {
    const cargarDatos = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api'}/mi-restaurante`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const textResponse = await res.text();
        if (!res.ok) {
          console.error("Error del servidor:", res.status);
          return;
        }
        
        const data = JSON.parse(textResponse);
        if (data.success && data.data) {
          const info = data.data;
          const etiquetasArr = info.etiquetas ? info.etiquetas.split(',') : ["","",""];

          console.log("📊 Datos cargados del backend:", info);
          console.log("🖼️ foto_portada:", info.foto_portada);
          console.log("🖼️ foto_2:", info.foto_2);
          console.log("🖼️ foto_3:", info.foto_3);
          console.log("📄 menu_pdf:", info.menu_pdf);

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

          // 🔥 CARGAR IMÁGENES PERSISTIDAS DESDE LA BD
          setImagenes([
            info.foto_portada || null, 
            info.foto_2 || null, 
            info.foto_3 || null
          ]);
          
          if (info.menu_pdf) {
            setMenuPDF(info.menu_pdf);
            // Extraer nombre del archivo de la URL si es posible
            const urlParts = info.menu_pdf.split('/');
            const fileName = urlParts[urlParts.length - 1] || 'menu.pdf';
            setPdfFileName(fileName);
          }

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

  // 🔥 NUEVA FUNCIÓN: Auto-guardar en el backend
  const autoGuardarBorrador = async (archivoNuevo?: { campo: string, file: File }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const etiquetasUnidas = [formData.etiqueta1, formData.etiqueta2, formData.etiqueta3]
        .filter(e => e !== "")
        .join(",");

      const formDataToSend = new FormData();
      
      // Agregar campos de texto
      formDataToSend.append("nombre", formData.nombre);
      formDataToSend.append("direccion", formData.direccion);
      formDataToSend.append("horario", formData.horario);
      formDataToSend.append("telefono", formData.telefono);
      formDataToSend.append("facebook", formData.facebook);
      formDataToSend.append("instagram", formData.instagram);
      formDataToSend.append("etiquetas", etiquetasUnidas);

      // Agregar URLs existentes (para que no se pierdan)
      formDataToSend.append("foto_portada", imagenes[0] || "");
      formDataToSend.append("foto_2", imagenes[1] || "");
      formDataToSend.append("foto_3", imagenes[2] || "");
      formDataToSend.append("menu_pdf", typeof menuPDF === 'string' ? menuPDF : "");

      // 🔥 Si hay un archivo nuevo, agregarlo
      if (archivoNuevo) {
        formDataToSend.set(archivoNuevo.campo, archivoNuevo.file);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api'}/mi-restaurante/draft`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}` 
        },
        body: formDataToSend
      });

      const textResponse = await res.text();
      
      if (!res.ok) {
        let errorMsg = `Error guardando borrador: ${res.status}`;
        try {
          const errData = JSON.parse(textResponse);
          errorMsg = errData.message || errData.error || errorMsg;
        } catch {
          errorMsg = `Error ${res.status}: ${textResponse.substring(0, 100)}`;
        }
        console.error(errorMsg);
        alert(errorMsg);
        return;
      }

      const data = JSON.parse(textResponse);
      
      if (data.success) {
        console.log("✅ Borrador guardado automáticamente");
        
        // 🔥 RECARGAR DATOS para obtener las URLs actualizadas de Cloudinary
        const resGet = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api'}/mi-restaurante`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const textGet = await resGet.text();
        if (resGet.ok) {
          const dataGet = JSON.parse(textGet);
          if (dataGet.success && dataGet.data) {
            console.log("🔄 Datos recargados después de guardar:", dataGet.data);
            console.log("🖼️ Nueva foto_portada:", dataGet.data.foto_portada);
            console.log("🖼️ Nueva foto_2:", dataGet.data.foto_2);
            console.log("🖼️ Nueva foto_3:", dataGet.data.foto_3);
            console.log("📄 Nuevo menu_pdf:", dataGet.data.menu_pdf);
            
            setImagenes([
              dataGet.data.foto_portada || null,
              dataGet.data.foto_2 || null,
              dataGet.data.foto_3 || null
            ]);
            if (dataGet.data.menu_pdf) {
              setMenuPDF(dataGet.data.menu_pdf);
              // Mantener el nombre del archivo que el usuario subió
              if (!pdfFileName) {
                const urlParts = dataGet.data.menu_pdf.split('/');
                const fileName = urlParts[urlParts.length - 1] || 'menu.pdf';
                setPdfFileName(fileName);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error en auto-guardado:", error);
    }
  };

  // 3. APLICAR CAMBIOS (Enviar a revisión)
  const handleAplicarCambios = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // 🔥 SOLO cambiar estado a "Pendiente" (los archivos ya están guardados)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api'}/mi-restaurante/submit`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });

      const textResponse = await res.text();
      
      if (!res.ok) {
        let errorMsg = `Error del servidor: ${res.status}`;
        try {
          const errData = JSON.parse(textResponse);
          errorMsg = errData.message || errData.error || errorMsg;
        } catch {
          errorMsg = `Error ${res.status}: ${textResponse.substring(0, 100)}`;
        }
        alert(errorMsg);
        return;
      }

      const data = JSON.parse(textResponse);
      
      if (data.success) {
        setMensajeRechazo(null);
        setModalAviso(true);
      } else {
        alert("Error al enviar: " + (data.error || "Error desconocido"));
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
  
  // 🔥 MODIFICADO: Subir imagen INMEDIATAMENTE al backend
  const handleImagenChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    console.log(`📤 Subiendo imagen ${index + 1}:`, file.name);
    
    // Mostrar preview inmediato
    const url = URL.createObjectURL(file);
    console.log(`🔗 Blob URL temporal creado:`, url);
    
    const nuevasImagenes = [...imagenes];
    nuevasImagenes[index] = url;
    setImagenes(nuevasImagenes);

    // 🔥 AUTO-GUARDAR en el backend
    const campoNombre = index === 0 ? 'foto_portada' : index === 1 ? 'foto_2' : 'foto_3';
    console.log(`💾 Guardando en campo:`, campoNombre);
    await autoGuardarBorrador({ campo: campoNombre, file });
  };
  
  // 🔥 MODIFICADO: Subir PDF INMEDIATAMENTE al backend
  const handlePDFChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setMenuPDF(file);
    setPdfFileName(file.name); // Guardar el nombre del archivo
    
    // 🔥 AUTO-GUARDAR en el backend
    await autoGuardarBorrador({ campo: 'menu_pdf', file });
  };

  // --- FUNCIÓN HELPER PARA OBTENER URL DE ARCHIVO ---
  const getFileUrl = (archivo: string | File | null): string | null => {
    console.log("📸 getFileUrl - archivo:", archivo);
    console.log("📸 getFileUrl - tipo:", typeof archivo);
    
    if (!archivo) {
      console.log("❌ No hay archivo");
      return null;
    }
    
    let url = typeof archivo === "string" ? archivo : URL.createObjectURL(archivo);
    
    // 🔥 Si es un PDF de Cloudinary sin extensión, agregar .pdf
    if (typeof archivo === "string" && url.includes("cloudinary") && url.includes("/raw/upload/") && !url.endsWith(".pdf")) {
      url = url + ".pdf";
      console.log("📄 URL de PDF corregida:", url);
    }
    
    console.log("✅ URL generada:", url);
    return url;
  };

  // --- FUNCIÓN PARA VER ARCHIVOS (YA NO SE USA, PERO LA DEJAMOS POR SI ACASO) ---
  const verArchivo = (archivo: string | File | null, e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("🔍 verArchivo llamado");
    console.log("Archivo recibido:", archivo);
    console.log("Tipo de archivo:", typeof archivo);
    
    e.preventDefault(); 
    e.stopPropagation();
    
    if (!archivo) {
      alert("No hay archivo para mostrar");
      return;
    }

    const url = typeof archivo === "string" ? archivo : URL.createObjectURL(archivo);
    console.log("URL generada:", url);
    
    const ventana = window.open(url, "_blank", "noopener,noreferrer");
    console.log("Ventana abierta:", ventana);
    
    if (!ventana) {
      alert("No se pudo abrir la ventana. Por favor permite ventanas emergentes.");
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
              <div key={num} style={{ position: 'relative', display: 'inline-block' }}>
                <label 
                  className={styles.imagenSlot} 
                  style={{ 
                    cursor: 'pointer', 
                    display: 'block',
                    position: 'relative'
                  }}
                >
                  <input type="file" hidden accept="image/png, image/jpeg" onChange={(e)=>handleImagenChange(e,num)} />
                  {imagenes[num] && imagenes[num] !== '' ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                          src={imagenes[num]!} 
                          alt={`Subir Imagen ${num + 1}`} 
                          width={200} 
                          height={150} 
                          className={styles.previewImagen}
                          style={{ objectFit: 'cover', display: 'block' }}
                      />
                    </>
                  ) : (
                    <div className={styles.imagenPlaceholder}>Subir Imagen {num + 1}</div>
                  )}
                </label>
                {imagenes[num] && imagenes[num] !== '' && (
                  <button 
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("🖱️ MouseDown en botón de imagen", num + 1);
                        console.log("🔗 URL a abrir:", imagenes[num]);
                        const ventana = window.open(imagenes[num]!, '_blank', 'noopener,noreferrer');
                        console.log("🪟 Ventana abierta:", ventana);
                        if (!ventana) {
                          alert("El navegador bloqueó la ventana emergente. Por favor permite ventanas emergentes para este sitio.");
                        }
                      }}
                      style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          backgroundColor: 'rgba(106, 30, 30, 0.95)',
                          color: 'white',
                          border: '2px solid white',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.1rem',
                          zIndex: 1000,
                          pointerEvents: 'auto',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                      }}
                      title={`Ver Imagen ${num + 1}`}
                  >
                      👁️
                  </button>
                )}
              </div>
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
                      ? `📄 ${pdfFileName || 'menu.pdf'}` 
                      : "Seleccionar archivo PDF"}
                  </span>
                  <input type="file" hidden accept="application/pdf" onChange={handlePDFChange} />
                </label>
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