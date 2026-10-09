// Sistema/JS/data.js - Datos pedagógicos para Mis Tablas (4° Básico)

const TABLES_DATA = {
  2: {
    number: 2,
    title: "Tabla del 2: El Poder de los Pares",
    color: "#3B82F6",
    bgGradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
    icon: "🍒",
    itemEmoji: "🍒",
    itemName: "Cerezas en pares",
    pattern: "¡Todos los resultados son números pares y terminan en 0, 2, 4, 6 u 8! Multiplicar por 2 es exactamente lo mismo que sumar un número consigo mismo (el doble).",
    tip: "💡 Truco mental: Para 2 × 7, solo piensa en 7 + 7 = 14.",
    unlockedByDefault: true
  },
  3: {
    number: 3,
    title: "Tabla del 3: Tríos Saltarines",
    color: "#10B981",
    bgGradient: "linear-gradient(135deg, #10B981 0%, #047857 100%)",
    icon: "🔺",
    itemEmoji: "🌟",
    itemName: "Estrellas mágicas",
    pattern: "¡Si sumas los dígitos del resultado de cualquier múltiplo de 3, la suma siempre da 3, 6 o 9! Por ejemplo: 3 × 7 = 21, y 2 + 1 = 3.",
    tip: "💡 Truco mental: Imagina que vas dando saltos de 3 en 3: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30.",
    unlockedByDefault: true
  },
  4: {
    number: 4,
    title: "Tabla del 4: El Doble del Doble",
    color: "#F59E0B",
    bgGradient: "linear-gradient(135deg, #F59E0B 0%, #B45309 100%)",
    icon: "🍀",
    itemEmoji: "🍀",
    itemName: "Tréboles de la suerte",
    pattern: "¡Multiplicar por 4 es calcular el doble dos veces! Si quieres calcular 4 × 6, primero haz el doble de 6 (12), y luego el doble de 12 (24).",
    tip: "💡 Truco mental: Todos los resultados de la tabla del 4 son números pares.",
    unlockedByDefault: false
  },
  5: {
    number: 5,
    title: "Tabla del 5: Monedas y Manos",
    color: "#EC4899",
    bgGradient: "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)",
    icon: "🖐️",
    itemEmoji: "🪙",
    itemName: "Monedas de oro",
    pattern: "¡Todos los resultados terminan en 0 o en 5! Si multiplicas por un número par, termina en 0 (5 × 6 = 30). Si multiplicas por impar, termina en 5 (5 × 7 = 35).",
    tip: "💡 Truco mental: Es exactamente igual a cómo avanzan los minutos en las manecillas del reloj.",
    unlockedByDefault: false
  },
  6: {
    number: 6,
    title: "Tabla del 6: El Doble del Tres",
    color: "#8B5CF6",
    bgGradient: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
    icon: "🎲",
    itemEmoji: "🐝",
    itemName: "Abejitas obreras",
    pattern: "¡La tabla del 6 es el doble de los resultados de la tabla del 3! Además, 6 × número par siempre termina en ese mismo dígito: 6 × 2 = 12, 6 × 4 = 24, 6 × 6 = 36, 6 × 8 = 48.",
    tip: "💡 Truco mental: Si ya sabes la tabla del 5, solo suma el número una vez más. Ejemplo: 6 × 7 = (5 × 7) + 7 = 35 + 7 = 42.",
    unlockedByDefault: false
  },
  7: {
    number: 7,
    title: "Tabla del 7: Días de la Semana",
    color: "#06B6D4",
    bgGradient: "linear-gradient(135deg, #06B6D4 0%, #0E7490 100%)",
    icon: "🌈",
    itemEmoji: "💎",
    itemName: "Gemas brillantes",
    pattern: "¡Una semana tiene 7 días! Calcular la tabla del 7 es como contar los días en varias semanas. 3 semanas = 21 días. 4 semanas = 28 días.",
    tip: "💡 Truco mental: Recuerda descomponer: 7 × 8 es lo mismo que (5 × 8) + (2 × 8) = 40 + 16 = 56.",
    unlockedByDefault: false
  },
  8: {
    number: 8,
    title: "Tabla del 8: El Pulpo Multiplicador",
    color: "#EF4444",
    bgGradient: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)",
    icon: "🐙",
    itemEmoji: "🐙",
    itemName: "Tentáculos veloces",
    pattern: "¡La tabla del 8 es el doble de la tabla del 4! O tres veces el doble: doble, doble y doble. Para 8 × 5: doble de 5 es 10, doble de 10 es 20, y doble de 20 es 40.",
    tip: "💡 Truco mental: Las unidades de los resultados bajan de 2 en 2: 8, 16, 24, 32, 40, 48, 56, 64, 72, 80.",
    unlockedByDefault: false
  },
  9: {
    number: 9,
    title: "Tabla del 9: El Gran Misterio del Nueve",
    color: "#14B8A6",
    bgGradient: "linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)",
    icon: "🪐",
    itemEmoji: "🚀",
    itemName: "Cohetes espaciales",
    pattern: "¡El truco más asombroso de la matemática! Los dos dígitos de cualquier resultado del 9 siempre suman 9: 9×2=18 (1+8=9), 9×5=45 (4+5=9), 9×9=81 (8+1=9). Además, la primera cifra siempre es 1 menos que el número multiplicado.",
    tip: "💡 Truco mental: 9 × N es lo mismo que (10 × N) - N. Por ejemplo: 9 × 7 = 70 - 7 = 63.",
    unlockedByDefault: false
  },
  10: {
    number: 10,
    title: "Tabla del 10: La Decena Mágica",
    color: "#F97316",
    bgGradient: "linear-gradient(135deg, #F97316 0%, #C2410C 100%)",
    icon: "🔟",
    itemEmoji: "🎁",
    itemName: "Cajas de sorpresas",
    pattern: "¡La tabla más rápida de todas! Solo tienes que tomar el número que estás multiplicando y agregarle un cero (0) al final. ¡Así de fácil!",
    tip: "💡 Truco mental: 10 × 6 = 60. 10 × 9 = 90. ¡Multiplicar por 10 es simplemente convertir unidades en decenas!",
    unlockedByDefault: false
  }
};

// Banco de 10 preguntas tipo SIMCE contextualizadas para 4° Básico
const SIMCE_QUESTIONS = [
  {
    id: 1,
    title: "Pregunta 1: La feria del barrio",
    context: "Don Pedro tiene un puesto de frutas en la feria de la esquina. Él prepara bolsas con 6 manzanas rojas cada una para venderlas frescas a los vecinos.",
    problem: "Si la mamá de Camila compra 4 bolsas completas de manzanas para la colación de la semana, ¿cuántas manzanas compró en total?",
    scheme: "4 bolsas × 6 manzanas en cada bolsa",
    icon: "🍎",
    options: [
      { text: "10 manzanas", label: "A" },
      { text: "20 manzanas", label: "B" },
      { text: "24 manzanas", label: "C" },
      { text: "28 manzanas", label: "D" }
    ],
    correctIndex: 2, // C: 24
    explanation: "Para calcular el total de manzanas, multiplicamos la cantidad de bolsas (4) por la cantidad de manzanas por bolsa (6): 4 × 6 = 24 manzanas. (O sumamos 6 + 6 + 6 + 6 = 24)."
  },
  {
    id: 2,
    title: "Pregunta 2: El cine del centro",
    context: "El 4° año básico de la escuela fue al cine a ver una película sobre dinosaurios. La sala asignada tiene filas muy ordenadas.",
    problem: "En la sala hay 8 filas de asientos. Si en cada fila caben exactamente 7 estudiantes sentados, ¿cuántos asientos hay en total en la sala?",
    scheme: "8 filas con 7 asientos cada una",
    icon: "🎬",
    options: [
      { text: "54 asientos", label: "A" },
      { text: "56 asientos", label: "B" },
      { text: "48 asientos", label: "C" },
      { text: "64 asientos", label: "D" }
    ],
    correctIndex: 1, // B: 56
    explanation: "Un arreglo rectangular de filas y columnas se resuelve multiplicando: 8 filas × 7 asientos = 56 asientos en total. 8 × 7 = 56."
  },
  {
    id: 3,
    title: "Pregunta 3: Las láminas de fútbol",
    context: "Diego y sus amigos están completando el álbum del campeonato de fútbol escolar en el recreo.",
    problem: "Diego fue al kiosco del colegio y compró 5 sobres de láminas. Si cada sobre contiene 6 láminas adentro, ¿cuántas láminas nuevas tiene Diego?",
    scheme: "5 sobres con 6 láminas por sobre",
    icon: "⚽",
    options: [
      { text: "30 láminas", label: "A" },
      { text: "25 láminas", label: "B" },
      { text: "35 láminas", label: "C" },
      { text: "11 láminas", label: "D" }
    ],
    correctIndex: 0, // A: 30
    explanation: "Multiplicamos la cantidad de sobres (5) por la cantidad de láminas de cada sobre (6): 5 × 6 = 30 láminas. Sumar 6 cinco veces: 6 + 6 + 6 + 6 + 6 = 30."
  },
  {
    id: 4,
    title: "Pregunta 4: El huerto escolar",
    context: "En el taller de ciencias, las y los estudiantes de 4° básico están cultivando un huerto con hortalizas saludables.",
    problem: "Plantaron 9 hileras de lechugas y en cada hilera colocaron 4 lechugas bien cuidadas. ¿Cuántas lechugas plantaron en total?",
    scheme: "9 hileras × 4 lechugas cada hilera",
    icon: "🥬",
    options: [
      { text: "32 lechugas", label: "A" },
      { text: "36 lechugas", label: "B" },
      { text: "40 lechugas", label: "C" },
      { text: "13 lechugas", label: "D" }
    ],
    correctIndex: 1, // B: 36
    explanation: "Calculamos 9 hileras por 4 lechugas: 9 × 4 = 36 lechugas. Recuerda el truco de la tabla del 9: el doble de 9 es 18, y el doble de 18 es 36."
  },
  {
    id: 5,
    title: "Pregunta 5: La sala de artes",
    context: "La profesora de Artes Visuales organizó el salón en 8 grupos de trabajo colaborativo para pintar un mural primaveral.",
    problem: "Para el trabajo, la profesora entregó 3 cajas de lápices de cera a cada uno de los 8 grupos. ¿Cuántas cajas de lápices entregó en total?",
    scheme: "8 grupos × 3 cajas por grupo",
    icon: "🎨",
    options: [
      { text: "21 cajas", label: "A" },
      { text: "11 cajas", label: "B" },
      { text: "24 cajas", label: "C" },
      { text: "27 cajas", label: "D" }
    ],
    correctIndex: 2, // C: 24
    explanation: "Multiplicamos 8 grupos por 3 cajas de lápices cada uno: 8 × 3 = 24 cajas. O bien por propiedad conmutativa: 3 × 8 = 24."
  },
  {
    id: 6,
    title: "Pregunta 6: El cumpleaños de Sofía",
    context: "Sofía está celebrando su cumpleaños junto a sus compañeros del colegio y preparó sorpresitas de regalo.",
    problem: "Ella armó 7 bolsitas de cumpleaños. En cada bolsita puso 8 dulces saludables y juguetes sorpresa. ¿Cuántos dulces y juguetes utilizó en total para todas las bolsas?",
    scheme: "7 bolsas × 8 regalitos cada una",
    icon: "🎉",
    options: [
      { text: "56 regalitos", label: "A" },
      { text: "49 regalitos", label: "B" },
      { text: "63 regalitos", label: "C" },
      { text: "15 regalitos", label: "D" }
    ],
    correctIndex: 0, // A: 56
    explanation: "Multiplicamos la cantidad de bolsas (7) por la cantidad de elementos en cada bolsa (8): 7 × 8 = 56 regalitos en total."
  },
  {
    id: 7,
    title: "Pregunta 7: La pastelería chilena",
    context: "En una pastelería tradicional hornean deliciosas bandejas de empanaditas de queso para un festejo de Fiestas Patrias.",
    problem: "El pastelero colocó 9 empanaditas en cada bandeja. Si horneó 7 bandejas completas de empanaditas, ¿cuántas empanaditas horneó en total?",
    scheme: "7 bandejas × 9 empanaditas por bandeja",
    icon: "🥟",
    options: [
      { text: "54 empanaditas", label: "A" },
      { text: "63 empanaditas", label: "B" },
      { text: "72 empanaditas", label: "C" },
      { text: "69 empanaditas", label: "D" }
    ],
    correctIndex: 1, // B: 63
    explanation: "Multiplicamos 7 bandejas por 9 empanaditas: 7 × 9 = 63 empanaditas. Observa que en 63, los dígitos 6 + 3 suman 9, demostrando el patrón del 9."
  },
  {
    id: 8,
    title: "Pregunta 8: La biblioteca del colegio",
    context: "El bibliotecario del colegio está ordenando los nuevos libros de fábulas y leyendas en la estantería infantil.",
    problem: "En una estantería acomodó 6 repisas de madera. En cada repisa colocó exactamente 8 libros infantiles. ¿Cuántos libros quedaron ordenados en la estantería?",
    scheme: "6 repisas × 8 libros en cada repisa",
    icon: "📚",
    options: [
      { text: "42 libros", label: "A" },
      { text: "46 libros", label: "B" },
      { text: "48 libros", label: "C" },
      { text: "54 libros", label: "D" }
    ],
    correctIndex: 2, // C: 48
    explanation: "Multiplicamos 6 repisas por 8 libros en cada una: 6 × 8 = 48 libros. (Recuerda: 6 × 8 = 48)."
  },
  {
    id: 9,
    title: "Pregunta 9: La alcancía de Matías",
    context: "Matías se propuso una meta de ahorro para comprar un set de plumones de colores para sus clases de matemática.",
    problem: "Durante 5 semanas seguidas, Matías depositó en su alcancía 9 monedas de $100 cada semana. ¿Cuántas monedas de $100 juntó en total?",
    scheme: "5 semanas × 9 monedas por semana",
    icon: "🪙",
    options: [
      { text: "45 monedas", label: "A" },
      { text: "40 monedas", label: "B" },
      { text: "50 monedas", label: "C" },
      { text: "14 monedas", label: "D" }
    ],
    correctIndex: 0, // A: 45
    explanation: "Multiplicamos las 5 semanas por las 9 monedas que ahorró en cada una: 5 × 9 = 45 monedas. (En dinero total ahorró $4.500)."
  },
  {
    id: 10,
    title: "Pregunta 10: La kermés solidaria",
    context: "Para la kermés del colegio, el curso organizó el clásico juego de puntería de 'Bota las Botellas'.",
    problem: "Los estudiantes ordenaron 4 mesas de juego. En cada mesa acomodaron una torre con 10 botellas plásticas recicladas. ¿Cuántas botellas hay listas para jugar?",
    scheme: "4 mesas × 10 botellas en cada mesa",
    icon: "🎯",
    options: [
      { text: "30 botellas", label: "A" },
      { text: "40 botellas", label: "B" },
      { text: "14 botellas", label: "C" },
      { text: "400 botellas", label: "D" }
    ],
    correctIndex: 1, // B: 40
    explanation: "Multiplicamos 4 mesas por 10 botellas: 4 × 10 = 40 botellas en total. ¡Solo agregamos un cero al 4!"
  }
];

// Medallas y Logros desbloqueables
const BADGES_CONFIG = [
  { id: "novato", name: "Primer Paso", desc: "Comenzaste tu aventura en Mis Tablas", icon: "🌱", color: "#10B981" },
  { id: "tabla_2", name: "Doble Campeón", desc: "Dominaste la tabla del 2", icon: "🍒", color: "#3B82F6" },
  { id: "tabla_3", name: "Trío de Ases", desc: "Completaste la tabla del 3", icon: "🔺", color: "#10B981" },
  { id: "tabla_4", name: "Cuarteto de Oro", desc: "Superaste los desafíos del 4", icon: "🍀", color: "#F59E0B" },
  { id: "tabla_5", name: "Choca Esos Cinco", desc: "Conquistaste la tabla del 5", icon: "🖐️", color: "#EC4899" },
  { id: "tabla_6", name: "Media Docena", desc: "Completaste la tabla del 6", icon: "🎲", color: "#8B5CF6" },
  { id: "tabla_7", name: "Siete Maravillas", desc: "Dominaste la desafiante tabla del 7", icon: "🌈", color: "#06B6D4" },
  { id: "tabla_8", name: "Pulpo Sabio", desc: "Conquistaste la tabla del 8", icon: "🐙", color: "#EF4444" },
  { id: "tabla_9", name: "Rey del Truco del 9", desc: "Descubriste los secretos del 9", icon: "🪐", color: "#14B8A6" },
  { id: "tabla_10", name: "Decena Perfecta", desc: "Completaste la tabla del 10", icon: "🔟", color: "#F97316" },
  { id: "juego_memoria", name: "Mente Fotográfica", desc: "Ganaste el juego de Memoria Matemática", icon: "🧠", color: "#6366F1" },
  { id: "juego_atrapa", name: "Atrapador Estrella", desc: "Atrapaste 10 resultados a toda velocidad", icon: "🎈", color: "#EC4899" },
  { id: "juego_tiempo", name: "Rayo Veloz", desc: "Completaste la Fiebre Contra el Reloj", icon: "⚡", color: "#F59E0B" },
  { id: "juego_detective", name: "Detective Máster", desc: "Descifraste las pistas matemáticas", icon: "🕵️", color: "#059669" },
  { id: "simce_crack", name: "Genio SIMCE", desc: "Obtuviste sobre el 80% en el ensayo SIMCE", icon: "🏆", color: "#FACC15" }
];
