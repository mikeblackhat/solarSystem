# 🌌 Sistema Solar 3D Interactivo con Efecto Big Bang

## 📋 Descripción
Este proyecto es una animación 3D interactiva de un sistema solar con efectos visuales avanzados, incluyendo un espectacular efecto Big Bang, planetas con shaders personalizados, cometas y una nave espacial.

## 🚀 Archivos Disponibles

### Archivos Principales
- **`index.html`** - Versión original del sistema solar
- **`script.js`** - Código JavaScript principal
- **`style.css`** - Estilos CSS

### Archivos de Prueba y Depuración
- **`galaxy_complete.html`** - ✅ **VERSIÓN RECOMENDADA** - Sistema completo con todos los efectos
- **`final_test.html`** - Versión simplificada para pruebas básicas
- **`galaxy_working.html`** - Versión intermedia con funcionalidad básica

## 🎯 Cómo Ver el Sistema Solar y el Efecto Big Bang

### Método 1: Usar la Versión Completa (Recomendado)
1. Abre el archivo `galaxy_complete.html` en tu navegador
2. **Para ver el sistema solar**: El sistema se carga automáticamente
3. **Para activar el efecto Big Bang**: Haz clic en cualquier parte de la pantalla

### Método 2: Servidor Local
1. Asegúrate de tener Python instalado
2. Ejecuta en la terminal: `python -m http.server 3000`
3. Abre tu navegador y ve a: `http://localhost:3000/galaxy_complete.html`

## 🎮 Controles

### Controles del Teclado
- **Mouse**: Rotar y orbitar la cámara
- **Scroll**: Zoom in/out
- **R**: Reiniciar vista a la posición inicial
- **T**: Cambiar entre temas (Inferno, Veridian, Celestial)
- **ESPACIO**: Activar/desactivar resonancia de energía
- **D**: Mostrar/ocultar panel de depuración
- **Click**: Activar efecto Big Bang

### Controles Visuales
Los botones en pantalla te permiten:
- Resetear la vista
- Activar resonancia
- Cambiar velocidad del tiempo
- Cambiar tema visual

## ✨ Características

### 🌟 Sistema Solar
- **Estrella Central**: Con shader personalizado de plasma y efectos de brillo
- **7 Planetas**: Cada uno con shaders únicos y órbitas realistas
- **Órbitas Visibles**: Anillos brillantes que muestran las trayectorias
- **Iluminación Dinámica**: Luces ambiental y puntual con sombras

### 💥 Efecto Big Bang
- **Animación Espectacular**: Explosión cósmica con ondas de energía
- **Shaders Avanzados**: Efectos de partículas y distorsión espacial
- **Activación con Click**: Simplemente haz clic en la pantalla

### 🌠 Efectos Adicionales
- **Cometas**: 5 cometas con trayectorias aleatorias
- **Nave Espacial**: Objeto 3D orbitando el sistema
- **Resonancia de Energía**: Efecto visual que intensifica los colores
- **Post-Procesamiento**: Efectos de bloom y tonemapping cinematográfico

## 🎨 Temas Visuales

### 🔥 Tema Inferno
- Colores cálidos y rojizos
- Atmósfera intensa y dramática

### 🌿 Tema Veridian  
- Colores verdes y naturales
- Ambiente futurista y limpio

### 🌌 Tema Celestial
- Colores azules y dorados
- Estilo clásico del espacio

## 🔧 Solución de Problemas

### "No veo nada en la pantalla"
1. **Verifica la consola del navegador** (F12 → Consola)
2. **Prueba la versión simplificada**: Abre `final_test.html`
3. **Asegúrate de tener conexión a internet** (los recursos se cargan desde CDN)

### "El efecto Big Bang no aparece"
1. **Haz clic en la pantalla** para activar el efecto
2. **Verifica que estés usando** `galaxy_complete.html`
3. **El efecto dura 5 segundos** y luego desaparece automáticamente

### "Los controles no funcionan"
1. **Haz clic en la pantalla** primero para dar foco al canvas
2. **Verifica que JavaScript esté habilitado** en tu navegador
3. **Prueba los controles del mouse** (arrastrar para rotar)

## 🌐 Requisitos del Navegador
- **WebGL**: Compatible con WebGL 2.0
- **ES6 Modules**: Soporte para módulos JavaScript
- **Modern Browser**: Chrome 61+, Firefox 60+, Safari 11+, Edge 79+

## 📁 Estructura del Proyecto
```
Interactive 3D Galaxy Animation/
├── index.html              # Versión original
├── script.js               # Código principal
├── style.css               # Estilos
├── galaxy_complete.html    # ✅ Versión completa recomendada
├── final_test.html         # Versión de prueba simplificada
├── galaxy_working.html     # Versión intermedia
└── README.md               # Este archivo
```

## 🎬 Experiencia Recomendada
1. **Abre `galaxy_complete.html`**
2. **Espera a que cargue completamente** (verás los planetas)
3. **Usa el mouse para explorar** el sistema solar
4. **Haz clic para ver el Big Bang**
5. **Prueba diferentes temas** con la tecla T
6. **Activa la resonancia** con ESPACIO

## 🆘 Soporte
Si sigues sin ver el sistema solar o el efecto Big Bang:
1. **Abre la consola del navegador** (F12) y envíame cualquier error
2. **Prueba la versión `final_test.html`** para verificar la funcionalidad básica
3. **Verifica tu conexión a internet** (los recursos se cargan desde CDN)

¡Disfruta explorando el universo! 🚀✨