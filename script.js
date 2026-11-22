/* ===== CONFIGURACIÓN (edita aquí) ===== */
// Número de WhatsApp que recibirá las confirmaciones (código de país + número, sin + ni espacios)
const WHATSAPP = "+51929640916";
// Fecha de la fiesta: 15 ene 2027, 8:00 PM hora de Lima (UTC-5)
const FIESTA = Date.parse("2027-01-15T20:00:00-05:00");
/* ===================================== */

const $ = id => document.getElementById(id);
const toast = msg => { const t = $("toast"); t.textContent = msg; t.classList.add("on"); setTimeout(() => t.classList.remove("on"), 2200); };

// Partículas plateadas
const cv = $("fx"), cx = cv.getContext("2d"); let P = [];
function resize() { cv.width = innerWidth; cv.height = innerHeight; P = Array.from({ length: 55 }, () => ({ x: Math.random() * cv.width, y: Math.random() * cv.height, r: Math.random() * 1.8 + .4, v: Math.random() * .35 + .1, a: Math.random() * 6 })); }
resize(); addEventListener("resize", resize);
// Confeti plateado y ráfaga de destellos al abrir el sobre
const C = Array.from({ length: 28 }, (_, i) => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, w: 4 + Math.random() * 4, h: 8 + Math.random() * 8, v: .3 + Math.random() * .6, r: Math.random() * 6, s: (Math.random() - .5) * .05, c: ["#e8ecf5", "#9aa0aa", "#ffffff", "#c0c6d0"][i % 4] }));
let B = [];
function burst() { for (let i = 0; i < 70; i++) { const a = Math.random() * 6.28, v = 2 + Math.random() * 7; B.push({ x: innerWidth / 2, y: innerHeight / 2, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 3, l: 1, c: i % 2 ? "#fff" : "#b9bec7" }); } }
(function draw() {
  cx.clearRect(0, 0, cv.width, cv.height);
  P.forEach(p => { p.y -= p.v; p.a += .03; if (p.y < -5) { p.y = cv.height + 5; p.x = Math.random() * cv.width; }
    cx.globalAlpha = .35 + .45 * Math.sin(p.a); cx.fillStyle = "#e8ecf5"; cx.shadowColor = "#cfd8ff"; cx.shadowBlur = 8;
    cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 7); cx.fill(); });
  cx.shadowBlur = 0;
  C.forEach(k => { k.y += k.v; k.r += k.s; if (k.y > cv.height + 12) { k.y = -12; k.x = Math.random() * cv.width; }
    cx.save(); cx.globalAlpha = .55; cx.translate(k.x, k.y); cx.rotate(k.r); cx.scale(Math.cos(k.r * 3), 1); cx.fillStyle = k.c; cx.fillRect(-k.w / 2, -k.h / 2, k.w, k.h); cx.restore(); });
  B = B.filter(b => b.l > 0);
  B.forEach(b => { b.x += b.vx; b.y += b.vy; b.vy += .12; b.vx *= .985; b.l -= .012; cx.globalAlpha = Math.max(b.l, 0); cx.fillStyle = b.c; cx.shadowColor = "#fff"; cx.shadowBlur = 10; cx.fillRect(b.x, b.y, 3, 5); });
  requestAnimationFrame(draw);
})();

// Música: usa musica.mp3 si existe; si no, melodía lounge generada (Web Audio)
const audio = $("audio"), mbtn = $("mbtn");
audio.volume = .6;
let mode = null, ctx, lp, next = 0, step = 0;
const CH = [[110, 164.81, 196, 246.94, 261.63], [87.31, 130.81, 164.81, 220], [130.81, 164.81, 196, 246.94], [98, 146.83, 164.81, 246.94]]; // Am9 · Fmaj7 · Cmaj7 · G6
function note(f, t, d, type, g, att) {
  const o = ctx.createOscillator(), e = ctx.createGain();
  o.type = type; o.frequency.value = f;
  e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g, t + att); e.gain.exponentialRampToValueAtTime(.0001, t + d);
  o.connect(e); e.connect(lp); o.start(t); o.stop(t + d + .1);
}
function sched() {
  while (next < ctx.currentTime + 1) {
    const ch = CH[Math.floor(step / 16) % 4];
    if (step % 16 === 0) ch.forEach(f => { note(f, next, 6.4, "triangle", .045, 1.6); note(f * 1.004, next, 6.4, "sine", .04, 1.6); });
    if (step % 4 !== 3) note(ch[[1, 3, 2, 4, 3, 2, 1, 3][step % 8] % ch.length] * 2, next, 1.4, "sine", .04, .03);
    next += .3333; step++;
  }
}
function startSynth() {
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  const master = ctx.createGain(); master.gain.value = .45; master.connect(ctx.destination);
  lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1300; lp.connect(master);
  const dl = ctx.createDelay(); dl.delayTime.value = .42; const fb = ctx.createGain(); fb.gain.value = .45; const wet = ctx.createGain(); wet.gain.value = .35;
  lp.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(wet); wet.connect(master);
  next = ctx.currentTime + .1; sched(); setInterval(sched, 200);
  mode = "synth"; mbtn.classList.remove("paused");
}
function setMusic(on) {
  if (on) {
    if (mode === "synth") { ctx.resume(); mbtn.classList.remove("paused"); return; }
    audio.play().then(() => { mode = "file"; mbtn.classList.remove("paused"); }).catch(startSynth);
  } else {
    if (mode === "synth") ctx.suspend(); else audio.pause();
    mbtn.classList.add("paused");
  }
}
mbtn.addEventListener("click", () => setMusic(mbtn.classList.contains("paused")));

// Sobre mágico
let opened = false;
$("env").addEventListener("click", () => {
  if (opened) return; opened = true;
  $("intro").classList.add("open");
  setMusic(true); // el toque del usuario permite el autoplay
  setTimeout(() => $("intro").classList.add("gone"), 2600);
  setTimeout(() => { $("main").classList.add("show"); document.body.classList.remove("lock"); revealInit(); burst(); }, 2200);
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