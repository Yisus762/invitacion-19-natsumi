/* ===== CONFIGURACIÓN (edita aquí) ===== */
// Número de WhatsApp que recibirá las confirmaciones (código de país + número, sin + ni espacios)
const WHATSAPP = "51929640916";
// Fecha de la fiesta: 15 ene 2027, 8:00 PM hora de Lima (UTC-5)
const FIESTA = Date.parse("2027-01-15T20:00:00-05:00");
// Ruta del MP3 (si tu archivo se llama distinto, cámbialo aquí). Debe estar dentro de la carpeta "audio"
const MUSIC_FILE = "audio/love-songs-bonus-kaash-paige.mp3.mpeg";
// Volumen de la música de fondo (0.22 – 0.25) y duración del fade-in al abrir el sobre
const MUSIC_VOL = 0.22;
const FADE_MS = 40
/* ===================================== */

const $ = id => document.getElementById(id);
const toast = msg => { const t = $("toast"); t.textContent = msg; t.classList.add("on"); setTimeout(() => t.classList.remove("on"), 2200); };

// Partículas plateadas
const cv = $("fx"), cx = cv.getContext("2d"); let P = [];
function resize() { cv.width = innerWidth; cv.height = innerHeight; P = Array.from({ length: 30 }, () => ({ x: Math.random() * cv.width, y: Math.random() * cv.height, r: Math.random() * 1.8 + .4, v: Math.random() * .35 + .1, a: Math.random() * 6 })); }
resize(); addEventListener("resize", resize);
// Confeti plateado y ráfaga de destellos al abrir el sobre
const C = Array.from({ length: 16 }, (_, i) => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, w: 4 + Math.random() * 4, h: 8 + Math.random() * 8, v: .3 + Math.random() * .6, r: Math.random() * 6, s: (Math.random() - .5) * .05, c: ["#e8ecf5", "#9aa0aa", "#ffffff", "#c0c6d0"][i % 4] }));
let B = [];
function burst() { for (let i = 0; i < 70; i++) { const a = Math.random() * 6.28, v = 2 + Math.random() * 7; B.push({ x: innerWidth / 2, y: innerHeight / 2, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 3, l: 1, c: i % 2 ? "#fff" : "#b9bec7" }); } }
// Fondo 3D: campo de estrellas con profundidad (z) + paralaje con puntero/giroscopio
const S = Array.from({ length: innerWidth < 768 ? 40 : 70 }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * .95 + .05 }));
let tx = 0, ty = 0, px = 0, py = 0;
const PAR = [[".aurora", -30, -20], [".beams", 24, 16], [".b1", -40, -30], [".b2", 28, 22], [".b3", -60, -45]].map(([q, a, b]) => [document.querySelector(q), a, b]);
addEventListener("pointermove", e => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; });
addEventListener("deviceorientation", e => { if (e.gamma == null) return; tx = Math.max(-1, Math.min(1, e.gamma / 30)) / 2; ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30)) / 2; });
(function draw() {
  cx.clearRect(0, 0, cv.width, cv.height);
  if (Math.abs(tx - px) + Math.abs(ty - py) > .0008) {
    px += (tx - px) * .05; py += (ty - py) * .05;
    PAR.forEach(([el, fx, fy]) => { if (el) el.style.translate = `${(px * fx).toFixed(1)}px ${(py * fy).toFixed(1)}px`; });
  }
  cx.shadowBlur = 0; cx.fillStyle = "#cfe0ff";
  S.forEach(t => { t.z -= .0014; if (t.z < .06) { t.z = 1; t.x = Math.random() * 2 - 1; t.y = Math.random() * 2 - 1; }
    const k = cv.width * .38 / t.z, sx = cv.width / 2 + t.x * k * .5 + px * 90 * (1 - t.z), sy = cv.height / 2 + t.y * k * .9 + py * 90 * (1 - t.z);
    if (sx < 0 || sx > cv.width || sy < 0 || sy > cv.height) return;
    cx.globalAlpha = Math.min(1, (1 - t.z) * 1.4 + .15); cx.beginPath(); cx.arc(sx, sy, (1 - t.z) * 2.4 + .4, 0, 7); cx.fill(); });
  P.forEach(p => { p.y -= p.v; p.a += .03; if (p.y < -5) { p.y = cv.height + 5; p.x = Math.random() * cv.width; }
    cx.globalAlpha = .35 + .45 * Math.sin(p.a); cx.fillStyle = "#e8ecf5";
    cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 7); cx.fill(); });
  cx.shadowBlur = 0;
  C.forEach(k => { k.y += k.v; k.r += k.s; if (k.y > cv.height + 12) { k.y = -12; k.x = Math.random() * cv.width; }
    cx.save(); cx.globalAlpha = .55; cx.translate(k.x, k.y); cx.rotate(k.r); cx.scale(Math.cos(k.r * 3), 1); cx.fillStyle = k.c; cx.fillRect(-k.w / 2, -k.h / 2, k.w, k.h); cx.restore(); });
  B = B.filter(b => b.l > 0);
  B.forEach(b => { b.x += b.vx; b.y += b.vy; b.vy += .12; b.vx *= .985; b.l -= .012; cx.globalAlpha = Math.max(b.l, 0); cx.fillStyle = b.c; cx.fillRect(b.x, b.y, 3, 5); });
  requestAnimationFrame(draw);
})();

/* ===== MÚSICA: "Love Songs - Bonus" · Kaash Paige =====
   Coloca el archivo love-songs-bonus-kaash-paige.mp3 dentro de la carpeta "audio" (junto a index.html):
   audio/love-songs-bonus-kaash-paige.mp3
   Si pausas a mano, la música nunca se vuelve a encender sola. */
const audio = $("audio"), mbtn = $("mbtn");
audio.volume = 0;
// Windows a veces oculta la extensión y el archivo queda como "...mp3.mp3": si el nombre normal falla, se prueba también ese
const MUSIC_FILES = [MUSIC_FILE, MUSIC_FILE + ".mp3"]; let mi = 0;
audio.addEventListener("error", () => {
  if (mi < MUSIC_FILES.length - 1) { mi++; audio.src = MUSIC_FILES[mi]; audio.load(); }
  else console.warn("No se pudo cargar", MUSIC_FILES.join(" ni "), "· código:", audio.error && audio.error.code);
});
audio.src = MUSIC_FILES[0];
let userPaused = false, fadeA;
const isOff = () => mbtn.classList.contains("paused");
function setLabel(v) {
  mbtn.classList.toggle("paused", !v);
  mbtn.setAttribute("aria-pressed", v);
  const t = $("mtxt"); if (t) t.textContent = v ? "♪ Música: ON" : "♪ Música: OFF";
}
function fadeAudio(to, ms, done) {
  clearInterval(fadeA);
  const from = audio.volume, t0 = performance.now();
  fadeA = setInterval(() => {
    const k = Math.min(1, (performance.now() - t0) / ms);
    audio.volume = Math.max(0, Math.min(1, from + (to - from) * k));
    if (k >= 1) { clearInterval(fadeA); if (done) done(); }
  }, 50);
}
function startMusic(ms) {
  clearInterval(fadeA); audio.volume = 0;
  audio.play().then(() => { setLabel(true); fadeAudio(MUSIC_VOL, ms); }).catch(err => { setLabel(false); toast(err && err.name === "NotAllowedError" ? "El navegador bloqueó el audio: toca ♪ Música para activarla" : "No se pudo cargar el MP3 (" + audio.currentSrc.split("/").pop() + ")"); console.warn("Música:", err); });
}
function stopMusic() { setLabel(false); fadeAudio(0, 500, () => { if (isOff()) audio.pause(); }); }
// Se llama al abrir el sobre (gesto del usuario). Si ya pausaste a mano, no se enciende.
function playMusic() { if (!userPaused && isOff()) startMusic(FADE_MS); }
mbtn.addEventListener("click", () => {
  if (!isOff()) { userPaused = true; stopMusic(); }
  else { userPaused = false; startMusic(1500); }
});
// Al salir de la pestaña se pausa; al volver se reanuda solo si estaba sonando y no la pausaste tú
let resumeShow = false;
document.addEventListener("visibilitychange", () => {
  if (document.hidden) { resumeShow = !isOff(); if (resumeShow) audio.pause(); }
  else if (resumeShow && !userPaused) { resumeShow = false; audio.play().catch(() => { }); }
});

// Sobre mágico: al tocar el sello se abre; el botón "Ver invitación" continúa
let opened = false;
$("env").addEventListener("click", () => {
  if (opened) return; opened = true;
  $("intro").classList.add("open");
  playMusic(); // el toque del usuario permite el autoplay
  burst();
  setTimeout(() => $("go").classList.add("show"), 1900);
});
$("go").addEventListener("click", () => {
  $("intro").classList.add("gone");
  $("main").classList.add("show");
  document.body.classList.remove("lock");
  window.scrollTo(0, 0);
  revealInit(); burst();
});

// Scroll reveal
function revealInit() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); } }), { threshold: .15 });
  document.querySelectorAll(".rv").forEach(el => io.observe(el));
}

// Contador regresivo
const z = n => String(n).padStart(2, "0");
function tick() {
  const t = Math.max(0, FIESTA - Date.now()) / 1000 | 0;
  $("d").textContent = z(t / 86400 | 0); $("h").textContent = z(t % 86400 / 3600 | 0);
  $("m").textContent = z(t % 3600 / 60 | 0); $("s").textContent = z(t % 60);
}
tick(); setInterval(tick, 1000);

// Acordeones
document.querySelectorAll(".acc").forEach(b => b.addEventListener("click", () => $(b.dataset.t).classList.toggle("on")));

// Copiar número de Yape/Plin
$("copy").addEventListener("click", async () => {
  const n = $("yape").textContent.replace(/\s/g, "");
  try { await navigator.clipboard.writeText(n); }
  catch { const i = document.createElement("input"); i.value = n; document.body.appendChild(i); i.select(); document.execCommand("copy"); i.remove(); }
  toast("¡Número copiado!");
});

// Playlist: la canción se sincroniza con el formulario
$("song").addEventListener("input", e => $("song2").value = e.target.value);
$("song2").addEventListener("input", e => $("song").value = e.target.value);
$("addsong").addEventListener("click", () => {
  if (!$("song").value.trim()) return toast("Escribe canción y artista");
  toast("¡Anotada! Se enviará con tu confirmación");
});

// RSVP por WhatsApp
$("rsvp").addEventListener("submit", e => {
  e.preventDefault();
  const msg = `✨ Confirmación – 19 años de Natsumi ✨\n` +
    `Nombre: ${$("nom").value.trim()}\n` +
    `Asistencia: ${$("asi").value}\n` +
    `Regalo: ${$("reg").value}\n` +
    `Canción sugerida: ${$("song2").value.trim() || "—"}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
});

// Decoración (portada y pantalla del sobre): estrellas titilantes y globos plateados/azules
const BC = ["#b9c6ff", "#5a78ff", "#e8ecf5", "#8fa2ff"];
function deco(el, stars, balloons) {
  for (let i = 0; i < stars; i++) { const e = document.createElement("i"); e.className = "st"; e.textContent = "✦"; e.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;font-size:${8 + Math.random() * 12}px;animation-delay:${Math.random() * 4}s`; el.appendChild(e); }
  for (let i = 0; i < balloons; i++) { const b = document.createElement("b"); b.className = "bl"; b.style.cssText = `left:${i % 2 ? 2 + Math.random() * 8 : 86 + Math.random() * 8}%;--c:${BC[i % 4]};animation-duration:${12 + Math.random() * 10}s;animation-delay:-${Math.random() * 14}s`; el.appendChild(b); }
}
deco(document.querySelector(".hero"), 16, 7);
deco($("intro"), 22, 6);

// Estrellas fugaces
function shoot() {
  const e = document.createElement("i"); e.className = "shoot";
  e.style.cssText = `top:${Math.random() * 40}%;left:${35 + Math.random() * 65}%;--l:${110 + Math.random() * 120}px`;
  document.body.appendChild(e); e.addEventListener("animationend", () => e.remove());
  setTimeout(shoot, 1800 + Math.random() * 3200);
}
setTimeout(shoot, 1200);