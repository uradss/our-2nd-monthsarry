// ===== CONFIG =====
const CORRECT_NAME = "dianna faith celiona";

let currentAudio = null;
let currentSongId = null;

const DEFAULT_SONG = {
  id: 'song1',
  src: 'music/ikaw at ako.mp3'
};

function checkName() {
  const input = document.getElementById('nameInput');
  const errorMsg = document.getElementById('errorMsg');
  const name = input.value.trim().toLowerCase();

  if (!name) {
    errorMsg.textContent = "Please enter a name first 💭";
    errorMsg.classList.add('show');
    return;
  }

  const isCorrect = name === CORRECT_NAME.toLowerCase();
  const overlay = document.getElementById('loadingOverlay');
  const loaderMsg = document.getElementById('loaderMessage');
  const spinner = document.getElementById('loaderSpinner');

  // Show loading
  overlay.classList.add('show');
  spinner.style.display = 'block';
  loaderMsg.textContent = 'Checking...';
  loaderMsg.className = 'loader-message';

  setTimeout(() => {
    spinner.style.display = 'none';

    if (isCorrect) {
      loaderMsg.textContent = 'HI BABYYYYY IKAW PALA YAN 💕';
      loaderMsg.className = 'loader-message correct';
    } else {
      // Use whatever name they typed
      const typedName = input.value.trim();
      loaderMsg.textContent = 'ay ikaw pala yan ' + typedName;
      loaderMsg.className = 'loader-message wrong';
    }

    setTimeout(() => {
      overlay.classList.remove('show');
      document.getElementById('landing').style.display = 'none';

      if (isCorrect) {
        document.getElementById('app').classList.add('visible');
        document.getElementById('limited').style.display = 'none';
      } else {
        document.getElementById('app').classList.remove('visible');
        document.getElementById('limited').style.display = 'block';
      }

      // Auto-play for everyone
      setTimeout(() => {
        playSong(DEFAULT_SONG.id, DEFAULT_SONG.src);
      }, 400);
    }, 1800);
  }, 1200);
}

document.getElementById('nameInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') checkName();
});

function showSection(id) {
  document.querySelectorAll('#app .section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('#app .nav-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');
}

function showLimitedSection(id) {
  document.querySelectorAll('.lim-section').forEach(sec => {
    sec.style.display = 'none';
  });
  const target = document.getElementById(id);
  if (target) target.style.display = 'block';
  document.querySelectorAll('#limited .nav-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');
}

function playSong(songId, audioSrc) {
  const songEl = document.getElementById(songId);
  if (!songEl) {
    // Still try to play even if UI element missing
    if (currentAudio) currentAudio.pause();
    currentAudio = new Audio(audioSrc);
    currentAudio.volume = 0.7;
    currentAudio.play().catch(() => {});
    return;
  }

  const playBtn = songEl.querySelector('.play-btn');

  if (currentSongId === songId && currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    playBtn.textContent = '▶';
    playBtn.classList.remove('playing');
    songEl.classList.remove('playing');
    return;
  }

  if (currentAudio) {
    currentAudio.pause();
    resetSongUI();
  }

  currentAudio = new Audio(audioSrc);
  const volumeSlider = songEl.querySelector('.volume-slider');
  currentAudio.volume = volumeSlider ? parseFloat(volumeSlider.value) : 0.7;
  currentSongId = songId;

  currentAudio.play().catch(err => {
    console.log('Audio play failed:', err);
  });

  playBtn.textContent = '⏸';
  playBtn.classList.add('playing');
  songEl.classList.add('playing');

  currentAudio.onended = () => resetSongUI();
}

function changeVolume(songId, value) {
  if (currentSongId === songId && currentAudio) {
    currentAudio.volume = value;
  }
}

function resetSongUI() {
  document.querySelectorAll('.song-item').forEach(el => {
    el.classList.remove('playing');
    const btn = el.querySelector('.play-btn');
    if (btn) {
      btn.textContent = '▶';
      btn.classList.remove('playing');
    }
  });
  currentSongId = null;
}

let noClickCount = 0;

function handleYes() {
  document.getElementById('promptBox').style.display = 'none';
  document.getElementById('giftBox').style.display = 'none';
  document.getElementById('flowersBox').style.display = 'none';
  const resultBox = document.getElementById('resultBox');
  resultBox.style.display = 'block';
  resultBox.innerHTML = `
    <div class="result-message">
      <p class="big-heart">💕</p>
      <p>yun love na love talaga kita baby mwaa</p>
      <p class="mwa">mwa mwa mwa 😘</p>
      <button class="next-btn" onclick="showGift()">Next →</button>
    </div>
  `;
}

function showGift() {
  document.getElementById('resultBox').style.display = 'none';
  document.getElementById('flowersBox').style.display = 'none';
  const giftBox = document.getElementById('giftBox');
  giftBox.style.display = 'block';
  giftBox.innerHTML = `
    <div class="result-message">
      <p class="gift-title">dahil ni yes mo open mo</p>
      <button class="gift-btn" onclick="openGift()" title="Open gift">🎁</button>
      <p class="gift-hint">tap the gift ✨</p>
    </div>
  `;
}

function openGift() {
  document.getElementById('giftBox').style.display = 'none';
  const flowersBox = document.getElementById('flowersBox');
  flowersBox.style.display = 'block';
  flowersBox.innerHTML = `
    <div class="result-message flowers-reveal">
      <div class="bouquet">
        <span class="flower">🌹</span>
        <span class="flower">🌷</span>
        <span class="flower">🌸</span>
        <span class="flower">💐</span>
        <span class="flower">🌺</span>
        <span class="flower">💮</span>
      </div>
      <p class="flowers-text">for you, my love</p>
      <p class="mwa">coquette flowers just for baby 💕</p>
    </div>
  `;
}

function handleNo() {
  noClickCount++;
  const noBtn = document.getElementById('noBtn');
  const container = document.getElementById('buttonContainer');
  const maxX = Math.max(container.offsetWidth - noBtn.offsetWidth - 10, 20);
  const maxY = Math.max(container.offsetHeight - noBtn.offsetHeight - 10, 20);
  noBtn.style.position = 'absolute';
  noBtn.style.left = Math.floor(Math.random() * maxX) + 'px';
  noBtn.style.top = Math.floor(Math.random() * maxY) + 'px';
  noBtn.style.transition = 'all 0.22s ease';
  if (noClickCount >= 3) noBtn.textContent = 'sure ka? 🥺';
  if (noClickCount >= 5) noBtn.textContent = 'please... 😭';
  if (noClickCount >= 7) noBtn.textContent = 'sige na yes na 💕';
}
