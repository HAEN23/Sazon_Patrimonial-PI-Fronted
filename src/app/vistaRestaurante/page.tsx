"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import styles from "./vistaRestaurante.module.css";


// IMPORTAMOS LOS MODALES DE SESIÓN
import LoginModal from '../LoginModal/LoginModal';
import LoginAdmin from '../LoginAdmin/LoginAdmin';
import LoginRest from '../LoginRest/LoginRest';
import LoginUser from '../LoginUser/LoginUser';
import RegistroModal from '../RegistroModal/RegistroModal';

function RestauranteContenido() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Estados para el restaurante dinámico
  const [restaurante, setRestaurante] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Procesamiento de etiquetas dinámicas
  const etiquetasArray = restaurante?.etiquetas 
    ? restaurante.etiquetas.split(',').map((e:string) => e.trim()).filter((e:string) => e !== "") 
    : [];
  const primeraEtiqueta = etiquetasArray.length > 0 ? etiquetasArray[0] : "General";
  const etiquetasExtra = etiquetasArray.slice(1);

  // ✅ CAMBIO 1: Arrancamos con 0 fotos
  const [fotos, setFotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubirFoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const token = localStorage.getItem("token");
    if (!isLogged || !token) {
      setIsLoginModalOpen(true);
      return;
    }

    setIsUploading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('foto', file);

        const res = await fetch(`${apiUrl}/restaurants/${id}/photos`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
            // IMPORTANTE: No pongas 'Content-Type' aquí, el navegador lo pone solo con el boundary
          },
          body: formData
        });

        const data = await res.json();

        if (res.ok) {
          const nuevaUrl = data.data?.url || data.data?.fileUrl || data.url;
          if (nuevaUrl) {
            setFotos((prev) => [...prev, nuevaUrl]);
          }
          alert("¡Foto subida con éxito!");
        } else {
          // 🚨 AQUÍ ESTÁ LA CLAVE: 
          // Si el servidor manda un 403 (Restaurantero), mostramos SU mensaje de error.
          alert(data.message || "No se pudo subir la foto.");
          break; // Detenemos el bucle si hay error de permisos
        }
      }
    } catch (error) {
      console.log("Aviso de conexión al subir foto:", error);
      alert("Hubo un problema de conexión al intentar subir la foto.");
    } finally {
      setIsUploading(false);
      event.target.value = ''; 
    }
  };
  
  // ESTADOS DE SESIÓN Y MODALES
  const [isLogged, setIsLogged] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRegistroOpen, setIsRegistroOpen] = useState(false);

  // Estados para los modales y favoritos
  const [modalMenuOpen, setModalMenuOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [mostrarMasTags, setMostrarMasTags] = useState(false);

  // Referencia para controlar la ventana de archivos
  const fileInputRef = useRef<HTMLInputElement>(null);

  // EFECTO PARA VERIFICAR SI HAY SESIÓN ACTIVA
  useEffect(() => {
    const sesion = localStorage.getItem("sesionActiva");
    if (sesion) setIsLogged(true);
  }, []);

  // EFECTO PARA PERSISTENCIA DE FAVORITOS
  useEffect(() => {
    // Si no hay ID de restaurante o el usuario no ha iniciado sesión, no hacemos nada
    if (!id || !isLogged) return;

    const verificarFavorito = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
        
        // 🚨 AQUÍ SUELE ESTAR EL DETALLE 🚨
        // Revisa cómo guardas tu token en el LoginModal. Si lo guardaste como "token", esto funcionará:
        const token = localStorage.getItem("token"); 

        /* Nota: Si en tu LoginModal guardaste el token dentro de un objeto JSON llamado "sesionActiva",
           necesitarías extraerlo así:
           const sesionObj = JSON.parse(localStorage.getItem("sesionActiva") || "{}");
           const token = sesionObj.token;
        */

        console.log("Enviando petición check con token:", token ? "Token encontrado" : "NO HAY TOKEN");

        const res = await fetch(`${apiUrl}/favorites/check?id_restaurante=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!res.ok) {
           console.error(`Fallo la petición de verificación. Código de estado: ${res.status}`);
           return;
        }

        const data = await res.json();
        console.log("Respuesta del backend para favoritos:", data);

        if (data.success) {
          setIsFavorite(data.isFavorite);
        }
      } catch (error) {
        console.error("Error verificando estado de favorito:", error);
      }
    };

    verificarFavorito();
  }, [id, isLogged]);

  const abrirModalMenu = () => setModalMenuOpen(true);
  const cerrarModalMenu = () => setModalMenuOpen(false);

  const toggleTags = () => setMostrarMasTags(!mostrarMasTags);
  const toggleFavorite = () => setIsFavorite(!isFavorite);

  // ==========================================
  // FUNCIONES PARA PROTEGER LOS CLICS
  // ==========================================
  const handleFavoritoClick = async () => {
    if (!isLogged) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
      
      const res = await fetch(`${apiUrl}/favorites/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id_restaurante: id }) 
      });

      const data = await res.json();

      if (res.ok) {
        setIsFavorite(!isFavorite);
      } else {
        // 🚨 AQUÍ ESTÁ LA LIMPIEZA: 
        // Le decimos: "Busca si el backend mandó un 'message', si no, busca un 'error', y si no hay ninguno, pon un texto por defecto"
        const mensajeLimpio = data.message || data.error || "No se pudo completar la acción.";
        
        // Lanzamos la alerta limpia, sin el "ERROR DEL SERVIDOR"
        alert(mensajeLimpio);
      }
    } catch (error) {
      console.log("Aviso de conexión:", error);
      alert("Hubo un problema de conexión con el servidor.");
    }
  };

  const handleEncuestaClick = async () => {
    if (!isLogged) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
      const token = localStorage.getItem("token");

      const res = await fetch(`${apiUrl}/restaurants/${id}/survey/check`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();

      // 🚨 AQUÍ ATRAPAMOS EL RECHAZO DEL BACKEND (Si es restaurantero, caerá aquí)
      if (!res.ok) {
        alert(data.message || "No tienes permiso para responder encuestas.");
        return; // Detenemos la ejecución
      }

      if (data.hasAnswered) {
        alert("📝 Ya respondiste la encuesta para este restaurante. ¡Muchas gracias por tu opinión!");
        return; 
      }

      // Si todo está bien y es cliente, lo mandamos a la encuesta
      router.push(`/EncuestaModal?restauranteId=${id}`);

    } catch (error) {
      // Usamos console.log para evitar la pantalla roja de Turbopack
      console.log("Aviso de conexión al verificar encuesta:", error);
      alert("Hubo un problema de conexión al verificar la encuesta.");
    }
  };

  const handleVerMenuClick = async () => {
    // 1. Verificamos sesión
    if (!isLogged) {
      setIsLoginModalOpen(true);
      return;
    }

    // 🔒 REGLA: Bloquear si es Restaurantero
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.id_rol === 2) {
        alert("Como Restaurantero, tienes una vista de 'Solo Lectura'. No puedes descargar menús.");
        return;
      }
    }

    // 2. Verificamos si es favorito
    if (!isFavorite) {
      alert("❤️ ¡Para poder ver o descargar el menú, primero debes agregar este restaurante a tus Favoritos!");
      return;
    }

    // 3. NUEVO: Registrar la "descarga" silenciosamente en el backend
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
      await fetch(`${apiUrl}/restaurants/${id}/menu/click`, {
        method: 'POST'
      });
    } catch (error) {
      console.error("Error registrando la vista del menú:", error);
    }

    // 4. Abrimos el modal para mostrar el PDF
    abrirModalMenu();
  };

  const handleSubirFotoClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Detenemos la ventanita automática de Windows

    if (!isLogged) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
      const token = localStorage.getItem("token");

      // 🔒 1. PRIMERO: Le preguntamos al backend si tienes permiso (bloquea al Restaurantero)
      const res = await fetch(`${apiUrl}/restaurants/${id}/photos/check`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();

      if (!res.ok) {
        // 🚨 SI ERES RESTAURANTERO, TE DETIENE AQUÍ CON ESTE MENSAJE
        alert(data.message || "Como Restaurantero, no puedes subir fotos de clientes.");
        return; 
      }

      // 👤 2. SEGUNDO: Si pasaste la prueba del backend, significa que eres CLIENTE.
      // Ahora sí, le exigimos al cliente que le dé Like.
      if (!isFavorite) {
        alert("❤️ ¡Para poder subir una foto, primero debes agregar este restaurante a tus Favoritos!");
        return;
      }

      // ✅ 3. TERCERO: Si es cliente y ya tiene el Favorito, abrimos la ventanita
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }

    } catch (error) {
      console.log("Aviso de conexión al verificar permisos de foto:", error);
      alert("Hubo un problema al verificar tus permisos.");
    }
  };
  // ==========================================

  // Funciones para manejar los modales
  const handleLoginSuccess = () => {
    setIsLogged(true);
  };

  const handleBackToLogin = () => {
    setIsAdminModalOpen(false);
    setIsRestModalOpen(false);
    setIsUserModalOpen(false);
    setIsRegistroOpen(false);
    setIsLoginModalOpen(true);
  };

  // Petición al backend para obtener los detalles del restaurante
  useEffect(() => {
    if (!id) return;

    const cargarDetalleRestaurante = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
        const urlPeticion = `${apiUrl}/restaurantes/${id}`;
        
        const res = await fetch(urlPeticion); 
        
        if (!res.ok) {
          console.error(`Error del servidor: ${res.status}. La ruta no existe o falló.`);
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (data.success && data.data) {
          setRestaurante(data.data);
        }
      } catch (error) {
        console.error("Error de red o de conexión:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDetalleRestaurante();
  }, [id]);

  // EFECTO PARA CARGAR LAS FOTOS SUBIDAS POR USUARIOS
  useEffect(() => {
    if (!id) return;

    const cargarFotosDeUsuarios = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
        
        // Petición al backend a la ruta de fotos por restaurante
        const res = await fetch(`${apiUrl}/photos/restaurant/${id}`);
        
        if (!res.ok) return;

        const data = await res.json();
        
        if (data.success && data.data) {
          // Ajusta data.url o data.ruta_archivo según cómo lo devuelva tu backend
          const urlsReales = data.data.map((foto: any) => foto.url || foto.fileUrl || foto);
          setFotos(urlsReales);
        }
      } catch (error) {
        console.error("Error obteniendo las fotos de usuarios:", error);
      }
    };

    cargarFotosDeUsuarios();
  }, [id]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '1.2rem', color: 'black' }}>Cargando información del restaurante...</div>;
  }

  if (!restaurante) {
    return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '1.2rem', color: 'black' }}>No se encontró el restaurante o faltó el ID.</div>;
  }

  // 1. Búsqueda exhaustiva de la URL del menú (con función auto-ejecutable)
  const urlDelMenu = (() => {
    if (restaurante?.menu_pdf) return restaurante.menu_pdf;
    if (restaurante?.pdf_url) return restaurante.pdf_url;
    if (restaurante?.application?.menu_pdf) return restaurante.application.menu_pdf;
    if (restaurante?.application?.menuUrl) return restaurante.application.menuUrl;
    
    // Si viene en el arreglo "menus" (del backend actualizado)
    if (restaurante?.menus && restaurante.menus.length > 0) {
        return restaurante.menus[0].fileUrl || restaurante.menus[0].menuUrl || restaurante.menus[0].ruta_archivo;
    }
    // Si viene en el arreglo "menu" (formato alternativo)
    if (restaurante?.menu && restaurante.menu.length > 0) {
        return restaurante.menu[0].ruta_archivo || restaurante.menu[0].fileUrl || restaurante.menu[0].menuUrl;
    }
    return null;
  })();

  // 🔥 DEPURACIÓN: Esto imprimirá los datos exactos en la consola de tu navegador (F12)
  console.log("DATOS COMPLETOS DEL RESTAURANTE:", restaurante);
  console.log("URL DEL MENÚ ENCONTRADA:", urlDelMenu);

  return (
    <div className={styles.vistaPrincipal}>
      {/* HEADER */}
      <header className={styles.headerPrincipal}>
        <div className={styles.logoContainer}>
          <Image
            src="/images/logo_sp_blanco.png"
            alt="Logo Sazón Patrimonial"
            width={50}
            height={50}
          />
          <div>
            Catálogo de Restaurantes<br />
            en Chiapa de Corzo
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className={styles.mainContent}>
        
        {/* Título y Regresar */}
        <div className={styles.headerTitle}>
          <button className={styles.btnBack} onClick={() => router.back()}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className={styles.restauranteNombre}>
            {restaurante.nombre || "Sin nombre"}
          </h1>
        </div>

        {/* GALERÍA DINÁMICA */}
        <div className={styles.galeria}>
          <div className={styles.galeriaPrincipal}>
            <Image 
              src={restaurante.foto_portada || "/images/fondo_inicio.png"} 
              alt={restaurante.nombre || "Restaurante"} 
              fill 
              className={styles.imageCover} 
              unoptimized 
            />
          </div>
          <div className={styles.galeriaSecundaria}>
            <div className={styles.imagenSecundaria}>
              <Image 
                src={restaurante.foto_2 || "/images/ImagenSecundariaRest.png"} 
                alt="Foto 2" 
                fill 
                className={styles.imageCover} 
                unoptimized 
              />
            </div>
            <div className={styles.imagenSecundaria}>
              <Image 
                src={restaurante.foto_3 || "/images/ImagenPlatilloRestaurante.jpg"} 
                alt="Foto 3" 
                fill 
                className={styles.imageCover} 
                unoptimized 
              />
            </div>
          </div>
        </div>

        {/* INFO GRID (3 Columnas) */}
        <div className={styles.infoGrid}>
          
          {/* COLUMNA 1: Horarios y Ubicación */}
          <div className={styles.infoSection}>
            <h3>Horarios</h3>
            <div className={styles.horariosBox}>
              <p><strong>Horarios de atención:</strong><br/>{restaurante.horario_atencion || "No especificado"}</p>
            </div>
            
            <div className={styles.ubicacionBox}>
              <h3>Ubicación</h3>
              <p>
                {restaurante.direccion ? (
                  <a href={restaurante.direccion.includes('http') ? restaurante.direccion : `https://${restaurante.direccion}`} target="_blank" rel="noopener noreferrer" style={{ color: '#6b1e1e', textDecoration: 'underline', fontWeight: 'bold' }}>
                    Ver en mapa (Clic aquí)
                  </a>
                ) : (
                  "Ubicación no disponible"
                )}
              </p>
            </div>
          </div>

          {/* COLUMNA 2: Contactos y Acciones */}
          <div className={styles.infoSection}>
            <h3>Contactos</h3>
            <ul className={styles.contactList}>
              {restaurante.telefono && (
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  {restaurante.telefono}
                </li>
              )}
              {restaurante.facebook && (
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  <a href={restaurante.facebook.includes('http') ? restaurante.facebook : `https://facebook.com/${restaurante.facebook.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>
                    {restaurante.facebook}
                  </a>
                </li>
              )}
              {restaurante.instagram && (
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  <a href={restaurante.instagram.includes('http') ? restaurante.instagram : `https://instagram.com/${restaurante.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>
                    {restaurante.instagram}
                  </a>
                </li>
              )}
            </ul>

            <div className={styles.actionRow}>
              {/* Botón Ver Menú Protegido con Regla de Favoritos y Descarga */}
              <button 
                className={styles.btnMenu} 
                onClick={handleVerMenuClick}
                style={{ opacity: isFavorite ? 1 : 0.8 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                {/* 🔥 CORRECCIÓN EN EL RENDERIZADO DEL BOTÓN 🔥 */}
                {urlDelMenu 
                  ? (isFavorite ? "Ver Menú" : "Menú (Requiere Like)") 
                  : "Menú (No disponible)"}
              </button>
              
              {/* Botón Favoritos Protegido */}
              <button className={styles.btnFav} onClick={handleFavoritoClick}>
                {isFavorite ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="#6b1e1e" stroke="#6b1e1e" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                )}
                Favoritos
              </button>
            </div>
          </div>

          {/* COLUMNA 3: Etiquetas e Íconos */}
          <div className={styles.infoSection}>
            <div className={styles.tagsWrapper}>
              
              <div className={styles.tagRow}>
                <div className={styles.iconContainer}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                </div>
                <span className={styles.tagPill}>{primeraEtiqueta}</span>
              </div>

              {etiquetasExtra.length > 0 && (
                <div className={styles.tagRow}>
                  <div className={styles.iconContainer}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                  </div>
                  <button 
                    className={`${styles.tagPill} ${styles.tagDark} ${styles.tagButton}`} 
                    onClick={toggleTags}
                  >
                    {mostrarMasTags ? "Ocultar" : `Ver más (${etiquetasExtra.length})`}
                  </button>
                </div>
              )}

              {mostrarMasTags && etiquetasExtra.map((tag: string, index: number) => (
                <div key={index} className={styles.tagRow}>
                  <div className={styles.iconContainer}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                  </div>
                  <span className={styles.tagPill}>{tag}</span>
                </div>
              ))}

              {/* Botón Encuesta Protegido */}
              <div className={styles.tagRow}>
                <div className={styles.iconContainer}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b1e1e" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                </div>
                <button 
                  className={`${styles.tagPill} ${styles.tagDark} ${styles.tagButton}`} 
                  onClick={handleEncuestaClick}
                >
                  Encuesta
                </button>
              </div>

            </div>

            <h3>Fotos de Usuarios</h3>
            <div className={styles.fotosUsuariosRow}>
              
              {/* ✅ CAMBIO 2: Condición para mostrar fotos solo si existen */}
              {fotos && fotos.length > 0 && fotos.map((foto, index) => (
                <div key={index} className={styles.fotoMini}>
                  <Image
                    src={foto}
                    alt={`Foto de usuario ${index + 1}`}
                    fill
                    className={styles.imageCover}
                    unoptimized
                  />
                </div>
              ))}

              {/* Botón Subir Foto Protegido */}
              <div className={styles.btnSubirFoto} onClick={handleSubirFotoClick} style={{ cursor: 'pointer' }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6b1e1e"
                  strokeWidth="2"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                Subir Foto
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  ref={fileInputRef} // 👈 ENLAZAMOS LA VENTANITA AQUÍ
                  onChange={handleSubirFoto}
                />
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerCol}>
          <h4>Contáctanos</h4>
          <p>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
             sazonpatrimonial@gmail.com
          </p>
          <p>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
             +52 961 208 5412
          </p>
        </div>
        
        <div className={styles.footerCol}>
           <p>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
             @sazonpatrimonial
           </p>
           <p>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
             @sazonpatrimonial
           </p>
        </div>

        <div className={styles.footerLogos}>
            <Image src="/images/logo_sp_blanco.png" alt="Logo SP" width={100} height={40} />
            <Image src="/images/devbox_logo.png" alt="Logo Devbox" width={80} height={40} />
            <Image src="/images/logo_uni.png" alt="Logo UP" width={80} height={40} />
        </div>
      </footer>

      {/* MODAL MENÚ (Incrustado) */}
      {modalMenuOpen && (
        <div className={styles.modalOverlay}>
          {/* Hacemos el modal más grande para que el PDF se lea bien */}
          <div className={styles.modalContent} style={{ width: '90%', maxWidth: '900px', height: '85vh', display: 'flex', flexDirection: 'column' }}>
            <button className={styles.closeModal} onClick={cerrarModalMenu}>&times;</button>
            
            <div style={{ padding: "20px", color: "#6b1e1e", flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ marginBottom: '15px' }}>Menú de {restaurante?.nombre}</h2>
              
              {urlDelMenu ? (
                /* Usamos el visor de Google Docs para forzar la lectura del PDF sin descargarlo */
                <iframe 
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(String(urlDelMenu))}&embedded=true`} 
                  style={{ width: "100%", flex: 1, border: "1px solid #ccc", borderRadius: "8px" }} 
                  title="Menú del Restaurante"
                />
              ) : (
                /* Muestra el mensaje si no hay PDF */
                <p>Este restaurante aún no ha subido su menú.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODALES DE SESIÓN */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onOpenAdmin={() => { setIsLoginModalOpen(false); setIsAdminModalOpen(true); }} onOpenRest={() => { setIsLoginModalOpen(false); setIsRestModalOpen(true); }} onOpenUser={() => { setIsLoginModalOpen(false); setIsUserModalOpen(true); }} onOpenRegistro={() => { setIsLoginModalOpen(false); setIsRegistroOpen(true); }} />
      <LoginAdmin isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} onBack={handleBackToLogin} />
      <LoginRest isOpen={isRestModalOpen} onClose={() => setIsRestModalOpen(false)} onBack={handleBackToLogin} />
      <LoginUser isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onBack={handleBackToLogin} onLoginSuccess={handleLoginSuccess} />
      <RegistroModal isOpen={isRegistroOpen} onClose={() => setIsRegistroOpen(false)} onBack={() => { setIsRegistroOpen(false); setIsLoginModalOpen(true); }} onLoginSuccess={handleLoginSuccess} />

    </div>
  );
}

export default function VistaRestaurante() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Cargando página...</div>}>
      <RestauranteContenido />
    </Suspense>
  );
}