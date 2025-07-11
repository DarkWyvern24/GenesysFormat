# e4front - Yu-Gi-Oh! Deck Builder

¡Bienvenido a **e4front**!  
Una aplicación web hecha en **React** que te permite construir mazos de Yu-Gi-Oh! de forma sencilla, con un diseño inspirado en EDOPro/YGOPro.

---

## 🚀 Características principales

✅ Búsqueda de cartas en tiempo real usando la **API pública de YGOPRODECK**  
✅ Filtro por nombre parcial o completo (case insensitive)  
✅ Visualización con imagen y descripción de cada carta  
✅ Deck Builder con soporte para:  
- Main Deck (40-60 cartas)  
- Extra Deck (0-15 cartas)  
- Side Deck (0-15 cartas)  
✅ Límite de 3 copias totales por carta entre todos los decks  
✅ Guardado automático en **localStorage**  
✅ Soporte para múltiples mazos con:  
- Crear  
- Renombrar  
- Guardar  
- Guardar como  
✅ Ordenar mazos por tipo y nombre  
✅ Estilo **Dark Mode** consistente  
✅ Fondo personalizado y logo  
✅ Música de fondo opcional (embed de YouTube)

---

## 🖥️ Tecnologías usadas

- **ReactJS** (Vite o Create React App)
- **Bootstrap 5**
- **JavaScript moderno (ES6)**
- **CSS personalizado (modo oscuro completo)**
- **LocalStorage** para persistencia
- **API pública YGOPRODECK** para obtener datos de cartas

---

## 🌐 API utilizada

[YGOPRODECK API](https://db.ygoprodeck.com/api-guide/)

---

## 🗂️ Estructura del proyecto
/public

background.jpg

logo.png

/src
/components
- DeckBuilder.jsx
- CardPreview.jsx
- CardResultItem.jsx
- DeckRow.jsx
/styles
- custom.css

App.js


---

## ⚙️ Cómo usar este proyecto

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/TUUSUARIO/e4front.git
cd e4front
### 2️⃣ Instalar dependencias
npm install
### 3️⃣ Ejecutar en desarrollo
npm start

💾 Notas técnicas
Los decks se guardan automáticamente en localStorage bajo la clave allDecks.

El fondo y el logo se colocan en /public para cargarse globalmente.

La música de fondo se reproduce de forma oculta mediante un iframe de YouTube (con autoplay).

Se recomienda reemplazar el video por un archivo local <audio> para mayor control.

✨ Créditos
Datos de cartas: YGOPRODECK API

Inspiración visual: EDOPro / YGOPro
