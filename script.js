// --- 1. ANIMASI HUJAN BUNGA ---
function createFlower() {
  const container = document.getElementById('flower-container');
  if (!container) return;

  const flower = document.createElement('div');
  const flowers = ['🌸', '🌺', '🌷', '🌹'];
  
  flower.classList.add('falling-flower');
  flower.innerText = flowers[Math.floor(Math.random() * flowers.length)];
  flower.style.left = Math.random() * 100 + 'vw';
  flower.style.animationDuration = Math.random() * 3 + 2 + 's';
  flower.style.fontSize = Math.random() * 10 + 15 + 'px';

  container.appendChild(flower);

  setTimeout(() => { flower.remove(); }, 5000);
}
setInterval(createFlower, 300);

// --- 2. LOGIC AMPLOP (PAGE 1) ---
function openEnvelope() {
  const envelope = document.getElementById('envelope');
  const music = document.getElementById('bg-music');
  const navBtn = document.getElementById('nav-p2-btn');

  // Putar lagu
  music.play().catch(err => console.log("Autoplay restricted: ", err));

  // Jalankan animasi buka amplop & surat meluncur keluar
  envelope.classList.add('open');

  // Munculkan tombol navigasi setelah surat keluar
  setTimeout(() => {
    navBtn.classList.remove('hidden');
  }, 800);
}

function startJourney() {
  goToPage(2);
}

// --- 3. NAVIGASI HALAMAN ---
function goToPage(pageNum) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.classList.remove('active');
    page.classList.add('hidden');
  });

  const targetPage = document.getElementById(`page-${pageNum}`);
  if (targetPage) {
    targetPage.classList.remove('hidden');
    void targetPage.offsetWidth; 
    targetPage.classList.add('active');
  }
}

// --- 4. BUKA BUKU DIARY 3D (PAGE 3) ---
function openBook(element) {
  const book = element.querySelector('.book');
  book.classList.toggle('open');
}

// --- LOGIC SWIPE UP CARDS (RECENT APPS STYLE) ---
let startY = 0;
let currentY = 0;
let activeCard = null;

function startSwipe(e) {
  // Ambil kartu paling atas yang belum di-dismiss
  const cards = document.querySelectorAll('.swipe-card:not(.dismissed)');
  if (cards.length === 0) return;
  
  activeCard = cards[cards.length - 1]; // Piliha kartu teratas
  startY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

  document.addEventListener('mousemove', onSwiping);
  document.addEventListener('touchmove', onSwiping);
  document.addEventListener('mouseup', endSwipe);
  document.addEventListener('touchend', endSwipe);
}

function onSwiping(e) {
  if (!activeCard) return;
  currentY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
  const diffY = currentY - startY;

  // Hanya izinkan pergeseran ke arah atas (negatif Y)
  if (diffY < 0) {
    activeCard.style.transform = `translateY(${diffY}px) rotate(${diffY * 0.05}deg)`;
  }
}

function endSwipe() {
  if (!activeCard) return;
  const diffY = currentY - startY;

  // Jika di-swipe ke atas melebihi 100px, hapus kartu (dismiss)
  if (diffY < -100) {
    activeCard.classList.add('dismissed');
    checkRemainingCards();
  } else {
    // Kembalikan ke posisi semula jika gesture kurang jauh
    activeCard.style.transform = 'translateY(0) rotate(0deg)';
  }

  // Bersihkan event listener
  activeCard = null;
  startY = 0;
  currentY = 0;
  document.removeEventListener('mousemove', onSwiping);
  document.removeEventListener('touchmove', onSwiping);
  document.removeEventListener('mouseup', endSwipe);
  document.removeEventListener('touchend', endSwipe);
}

function checkRemainingCards() {
  const remaining = document.querySelectorAll('.swipe-card:not(.dismissed)');
  // Jika semua kartu sudah habis di-swipe, munculkan tombol lanjut ke kue
  if (remaining.length === 0) {
    const navBtn = document.getElementById('nav-p5-btn');
    if (navBtn) navBtn.classList.remove('hidden');
  }
}

// --- 5. CAROUSEL MEMORIES (PAGE 4) ---
let currentSlide = 0;
function moveSlide(direction) {
  const items = document.querySelectorAll('.carousel-item');
  items[currentSlide].classList.remove('active');
  
  currentSlide += direction;
  if (currentSlide < 0) currentSlide = items.length - 1;
  if (currentSlide >= items.length) currentSlide = 0;
  
  items[currentSlide].classList.add('active');
}

// --- 6. INTERAKTIF KUE (PAGE 5) ---
let cakeClickCount = 0;

function handleCakeClick() {
  cakeClickCount++;
  const flame = document.getElementById('flame');
  const hint = document.getElementById('cake-hint');
  const overlay = document.getElementById('flower-overlay');

  if (cakeClickCount === 1) {
    hint.innerText = "Satu kali lagi untuk meniup! ✨";
    
    // Efek sedikit bergoyang saat pertama kali diklik
    const cakeBody = document.querySelector('.cake-body');
    if (cakeBody) {
      cakeBody.style.transform = 'scale(0.95)';
      setTimeout(() => cakeBody.style.transform = 'scale(1)', 150);
    }
  } else if (cakeClickCount >= 2 && flame && !flame.classList.contains('extinguished')) {
    // 1. Matikan Api dengan Animasi CSS
    flame.classList.add('extinguished');
    hint.innerText = "Yey! Lilinnya sudah padam! 🥳";

    // 2. Letupan Confetti
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    // 3. Transisi Bunga & Pindah ke Page Akhir
    setTimeout(() => {
      if (overlay) {
        overlay.classList.remove('hidden');
        overlay.classList.add('show');

        setTimeout(() => {
          overlay.classList.remove('show');
          overlay.classList.add('hidden');
          goToPage(6);
        }, 1500);
      }
    }, 800);
  }
}

// --- LOGIC GELEMBUNG MELETUS KE DISPLAY BOX (PAGE 6) ---
function burstWish(element, message) {
  // 1. Ambil posisi gelembung untuk titik animasi confetti
  const rect = element.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  // 2. Efek visual meletus
  element.classList.add('popped');

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { x: x, y: y },
      colors: ['#f472b6', '#fb7185', '#fef08a'],
      disableForReducedMotion: true
    });
  }

  // 3. Masukkan teks ucapan ke Box Display Atas dengan animasi halus
  const displayBox = document.getElementById('wish-display-box');
  const displayText = document.getElementById('wish-display-text');

  if (displayText && displayBox) {
    displayBox.style.opacity = '0';
    setTimeout(() => {
      displayText.innerText = message;
      displayBox.style.borderColor = '#f472b6';
      displayBox.style.background = 'rgba(244, 114, 182, 0.15)';
      displayBox.style.opacity = '1';
    }, 200);
  }
}


// --- TRANSISTION OVERLAY BUNGA SEBELUM PAGE 7 ---
function goToFinalPageWithFlowers() {
  const overlay = document.getElementById('flower-transition');
  
  if (overlay) {
    // 1. Munculkan overlay bunga menutupi layar
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.add('show'), 10);

    // 2. Pindah Halaman ke Page 7 setelah layar tertutup bunga (jeda 1 detik)
    setTimeout(() => {
      goToPage(7);
      
      // Auto-play musik jika diinginkan
      const audio = document.getElementById('audio-player');
      if (audio) audio.play();

      // 3. Sembunyikan kembali overlay bunga
      setTimeout(() => {
        overlay.classList.remove('show');
        setTimeout(() => overlay.classList.add('hidden'), 500);
      }, 800);
    }, 1200);
  } else {
    goToPage(7);
  }
}

// Efek Saat Kotak Kado Diklik (Membuka & Mengeluarkan Bunga)
function openGift() {
  const boxWrapper = document.querySelector('.gift-box-wrapper');
  const msg = document.getElementById('gift-message');

  if (boxWrapper && !boxWrapper.classList.contains('open')) {
    boxWrapper.classList.add('open');
    
    // Tampilkan pesan ucapan di bawah kado
    if (msg) {
      setTimeout(() => {
        msg.classList.remove('hidden');
      }, 400);
    }

    // Ambil koordinat kado untuk lokasi ledakan bunga
    const rect = boxWrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Ledakkan 40 partikel bunga & efek kilau!
    createFlowerBurst(centerX, centerY, 40);
  }
}

// Reset Kado saat disembunyikan
function toggleGiftBox() {
  const card = document.getElementById('gift-card');
  const btn = document.getElementById('open-gift-btn');
  const wrapper = document.querySelector('.final-wrapper');

  if (card.classList.contains('hidden')) {
    if (wrapper) wrapper.classList.add('has-music');
    
    setTimeout(() => {
      card.classList.remove('hidden');
    }, 150);

    btn.innerHTML = '<i class="fa-solid fa-gift"></i> Sembunyikan Hadiah';
  } else {
    card.classList.add('hidden');
    
    setTimeout(() => {
      if (wrapper) wrapper.classList.remove('has-music');
    }, 200);

    btn.innerHTML = '<i class="fa-solid fa-gift"></i> Buka Hadiah Spesial <i class="fa-solid fa-chevron-right"></i>';
    
    // Reset kondisi kado
    const boxWrapper = document.querySelector('.gift-box-wrapper');
    const msg = document.getElementById('gift-message');
    if (boxWrapper) boxWrapper.classList.remove('open');
    if (msg) msg.classList.add('hidden');
  }
}

// Generator Hujan Bunga
function createFlowerBurst(x, y, count) {
  const flowers = ['🌸', '🌺', '🌷', '🌹', '🌻', '✨', '💖', '🎉'];

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'flower-particle';
    particle.innerText = flowers[Math.floor(Math.random() * flowers.length)];

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    const angle = Math.random() * Math.PI * 2;
    const velocity = 90 + Math.random() * 160;
    const dx = Math.cos(angle) * velocity + 'px';
    const dy = Math.sin(angle) * velocity - 60 + 'px';

    particle.style.setProperty('--dx', dx);
    particle.style.setProperty('--dy', dy);

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 2500);
  }
}