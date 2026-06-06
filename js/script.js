
/* ==========================================================================
   SISTEMA DE CONTROL DE ENTORNO DINÁMICO (DOM & TEMAS)
   ========================================================================== */
function switchTab(tabId, themeName) {
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');

    const container = document.getElementById('main-container');
    container.className = ''; 
    container.classList.add(`theme-${themeName}`);
}

function cargarCasoEstudio(escenario, valores) {
    if (escenario === 'a') {
        switchTab('scenario-a', 'cyan');
        document.getElementById('a-inicial').value = valores[0];
        document.getElementById('a-consumo').value = valores[1];
        document.getElementById('a-reabastecimiento').value = valores[2];
        document.getElementById('a-critico').value = valores[3];
        document.querySelector('#form-a button[type="submit"]').click();
    } else if (escenario === 'b') {
        switchTab('scenario-b', 'tomato');
        document.getElementById('b-producto').value = valores[0];
        document.getElementById('b-precio-ini').value = valores[1];
        document.getElementById('b-precio-act').value = valores[2];
        document.getElementById('b-cantidad').value = valores[3];
        document.querySelector('#form-b button[type="submit"]').click();
    } else if (escenario === 'c') {
        switchTab('scenario-c', 'amber');
        document.getElementById('c-dist-normal').value = valores[0];
        document.getElementById('c-dist-desvio').value = valores[1];
        document.getElementById('c-costo-km').value = valores[2];
        document.getElementById('c-viajes').value = valores[3];
        document.querySelector('#form-c button[type="submit"]').click();
    } else if (escenario === 'd') {
        switchTab('scenario-d', 'emerald');
        document.getElementById('d-presupuesto').value = valores[0];
        document.getElementById('d-total-compra').value = valores[1];
        document.querySelector('#form-d button[type="submit"]').click();
    } else if (escenario === 'e') {
        switchTab('scenario-e', 'crimson');
        document.getElementById('e-demanda').value = valores[0];
        document.getElementById('e-incremento').value = valores[1];
        document.getElementById('e-stock').value = valores[2];
        document.querySelector('#form-e button[type="submit"]').click();
    }
}

function limpiarFormulario(formId, resultId) {
    document.getElementById(formId).reset();
    const resultBox = document.getElementById(resultId);
    resultBox.className = "result-card";
    resultBox.innerHTML = `
        <h3>🔮 Resultados del Análisis</h3>
        <p class="placeholder-text">Introduce datos válidos en el panel izquierdo para proyectar los resultados en tiempo real.</p>
    `;
}

function renderizarResultado(elementId, status, HTMLContent, progressWidth = 0) {
    const box = document.getElementById(elementId);
    box.className = `result-card ${status}`;
    box.innerHTML = HTMLContent;

    setTimeout(() => {
        const bar = box.querySelector('.metric-progress-bar');
        if (bar) bar.style.width = `${progressWidth}%`;
    }, 50);
}

/* ==========================================================================
   ALGORITMOS MATEMÁTICOS DE LOS ESCENARIOS CON MÉTRICAS DE BARRAS
   ========================================================================== */

// ESCENARIO A: CARBURANTES
function calcularCarburantes(e) {
    e.preventDefault();
    const inicial = parseFloat(document.getElementById('a-inicial').value);
    const consumo = parseFloat(document.getElementById('a-consumo').value);
    const reabastecimiento = parseFloat(document.getElementById('a-reabastecimiento').value);
    const critico = parseFloat(document.getElementById('a-critico').value);

    if (consumo <= reabastecimiento) {
        renderizarResultado('result-a', 'success', `
            <h3>📈 Análisis de Logística</h3>
            <p><strong>Estado:</strong> Flujo autosustentable continuo.</p>
            <div class="metric-progress-container"><div class="metric-progress-bar"></div></div>
            <span class="badge success">✅ ESTABLE SIN RIESGOS</span>
        `, 100);
        return;
    }

    let dias = 0, reservaActual = inicial;
    while (reservaActual > 0 && dias < 30) {
        reservaActual = (reservaActual + reabastecimiento) - consumo;
        if (reservaActual > 0) dias++;
    }

    let status = "success";
    let pct = (dias / 30) * 100;
    if (dias <= 4) status = "danger";
    else if (dias <= 10) status = "warning";

    renderizarResultado('result-a', status, `
        <h3>🚨 Proyección de Autonomía</h3>
        <p><strong>Días de Autonomía Operativa:</strong> ${dias} Días</p>
        <div class="metric-progress-container"><div class="metric-progress-bar"></div></div>
        <span class="badge ${status}">${status === 'danger' ? '❌ RIESGO CRÍTICO DE SUMINISTRO' : '⚠️ RESERVAS AJUSTADAS'}</span>
    `, pct);
}

// ESCENARIO B: PRECIOS ALIMENTOS
function calcularAlimentos(e) {
    e.preventDefault();
    const producto = document.getElementById('b-producto').value;
    const precioIni = parseFloat(document.getElementById('b-precio-ini').value);
    const precioAct = parseFloat(document.getElementById('b-precio-act').value);
    const cantidad = parseFloat(document.getElementById('b-cantidad').value);

    const porcentaje = ((precioAct - precioIni) / precioIni) * 100;
    const sobrecosto = (precioAct - precioIni) * cantidad;

    let status = "success";
    if (porcentaje > 25) status = "danger";
    else if (porcentaje > 0) status = "warning";

    renderizarResultado('result-b', status, `
        <h3>📊 Inflación en Canasta Familiar</h3>
        <p><strong>Producto:</strong> ${producto}</p>
        <p><strong>Incremento porcentual:</strong> +${porcentaje.toFixed(1)}%</p>
        <p><strong>Costo extra mensual:</strong> +${sobrecosto.toFixed(2)} Bs</p>
        <div class="metric-progress-container"><div class="metric-progress-bar"></div></div>
        <span class="badge ${status}">${status === 'danger' ? '❌ INFLACIÓN DESMEDIDA' : '⚠️ AJUSTE DE PRECIO'}</span>
    `, Math.min(porcentaje, 100));
}

// ESCENARIO C: COSTO DE TRANSPORTE
function calcularTransporte(e) {
    e.preventDefault();
    const distNormal = parseFloat(document.getElementById('c-dist-normal').value);
    const distDesvio = parseFloat(document.getElementById('c-dist-desvio').value);
    const costoKm = parseFloat(document.getElementById('c-costo-km').value);
    const viajes = parseInt(document.getElementById('c-viajes').value);

    const extraSemanal = (distDesvio - distNormal) * costoKm * viajes;
    let status = extraSemanal > 50 ? "danger" : "warning";

    renderizarResultado('result-c', status, `
        <h3>🚌 Impacto por Desvío Vial</h3>
        <p><strong>Pérdida Semanal Directa:</strong> +${extraSemanal.toFixed(2)} Bs</p>
        <div class="metric-progress-container"><div class="metric-progress-bar"></div></div>
        <span class="badge ${status}">⚠️ COSTO OPERATIVO ELEVADO</span>
    `, Math.min((extraSemanal / 150) * 100, 100));
}

// ESCENARIO D: COMPRAS FAMILIARES
function calcularPresupuesto(e) {
    e.preventDefault();
    const presupuesto = parseFloat(document.getElementById('d-presupuesto').value);
    const totalCompra = parseFloat(document.getElementById('d-total-compra').value);

    const saldo = presupuesto - totalCompra;
    const status = saldo >= 0 ? "success" : "danger";
    const ratio = Math.min((totalCompra / presupuesto) * 100, 100);

    renderizarResultado('result-d', status, `
        <h3>💵 Eficiencia del Presupuesto</h3>
        <p><strong>Uso del Capital de Caja:</strong> ${ratio.toFixed(0)}% ocupado.</p>
        <p><strong>Balance Neto:</strong> ${saldo.toFixed(2)} Bs</p>
        <div class="metric-progress-container"><div class="metric-progress-bar"></div></div>
        <span class="badge ${status}">${saldo >= 0 ? '✅ SOLVENTE' : '❌ DEFICIT DE CAJA'}</span>
    `, ratio);
}

// ESCENARIO E: COMPRAS POR PÁNICO
function calcularPanico(e) {
    e.preventDefault();
    const demanda = parseFloat(document.getElementById('e-demanda').value);
    const incremento = parseFloat(document.getElementById('e-incremento').value);
    const stock = parseFloat(document.getElementById('e-stock').value);

    const nuevaDemanda = demanda + (demanda * (incremento / 100));
    const balance = stock - nuevaDemanda;
    const status = balance >= 0 ? "success" : "danger";
    let ocupacion = Math.min((nuevaDemanda / stock) * 100, 100);

    renderizarResultado('result-e', status, `
        <h3>⚠️ Demanda por Especulación</h3>
        <p><strong>Demanda Inflada:</strong> ${nuevaDemanda.toFixed(0)} Unidades</p>
        <p><strong>Balance de Stock:</strong> ${balance.toFixed(0)} Unidades</p>
        <div class="metric-progress-container"><div class="metric-progress-bar"></div></div>
        <span class="badge ${status}">${balance >= 0 ? '✅ STOCK RESILIENTE' : '❌ ROTURA DE ALMACÉN'}</span>
    `, ocupacion);
}

/* ==========================================================================
   ENGINE CANVAS: CONSTELACIONES FRACTALES CON ONDA EXPANSIVA POR CLIC
   ========================================================================== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let maxDistance = 135;
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

window.addEventListener('click', () => {
    if (mouse.x && mouse.y) {
        particlesArray.forEach(p => {
            let dx = p.x - mouse.x;
            let dy = p.y - mouse.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 200) {
                p.x += (dx / dist) * 45;
                p.y += (dy / dist) * 45;
            }
        });
    }
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
}
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * 3 + 2; 
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * 0.6 - 0.3;
    }
    update() {
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
        this.x += this.speedX;
        this.y += this.speedY;

        if (mouse.x && mouse.y) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < mouse.radius) {
                let force = (mouse.radius - dist) / mouse.radius;
                this.x -= (dx / dist) * force * 2.5;
                this.y -= (dy / dist) * force * 2.5;
            }
        }
    }
    draw() {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.55)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    let density = window.innerWidth < 600 ? 45 : 100;
    for (let i = 0; i < density; i++) particlesArray.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        for (let j = i + 1; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < maxDistance) {
                let opacity = (1 - (dist / maxDistance)) * 0.35;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
                ctx.lineWidth = 1.2;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}

resizeCanvas();
animateParticles();


/**
 * Aplica esta función en tus scripts. 
 * Solo debes llamar a 'actualizarIndicador(containerId, isSuccess)' 
 * al final de cada cálculo.
 */
function actualizarIndicador(containerId, isSuccess) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Cambiamos el color de borde del contenedor
    container.style.borderColor = isSuccess ? '#00ff9d' : '#ff4d4d';
    
    // Si tienes una barra interna, le pasamos el mismo color
    const bar = container.querySelector('.status-bar');
    if (bar) bar.style.backgroundColor = isSuccess ? '#00ff9d' : '#ff4d4d';
}

// Ejemplo en el cálculo del Escenario D
if (saldo >= 0) {
    // ... tu lógica de éxito
    actualizarIndicador('result-d', true); 
} else {
    // ... tu lógica de error
    actualizarIndicador('result-d', false);
}