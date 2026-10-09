# 🌟 Plataforma Educativa "Mis Tablas" (4° Básico)

Plataforma educativa web interactiva, lúdica y gamificada desarrollada para estudiantes de 4° básico (Chile), orientada al aprendizaje significativo de las tablas de multiplicar del 2 al 10 y al entrenamiento de habilidades matemáticas mediante ejercicios tipo SIMCE con situaciones contextualizadas.

---

## 📋 Información del Proyecto
- **Asignatura / Módulo:** Elaboración de Apps para Dispositivos Electrónicos Móviles (Unidad 4)
- **Objetivo de Aprendizaje (OA5):** Desarrollar aplicaciones para dispositivos móviles y con mecanismos de control.
- **Nivel:** 4° Año de Enseñanza Básica (Eje Números y Operaciones).
- **Tecnologías:** HTML5 Semántico, CSS3 Moderno (Responsive, Mobile-First), JavaScript (ES6+), Web Audio API, Canvas Confetti, SVG Vector Graphics.
- **Servidor Local:** XAMPP Apache (`htdocs/misTablas`).

---

## 📁 Estructura del Proyecto
```
htdocs/
└── misTablas/
    ├── index.html                  # Etapa 1: Login del estudiante, avatares y validación
    ├── README.md                   # Documentación y pauta de evaluación
    └── Sistema/
        ├── index.html              # Etapa 2, 3 y 4: Menú principal, Vistas interactivas
        ├── CSS/
        │   └── style.css           # Estilos completos, diseño responsivo y animaciones
        ├── IMAGEN/
        │   ├── logo.svg            # Emblema oficial de "Mis Tablas"
        │   ├── star.svg            # Estrella interactiva
        │   ├── trophy.svg          # Trofeo dorado de campeones
        │   ├── medal.svg           # Medalla de logros
        │   ├── avatar-cosmo.svg    # Astronauta Cosmo
        │   ├── avatar-rexi.svg     # Dinosaurio Rexi
        │   ├── avatar-chip.svg     # Robot Sabio Chip
        │   ├── avatar-foxy.svg     # Zorro Veloz Foxy
        │   ├── avatar-mishi.svg    # Gato Mágico Mishi
        │   └── avatar-ollie.svg    # Búho Detective Ollie
        └── JS/
            ├── sound.js            # Sintetizador Web Audio API (efectos de sonido arcade sin dependencias externas)
            ├── confetti.js         # Motor Canvas de confeti para celebraciones
            ├── data.js             # Datos pedagógicos de tablas (2 al 10), patrones y 10 preguntas SIMCE
            ├── tables.js           # Módulo interactivo de agrupación visual y misiones de tablas
            ├── games.js            # 7 minijuegos interactivos (Memoria, Atrapa, Arrastra, etc.)
            ├── simce.js            # Simulador de ensayo SIMCE con navegación lateral y retroalimentación
            └── app.js              # Controlador principal, perfil de usuario, niveles y almacenamiento
```

---

## 🚀 Cómo Ejecutar en XAMPP
1. Abre el **Panel de Control de XAMPP**.
2. Inicia el módulo **Apache** haciendo clic en **Start**.
3. Asegúrate de que la carpeta `misTablas` esté ubicada en:
   `C:\xampp\htdocs\misTablas`
4. Abre tu navegador web favorito (Google Chrome, Microsoft Edge, Mozilla Firefox) e ingresa a:
   👉 **`http://localhost/misTablas/`**
5. *(Opcional)* Si no deseas usar XAMPP, puedes abrir directamente el archivo `index.html` haciendo doble clic en él.

---

## 🎯 Características y Módulos Desarrollados

### 1. Etapa 1: Ingreso del Estudiante (`index.html`)
- Identificación personalizada con nombre o apodo (mínimo 2 letras).
- Galería interactiva con 6 avatares con personalidad (Cosmo, Rexi, Chip, Foxy, Mishi, Ollie).
- Validación de formulario antes de ingresar con mensajes y alertas amigables.
- Detección automática de estudiantes previos con botón de acceso rápido.
- Almacenamiento local persistente (`localStorage`).

### 2. Etapa 2: Menú Principal Gamer (`Sistema/index.html`)
- Barra superior con foto de avatar, nivel del jugador (Explorador a Leyenda), puntos XP acumulados, estrellas ⭐, control de sonido (silenciar/activar) y botón de salida.
- Tarjetas interactivas con animaciones hover y caminos de aprendizaje:
  - **Mundo de Tablas**: mapa de islas con las tablas del 2 al 10.
  - **Juegos y Desafíos**: zona de minijuegos arcade matemáticos.
  - **Ensayo SIMCE**: evaluación contextualizada con resultados y solucionario.
  - **Mi Progreso**: estadísticas detalladas y barras de dominio por tabla.
  - **Logros y Medallas**: álbum coleccionable de 15 insignias.
  - **Misión Especial Trío**: desafío combinado contra el tiempo.

### 3. Etapa 3: Ruta Pedagógica Guiada ("¡Primero Aprendo, Luego Desafíos!")
- **Flujo Secuencial Obligatorio:** El estudiante primero debe explorar y aprender la tabla para desbloquear los desafíos y juegos, guiado por su avatar con animaciones y globos de diálogo.
- **Paso A - Representación Concreta y Pictórica:** Selector interactivo con animaciones de rebote escalonadas que dibuja grupos reales de objetos (cerezas, estrellas, abejitas, gemas, etc.).
- **Suma Iterada Animada:** Visualización de la multiplicación como sumas repetidas paso a paso (ej: 4 × 3 = 3 + 3 + 3 + 3 = 12).
- **Lectura por Voz:** Botón de síntesis de voz en español para escuchar la pronunciación exacta de la operación.
- **Paso B - Patrones Secretos y Trucos Mentales:** Explicaciones de trucos mentales (números pares, suma de dígitos en el 9, terminaciones en 0 y 5).
- **Paso C - Desbloqueo Triunfal:** Botón dorado pulsante de graduación con confeti y fanfarria que desbloquea la Zona de Desafíos y Juegos.

### 4. Zona de Desafíos con Minijuegos Didácticos (Cero Monotonía)
1. 🎁 **JUEGO ESTRELLA: "Memoriza y Descubre las Cajas Anónimas"**:
   - **Fase de Memorización:** Aparece una tarjeta dorada brillante con la operación y su resultado en letras gigantes, acompañada de una barra y temporizador circular de 4 segundos con sonido de tictac (*tick... tick...*).
   - **Fase de Desaparición:** ¡Puf mágico! La tarjeta se desvanece con animación de desenfoque.
   - **Fase de Cajas Anónimas:** Aparecen 4 cofres cerrados que tiemblan con brillo y un gran signo `?` (100% anónimos). El niño debe abrir la caja donde cree que está el resultado que memorizó. Al tocarla, la caja se abre en 3D con sonido mágico y el número flota hacia arriba. Si acierta, ¡explosión de confeti y esmeralda brillante! Si falla, revela el número y le permite seguir buscando sin frustración.
2. ⚡ **Rayo Veloz de la Tabla:** 30 segundos de adrenalina respondiendo operaciones consecutivas de la tabla.
3. ⭐ **Desafío de las 3 Estrellas:** Evaluación formativa con pistas para obtener 3 ⭐⭐⭐ y avanzar en el mapa.
4. 🧠 **Memoria Matemática Clásica:** Empareja multiplicaciones con su resultado en tarjetas 3D.
5. 🎯 **Atrapa el Resultado:** Burbujas flotantes que desafían la velocidad de cálculo.
6. 🧱 **Construye la Multiplicación:** Agrupa canastas y manzanas interactivas para alcanzar la meta.
7. 🎭 **¿Quién tiene la respuesta?:** Descubre qué amigo dice la verdad matemática.
8. 🖐️ **Arrastra y Completa (Drag & Drop):** Encaja fichas numéricas en ecuaciones (mouse y pantallas táctiles).
9. 🕵️ **Detective Matemático:** Resuelve casos deduciendo el número misterioso con pistas de múltiplos.

### 5. Etapa 4: Ensayo Matemático tipo SIMCE (4° Básico)
- 10 preguntas con situaciones auténticas: feria del barrio, filas del cine, sobres de láminas, huerto escolar, pastelería tradicional, biblioteca, ahorros y kermés escolar.
- Panel lateral con las 10 preguntas numeradas e indicadores de estado (Actual, Respondida, Pendiente).
- 4 alternativas por pregunta (A, B, C, D).
- Cálculo de puntaje oficial estimado SIMCE (200 a 350 puntos) y nivel de logro (Elemental, Adecuado, Avanzado).
- **Solucionario Pedagógico Paso a Paso**: explica de forma clara el porqué de la respuesta correcta en cada pregunta.

---

## 📅 Cumplimiento de Evaluaciones

| Fecha | Tipo | Objetivo Evaluado | Estado en el Proyecto |
|---|---|---|---|
| **14-10-2026** | **Formativa** | Interfaz interactiva 4° Básico, login validado, menú interactivo y animaciones, respaldo en GitHub. | ✅ **Completado al 100%** (Login interactivo, avatares, validación, menú con animaciones y confeti). |
| **21-10-2026** | **Formativa** | Actividades interactivas tablas 2 al 6, arrastrar y soltar, animaciones y aprendizaje mediante juego. | ✅ **Completado al 100%** (Tablas 2 al 10 interactivas con drag & drop táctil, 7 minijuegos). |
| **21-10-2026** | **Sumativa** | Demostración integral del proyecto, contenidos matemáticos, ensayo SIMCE, diseño adaptado a móviles y respaldo en GitHub. | ✅ **Completado al 100%** (Integración completa, responsive mobile-ready, simulador SIMCE con retroalimentación). |

---

## 🐙 Guía para Respaldar en GitHub
Si tienes Git instalado en tu computador:
```bash
# 1. Abrir la terminal en la carpeta del proyecto
cd C:\xampp\htdocs\misTablas

# 2. Inicializar el repositorio Git
git init

# 3. Agregar todos los archivos
git add .

# 4. Crear el commit inicial
git commit -m "feat: Plataforma educativa Mis Tablas completa (Login, Menú, Tablas 2 al 10, Minijuegos y Ensayo SIMCE)"

# 5. Conectar con tu repositorio en GitHub (reemplaza TU-USUARIO y TU-REPO)
git remote add origin https://github.com/TU-USUARIO/misTablas.git
git branch -M main
git push -u origin main
```
