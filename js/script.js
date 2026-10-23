/* =========================================================
   Birthday Surprise — script.js
   ========================================================= */

/* ---------------------------------------------------------
   ⚙️  CONFIGURATION — EDIT ONLY THIS BLOCK
   --------------------------------------------------------- */
const birthdayConfig = {
  // 1) The person's name
  name: "Ahana",

  // 2) The birthday card message
  message:
    "May your birthday be filled with happiness, beautiful memories, laughter and countless wonderful moments. You deserve all the happiness in the world. ❤️",

  // Subtitle shown on the reveal scene
  subMessage: "Today is your special day,\nso I made something special just for you.",

  // 4) Background music file (put your own file in assets/music/)
  music: "assets/music/birthday.mp3",

  // 3) Photos — add as many as you like (images live in assets/images/)
  photos: [
    { image: "assets/images/photo4.jpg", caption: "Beautiful Memory ❤️" },
    { image: "assets/images/photo5.jpg", caption: "Another Beautiful Memory ✨" },
    { image: "assets/images/photo6.jpg", caption: "Wishes & candles 🎂" },
  ],
};
/* -------------- END OF CONFIGURATION -------------------- */

const $ = (sel) => document.querySelector(sel);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Scene navigation ---------- */
const scenes = [...document.querySelectorAll(".scene")];
let current = 0;

function goToScene(index) {
  if (index < 0 || index >= scenes.length || index === current) return;
  scenes[current].classList.remove("is-active");
  current = index;
  scenes[current].classList.add("is-active");
  onSceneEnter(current + 1); // scenes are 1-based in the markup
}

function onSceneEnter(sceneNumber) {
  if (sceneNumber === 3) startReveal();
  if (sceneNumber === 6) finale();
}

document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => goToScene(current + 1));
});
$("[data-restart]").addEventListener("click", () => {
  resetGift();
  goToScene(0);
});

/* ---------- Scene 2 : gift box ---------- */
const giftBox = $("#giftBox");
let giftOpened = false;

giftBox.addEventListener("click", () => {
  if (giftOpened) return;
  giftOpened = true;
  giftBox.classList.add("is-open");
  burstConfetti(90);
  releaseHearts(16);
  setTimeout(() => goToScene(2), 1400);
});

function resetGift() {
  giftOpened = false;
  giftBox.classList.remove("is-open");
  $("#revealHeading").textContent = "";
  $("#revealSub").textContent = "";
  $("#revealSub").classList.remove("done");
  $("#finalText").textContent = "One Last Thing… ❤️";
}

/* ---------- Scene 3 : typing reveal ---------- */
let revealStarted = false;
function startReveal() {
  const heading = $("#revealHeading");
  const sub = $("#revealSub");
  heading.textContent = `Happy Birthday, ${birthdayConfig.name} 🎂`;
  typeText(sub, birthdayConfig.subMessage, 34);
  if (!revealStarted) revealStarted = true;
}

/** Types text character by character into an element. */
function typeText(el, text, speed = 40) {
  el.classList.remove("done");
  el.textContent = "";
  if (reduceMotion) {
    el.textContent = text;
    el.classList.add("done");
    return;
  }
  let i = 0;
  (function tick() {
    el.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(tick, speed);
    else el.classList.add("done");
  })();
}

/* ---------- Scene 4 : card content ---------- */
$("#cardTitle").textContent = `Happy Birthday, ${birthdayConfig.name}`;
$("#cardMessage").textContent = birthdayConfig.message;

/* ---------- Scene 5 : photo gallery ---------- */
const gallery = $("#gallery");
const placeholders = ["🌸", "🌙", "💞", "✨"];

(birthdayConfig.photos.length
  ? birthdayConfig.photos
  : placeholders.map((e, i) => ({ image: "", caption: `Memory ${i + 1} ${e}` }))
).forEach((photo, i) => {
  const card = document.createElement("figure");
  card.className = "polaroid";
  card.tabIndex = 0;
  card.setAttribute("role", "button");

  if (photo.image) {
    const img = document.createElement("img");
    img.src = photo.image;
    img.alt = photo.caption || "A memory";
    img.loading = "lazy";
    // If a photo is missing, fall back to a pretty placeholder tile.
    img.onerror = () => img.replaceWith(makePlaceholder(i));
    card.appendChild(img);
  } else {
    card.appendChild(makePlaceholder(i));
  }

  const cap = document.createElement("figcaption");
  cap.textContent = photo.caption || "Beautiful memory ❤️";
  card.appendChild(cap);

  const open = () => openLightbox(photo.image, cap.textContent);
  card.addEventListener("click", open);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  });
  gallery.appendChild(card);
});

function makePlaceholder(i) {
  const ph = document.createElement("div");
  ph.className = "ph";
  ph.textContent = placeholders[i % placeholders.length];
  return ph;
}

/* ---------- Lightbox ---------- */
const lightbox = $("#lightbox");
function openLightbox(src, caption) {
  if (!src) return;
  $("#lightboxImg").src = src;
  $("#lightboxImg").alt = caption;
  $("#lightboxCap").textContent = caption;
  lightbox.hidden = false;
}
function closeLightbox() {
  lightbox.hidden = true;
}
$("#lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => e.key === "Escape" && closeLightbox());

/* ---------- Scene 6 : finale ---------- */
function finale() {
  const el = $("#finalText");
  el.textContent = "One Last Thing… ❤️";
  setTimeout(() => {
    typeText(el, `Happy Birthday, ${birthdayConfig.name}! 🎉`, 55);
    burstConfetti(140);
    releaseHearts(22);
    releaseBalloons(10);
    fireworks(4);
  }, 1600);
}

/* ---------- Floating hearts / balloons / confetti ---------- */
const floaters = $("#floaters");
const rand = (min, max) => Math.random() * (max - min) + min;

function spawnFloater(char, size, duration) {
  const s = document.createElement("span");
  s.className = "floater";
  s.textContent = char;
  s.style.left = `${rand(2, 94)}vw`;
  s.style.fontSize = `${size}px`;
  s.style.setProperty("--dur", `${duration}s`);
  s.style.setProperty("--drift", `${rand(-70, 70)}px`);
  s.style.setProperty("--spin", `${rand(-140, 140)}deg`);
  floaters.appendChild(s);
  setTimeout(() => s.remove(), duration * 1000 + 100);
}

function releaseHearts(count = 12) {
  const hearts = ["❤️", "💗", "💖", "💕"];
  for (let i = 0; i < count; i++) {
    setTimeout(
      () => spawnFloater(hearts[i % hearts.length], rand(16, 34), rand(5, 9)),
      i * 180,
    );
  }
}

function releaseBalloons(count = 8) {
  const balloons = ["🎈", "🎈", "🩷"];
  for (let i = 0; i < count; i++) {
    setTimeout(() => spawnFloater(balloons[i % balloons.length], rand(30, 52), rand(7, 12)), i * 320);
  }
}

function burstConfetti(count = 80) {
  const colors = ["#ff6fae", "#a56bff", "#56b8ff", "#ffd76f", "#ffffff"];
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const c = document.createElement("i");
    c.className = "confetto";
    c.style.left = `${rand(0, 100)}vw`;
    c.style.background = colors[i % colors.length];
    const dur = rand(2.4, 4.2);
    c.style.setProperty("--dur", `${dur}s`);
    c.style.setProperty("--drift", `${rand(-120, 120)}px`);
    c.style.animationDelay = `${rand(0, 0.8)}s`;
    setTimeout(() => c.remove(), (dur + 1) * 1000);
    frag.appendChild(c);
  }
  floaters.appendChild(frag);
}

/* ---------- Particle background + fireworks (single canvas) ---------- */
const canvas = $("#particles");
const ctx = canvas.getContext("2d");
let dots = [];
let sparks = [];

function sizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  // Fewer particles on small screens keeps phones smooth.
  const count = innerWidth < 640 ? 34 : 70;
  dots = Array.from({ length: count }, () => ({
    x: rand(0, innerWidth),
    y: rand(0, innerHeight),
    r: rand(0.7, 2.2),
    vy: rand(-0.28, -0.06),
    vx: rand(-0.14, 0.14),
    a: rand(0.25, 0.85),
  }));
}
sizeCanvas();
addEventListener("resize", sizeCanvas);

/** Fireworks-style particle bursts used in the finale. */
function fireworks(rounds = 3) {
  for (let r = 0; r < rounds; r++) {
    setTimeout(() => {
      const cx = rand(innerWidth * 0.2, innerWidth * 0.8);
      const cy = rand(innerHeight * 0.15, innerHeight * 0.5);
      const hue = Math.floor(rand(280, 350));
      for (let i = 0; i < 60; i++) {
        const ang = (Math.PI * 2 * i) / 60;
        const sp = rand(1.6, 4.2);
        sparks.push({
          x: cx,
          y: cy,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp,
          life: 1,
          hue,
        });
      }
    }, r * 700);
  }
}

function loop() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  // soft drifting dust
  for (const d of dots) {
    d.x += d.vx;
    d.y += d.vy;
    if (d.y < -5) d.y = innerHeight + 5;
    if (d.x < -5) d.x = innerWidth + 5;
    if (d.x > innerWidth + 5) d.x = -5;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,225,245,${d.a})`;
    ctx.fill();
  }

  // fireworks sparks
  sparks = sparks.filter((s) => s.life > 0.02);
  for (const s of sparks) {
    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.03; // gravity
    s.life *= 0.955;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${s.hue},100%,72%,${s.life})`;
    ctx.fill();
  }

  requestAnimationFrame(loop);
}
if (!reduceMotion) loop();

/* ---------- Background music (never autoplays) ---------- */
const audio = $("#bgMusic");
const musicBtn = $("#musicBtn");
const musicLabel = $("#musicLabel");
audio.src = birthdayConfig.music;
audio.volume = 0.5;
let fallbackAudio = null; // gentle generated melody if no mp3 exists

musicBtn.addEventListener("click", async () => {
  const playing = musicBtn.getAttribute("aria-pressed") === "true";
  if (playing) {
    audio.pause();
    fallbackAudio?.stop();
    fallbackAudio = null;
    setMusicState(false);
    return;
  }
  try {
    await audio.play();
    setMusicState(true);
  } catch {
    // No music file yet (or blocked): play a soft generated tune instead.
    fallbackAudio = playGeneratedMelody();
    setMusicState(true);
  }
});

function setMusicState(on) {
  musicBtn.setAttribute("aria-pressed", String(on));
  musicLabel.textContent = on ? "Music On" : "Music Off";
}

/** Tiny Web Audio lullaby so the music button always works. */
function playGeneratedMelody() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  const actx = new AC();
  const gain = actx.createGain();
  gain.gain.value = 0.07;
  gain.connect(actx.destination);
  const notes = [523.25, 587.33, 659.25, 783.99, 659.25, 587.33];
  let step = 0;
  const timer = setInterval(() => {
    const osc = actx.createOscillator();
    const g = actx.createGain();
    osc.type = "sine";
    osc.frequency.value = notes[step++ % notes.length];
    g.gain.setValueAtTime(0.0001, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.5, actx.currentTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.8);
    osc.connect(g).connect(gain);
    osc.start();
    osc.stop(actx.currentTime + 0.85);
  }, 620);
  return {
    stop() {
      clearInterval(timer);
      actx.close();
    },
  };
}

/* ---------- Ambient hearts on the welcome screen ---------- */
if (!reduceMotion) setInterval(() => spawnFloater("❤️", rand(14, 24), rand(6, 10)), 2200);
