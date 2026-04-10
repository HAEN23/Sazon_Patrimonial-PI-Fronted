# Sazón Patrimonial - Frontend

Este repositorio contiene la aplicación cliente (Frontend) del proyecto Sazón Patrimonial, diseñada para mostrar el catálogo de restaurantes de Chiapa de Corzo, permitir el registro de usuarios y restauranteros, y visualizar paneles estadísticos dinámicos.

## Arquitectura y Tecnologías
La aplicación está construida utilizando una arquitectura orientada a componentes, separada completamente de la lógica de negocio del backend.
* **Framework:** Next.js / React
* **Estilos:** CSS Modules (`.module.css`) para evitar colisiones de estilos.
* **Gráficas:** `react-chartjs-2` y `chart.js` para visualización interactiva de datos.
* **Despliegue:** Preparado para Vercel.

## Pruebas y Aseguramiento de Calidad (QA)
Las pruebas de Interfaz de Usuario (UI) y flujos End-to-End (E2E) correspondientes a las Historias de Usuario han sido documentadas. Las herramientas usadas para las pruebas fueron (Selenium/Appium) para validar flujos críticos como el registro, inicio de sesión y renderizado del dashboard estadístico y Jmeter usado para cuantos usuarios podrian estar en simulteaneo en la pagina principal.

## Declaración de uso de Inteligencia Artificial y recursos externos
Durante el desarrollo de este proyecto, se utilizó asistencia de Inteligencia Artificial (Gemini) estrictamente como herramienta de apoyo algorítmico y de diseño para las siguientes tareas específicas:

Optimización visual y de responsividad: Refactorización del código de las gráficas (Chart.js) en el Frontend para mejorar el diseño responsivo mediante el uso avanzado de CSS Grid (auto-fit, minmax).

Seguridad en formularios: Generación de Expresiones Regulares (Regex) complejas para la validación de contraseñas seguras directamente en el cliente.
