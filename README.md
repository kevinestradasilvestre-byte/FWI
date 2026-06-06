# ⚡ Simulador Web: Análisis de Contexto y Crisis

## Descripción del Proyecto
Este proyecto es una aplicación web interactiva desarrollada para la asignatura de **Programación Web I**. Su objetivo principal es modelar, calcular y visualizar situaciones reales del contexto actual (como abastecimiento, precios y consumo familiar) mediante modelos matemáticos, proporcionando una herramienta educativa para la toma de decisiones[cite: 1].

---

## 🎯 Objetivos
*   **Estructura:** Desarrollo con HTML5 semántico y organización modular en carpetas (`css/`, `js/`, `img/`)[cite: 1].
*   **Interactividad:** Uso de JavaScript y manipulación del DOM para cálculos dinámicos y validaciones en tiempo real[cite: 1].
*   **Diseño:** Interfaz responsiva y adaptativa, diseñada con una paleta de colores coherente y profesional[cite: 1].

---

## 🛠️ Tecnologías Utilizadas
*   **HTML5** - Estructura semántica.
*   **CSS3** - Estilos, diseño responsivo y UX.
*   **JavaScript (ES6+)** - Lógica de negocio, cálculos y manipulación del DOM.
*   **Git & GitHub** - Control de versiones y despliegue.

---

## 🚀 Despliegue
Puedes acceder a la versión en vivo del simulador aquí:
https://kevinestradasilvestre-byte.github.io/FWI/

---

## 🧪 Casos de Estudio para Probar
Para verificar el correcto funcionamiento del simulador, puedes utilizar los siguientes datos de prueba:

| Escenario | Datos de Prueba | Resultado Esperado |
| :--- | :--- | :--- |
| **Carburantes** | Reserva: 10000, Consumo: 1200, Reabastecimiento: 300 | Cálculo de días hasta nivel crítico |
| **Precios** | Arroz (8 -> 11 Bs, 10 unid) | Diferencia de gasto total |
| **Transporte** | Distancia Normal: 10km, Desvío: 16km, Costo: 2 Bs | Cálculo de gasto adicional |
| **Presupuesto** | Disponible: 500 Bs, Total: 580 Bs | Alerta de presupuesto insuficiente |

---

## 📂 Estructura del Proyecto
```text
proyecto-web-crisis/
├── index.html        # Página principal
├── css/
│   └── estilos.css   # Estilos globales y responsive
├── js/
│   └── script.js     # Lógica y manipulación del DOM
└── img/              # Recursos visuales
