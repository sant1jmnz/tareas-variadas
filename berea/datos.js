/* Contenido de la página de estudio de Dermalia.
   Todo sale del repo Proyect-berea (docs/06-pitch.md, docs/12-contrato-sp.md, backend/*.sql, frontend/*).
   Si algo cambia en el repo, se corrige acá. Nada de claves ni datos de conexión: eso vive en dermalia.ini / variables DERMALIA_DB_*. */

window.GUION = {
  fuente: "docs/06-pitch.md",
  idealSeg: 7 * 60, maxSeg: 10 * 60,
  bloques: [
    { n: "1. Gancho", seg: 30, quien: "Santiago",
      dice: "Dermalia es un instituto de estética médica. Cada semana pierde 6 turnos por inasistencia (unos $900.000 por semana) y su recepción dedica 95 minutos por día a contestar consultas." },
    { n: "2. Solución", seg: 40, quien: "Santiago",
      dice: "Un solo sistema, con tres puertas y una misma base: terminal táctil en el instituto para que la paciente reserve sola, la PC de recepción (Gestión) y el sitio web con asistente." },
    { n: "3. Demo en vivo", seg: 150, quien: "Bautista",
      dice: "Una tarea de punta a punta (ver guion de la demo abajo). Si falla la conexión: modo contingencia." },
    { n: "4. Competencia", seg: 50, quien: "Bautista",
      dice: "AgendaPro, Fresha, Booksy y Doctoralia cobran por profesional: con 20 profesionales son entre USD 3.600 y 4.900 por año. Si el tiempo se pasa de 7 min, se recorta ESTO, nunca la demo." },
    { n: "5. Números", seg: 60, quien: "Santiago",
      dice: "Desarrollo: 847 horas, $16,9 millones. Implantación $22 millones más abono de $400.000 por mes. El instituto recupera 156 turnos al año ($23,4 millones)." },
    { n: "6. Cierre", seg: 30, quien: "Santiago",
      dice: "Pedido: que un instituto lo use cuatro semanas y medir los cuatro indicadores. Pregunta final: ¿qué necesitarían ver para pilotear esto?" }
  ],
  demo: [
    { t: "0:35", donde: "Terminal (Cliente)", hace: "Elige Peeling químico + Mesoterapia; el sistema ofrece solo horarios libres de profesionales que hacen LOS DOS; confirma.", cuenta: "Solo muestra lo realmente disponible (RF-18)." },
    { t: "0:25", donde: "Terminal", hace: "Paga la seña: mostrar monto (30%) y código de operación.", cuenta: "Calcula el 30%, 40% en cirugías." },
    { t: "0:20", donde: "Terminal o sitio", hace: "Asistente: «¿cuánto sale el botox?», «me quiero operar la nariz», «quiero un turno para peeling el jueves a la mañana». (Se saca primero si falta tiempo.)", cuenta: "Responde con el catálogo; si no sabe, deriva a una persona." },
    { t: "0:30", donde: "Gestión", hace: "Buscar a Carla por DNI, ver el turno confirmado, intentar cargar otro en el mismo horario → error.", cuenta: "La regla vive en la base: ni la recepción puede pisar un horario." },
    { t: "0:25", donde: "Gestión", hace: "Cancelar el turno con más de 24 h → seña reembolsada; con menos de 24 h queda retenida.", cuenta: "Reglas de seña y reembolso (RF-10), automáticas." },
    { t: "0:35", donde: "Gestión → Reportes", hace: "Abrir la auditoría del día: aparecen alta, pago y cancelación con usuario, hora y origen.", cuenta: "Cada acción queda registrada solo por los stored procedures." }
  ],
  planB: "Plan B si falla la conexión (RNF-09): la app entra en modo contingencia (franja amarilla), guarda el turno en el equipo y avisa. Si también falla el programa: mostrar el sitio web (web/, npm run dev) y los reportes ya ejecutados en Workbench (backend/05_reportes_semana5.sql).",
  objeciones: [
    ["¿Qué pasa con los datos de salud y personales?", "Quedan en una base MySQL del instituto (Aiven). Al asistente de IA no se le mandan datos personales: antes de enviar la pregunta a Gemini y antes de guardarla, la API borra emails y números largos (DNI, teléfonos, tarjetas). Si no sabe responder, deriva al WhatsApp del instituto. Cada acción queda en un log que solo escriben los stored procedures."],
    ["¿Y si se corta internet o la luz?", "No-break y conexión 4G de respaldo. El modo contingencia guarda los turnos en el equipo y, cuando vuelve la conexión, los manda solos a la base y avisa cuántos sincronizó (RNF-09). Si solo se corta la IA, el asistente local sigue respondiendo con el catálogo."],
    ["¿La IA puede inventar precios?", "No: se le pasa el catálogo de la base y las reglas, con la orden de responder solo con eso; si no está ahí, deriva a una persona. Si Gemini no responde, contesta el asistente local, que solo busca en el catálogo."],
    ["¿Por qué pagar esto si Fresha o Booksy cuestan menos por mes?", "Con 20 profesionales cuestan USD 3.600–4.900 al año, por profesional, y (en lo que revisamos) no tienen consulta previa para cirugías, tarjetas de regalo con saldo ni cupones con QR que cambia cada 5 minutos. Los datos quedan en su plataforma. Aclaración honesta: varias celdas de la matriz dicen «a verificar» (docs/07-competencia.md)."],
    ["¿Quién lo mantiene?", "El abono de $400.000/mes incluye soporte, hosting, respaldos y la cuota de IA. El código está documentado (manual técnico) y la lógica vive en stored procedures probados (255 casos)."],
    ["¿Cómo saben que funciona?", "Cuatro indicadores de la MML, medidos a las 4 semanas de uso: −60% de tiempo de atención manual, −50% de turnos perdidos, 0 superposiciones, ≥70% de consultas resueltas con el buscador. Lo que mostramos es el diseño y la prueba de las reglas, NO resultados medidos."],
    ["¿Es realizable con el equipo que son?", "Está hecho para el bimestre: base completa (reglas, reportes, auditoría), Gestión con 13 pantallas, terminal y sitio conectados, asistente de IA, cupones con QR, tarjetas de regalo y cirugías con consulta previa. 255 casos de prueba de la base, 44 de estructura, 6 programas de prueba de las apps y 61 de la API. Queda para después: pasarela de pagos real y WhatsApp con la API oficial de Meta."]
  ]
};

/* ---------- Mapa: capas del programa ---------- */
window.CAPAS = [
  { nom: "Pantalla (Qt/C++)", arch: "frontend/cliente/ventanacliente.cpp · frontend/gestion/ventanagestion.cpp · frontend/gestion/pagina*.cpp",
    que: "Lo que ve la persona. Los widgets se dibujan en el .ui; el .cpp conecta cada botón con su función (señales y slots) y valida lo escrito." },
  { nom: "Repositorio", arch: "frontend/comun/repositorio.cpp / .h",
    que: "Un método por stored procedure (ej. modificarProtocolo). Pasa los parámetros y devuelve una Respuesta (ok, codigo, mensaje, id, valor, dato) o un Resultado (filas)." },
  { nom: "BaseDatos::llamar", arch: "frontend/comun/basedatos.cpp",
    que: "Arma el texto «CALL esquema.sp(...)», escapa las comillas (D'Angelo no rompe nada), lo manda con mysql_query y lee los resultados. Si el SP devolvió estado='ERROR', lo convierte en error." },
  { nom: "MySQL en Aiven", arch: "backend/*.sql",
    que: "Tablas + stored procedures. Las apps NUNCA tocan tablas: solo llaman SP. Las reglas de negocio (seña, 24 h, cirugías, cupones) viven acá." },
  { nom: "Modo contingencia", arch: "frontend/comun/conexionapp.cpp · contingencia.cpp · almacenlocal.cpp",
    que: "Sin base, las apps siguen andando con datos locales y guardan los turnos pendientes en el equipo (pendientes.json); al volver la conexión los envían." }
];
window.OTROS = [
  ["Sitio web", "web/ — Vite (sitio) + API Node (web/api/servidor.js). Asistente de IA con Gemini en web/api/asistente.js; reserva por pasos en reservachat.js."],
  ["Bot de Telegram", "web/api/telegram.js (long polling). Vincula a la paciente (/start, expira a los 30 min) y manda avisos."],
  ["n8n", "Carpeta n8n/: flujos automáticos (por ejemplo la tarea diaria que vence evaluaciones previas sin usar)."],
  ["Configuración", "Variables DERMALIA_DB_HOST/PORT/USER/PASS/NAME/SSL/CA, o el archivo dermalia.ini (base/host, puerto, usuario, clave, base, ssl, ca). Nunca va en el repo. Aiven exige SSL con el certificado (CA)."]
];

/* ---------- SQL ---------- */
window.ESQUEMAS = [
  ["personas", "Paciente (id_paciente, dni, nombre, apellido, fecha_nacimiento, email, telegram_chat_id), Profesional (id_profesional, matricula, nombre, apellido, email, activo), teléfonos"],
  ["clinica", "CategoriaProtocolo (id_categoria, nombre, porcentaje_sena, requiere_evaluacion), Protocolo (id_protocolo, id_categoria, nombre, descripcion, precio, duracion_min, activo), ProfesionalProtocolo"],
  ["agenda", "Turno (id_turno, id_paciente, id_profesional, id_estado_turno, fecha_hora_inicio, fecha_hora_fin…), TurnoProtocolo (id_turno, id_protocolo, precio_aplicado)"],
  ["pagos", "PagoSena (id_pago, id_turno, monto, codigo_operacion, monto_reembolsado…), TarjetaRegalo, MovimientoTarjeta, MedioPago, EstadoPago"],
  ["otros", "seguridad (usuarios, login), beneficios (cupones), notificaciones, asistente (consultas y Telegram), auditoria (log)"]
];
window.SP_PLANTILLA = `-- Así están hechos TODOS los SP de escritura de Dermalia (ejemplo real: clinica.sp_modificar_protocolo)
CREATE PROCEDURE clinica.sp_modificar_protocolo(
    IN p_id_protocolo INT, IN p_nombre VARCHAR(100), IN p_descripcion VARCHAR(500), IN p_precio DECIMAL(12,2),
    IN p_duracion_min INT, IN p_activo SMALLINT, IN p_origen VARCHAR(50), IN p_id_usuario INT)
BEGIN
    DECLARE v_codigo INT DEFAULT NULL;          -- NULL = ninguna regla falló todavía
    DECLARE v_mensaje VARCHAR(255) DEFAULT NULL;
    DECLARE v_errno INT DEFAULT 0;
    DECLARE v_msg VARCHAR(500) DEFAULT '';
    DECLARE v_antes VARCHAR(400);

    -- 1) Si MySQL tira un error de motor: deshace, deja registro en el log y devuelve la fila ERROR
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_errno = MYSQL_ERRNO, v_msg = MESSAGE_TEXT;
        ROLLBACK;
        CALL auditoria.sp_registrar_log('cambio_protocolo', p_id_usuario, NULL, p_origen, v_msg,
                                        'clinica.Protocolo', p_id_protocolo, NULL, NULL, 0, NULL);
        SELECT 'ERROR' AS estado, v_errno AS codigo, v_msg AS mensaje, NULL AS id, NULL AS valor, NULL AS dato;
    END;

    -- 2) Reglas de negocio, una tras otra. Solo cae la primera que falla (por el v_codigo IS NULL)
    SELECT CAST(precio AS CHAR) INTO v_antes FROM clinica.Protocolo WHERE id_protocolo = p_id_protocolo;
    IF v_codigo IS NULL AND (v_antes IS NULL) THEN
        SET v_codigo = 52060; SET v_mensaje = 'El protocolo no existe';
    END IF;
    IF v_codigo IS NULL AND (p_precio IS NULL OR p_precio <= 0) THEN
        SET v_codigo = 52063; SET v_mensaje = 'El precio debe ser mayor a cero';
    END IF;
    -- ... (después: el UPDATE, el log de auditoría y el SELECT 'OK')
END`;
window.SP_FILA = "Todo SP de escritura devuelve UNA fila con 6 columnas: estado ('OK'/'ERROR'), codigo (0 o 52xxx), mensaje, id, valor, dato. Los de consulta devuelven filas (0 filas si no hay coincidencias, nunca error).";
window.ERRORES = [
  ["52060", "El protocolo no existe"], ["52063", "El precio debe ser mayor a cero"], ["52064", "La duración debe estar entre 1 y 600 minutos"],
  ["52062", "El nombre del protocolo debe tener al menos 3 caracteres"], ["52070", "Origen inválido (solo terminal, web, gestion, sistema)"],
  ["52012", "Cuenta bloqueada 15 minutos (5 intentos fallidos de login en 15 min)"], ["52116", "No se puede combinar cupón y tarjeta de regalo en un mismo turno"],
  ["52150", "Monto de tarjeta de regalo fuera de $20.000 – $5.000.000"], ["52151", "No se puede pagar una tarjeta de regalo con otra tarjeta"]
];
window.REGLAS = [
  ["Seña", "Porcentaje del precio según la categoría del protocolo (30% general, 40% cirugías). Se redondea al peso. En C++: Sena::calcular(precio, porcentaje) en frontend/comun/sena.h."],
  ["Cancelación", "Más de 24 h antes: seña 100% reembolsada. Menos de 24 h: queda retenida. Está en agenda.sp_cancelar_turno (INTERVAL 24 HOUR en backend/04_sp_semana4.sql)."],
  ["Inasistencia", "El turno marcado como inasistencia retiene la seña."],
  ["Cirugías", "Requieren una consulta prequirúrgica con resultado «apta» de menos de 6 meses (RF-25). Al reservar la cirugía se devuelve la seña de la consulta."],
  ["Reclamo de evaluación", "sp_reclamar_evaluacion: el instituto retiene el 50% de la consulta y devuelve el resto; se reclama una sola vez. Si la evaluación no es apta, retiene el 10% de la seña."],
  ["Vencimiento", "Una evaluación sin usar vence a los 6 meses y el instituto se queda con el dinero de la consulta. Tarea diaria en n8n."],
  ["Precios", "Cambiar el precio de un protocolo NO toca turnos ya reservados: guardan su precio en agenda.TurnoProtocolo.precio_aplicado. La recepción cambia precios sin ayuda técnica (RNF-08)."],
  ["Cupones", "Token que cambia cada 5 minutos (el QR); se acepta el token actual y el anterior. Reglas de frecuencia y gasto, más una promoción general de una sola vez."],
  ["Tarjetas de regalo", "Vigencia 12 meses; monto $20.000–$5.000.000; no se paga una tarjeta con otra; no se combina con cupón en el mismo turno."],
  ["Login", "5 intentos fallidos en 15 minutos bloquean 15 minutos. Las claves se guardan y comparan en texto plano: decisión del equipo documentada (docs/12-contrato-sp.md)."],
  ["Avisos", "Un envío fallido se reintenta hasta 3 veces y después queda 'fallida'. El recordatorio del turno se programa 24 h antes (RF-11)."],
  ["Telegram", "El paso /start vence a los 30 minutos; el historial cubre las últimas 6 h y guarda los últimos 20 mensajes."],
  ["Reloj de prueba", "Para probar fechas: SET @ahora_simulado = '2026-11-03 09:00:00'; los SP usan COALESCE(@ahora_simulado, NOW())."]
];

/* ---------- Ejercicios (con checklist que se tilda sola; NO ejecuta SQL) ---------- */
window.EJ_SQL = [
  { id: "sql1", t: "Subir un precio a mano", dif: 1,
    q: "La profesora dice: «el Peeling químico cuesta 30000, cambialo». Escribí cómo lo harías desde SQL respetando que las apps solo llaman SP (id_usuario 1, origen 'gestion'). Suponé que id_protocolo del peeling es 3 y que su nombre/descripción/duración quedan igual (usá valores de ejemplo).",
    chk: [["CALL", /\bCALL\b/i], ["el SP correcto", /clinica\.sp_modificar_protocolo/i], ["el precio 30000", /30000/], ["origen 'gestion'", /'gestion'/i]],
    sol: "CALL clinica.sp_modificar_protocolo(3, 'Peeling químico', NULL, 30000, 45, 1, 'gestion', 1);\n-- Los turnos ya reservados conservan agenda.TurnoProtocolo.precio_aplicado." },
  { id: "sql2", t: "Listar protocolos caros", dif: 1,
    q: "Escribí un SELECT que muestre nombre y precio de los protocolos ACTIVOS con precio mayor a 20000, del más caro al más barato.",
    chk: [["FROM clinica.Protocolo", /clinica\.Protocolo/i], ["WHERE con activo", /activo/i], ["precio > 20000", /precio\s*>\s*20000/i], ["ORDER BY precio DESC", /ORDER\s+BY\s+precio\s+DESC/i]],
    sol: "SELECT nombre, precio\nFROM clinica.Protocolo\nWHERE activo = 1 AND precio > 20000\nORDER BY precio DESC;" },
  { id: "sql3", t: "Turnos de una paciente por DNI", dif: 2,
    q: "Escribí un SELECT con JOIN que muestre, para el DNI '33222111', la fecha_hora_inicio de cada turno y el apellido de la paciente.",
    chk: [["JOIN", /\bJOIN\b/i], ["agenda.Turno", /agenda\.Turno/i], ["personas.Paciente", /personas\.Paciente/i], ["ON id_paciente", /id_paciente/i], ["dni = '33222111'", /33222111/]],
    sol: "SELECT p.apellido, t.fecha_hora_inicio\nFROM agenda.Turno t\nJOIN personas.Paciente p ON p.id_paciente = t.id_paciente\nWHERE p.dni = '33222111'\nORDER BY t.fecha_hora_inicio;" },
  { id: "sql4", t: "Cantidad de turnos por profesional", dif: 2,
    q: "Escribí un SELECT que muestre el apellido de cada profesional y cuántos turnos tiene (aunque tenga 0).",
    chk: [["LEFT JOIN", /LEFT\s+JOIN/i], ["COUNT", /COUNT\s*\(/i], ["GROUP BY", /GROUP\s+BY/i], ["personas.Profesional", /personas\.Profesional/i]],
    sol: "SELECT pr.apellido, COUNT(t.id_turno) AS turnos\nFROM personas.Profesional pr\nLEFT JOIN agenda.Turno t ON t.id_profesional = pr.id_profesional\nGROUP BY pr.id_profesional, pr.apellido;" },
  { id: "sql5", t: "Crear un SP de consulta", dif: 3,
    q: "Creá agenda.sp_turnos_de_un_dia(IN p_fecha DATE) que devuelva id_turno y fecha_hora_inicio de los turnos de ese día. Los SP de consulta devuelven filas (0 si no hay), sin error. Recordá DELIMITER.",
    chk: [["DELIMITER", /DELIMITER/i], ["CREATE PROCEDURE agenda.", /CREATE\s+PROCEDURE\s+agenda\./i], ["parámetro p_fecha", /IN\s+p_fecha\s+DATE/i], ["SELECT sobre agenda.Turno", /FROM\s+agenda\.Turno/i], ["filtra por DATE(", /DATE\s*\(/i], ["END", /\bEND\b/i]],
    sol: "DELIMITER //\nCREATE PROCEDURE agenda.sp_turnos_de_un_dia(IN p_fecha DATE)\nBEGIN\n    SELECT id_turno, fecha_hora_inicio\n    FROM agenda.Turno\n    WHERE DATE(fecha_hora_inicio) = p_fecha\n    ORDER BY fecha_hora_inicio;\nEND //\nDELIMITER ;" },
  { id: "sql6", t: "Cambiar la regla de 24 h a 48 h", dif: 3,
    q: "La profesora pide que la cancelación con reembolso total sea con más de 48 horas. ¿Qué archivo y qué línea tocás, y qué tenés que hacer para que la base lo tome?",
    chk: [["archivo 04_sp_semana4", /04_sp_semana4/i], ["sp_cancelar_turno", /sp_cancelar_turno/i], ["INTERVAL 48 HOUR", /INTERVAL\s+48\s+HOUR/i], ["volver a crear el SP (DROP + CREATE)", /DROP|CREATE|ejecutar|correr/i]],
    sol: "En backend/04_sp_semana4.sql, dentro de agenda.sp_cancelar_turno, la línea:\n  SET v_total = (v_inicio > COALESCE(@ahora_simulado, NOW()) + INTERVAL 24 HOUR);\npasa a INTERVAL 48 HOUR. Hay que volver a ejecutar el CREATE PROCEDURE en la base (DROP PROCEDURE IF EXISTS y CREATE). También quedan textos de 'más de 24 h' en los mensajes del SP y en la app: buscar con grep." }
];
window.EJ_CPP = [
  { id: "cpp1", t: "Sacar un botón", dif: 1,
    q: "«Sacá el botón X» (por ejemplo ui->btnIrBuscar). ¿Qué pasos seguís para que no rompa la compilación?",
    chk: [[".ui / Qt Designer", /\.ui|designer/i], ["borrar los connect", /connect/i], ["o ocultarlo con hide()/setVisible(false)", /hide|setVisible/i]],
    sol: "Opción rápida: ui->btnX->hide(); en el constructor (no se rompe nada).\nOpción limpia: borrarlo en el .ui (Qt Designer) Y borrar toda línea del .cpp que use ui->btnX (los connect en conectarSenales, texto, enable). Si queda una referencia, no compila." },
  { id: "cpp2", t: "Cambiar el tiempo de inactividad", dif: 1,
    q: "La terminal del cliente cierra la sesión por inactividad. ¿En qué archivo y qué constante cambiás para que sean 5 minutos?",
    chk: [["ventanacliente.cpp", /ventanacliente/i], ["MINUTOS_SESION", /MINUTOS_SESION/], ["= 5", /5/]],
    sol: "frontend/cliente/ventanacliente.cpp línea ~59: static const int MINUTOS_SESION = 3;  →  = 5;\nSe usa en relojSesion->setInterval(MINUTOS_SESION * 60 * 1000) y eventFilter lo reinicia con cada clic o tecla." },
  { id: "cpp3", t: "Agregar un método al Repositorio", dif: 3,
    q: "Escribí el método Repositorio::turnosDeUnDia(const QDate &fecha) que llame al SP agenda.sp_turnos_de_un_dia. Mostrá la declaración en el .h y la definición en el .cpp. Recordá cómo se pasan los parámetros: base.llamar(\"esquema.sp\", { ... }).",
    chk: [["declaración con QDate", /QDate/], ["Resultado como retorno", /Resultado/], ["base.llamar", /base\.llamar/], ["nombre del SP completo", /agenda\.sp_turnos_de_un_dia/], ["el parámetro fecha", /fecha/]],
    sol: "// repositorio.h  (dentro de la clase, sección agenda)\nResultado turnosDeUnDia(const QDate &fecha);\n\n// repositorio.cpp\n/* Turnos de un día (agenda.sp_turnos_de_un_dia). */\nResultado Repositorio::turnosDeUnDia(const QDate &fecha)\n{\n    return base.llamar(\"agenda.sp_turnos_de_un_dia\", { fecha });\n}\n// Los SP de consulta devuelven filas (Resultado). Los de escritura usan aRespuesta(...)." },
  { id: "cpp4", t: "Cambiar un texto de mensaje", dif: 1,
    q: "El mensaje al confirmar un turno dice «El turno quedó cargado.» y la profesora lo quiere distinto. ¿Dónde está y cómo lo encontrás rápido?",
    chk: [["ventanagestion.cpp", /ventanagestion/i], ["confirmarTurnoEnBase / confirmarTurno", /confirmarTurno/i], ["buscar con Ctrl+Shift+F / grep", /buscar|grep|ctrl/i]],
    sol: "Se busca el texto exacto («El turno quedó cargado») con Ctrl+Shift+F en Qt Creator o con grep -rn. Está en frontend/gestion/ventanagestion.cpp, al final de la carga del turno (confirmarTurnoEnBase y confirmarTurno), dentro del QString mensaje." },
  { id: "cpp5", t: "Agregar una columna a la tabla de turnos", dif: 3,
    q: "La profesora quiere ver el email del paciente en la tabla de turnos de Gestión. ¿Qué partes del código tocás (sin escribir todo, listá archivo + qué)?",
    chk: [["el .ui / columnCount", /\.ui|columnCount|setColumnCount/i], ["el enum Col*", /Col[A-Z]|enum/i], ["el arreglo columnas en mostrarTurnos", /mostrarTurnos|columnas/i], ["la estructura Turno", /Turno|struct/i]],
    sol: "1) ventanagestion.ui: una columna más en tablaTurnos (o setColumnCount).\n2) El enum de columnas (ColPaciente … ColSena): agregar ColEmail y ajustar el bucle de mostrarTurnos().\n3) mostrarTurnos(): sumar t.email al arreglo columnas[].\n4) La estructura Turno (y DatosBase / repositorio, que la llenan): un campo email y de dónde sale (el SP de turnos tiene que devolverlo)." },
  { id: "cpp6", t: "Nueva validación de campo", dif: 2,
    q: "Agregá una regla: el nombre del paciente no puede tener más de 40 caracteres. ¿En qué función va y qué patrón usan las demás validaciones?",
    chk: [["Validaciones::", /Validaciones/], ["devuelve un error por puntero", /error|QString\s*\*/i], ["size() > 40", /size\s*\(\s*\)\s*>\s*40|length\s*\(\s*\)\s*>\s*40/]],
    sol: "En frontend/comun/validaciones.cpp, función nombreApellidoValido(texto, &error): al principio\n  if (texto.simplified().size() > 40) { *error = \"El nombre no puede pasar de 40 caracteres.\"; return false; }\nTodas las Validaciones::xxxValido(valor, &error) devuelven bool y dejan el motivo en error; las pantallas lo juntan con '• ' y lo muestran con Formato::avisarErrores." }
];

/* ---------- Recetas: «la profe dice…» ---------- */
window.RECETAS = [
  { dice: "«Este precio no me gusta, cambialo»", donde: "App Gestión → Protocolos → tocar la fila → editar Precio → Guardar.",
    codigo: "PaginaProtocolos::guardar (paginaprotocolos.cpp)\n  → repo->modificarProtocolo(...)            (repositorio.cpp)\n  → clinica.sp_modificar_protocolo(...)       (backend/03_sp_semana3.sql)\n\nPara cambiar el precio de ejemplo (datos de prueba sin base): frontend/comun/datosprueba.cpp.\nPara un valor en la base: CALL clinica.sp_modificar_protocolo(id, nombre, NULL, 30000, duración, 1, 'gestion', 1);",
    ojo: "Los turnos ya reservados mantienen el precio viejo (precio_aplicado). Si piden otro tope de precio: Validaciones::precioValido." },
  { dice: "«Sacá este botón»", donde: "El botón vive en un .ui (ventanacliente.ui / ventanagestion.ui) y se conecta en el .cpp.",
    codigo: "Rápido:  ui->btnNombre->hide();   // en el constructor\nLimpio:  borrar el widget en Qt Designer y borrar sus 'connect' y usos en el .cpp.\n\nBuscar su nombre:  grep -n \"btnNombre\" frontend -r",
    ojo: "Si borrás el widget del .ui y queda una línea con ui->btnNombre, NO compila." },
  { dice: "«Cambiá el color / el estilo de esto»", donde: "El QSS está en la propiedad styleSheet del widget central, dentro del .ui.",
    codigo: "QPushButton[primario=\"true\"] { background: #A8475F; border-color: #A8475F; color: #FFFFFF; }\n                                  ↑ cambiás este color\n\nSelectores: QPushButton (clase) · #btnSena (nombre del objeto) · [rol=\"titulo\"] (propiedad) · :hover :disabled (estado).\nProbalo en la pestaña «QSS en vivo» antes de tocar el .ui.",
    ojo: "El tema vive en UN solo bloque QSS por programa: se cambia ahí y vale para todas las pantallas. Los colores base: rosa #A8475F, dorado #B8935A, fondo #FCF8F2." },
  { dice: "«Creá una función que…»", donde: "Depende de si toca la base o solo la pantalla.",
    codigo: "1) ¿Hace falta dato nuevo de la base? → crear el SP en backend/*.sql (plantilla en la pestaña SQL).\n2) Un método en Repositorio que lo llame (repositorio.h + .cpp).\n3) Una función en la pantalla (VentanaGestion::algo) y su connect en conectarSenales().\n4) Si es lógica pura (cuentas, validaciones): funciones chicas en frontend/comun (sena.h, validaciones.cpp, formato.cpp).",
    ojo: "Declarar en el .h antes de definir en el .cpp, o el compilador no la encuentra." },
  { dice: "«Cambiá el porcentaje de seña / la regla de 24 horas»", donde: "Seña: tabla clinica.CategoriaProtocolo (porcentaje_sena). 24 h: SP agenda.sp_cancelar_turno.",
    codigo: "-- Seña de una categoría (ejemplo; confirmar el id_categoria):\nUPDATE clinica.CategoriaProtocolo SET porcentaje_sena = 35 WHERE id_categoria = 1;\n\n-- 24 h: backend/04_sp_semana4.sql → INTERVAL 24 HOUR → 48 HOUR y volver a crear el SP.",
    ojo: "La app lee el porcentaje desde la categoría del protocolo (p.categoria.porcentajeSena); el cálculo está en Sena::calcular (sena.h)." },
  { dice: "«Cambiá cuánto tarda en cerrarse la sesión»", donde: "frontend/cliente/ventanacliente.cpp, constante MINUTOS_SESION (línea ~59).",
    codigo: "static const int MINUTOS_SESION = 3;   // → 5", ojo: "Cada clic, tecla o toque la reinicia (eventFilter)." },
  { dice: "«¿Cómo se conecta a la base?»", donde: "frontend/comun/basedatos.cpp (ConfigBD::desdeEntorno y BaseDatos::conectar).",
    codigo: "Variables: DERMALIA_DB_HOST / PORT / USER / PASS / NAME / SSL / CA   (o dermalia.ini, sección base)\nmysql_init → mysql_options (timeout, utf8mb4, SSL + CA) → mysql_real_connect(..., CLIENT_MULTI_RESULTS)",
    ojo: "Aiven necesita SSL. Si la conexión falla, la app NO se cae: pasa a modo contingencia." },
  { dice: "«Recompilá / mostrame que anda»", donde: "Según el manual técnico (docs/13-manual-tecnico.md), en Ubuntu:",
    codigo: "cmake -S frontend -B build -G Ninja && cmake --build build",
    ojo: "Confirmá antes con tu equipo cómo se compila en la computadora de la presentación (el manual describe Ubuntu)." }
];

/* ---------- Pantallas ---------- */
window.PANTALLAS = [
  ["cliente-00-inicio.png", "Cliente · Inicio", "ventanacliente.ui / VentanaCliente (PagInicio)", "Pantalla de bienvenida (QFrame#hero con el botón btnSacarTurno)."],
  ["cliente-01-protocolo.png", "Cliente · Paso 1 protocolo", "VentanaCliente::cargarProtocolos / continuarProtocolo", "Lista de tratamientos (QListWidget#listaProtocolos); máximo MAX_PROTOCOLOS; aviso de cirugía."],
  ["cliente-02-horario.png", "Cliente · Paso 2 horario", "VentanaCliente::actualizarHorarios / continuarHorario", "Calendario + horarios libres (QListWidget#listaHorarios)."],
  ["cliente-03-confirmar.png", "Cliente · Paso 3 confirmar", "VentanaCliente (resumen y pago de la seña)", "Resumen del turno y seña."],
  ["cliente-04-precios.png", "Cliente · Precios", "comun/buscadorprecios.cpp", "Buscador de precios (mismo catálogo que Gestión)."],
  ["cliente-05-mi-turno.png", "Cliente · Mi turno", "VentanaCliente::mostrarTurno / ocultarTurno", "Tarjeta del turno con botones de Google Calendar y Telegram."],
  ["cliente-06-ingresar.png", "Cliente · Ingresar", "cliente/dialogocuenta.cpp (ingresar)", "Login de la paciente."],
  ["cliente-07-crear-cuenta.png", "Cliente · Crear cuenta", "cliente/dialogocuenta.cpp", "Alta de cuenta."],
  ["cliente-08-asistente.png", "Cliente · Asistente", "cliente/dialogoasistente.cpp", "Chat con el asistente de IA (preguntar, enviarPedido)."],
  ["gestion-00-ingreso.png", "Gestión · Ingreso", "VentanaGestion::pedirLogin", "Login de recepción."],
  ["gestion-01-inicio.png", "Gestión · Inicio", "ventanagestion.ui (hero + menú lateral)", "Menú lateral (QListWidget#menu) y accesos."],
  ["gestion-02-cargar-turno.png", "Gestión · Cargar turno", "continuarPaso1 / continuarPaso2 / confirmarTurno", "Alta de turno en 3 pasos."],
  ["gestion-04-buscador-precios.png", "Gestión · Buscador de precios", "comun/buscadorprecios.cpp", "Consulta de precios."],
  ["gestion-05-buscar-turnos.png", "Gestión · Buscar turnos", "VentanaGestion::mostrarTurnos / cancelarTurno", "Tabla de turnos, cancelar, estado de la seña."],
  ["gestion-06-protocolos.png", "Gestión · Protocolos", "gestion/paginaprotocolos.cpp", "ABM de protocolos: ACÁ se cambia un precio."],
  ["gestion-07-profesionales.png", "Gestión · Profesionales", "gestion/paginaprofesionales.cpp", "Profesionales, protocolos que hacen y franjas."],
  ["gestion-08-pacientes.png", "Gestión · Pacientes", "gestion/paginapacientes.cpp", "ABM de pacientes."],
  ["gestion-09-avisos.png", "Gestión · Avisos", "gestion/paginaavisos.cpp", "Recordatorios y WhatsApp."],
  ["gestion-10-cupones.png", "Gestión · Cupones", "gestion/paginacupones.cpp", "Cupones."],
  ["gestion-11-tarjetas.png", "Gestión · Tarjetas de regalo", "gestion/paginatarjetas.cpp", "Tarjetas."],
  ["gestion-12-consultas-previas.png", "Gestión · Consultas previas", "gestion/paginaevaluaciones.cpp", "Evaluaciones prequirúrgicas."],
  ["gestion-13-reportes.png", "Gestión · Reportes", "gestion/paginareportes.cpp", "Los 8 reportes y la auditoría."],
  ["gestion-14-usuarios.png", "Gestión · Usuarios", "gestion/paginausuarios.cpp", "Usuarios del personal."]
];

/* ---------- Preguntas probables ---------- */
window.PREGUNTAS = [
  ["Negocio", "¿Cuánto pierde el instituto por inasistencias?", "6 turnos por semana, unos $900.000 por semana. La recepción gasta 95 minutos por día contestando."],
  ["Negocio", "¿Cuánto cuesta y qué incluye?", "Implantación $22 millones más abono de $400.000 por mes (soporte, hosting, respaldos y cuota de IA). Desarrollo: 847 horas, $16,9 millones."],
  ["Negocio", "¿Contra quién compiten y por qué son mejores?", "AgendaPro, Fresha, Booksy, Doctoralia: cobran por profesional (USD 3.600–4.900/año con 20). Dermalia suma consulta previa para cirugías, tarjetas con saldo y cupones con QR. Varias celdas de la matriz están «a verificar»."],
  ["Negocio", "¿Cuáles son los 4 indicadores?", "−60% tiempo de atención manual, −50% turnos perdidos, 0 superposiciones, ≥70% consultas resueltas con el buscador; se miden a las 4 semanas. Son metas, no resultados medidos."],
  ["Negocio", "¿Cuántas pruebas hay?", "255 casos de la base, 44 de estructura, 6 programas de prueba de las apps y 61 de la API."],
  ["Reglas", "¿Qué pasa si cancelo con más de 24 horas?", "La seña se reembolsa 100%. Con menos de 24 h queda retenida."],
  ["Reglas", "¿De cuánto es la seña?", "Un porcentaje del precio según la categoría: 30% en general, 40% en cirugías; se redondea al peso."],
  ["Reglas", "¿Qué se necesita para una cirugía?", "Una consulta prequirúrgica con resultado «apta» de menos de 6 meses. Al reservar la cirugía se devuelve la seña de la consulta."],
  ["Reglas", "¿Qué pasa si la evaluación no es apta o vence?", "No apta: el instituto retiene el 10% de la seña. Vence a los 6 meses sin usar: el instituto se queda con el dinero de la consulta. Si se reclama, retiene el 50% y devuelve el resto (una sola vez)."],
  ["Reglas", "Si cambio un precio, ¿qué pasa con los turnos ya sacados?", "Mantienen el precio viejo: se guarda en agenda.TurnoProtocolo.precio_aplicado."],
  ["Reglas", "¿Cuántos intentos de login hay?", "5 fallidos en 15 minutos bloquean la cuenta 15 minutos (error 52012)."],
  ["Reglas", "¿Cómo se guardan las contraseñas?", "En texto plano: es una decisión del equipo, documentada en docs/12-contrato-sp.md. Mejora a futuro: guardar un hash (idea mía, no está implementada)."],
  ["Reglas", "¿Qué restricciones tiene una tarjeta de regalo?", "Vence a los 12 meses, monto $20.000–$5.000.000, no se paga una tarjeta con otra y no se combina con cupón en el mismo turno."],
  ["Reglas", "¿Cuánto dura un cupón (QR)?", "El token cambia cada 5 minutos; se acepta el actual y el anterior."],
  ["Técnico", "¿Dónde está la base y cómo se conecta?", "MySQL en Aiven. La app lee DERMALIA_DB_* o dermalia.ini (nunca en el repo); SSL con el certificado CA; mysql_real_connect con CLIENT_MULTI_RESULTS."],
  ["Técnico", "¿Por qué CLIENT_MULTI_RESULTS?", "Un CALL de stored procedure puede devolver más de un resultado (el SELECT y el propio CALL). Sin eso la conexión se traba."],
  ["Técnico", "¿Por qué se escapan las comillas en BaseDatos::literal?", "Porque el CALL se arma concatenando texto: un apellido como D'Angelo rompería la consulta (y sería una inyección SQL)."],
  ["Técnico", "¿Qué devuelve un SP que escribe?", "Una fila: estado ('OK'/'ERROR'), codigo, mensaje, id, valor, dato. BaseDatos::llamar convierte estado='ERROR' en error."],
  ["Técnico", "¿Qué hace el EXIT HANDLER?", "Si MySQL tira un error de motor: ROLLBACK, registra el fallo en el log y devuelve la fila ERROR. Las reglas de negocio se validan con IF v_codigo IS NULL AND (...)."],
  ["Técnico", "¿Qué hace cada capa?", "Pantalla (valida y muestra) → Repositorio (un método por SP) → BaseDatos::llamar (arma el CALL y lee) → MySQL (las reglas)."],
  ["Técnico", "¿Qué pasa si se cae la base?", "Modo contingencia (RNF-09): franja amarilla, datos locales, el turno se guarda en el equipo (pendientes.json) y se manda solo cuando vuelve la conexión."],
  ["Técnico", "¿Qué orígenes acepta un SP?", "'terminal', 'web', 'gestion' y 'sistema'. Otro valor da error 52070."],
  ["Técnico", "¿Cómo evita la IA inventar precios y qué datos recibe?", "Se le pasa el catálogo de la base y la orden de contestar solo con eso; si no sabe, deriva a una persona. Antes de enviar a Gemini y antes de guardar, se borran emails y números largos."],
  ["Técnico", "¿Para qué sirven las versiones _tuneado?", "Son versiones de los SP optimizadas en la semana 6 (backend/06_tuning_semana6.sql) con el mismo resultado que los originales."],
  ["Técnico", "¿Qué reportes hay?", "8 reportes: turnos por período, ingresos de seña, cancelaciones e inasistencias, evaluaciones y cirugías, protocolos más pedidos, ocupación, cupones, tarjetas; más la auditoría."],
  ["Técnico", "¿Cómo se reintentan los avisos?", "Un envío fallido se reintenta hasta 3 veces; después queda 'fallida'."],
  ["Técnico", "¿Cómo funciona el bloqueo por inactividad de la terminal?", "Un reloj (QTimer) de MINUTOS_SESION = 3 minutos; eventFilter lo reinicia con cada clic, tecla o toque. Al vencer, cierra la sesión."],
  ["Honestidad", "¿Qué NO está verificado?", "La app Qt usada de punta a punta con el asistente por una persona, y el bot de Telegram con token real. No afirmarlo en la presentación."],
  ["Honestidad", "¿Qué falta hacer?", "Pasarela de pagos real y WhatsApp con la API oficial de Meta: están identificados y presupuestados."]
];

window.OLVIDOS = [
  "Antes de empezar: dejar la base con datos de ejemplo e iniciar todo con ./dermalia.sh (recargar-base, iniciar, estado). Usuario y clave de demo: están en docs/06-pitch.md / README del proyecto.",
  "Verificar ./dermalia.sh estado: la API tiene que decir que llega a la base.",
  "Si la base no responde: no entrar en pánico, mostrar la franja amarilla de contingencia y decir que es una función (RNF-09).",
  "Datos de la demo: paciente Carla Gómez, DNI 33222111; profesional Dra. Marino (limpieza, peeling, mesoterapia).",
  "Probar con reloj simulado: SET @ahora_simulado = '2026-11-03 09:00:00';",
  "Ensayar cronometrado tres veces. Si pasa de 7 min, se recorta competencia, nunca la demo. Máximo 10.",
  "Llevar impresa la matriz de competencia y la tabla de presupuesto.",
  "Coevaluación: completar la rúbrica de BA Aprende de los otros equipos.",
  "Nunca afirmar lo no verificado (ver «Honestidad» en Preguntas).",
  "Si la profe pide un cambio en vivo: decir en voz alta qué archivo vas a tocar y por qué ANTES de tocarlo. Mostrás que entendés, no solo que sabés copiar.",
  "Después de cambiar un SP hay que volver a crearlo en la base (DROP + CREATE); después de cambiar C++ hay que recompilar; el QSS se ve al recompilar o al reabrir.",
  "No pegar claves ni el host de Aiven en pantalla ni en el chat."
];
