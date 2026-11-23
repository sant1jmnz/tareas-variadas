/* Página de estudio de Dermalia. Sin dependencias. Estado en localStorage (con try/catch). */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const S = {
    get(k, d) { try { const v = localStorage.getItem("derm:" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("derm:" + k, JSON.stringify(v)); } catch (e) { /* sin storage: sigue andando */ } }
  };
  const mmss = s => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(Math.floor(s % 60)).padStart(2, "0");
  const pre = t => "<pre>" + esc(t) + "</pre>";

  const TABS = [
    ["pres", "Presentación"], ["mapa", "Mapa"], ["sql", "SQL"], ["cpp", "C++ / Qt"], ["profe", "La profe dice…"],
    ["qss", "Pantallas y QSS"], ["ej", "Ejercicios"], ["preg", "Preguntas"], ["olv", "Que no se te pase"]
  ];
  const V = {};
  let timers = [];
  const limpiar = () => { timers.forEach(clearInterval); timers = []; };

  /* ---------- Presentación ---------- */
  V.pres = function (el) {
    const G = window.GUION, total = G.bloques.reduce((a, b) => a + b.seg, 0);
    let h = `<h2>Guion (${mmss(total)} + margen)</h2><p class="mut">Fuente: <code>${G.fuente}</code> en el repo. Ideal 7 min, máximo 10. Si te pasás, cortás la competencia, nunca la demo.</p>`;
    h += `<div class="card"><h3>Práctica con cronómetro</h3><div id="pr"></div></div>`;
    h += `<table><tr><th>Bloque</th><th>Tiempo</th><th>Quién</th><th>Qué decís</th></tr>` +
      G.bloques.map(b => `<tr><td><b>${esc(b.n)}</b></td><td>${mmss(b.seg)}</td><td>${b.quien}</td><td>${esc(b.dice)}</td></tr>`).join("") + "</table>";
    h += `<h2>Guion de la demo</h2><table><tr><th>Tiempo</th><th>Dónde</th><th>Qué hacés</th><th>Qué contás</th></tr>` +
      G.demo.map(d => `<tr><td>${d.t}</td><td>${esc(d.donde)}</td><td>${esc(d.hace)}</td><td>${esc(d.cuenta)}</td></tr>`).join("") + "</table>";
    h += `<div class="aviso"><b>Plan B.</b> ${esc(G.planB)}</div>`;
    h += `<h2>Las 7 objeciones</h2>` + G.objeciones.map(o => `<details class="card"><summary><b>${esc(o[0])}</b></summary><p>${esc(o[1])}</p></details>`).join("");
    el.innerHTML = h;
    practica($("#pr", el), G);
  };
  function practica(box, G) {
    let i = -1, t0 = 0, tb = 0, reg = [], vivo = false;
    const hist = S.get("intentos", []);
    function pintar() {
      const b = G.bloques[i];
      box.innerHTML = i < 0 && !reg.length
        ? `<button class="pri" id="ini">Empezar ensayo</button> <span class="mut">Apretás «Siguiente» al terminar cada bloque. Se compara con el tiempo del guion.</span>`
        : (i >= G.bloques.length
          ? `<h3>Resultado</h3><p>Total <b>${mmss(reg.reduce((a, r) => a + r.s, 0))}</b> (ideal 07:00, máximo 10:00)</p><table>${reg.map(r => `<tr><td>${esc(r.n)}</td><td>${mmss(r.s)}</td><td>guion ${mmss(r.obj)}</td><td>${r.s > r.obj ? "⏱ te pasaste " + (r.s - r.obj) + " s" : "ok"}</td></tr>`).join("")}</table><button class="pri" id="ini">Otro ensayo</button>`
          : `<div class="mut">${esc(b.n)} · habla ${b.quien} · objetivo ${mmss(b.seg)}</div><div class="cron" id="c">00:00</div><p>${esc(b.dice)}</p><button class="pri" id="sig">${i === G.bloques.length - 1 ? "Terminar" : "Siguiente bloque"}</button> <button id="can">Cancelar</button>`)
        ;
      const ini = $("#ini", box); if (ini) ini.onclick = () => { reg = []; i = 0; t0 = Date.now(); vivo = true; pintar(); };
      const sig = $("#sig", box); if (sig) sig.onclick = () => { reg.push({ n: b.n, s: Math.round((Date.now() - t0) / 1000), obj: b.seg }); i++; t0 = Date.now(); if (i >= G.bloques.length) { vivo = false; hist.push({ fecha: new Date().toISOString().slice(0, 16), seg: reg.reduce((a, r) => a + r.s, 0) }); S.set("intentos", hist.slice(-20)); } pintar(); };
      const can = $("#can", box); if (can) can.onclick = () => { i = -1; reg = []; vivo = false; pintar(); };
      if (i >= G.bloques.length && hist.length) box.insertAdjacentHTML("beforeend", `<p class="mut">Ensayos anteriores: ${hist.map(x => mmss(x.seg)).join(" · ")}</p>`);
    }
    const iv = setInterval(() => { const c = $("#c", box); if (c && vivo) { const s = (Date.now() - t0) / 1000, b = G.bloques[i]; c.textContent = mmss(s); c.classList.toggle("pasado", s > b.seg); } }, 250);
    timers.push(iv); pintar();
  }

  /* ---------- Mapa ---------- */
  V.mapa = function (el) {
    el.innerHTML = `<h2>Tres puertas, una sola base</h2>
    <p>Terminal del instituto (<b>cliente</b>), PC de recepción (<b>gestion</b>) y el <b>sitio web</b>. Las tres hablan con la misma base MySQL en Aiven, y siempre a través de stored procedures.</p>
    <h2>Capas del programa Qt (de arriba hacia abajo)</h2>` +
      window.CAPAS.map((c, i) => `<div class="card"><b>${i + 1}. ${esc(c.nom)}</b><div class="mut"><code>${esc(c.arch)}</code></div><p>${esc(c.que)}</p></div>`).join("") +
      `<h2>Otras piezas</h2><table>${window.OTROS.map(o => `<tr><td><b>${esc(o[0])}</b></td><td>${esc(o[1])}</td></tr>`).join("")}</table>
    <h2>Una acción de punta a punta</h2>${pre(`Gestión → Protocolos → cambiás el precio y tocás Guardar
 PaginaProtocolos::guardar()            frontend/gestion/paginaprotocolos.cpp
   Validaciones::...                    frontend/comun/validaciones.cpp   (valida lo escrito)
   repo->modificarProtocolo(...)        frontend/comun/repositorio.cpp
     base.llamar("clinica.sp_modificar_protocolo", {...})   frontend/comun/basedatos.cpp
       CALL clinica.sp_modificar_protocolo(3, 'Peeling', NULL, 30000, 45, 1, 'gestion', 1)
         MySQL: valida (52060, 52062, 52063, 52064...), UPDATE, log de auditoría, SELECT 'OK'`)}
    <div class="aviso">Si la profe pide algo y no sabés dónde está: buscá el texto en pantalla con <code>grep -rn "texto" frontend</code> (o Ctrl+Shift+F en Qt Creator) y seguí hacia abajo por las capas.</div>`;
  };

  /* ---------- SQL ---------- */
  V.sql = function (el) {
    el.innerHTML = `<h2>Esquemas de la base</h2><table>${window.ESQUEMAS.map(e => `<tr><td><code>${e[0]}</code></td><td>${esc(e[1])}</td></tr>`).join("")}</table>
    <h2>Cómo es un stored procedure de Dermalia</h2><p>${esc(window.SP_FILA)}</p>${pre(window.SP_PLANTILLA)}
    <h2>Códigos de error que más te van a preguntar</h2><table>${window.ERRORES.map(e => `<tr><td><code>${e[0]}</code></td><td>${esc(e[1])}</td></tr>`).join("")}</table>
    <h2>Reglas de negocio</h2><table>${window.REGLAS.map(r => `<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td></tr>`).join("")}</table>
    <div class="aviso">Los scripts viven en <code>backend/</code>: <code>03_sp_semana3.sql</code>, <code>04_sp_semana4.sql</code> (turnos y seña), <code>05_reportes_semana5.sql</code>, <code>06_tuning_semana6.sql</code>, <code>09_sp_pantallas.sql</code>, <code>10_sp_telegram.sql</code>. Las columnas de arriba son las verificadas; si dudás de un nombre, miralo en el script.</div>`;
  };

  /* ---------- C++ ---------- */
  V.cpp = function (el) {
    el.innerHTML = `<h2>Las cuatro funciones que más vas a usar</h2>
    <h3>Un método del Repositorio (así se agrega una llamada nueva)</h3>${pre(`Respuesta Repositorio::modificarProtocolo(int idProtocolo, const QString &nombre, const QString &descripcion,
    double precio, int duracionMin, bool activo, const QString &origen, int idUsuario)
{ return aRespuesta(base.llamar("clinica.sp_modificar_protocolo",
    { idProtocolo, nombre, textoONulo(descripcion), precio, duracionMin, activo ? 1 : 0, origen, idONulo(idUsuario) })); }`)}
    <p class="mut">Escritura → <code>aRespuesta(...)</code> (devuelve <code>Respuesta</code>: ok, codigo, mensaje, id, valor, dato). Consulta → devuelve <code>Resultado</code> con las filas. <code>textoONulo</code> y <code>idONulo</code> mandan NULL si está vacío.</p>
    <h3>Cómo llega el texto a la base (BaseDatos::llamar)</h3>${pre(`valores << literal(p);                       // cada parámetro: números tal cual, texto entre comillas ESCAPADO
sql = "CALL " + sp + "(" + valores.join(", ") + ")";
mysql_query(conn, sql);                      // 0 = bien
do { mysql_store_result ... } while (mysql_next_result(conn) == 0);   // un CALL devuelve 2 resultados
// si la primera fila dice estado = 'ERROR' → r.error = mensajeDeError(codigo, mensaje)`)}
    <h3>Cómo se conecta (BaseDatos::conectar)</h3>${pre(`mysql_init(NULL);
mysql_options(c, MYSQL_OPT_CONNECT_TIMEOUT, ...);  mysql_options(c, MYSQL_SET_CHARSET_NAME, "utf8mb4");
mysql_options(c, MYSQL_OPT_SSL_CA, ruta_absoluta_del_certificado);   // Aiven exige SSL
mysql_real_connect(c, host, usuario, clave, base, puerto, NULL, CLIENT_MULTI_RESULTS);`)}
    <h3>Una pantalla conecta todo (patrón de las páginas Pagina*)</h3>${pre(`connect(ui->btnGuardar, &QPushButton::clicked, this, &PaginaProtocolos::guardar);   // señal → slot
void PaginaProtocolos::guardar() {
    // 1) leer los campos  2) Validaciones::...  3) repo->modificarProtocolo(...)  4) mostrar el mensaje y recargar
}`)}
    <h2>Dónde está cada cosa</h2><table>
    <tr><td>Texto de un botón o etiqueta</td><td>El <code>.ui</code> (Qt Designer) o <code>setText</code> en el <code>.cpp</code>. Buscar el texto exacto.</td></tr>
    <tr><td>Qué hace un botón</td><td>El <code>connect(ui->btnX, ...)</code> en el constructor o <code>conectarSenales()</code>.</td></tr>
    <tr><td>Reglas de validación del formulario</td><td><code>frontend/comun/validaciones.cpp</code> (<code>nombreApellidoValido</code>, <code>precioValido</code>, etc.).</td></tr>
    <tr><td>Cuenta de la seña</td><td><code>frontend/comun/sena.h</code> → <code>Sena::calcular(precio, porcentaje)</code> = (precio*porcentaje+50)/100.</td></tr>
    <tr><td>Formatos y avisos</td><td><code>frontend/comun/formato.cpp</code> (<code>Formato::avisarErrores</code>, moneda, fechas).</td></tr>
    <tr><td>Datos de prueba sin base</td><td><code>frontend/comun/datosprueba.cpp</code></td></tr>
    <tr><td>Modo contingencia</td><td><code>conexionapp.cpp</code>, <code>contingencia.cpp</code>, <code>almacenlocal.cpp</code></td></tr>
    <tr><td>Inactividad de la terminal</td><td><code>ventanacliente.cpp</code> → <code>MINUTOS_SESION</code> y <code>eventFilter</code></td></tr></table>
    <div class="aviso">Los comentarios que dejé arriba de las funciones (en el repo, rama <code>comentarios-estudio</code>) dicen qué hace cada una. Recorrelos con <code>git diff</code>; no cambian el código.</div>`;
  };

  /* ---------- La profe dice ---------- */
  V.profe = function (el) {
    el.innerHTML = `<h2>Si la profe dice…</h2><p class="mut">Cada tarjeta: qué te piden, dónde está y qué tocás. Antes de tocar nada, decí en voz alta qué archivo y por qué.</p>` +
      window.RECETAS.map(r => `<details class="card"><summary><b>${esc(r.dice)}</b></summary><p><b>Dónde:</b> ${esc(r.donde)}</p>${pre(r.codigo)}<p class="mut"><b>Ojo:</b> ${esc(r.ojo)}</p></details>`).join("");
  };

  /* ---------- Pantallas y QSS ---------- */
  function aCss(qss) {
    let q = qss.replace(/\/\*[\s\S]*?\*\//g, "");
    q = q.replace(/qlineargradient\(([^)]*)\)/g, (m, a) => {
      const g = k => { const r = a.match(new RegExp(k + ":\\s*([\\d.]+)")); return r ? +r[1] : 0; };
      const ang = Math.round(Math.atan2(g("x2") - g("x1"), -(g("y2") - g("y1"))) * 180 / Math.PI);
      const stops = [...a.matchAll(/stop:\s*([\d.]+)\s+(#[0-9a-fA-F]+)/g)].map(s => `${s[2]} ${Math.round(s[1] * 100)}%`);
      return `linear-gradient(${ang}deg, ${stops.join(", ")})`;
    });
    q = q.replace(/qproperty-[^;]*;/g, "");
    return q.replace(/([^{}]+)\{([^{}]*)\}/g, (m, sel, body) => {
      const out = sel.split(",").map(s => {
        s = s.trim().replace(/::item:selected/g, " .item.selected").replace(/::item:hover/g, " .item:hover").replace(/::item/g, " .item");
        if (/::/.test(s)) return null;                       // partes internas de Qt (scrollbar, header): no se dibujan
        if (s === "QWidget") return "#lab *";
        s = s.replace(/\bQ[A-Za-z]+/g, "." + "$&").replace(/:pressed/g, ":active").replace(/:checked/g, ".checked");
        return "#lab " + s;
      }).filter(Boolean);
      return out.length ? out.join(",") + "{" + body + "}\n" : "";
    });
  }
  function mock(app) {
    const heroBtn = app === "cliente" ? "btnSacarTurno" : "btnIrCargar";
    return `<div id="central" class="QWidget">
      <div class="QFrame" id="hero"><span class="QLabel" id="lblHeroEtiqueta">BIENVENIDA</span><br><span class="QLabel" id="lblHeroTitulo">Tu turno en un minuto</span><br><span class="QLabel" id="lblHeroDetalle">Elegí el tratamiento y el horario.</span><br>
        <button class="QPushButton" id="${heroBtn}">Sacar turno</button></div>
      <div class="fila"><span class="QLabel" paso="hecho">1 Protocolo</span><span class="QLabel" paso="activo">2 Horario</span><span class="QLabel" paso="pendiente">3 Confirmar</span></div>
      <div class="QFrame" tarjeta="true"><span class="QLabel" rol="seccion">Protocolos</span><br><span class="QLabel" rol="nota">Tocá uno para elegirlo</span>
        <ul class="QListWidget" id="listaProtocolos"><li class="item">Peeling químico · $28.000</li><li class="item selected">Mesoterapia · $35.000</li><li class="item">Limpieza profunda · $22.000</li></ul>
        <ul class="QListWidget" id="listaHorarios" style="display:flex;flex-wrap:wrap"><li class="item">09:00</li><li class="item selected">10:30</li><li class="item">15:00</li></ul></div>
      <div class="QFrame" id="tarjetaSena"><span class="QLabel" rol="campo">SEÑA A PAGAR</span><br><span class="QLabel" id="lblSena">$10.500</span><br><span class="QLabel" id="lblRecordatorio">Te avisamos 24 h antes.</span></div>
      <div class="fila"><span class="QLabel" etiqueta="ok">Confirmado</span><span class="QLabel" etiqueta="pendiente">Seña pendiente</span><span class="QLabel" avatar="rosa">CG</span><span class="QLabel" avatar="dorado">DM</span></div>
      <div class="fila"><input class="QLineEdit" placeholder="DNI de la paciente"></div>
      <div class="fila"><button class="QPushButton" primario="true">Confirmar</button><button class="QPushButton">Volver</button><button class="QPushButton" peligro="true">Cancelar turno</button><button class="QPushButton" disabled>Deshabilitado</button><button class="QPushButton" id="btnSena">Seña</button></div></div>`;
  }
  const RETOS = [
    ["Pasá el botón primario a azul (#2255AA).", q => /QPushButton\[primario="true"\]\s*\{[^}]*#2255AA/i.test(q)],
    ["Hacé que el título del hero (lblHeroTitulo) tenga 40px.", q => /#lblHeroTitulo\s*\{[^}]*font-size:\s*40px/i.test(q)],
    ["Cambiá el fondo de la tarjeta de seña (tarjetaSena) a #DDEEDD.", q => /QFrame#tarjetaSena\s*\{[^}]*#DDEEDD/i.test(q)],
    ["Ocultá el botón de volver o hacelo invisible con QSS.", q => /(visibility|display)\s*:\s*(hidden|none)/i.test(q)]
  ];
  V.qss = function (el) {
    el.innerHTML = `<h2>Laboratorio de QSS</h2>
    <div class="aviso"><b>Es una aproximación.</b> El navegador no corre Qt: el QSS real se convierte a CSS para que veas el efecto de colores, bordes, tamaños y fuentes. Qt puede verse un poco distinto. Lo definitivo es recompilar y abrir la app. Los degradados <code>qlineargradient</code> se pasan a <code>linear-gradient</code>.</div>
    <div class="fila"><label>Programa: <select id="qa"><option value="gestion">Gestión (recepción)</option><option value="cliente">Cliente (terminal)</option></select></label> <button id="qre">Restaurar QSS original</button></div>
    <div class="lab"><div><textarea id="qt" spellcheck="false" style="min-height:420px"></textarea><div class="err" id="qe"></div></div><div id="lab"></div></div>
    <h3>Retos</h3><ul id="retos" class="chk"></ul>
    <p class="mut">Dónde va en el proyecto: propiedad <code>styleSheet</code> del widget central dentro de <code>ventanagestion.ui</code> / <code>ventanacliente.ui</code>.</p>
    <h2>Pantallas reales (capturas)</h2><p class="mut">Tocá una para verla grande. Cada una indica el archivo y la función.</p>
    <div class="shots">${window.PANTALLAS.map((p, i) => `<figure data-i="${i}"><img loading="lazy" src="img/${p[0]}" alt="${esc(p[1])}"><figcaption><b>${esc(p[1])}</b></figcaption></figure>`).join("")}</div><div id="inf" class="card" hidden></div>`;
    const lab = $("#lab", el), ta = $("#qt", el), st = document.createElement("style");
    document.head.appendChild(st); lab.insertAdjacentHTML("beforebegin", ""); lab.dataset.k = "1";
    el._st = st;
    function render() {
      lab.innerHTML = mock($("#qa", el).value);
      try { st.textContent = aCss(ta.value); $("#qe", el).textContent = ""; } catch (e) { $("#qe", el).textContent = "QSS con error: " + e.message; }
      $("#retos", el).innerHTML = RETOS.map(r => { const ok = r[1](ta.value); return `<li class="${ok ? "y" : "n"}">${ok ? "✔" : "○"} ${esc(r[0])}</li>`; }).join("");
      $$(".item", lab).forEach(li => li.onclick = () => { $$(".item", li.parentNode).forEach(x => x.classList.remove("selected")); li.classList.add("selected"); });
    }
    function cargar() { ta.value = window.QSS_REAL[$("#qa", el).value]; render(); }
    $("#qa", el).onchange = cargar; $("#qre", el).onclick = cargar; ta.oninput = render; cargar();
    $$(".shots figure", el).forEach(f => f.onclick = () => {
      const p = window.PANTALLAS[f.dataset.i];
      $("#dlgimg").src = "img/" + p[0]; $("#dlg").showModal();
      const inf = $("#inf", el); inf.hidden = false; inf.innerHTML = `<b>${esc(p[1])}</b><br><code>${esc(p[2])}</code><p>${esc(p[3])}</p>`;
    });
  };

  /* ---------- Ejercicios ---------- */
  function ejercicios(el, lista, tipo) {
    const resp = S.get("resp", {});
    return lista.map(e => `<div class="card" data-id="${e.id}"><b>${esc(e.t)}</b> <span class="tag">${"★".repeat(e.dif)}</span><p>${esc(e.q)}</p>
      <textarea placeholder="Tu respuesta (${tipo})">${esc(resp[e.id] || "")}</textarea><ul class="chk"></ul>
      <button class="sm sol">Ver solución</button><div class="solbox" hidden>${pre(e.sol)}</div></div>`).join("");
  }
  V.ej = function (el) {
    el.innerHTML = `<h2>Ejercicios de SQL y C++</h2>
    <div class="aviso">Esto NO ejecuta SQL ni compila C++ (el navegador no llega a Aiven ni corre Qt). La lista de abajo es un autocontrol por palabras clave; <b>no prueba que tu código funcione</b>. Cuando termines, exportá el archivo y pasaselo a Claude para que lo revise de verdad.</div>
    <div class="fila"><button class="pri" id="exp">Exportar para revisión (.md)</button> <button id="expj">Exportar .json</button> <button id="clr">Borrar mis respuestas</button></div>
    <h3>SQL</h3>${ejercicios(el, window.EJ_SQL, "SQL")}<h3>C++ / Qt</h3>${ejercicios(el, window.EJ_CPP, "C++")}`;
    const todos = [...window.EJ_SQL.map(e => ({ ...e, tipo: "SQL" })), ...window.EJ_CPP.map(e => ({ ...e, tipo: "C++" }))];
    const resp = S.get("resp", {});
    function marcar(card) {
      const e = todos.find(x => x.id === card.dataset.id), v = $("textarea", card).value;
      $(".chk", card).innerHTML = e.chk.map(c => { const ok = c[1].test(v); return `<li class="${ok ? "y" : "n"}">${ok ? "✔" : "○"} ${esc(c[0])}</li>`; }).join("");
    }
    $$(".card", el).forEach(card => {
      marcar(card);
      $("textarea", card).oninput = ev => { resp[card.dataset.id] = ev.target.value; S.set("resp", resp); marcar(card); };
      $(".sol", card).onclick = () => { const b = $(".solbox", card); b.hidden = !b.hidden; };
    });
    const bajar = (nombre, txt, mime) => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([txt], { type: mime })); a.download = nombre; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); };
    const fecha = new Date().toISOString().slice(0, 10);
    $("#exp", el).onclick = () => {
      const md = ["# Ejercicios Dermalia — para revisar", "", "Fecha: " + fecha, "Pedido: revisá cada respuesta como lo haría la profe: ¿corre?, ¿respeta las reglas del proyecto?, ¿qué le falta?", ""];
      todos.forEach(e => { const v = (resp[e.id] || "").trim(); md.push(`## ${e.id} · ${e.tipo} · ${e.t}`, "", "**Consigna:** " + e.q, "", "**Autocontrol por palabras clave:** " + e.chk.map(c => (c[1].test(v) ? "[x] " : "[ ] ") + c[0]).join(" · "), "", "**Respuesta:**", "```" + (e.tipo === "SQL" ? "sql" : "cpp"), v || "(sin responder)", "```", ""); });
      bajar(`dermalia-ejercicios-${fecha}.md`, md.join("\n"), "text/markdown");
    };
    $("#expj", el).onclick = () => bajar(`dermalia-ejercicios-${fecha}.json`, JSON.stringify({ fecha, ejercicios: todos.map(e => ({ id: e.id, tipo: e.tipo, titulo: e.t, consigna: e.q, respuesta: resp[e.id] || "" })) }, null, 2), "application/json");
    $("#clr", el).onclick = () => { if (confirm("¿Borrar todas tus respuestas guardadas en este navegador?")) { S.set("resp", {}); V.ej(el); } };
  };

  /* ---------- Preguntas ---------- */
  V.preg = function (el) {
    const sab = S.get("sabe", {}), cats = ["Todas", ...new Set(window.PREGUNTAS.map(p => p[0]))];
    let cat = "Todas", q = "", sol = false;
    function pintar() {
      const L = window.PREGUNTAS.map((p, i) => ({ p, i })).filter(x => (cat === "Todas" || x.p[0] === cat) && (!sol || !sab[x.i]) && (x.p[1] + x.p[2]).toLowerCase().includes(q.toLowerCase()));
      $("#lp", el).innerHTML = `<p class="mut">${L.length} preguntas · sabidas: ${Object.values(sab).filter(Boolean).length}/${window.PREGUNTAS.length}</p>` +
        L.map(x => `<details class="card"><summary><span class="tag">${x.p[0]}</span> <b>${esc(x.p[1])}</b> ${sab[x.i] ? '<span class="tag ok">la sé</span>' : ""}</summary><p>${esc(x.p[2])}</p><button class="sm" data-i="${x.i}">${sab[x.i] ? "Repasar" : "La sé"}</button></details>`).join("");
      $$("#lp button", el).forEach(b => b.onclick = ev => { ev.preventDefault(); sab[b.dataset.i] = !sab[b.dataset.i]; S.set("sabe", sab); pintar(); });
    }
    el.innerHTML = `<h2>Preguntas probables</h2><p class="mut">Contestá en voz alta ANTES de abrir.</p><div class="fila">${cats.map(c => `<button class="sm ${c === "Todas" ? "on" : ""}" data-c="${c}">${c}</button>`).join("")} <label><input type="checkbox" id="so"> solo las que no sé</label></div><input type="search" id="bq" placeholder="Buscar…"><div id="lp"></div>`;
    $$("[data-c]", el).forEach(b => b.onclick = () => { cat = b.dataset.c; $$("[data-c]", el).forEach(x => x.classList.toggle("on", x === b)); pintar(); });
    $("#bq", el).oninput = e => { q = e.target.value; pintar(); }; $("#so", el).onchange = e => { sol = e.target.checked; pintar(); };
    pintar();
  };

  /* ---------- Olvidos ---------- */
  V.olv = function (el) {
    const ck = S.get("olv", {});
    el.innerHTML = `<h2>Que no se te pase</h2><ul class="chk">${window.OLVIDOS.map((t, i) => `<li><label><input type="checkbox" data-i="${i}" ${ck[i] ? "checked" : ""}> ${esc(t)}</label></li>`).join("")}</ul>
    <div class="aviso"><b>No verificado, no lo afirmes:</b> la app Qt usada de punta a punta con el asistente por una persona, y el bot de Telegram con un token real.</div>
    <div class="aviso"><b>Esta página no tiene claves ni el host de Aiven.</b> Los datos de la demo (usuario y clave) están en el README y en docs/06-pitch.md del repo.</div>`;
    $$("input[type=checkbox]", el).forEach(c => c.onchange = () => { ck[c.dataset.i] = c.checked; S.set("olv", ck); });
  };

  /* ---------- Navegación ---------- */
  const nav = $("#nav"), app = $("#app");
  nav.innerHTML = TABS.map(t => `<button data-t="${t[0]}">${t[1]}</button>`).join("");
  function ir(id) {
    if (!V[id]) id = "pres";
    limpiar(); $$("style[data-qss]").forEach(s => s.remove());
    const old = app._st; if (old) old.remove();
    app.innerHTML = ""; V[id](app);
    $$("#nav button").forEach(b => b.classList.toggle("on", b.dataset.t === id));
    if (location.hash !== "#" + id) history.replaceState(null, "", "#" + id);
    window.scrollTo(0, 0);
  }
  nav.onclick = e => { const b = e.target.closest("button"); if (b) ir(b.dataset.t); };
  ir(location.hash.slice(1));
})();
