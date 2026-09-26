/* ==========================================================================
   PREMIUM CINEMATIC DIGITAL WEDDING INVITATION - LOGIC & ANIMATION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Element References
  const posterImg = document.getElementById('doorPoster');
  const video = document.getElementById('doorVideo');
  const videoSource = document.getElementById('videoSource');
  const staticCanvas = document.getElementById('staticFrameCanvas');
  const canvasCtx = staticCanvas.getContext('2d');
  
  const tapOverlay = document.getElementById('tapOverlay');
  const invitationOverlay = document.getElementById('invitationOverlay');
  
  // Controls & Modals
  const doorSelectBtn = document.getElementById('doorSelectBtn');
  const editDetailsBtn = document.getElementById('editDetailsBtn');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioIconOn = document.getElementById('audioIconOn');
  const audioIconOff = document.getElementById('audioIconOff');
  const replayBtn = document.getElementById('replayBtn');
  
  // Modals
  const doorModal = document.getElementById('doorModal');
  const closeDoorModal = document.getElementById('closeDoorModal');
  const editorModal = document.getElementById('editorModal');
  const closeEditorModal = document.getElementById('closeEditorModal');
  const mapModal = document.getElementById('mapModal');
  const openMapBtn = document.getElementById('openMapBtn');
  const closeMapModal = document.getElementById('closeMapModal');
  const addToCalendarBtn = document.getElementById('addToCalendarBtn');
  
  // Forms & Inputs
  const editorForm = document.getElementById('editorForm');

  // Application State
  let currentDoorId = '1';
  let isAudioMuted = false;
  let isPlaying = false;
  let hasOpened = false;
  let audioCtx = null;

  // --- Audio Context Helper ---
  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // --- 3D Depth Floating Sky Lanterns Engine ---
  function initFloatingLanterns() {
    const container = document.getElementById('lanternsContainer');
    if (!container) return;

    container.innerHTML = '';
    const lanternCount = 22;
    const depthTiers = ['depth-far', 'depth-far', 'depth-mid', 'depth-mid', 'depth-near'];

    for (let i = 0; i < lanternCount; i++) {
      const lantern = document.createElement('div');
      const depthClass = depthTiers[Math.floor(Math.random() * depthTiers.length)];
      lantern.className = `lantern-item ${depthClass}`;

      const leftPos = (Math.random() * 92 + 4).toFixed(1);
      const duration = (Math.random() * 14 + 14).toFixed(1);
      const delay = (Math.random() * 20).toFixed(1);
      const swayX = (Math.random() * 24 + 10).toFixed(0);
      const rotDeg = (Math.random() * 6 - 3).toFixed(1);

      lantern.style.left = `${leftPos}%`;
      lantern.style.animationDuration = `${duration}s`;
      lantern.style.animationDelay = `${delay}s`;
      lantern.style.setProperty('--sway-x', `${swayX}px`);
      lantern.style.setProperty('--rot-deg', `${rotDeg}deg`);

      lantern.innerHTML = `
        <div class="lantern-paper">
          <div class="lantern-core-flame"></div>
        </div>
        <div class="lantern-tassel"></div>
      `;

      container.appendChild(lantern);
    }
  }

  // Initialize floating sky lanterns
  initFloatingLanterns();

  // --- Capture Final Video Frame onto Canvas for 100% Static Hold ---
  function freezeFinalFrame() {
    if (video.videoWidth && video.videoHeight) {
      staticCanvas.width = video.videoWidth;
      staticCanvas.height = video.videoHeight;
      canvasCtx.drawImage(video, 0, 0, staticCanvas.width, staticCanvas.height);
      
      staticCanvas.classList.add('active');
      video.pause();
    }
  }

  // --- Helper: Reveal Invitation Content ---
  function revealInvitationContent() {
    freezeFinalFrame();
    hasOpened = true;
    isPlaying = false;

    // Reveal invitation text overlay smoothly over static final door frame
    invitationOverlay.classList.remove('hidden');
    void invitationOverlay.offsetWidth;
    invitationOverlay.classList.add('revealed');

    // Initialize HTML5 Scratch Canvas & Atmosphere Canvas once overlay is visible
    setTimeout(() => {
      initScratchCanvas();
      if (typeof resizeAtmosphereCanvas === 'function') {
        resizeAtmosphereCanvas();
      }
    }, 150);
  }

  // --- HTML5 Scratch Card Engine ---
  const scratchCanvas = document.getElementById('scratchCanvas');
  const scratchHint = document.getElementById('scratchHint');
  const quickRevealBtn = document.getElementById('quickRevealBtn');
  let scratchCtx = null;
  let isScratching = false;
  let hasScratchedCleared = false;
  let dragCount = 0;

  function initScratchCanvas() {
    if (!scratchCanvas) return;
    scratchCtx = scratchCanvas.getContext('2d');
    
    const container = document.getElementById('scratchContainer');
    if (!container) return;
    
    scratchCanvas.width = container.offsetWidth || 320;
    scratchCanvas.height = container.offsetHeight || 120;
    
    // Render Metallic Gold Foil Gradient
    const grad = scratchCtx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
    grad.addColorStop(0, '#E5C158');
    grad.addColorStop(0.35, '#FFF4D0');
    grad.addColorStop(0.7, '#D4A338');
    grad.addColorStop(1, '#A67C1E');
    
    scratchCtx.fillStyle = grad;
    scratchCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
    
    // Add shimmering gold foil texture speckles
    scratchCtx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let i = 0; i < 160; i++) {
      const x = Math.random() * scratchCanvas.width;
      const y = Math.random() * scratchCanvas.height;
      const r = Math.random() * 2 + 0.5;
      scratchCtx.beginPath();
      scratchCtx.arc(x, y, r, 0, Math.PI * 2);
      scratchCtx.fill();
    }
    
    // Add prompt text on foil
    scratchCtx.font = '600 12px Cormorant Garamond, serif';
    scratchCtx.fillStyle = 'rgba(10, 10, 15, 0.75)';
    scratchCtx.textAlign = 'center';
    scratchCtx.fillText('✦ SCRATCH TO UNLOCK DATE ✦', scratchCanvas.width / 2, scratchCanvas.height / 2 + 4);
  }

  function scratchAt(x, y) {
    if (!scratchCtx || hasScratchedCleared) return;
    
    scratchCtx.globalCompositeOperation = 'destination-out';
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, 22, 0, Math.PI * 2);
    scratchCtx.fill();
    
    dragCount++;
    if (dragCount % 10 === 0) {
      checkScratchPercentage();
    }
  }

  function getScratchCoords(e) {
    const rect = scratchCanvas.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;
    
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function checkScratchPercentage() {
    if (hasScratchedCleared || !scratchCtx) return;
    
    const imgData = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;
    
    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }
    
    const totalSampled = pixels.length / 16;
    const ratio = transparentCount / totalSampled;
    
    if (ratio > 0.35) {
      revealDateFully();
    }
  }

  function revealDateFully() {
    if (hasScratchedCleared) return;
    hasScratchedCleared = true;
    
    if (scratchCanvas) scratchCanvas.classList.add('fade-out');
    if (scratchHint) scratchHint.style.opacity = '0';
    if (quickRevealBtn) quickRevealBtn.style.display = 'none';
    
    triggerConfetti();
  }

  if (scratchCanvas) {
    ['mousedown', 'touchstart'].forEach(evt => {
      scratchCanvas.addEventListener(evt, (e) => {
        isScratching = true;
        const coords = getScratchCoords(e);
        scratchAt(coords.x, coords.y);
      }, { passive: true });
    });

    ['mousemove', 'touchmove'].forEach(evt => {
      scratchCanvas.addEventListener(evt, (e) => {
        if (!isScratching) return;
        const coords = getScratchCoords(e);
        scratchAt(coords.x, coords.y);
      }, { passive: true });
    });

    ['mouseup', 'mouseleave', 'touchend'].forEach(evt => {
      scratchCanvas.addEventListener(evt, () => {
        isScratching = false;
      });
    });
  }

  if (quickRevealBtn) {
    quickRevealBtn.addEventListener('click', revealDateFully);
  }

  // --- Gold Confetti Particle Celebration Engine ---
  const confettiCanvas = document.getElementById('confettiCanvas');
  let confettiCtx = null;
  let confettiParticles = [];
  let confettiAnimationId = null;

  function triggerConfetti() {
    if (!confettiCanvas) return;
    confettiCtx = confettiCanvas.getContext('2d');
    
    const container = document.getElementById('invitationOverlay');
    confettiCanvas.width = container ? container.offsetWidth : window.innerWidth;
    confettiCanvas.height = container ? container.offsetHeight : window.innerHeight;
    
    const colors = ['#FFF4D0', '#E5C158', '#D4A338', '#FFFFFF', '#F5D77F'];
    confettiParticles = [];
    
    for (let i = 0; i < 70; i++) {
      confettiParticles.push({
        x: confettiCanvas.width / 2 + (Math.random() * 60 - 30),
        y: confettiCanvas.height * 0.35,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() * -10) - 4,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1
      });
    }
    
    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
    animateConfetti();
  }

  function animateConfetti() {
    if (!confettiCtx) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    let activeParticles = 0;
    
    confettiParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.008;
      
      if (p.opacity > 0) {
        activeParticles++;
        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rotation * Math.PI) / 180);
        confettiCtx.globalAlpha = Math.max(0, p.opacity);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        confettiCtx.restore();
      }
    });
    
    if (activeParticles > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // --- Live Countdown Timer Engine ---
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');
  
  const targetWeddingDate = new Date('November 19, 2026 10:00:00').getTime();

  function updateCountdown() {
    if (!cdDays || !cdHours || !cdMins || !cdSecs) return;
    
    const now = new Date().getTime();
    const distance = targetWeddingDate - now;
    
    if (distance < 0) {
      cdDays.innerText = '00';
      cdHours.innerText = '00';
      cdMins.innerText = '00';
      cdSecs.innerText = '00';
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    cdDays.innerText = days < 10 ? '0' + days : days;
    cdHours.innerText = hours < 10 ? '0' + hours : hours;
    cdMins.innerText = minutes < 10 ? '0' + minutes : minutes;
    cdSecs.innerText = seconds < 10 ? '0' + seconds : seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // --- 3D Card Parallax & Tilt Engine ---
  const tiltCards = document.querySelectorAll('.tilt-card');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // --- Door Opening Handler ---
  function openDoorInvitation() {
    if (isPlaying || hasOpened) return;
    
    isPlaying = true;
    initAudioContext();

    // Trigger YouTube background music if URL input is filled
    const ytUrlInput = document.getElementById('inputYoutubeUrl');
    if (ytUrlInput && ytUrlInput.value) {
      playYouTubeBackgroundMusic(ytUrlInput.value, true);
    }

    // 1. Hide tap callout overlay
    tapOverlay.classList.add('fade-out');
    
    // 2. Hide poster image & clear static canvas
    posterImg.classList.add('fade-out');
    staticCanvas.classList.remove('active');
    
    // 3. Reset video playback to 0 and play continuous single-motion video
    video.currentTime = 0;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Video playing smoothly to the end
      }).catch(err => {
        console.warn('Video auto-play error fallback:', err);
        // Fallback only if browser blocked video playback entirely
        revealInvitationContent();
      });
    }
  }

  // Forward desktop wheel scrolling to content-scrollable container once revealed
  const contentScrollable = document.getElementById('contentScrollable');
  window.addEventListener('wheel', (e) => {
    if (hasOpened && contentScrollable) {
      contentScrollable.scrollTop += e.deltaY;
    }
  }, { passive: true });

  // --- Video Event Listeners ---
  video.addEventListener('timeupdate', () => {
    // Reveal floating sky lanterns at 6th second of video playback
    if (video.currentTime >= 6.0) {
      const lanternsContainer = document.getElementById('lanternsContainer');
      if (lanternsContainer) lanternsContainer.classList.add('revealed');
    }

    // Trigger fade-in reveal starting from 6th second of video playback
    if (!hasOpened && (video.currentTime >= 6.0 || video.ended)) {
      revealInvitationContent();
    }
  });

  video.addEventListener('ended', () => {
    freezeFinalFrame();
    if (!hasOpened) {
      revealInvitationContent();
    }
  });

  // --- Reset & Replay ---
  function resetDoorState() {
    isPlaying = false;
    hasOpened = false;
    
    video.pause();
    video.currentTime = 0;
    
    staticCanvas.classList.remove('active');
    invitationOverlay.classList.remove('revealed');
    
    const lanternsContainer = document.getElementById('lanternsContainer');
    if (lanternsContainer) lanternsContainer.classList.remove('revealed');

    setTimeout(() => {
      invitationOverlay.classList.add('hidden');
      posterImg.classList.remove('fade-out');
      tapOverlay.classList.remove('fade-out');
    }, 400);
  }

  // --- Door Selector Logic ---
  function switchDoorStyle(doorId) {
    if (currentDoorId === doorId) return;
    
    currentDoorId = doorId;
    resetDoorState();

    // Update Poster & Video source (AVIF primary, WebP fallback)
    const posterPath = `/assets/doors/${doorId}.avif`;
    const videoPath = `/assets/doors/${doorId}.mp4`;

    posterImg.onerror = () => {
      if (!posterImg.src.endsWith('.webp')) {
        posterImg.src = `/assets/doors/${doorId}.webp`;
      }
    };
    posterImg.src = posterPath;
    videoSource.src = videoPath;
    video.load();

    // Update active highlight in modal
    document.querySelectorAll('.door-option-card').forEach(card => {
      card.classList.toggle('active', card.dataset.door === doorId);
    });

    doorModal.classList.add('hidden');
  }

  // Event Listener for Tap Overlay
  tapOverlay.addEventListener('click', openDoorInvitation);
  replayBtn.addEventListener('click', resetDoorState);

  // --- Door Modal Controls ---
  doorSelectBtn.addEventListener('click', () => doorModal.classList.remove('hidden'));
  closeDoorModal.addEventListener('click', () => doorModal.classList.add('hidden'));
  
  document.querySelectorAll('.door-option-card').forEach(card => {
    card.addEventListener('click', () => {
      switchDoorStyle(card.dataset.door);
    });
  });

  // --- Details Editor Controls ---
  editDetailsBtn.addEventListener('click', () => editorModal.classList.remove('hidden'));
  closeEditorModal.addEventListener('click', () => editorModal.classList.add('hidden'));

  editorForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    document.getElementById('displayGroom').innerText = document.getElementById('inputGroom').value;
    document.getElementById('displayBride').innerText = document.getElementById('inputBride').value;
    document.getElementById('displayBismillah').innerText = document.getElementById('inputBismillah').value;
    document.getElementById('displayGreeting').innerText = document.getElementById('inputGreeting').value;
    document.getElementById('displayDateNum').innerText = document.getElementById('inputDateNum').value;
    document.getElementById('displayMonth').innerText = document.getElementById('inputMonth').value;
    document.getElementById('displayYear').innerText = document.getElementById('inputYear').value;
    document.getElementById('displayDay').innerText = document.getElementById('inputDay').value;
    document.getElementById('displayTime').innerText = document.getElementById('inputTime').value;
    document.getElementById('displayVenue').innerText = document.getElementById('inputVenue').value;
    document.getElementById('displayLocation').innerText = document.getElementById('inputLocation').value;
    document.getElementById('displayDressCode').innerText = document.getElementById('inputDressCode').value;

    // Update Map Modal text as well
    document.getElementById('mapVenueTitle').innerText = document.getElementById('inputVenue').value;
    document.getElementById('mapVenueAddress').innerText = document.getElementById('inputLocation').value;

    // Load YouTube Background Music if URL provided
    const ytUrlInput = document.getElementById('inputYoutubeUrl');
    if (ytUrlInput && ytUrlInput.value) {
      playYouTubeBackgroundMusic(ytUrlInput.value, true);
    }

    editorModal.classList.add('hidden');
  });

  // --- YouTube Background Music Player Engine ---
  let currentYoutubeVideoId = '';
  let ytPlayerIframe = null;

  function extractYouTubeId(url) {
    if (!url) return '';
    url = url.trim();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      return match[2];
    }
    if (url.length === 11) return url;
    return '';
  }

  function playYouTubeBackgroundMusic(url, autoPlay = true) {
    const videoId = extractYouTubeId(url);
    if (!videoId) return;
    currentYoutubeVideoId = videoId;
    const container = document.getElementById('youtubePlayerContainer');
    if (!container) return;

    const mute = isAudioMuted ? 1 : 0;
    const playParam = autoPlay ? 1 : 0;
    container.innerHTML = `<iframe id="ytIframe" width="200" height="200" 
      src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=${playParam}&loop=1&playlist=${videoId}&controls=0&mute=${mute}" 
      frameborder="0" allow="autoplay"></iframe>`;

    ytPlayerIframe = document.getElementById('ytIframe');
  }

  function toggleYouTubeAudioMute(isMuted) {
    if (!ytPlayerIframe || !ytPlayerIframe.contentWindow) return;
    const command = isMuted ? 'mute' : 'unMute';
    try {
      ytPlayerIframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: command,
        args: []
      }), '*');
    } catch (e) {
      console.warn('YouTube audio command postMessage exception:', e);
    }
  }

  // --- Audio Mute Toggle ---
  audioToggleBtn.addEventListener('click', () => {
    isAudioMuted = !isAudioMuted;
    video.muted = isAudioMuted;
    
    toggleYouTubeAudioMute(isAudioMuted);

    if (isAudioMuted) {
      audioIconOn.classList.add('hidden');
      audioIconOff.classList.remove('hidden');
    } else {
      audioIconOn.classList.remove('hidden');
      audioIconOff.classList.add('hidden');
      initAudioContext();
    }
  });

  // --- Map Modal Controls ---
  openMapBtn.addEventListener('click', () => mapModal.classList.remove('hidden'));
  closeMapModal.addEventListener('click', () => mapModal.classList.add('hidden'));

  // Close modals when clicking backdrop
  [doorModal, editorModal, mapModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });

  // --- Add to Google Calendar (Main Wedding Celebration) ---
  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener('click', () => {
      const groom = document.getElementById('displayGroom').innerText;
      const bride = document.getElementById('displayBride').innerText;
      const venue = document.getElementById('displayVenue').innerText;
      const location = document.getElementById('displayLocation').innerText;

      const title = encodeURIComponent(`Wedding Celebration of ${bride} & ${groom}`);
      const details = encodeURIComponent(`Join us to celebrate the royal wedding of ${bride} & ${groom} on 19th & 20th November 2026 at ${venue}, Gwalior.`);
      const loc = encodeURIComponent(`${venue}, ${location}`);

      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${loc}&dates=20261119T043000Z/20261120T183000Z`;

      window.open(googleCalendarUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // --- Dedicated Ceremony Calendar Buttons ---
  document.querySelectorAll('.ceremony-calendar-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const eventName = btn.dataset.event || 'Ceremony';
      const eventDate = btn.dataset.date || '20261119T043000Z/20261119T093000Z';
      const groom = document.getElementById('displayGroom').innerText;
      const bride = document.getElementById('displayBride').innerText;
      const venue = document.getElementById('displayVenue').innerText;
      const location = document.getElementById('displayLocation').innerText;

      const title = encodeURIComponent(`${eventName} — ${bride} & ${groom}`);
      const details = encodeURIComponent(`Join us for the auspicious ${eventName} ceremony of ${bride} & ${groom} at ${venue}, Gwalior.`);
      const loc = encodeURIComponent(`${venue}, ${location}`);

      const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${loc}&dates=${eventDate}`;
      window.open(calUrl, '_blank', 'noopener,noreferrer');
    });
  });

  // ==========================================================================
  // CEREMONY NAVIGATION TABS & VIEW SWITCHER
  // ==========================================================================
  function switchCeremonyTab(tabId) {
    if (!tabId) return;

    // 1. Update tab buttons
    document.querySelectorAll('.ceremony-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // 2. Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
      if (pane.id === `pane-${tabId}`) {
        pane.classList.remove('hidden');
        pane.classList.add('active');
      } else {
        pane.classList.add('hidden');
        pane.classList.remove('active');
      }
    });

    // 3. Switch atmosphere animation mode
    switchAtmosphereMode(tabId);

    // 4. Scroll smoothly to the ceremony view
    const scrollContainer = document.getElementById('contentScrollable');
    const tabsElement = document.getElementById('ceremonyTabs');
    if (scrollContainer && tabsElement) {
      if (tabId !== 'overview') {
        const targetPane = document.getElementById(`pane-${tabId}`);
        if (targetPane) {
          targetPane.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  // Click on Ceremony Tab Buttons
  document.querySelectorAll('.ceremony-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchCeremonyTab(btn.dataset.tab);
    });
  });

  // Click on interactive event timeline cards or jump buttons
  document.querySelectorAll('[data-target-tab]').forEach(elem => {
    elem.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetTab = elem.dataset.targetTab;
      if (targetTab) {
        switchCeremonyTab(targetTab);
      }
    });
  });

  // ==========================================================================
  // DYNAMIC ATMOSPHERE CANVAS ENGINE
  // Haldi: Flowing marigold flowers & petals from top to bottom
  // Reception: Floating 3D balloons & shimmer lights in motion
  // Pheras: Sacred Agni fire embers & rose petals with golden aura
  // ==========================================================================
  const atmosphereCanvas = document.getElementById('atmosphereCanvas');
  let atmosCtx = null;
  let activeAtmosphere = 'overview';
  let atmosAnimationId = null;

  // Particle Stores
  let haldiItems = [];
  let receptionBalloons = [];
  let shimmerLights = [];
  let pherasEmbers = [];
  let pherasPetals = [];
  let ambientMotes = [];

  function initAtmosphereEngine() {
    if (!atmosphereCanvas) return;
    atmosCtx = atmosphereCanvas.getContext('2d');
    resizeAtmosphereCanvas();
    window.addEventListener('resize', resizeAtmosphereCanvas);

    setupHaldiParticles();
    setupReceptionParticles();
    setupPherasParticles();
    setupAmbientParticles();

    if (atmosAnimationId) cancelAnimationFrame(atmosAnimationId);
    animateAtmosphere();
  }

  function resizeAtmosphereCanvas() {
    if (!atmosphereCanvas) return;
    const parent = atmosphereCanvas.parentElement || document.getElementById('invitationContainer');
    const rect = parent ? parent.getBoundingClientRect() : { width: 360, height: 640 };
    const width = rect.width || 360;
    const height = rect.height || 640;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    atmosphereCanvas.width = width * dpr;
    atmosphereCanvas.height = height * dpr;
    atmosphereCanvas.style.width = width + 'px';
    atmosphereCanvas.style.height = height + 'px';

    if (atmosCtx) {
      atmosCtx.setTransform(1, 0, 0, 1, 0, 0);
      atmosCtx.scale(dpr, dpr);
    }

    atmosphereCanvas.displayWidth = width;
    atmosphereCanvas.displayHeight = height;
  }

  // --- 1. Haldi Particles: Full Marigold Blossoms & Petals Flowing Top to Bottom ---
  function setupHaldiParticles() {
    haldiItems = [];
    const width = atmosphereCanvas.displayWidth || 360;
    const height = atmosphereCanvas.displayHeight || 640;
    const flowerColors = [
      { outer: '#FF8F00', mid: '#FFA000', core: '#FFD54F' }, // Vibrant Orange
      { outer: '#FFA000', mid: '#FFB300', core: '#FFF59D' }, // Golden Yellow
      { outer: '#E65100', mid: '#FF6F00', core: '#FFCA28' }, // Deep Saffron
      { outer: '#FFB300', mid: '#FFC107', core: '#FFFFFF' }  // Sunlit Gold
    ];
    const petalColors = ['#FFB300', '#FFA000', '#FF8F00', '#FFD54F', '#FFF176'];

    for (let i = 0; i < 45; i++) {
      const isFlower = i % 2 === 0;
      const palette = flowerColors[Math.floor(Math.random() * flowerColors.length)];

      haldiItems.push({
        type: isFlower ? 'flower' : 'petal',
        x: Math.random() * width,
        y: Math.random() * (height + 100) - 50,
        radius: isFlower ? Math.random() * 8 + 8 : Math.random() * 4 + 3,
        vy: Math.random() * 1.5 + 1.2, // Continuous downward flow from top to bottom
        swayAmp: Math.random() * 20 + 8,
        swaySpeed: Math.random() * 0.025 + 0.015,
        swayPhase: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        palette: palette,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        opacity: Math.random() * 0.35 + 0.65
      });
    }
  }

  // --- 2. Reception Particles: 3D Metallic Balloons & Shimmering Lights in Motion ---
  function setupReceptionParticles() {
    receptionBalloons = [];
    shimmerLights = [];
    const width = atmosphereCanvas.displayWidth || 360;
    const height = atmosphereCanvas.displayHeight || 640;

    const balloonTypes = [
      { name: 'gold', grad: ['#FFF8E1', '#FFD54F', '#C79100', '#795548'] },
      { name: 'pearl', grad: ['#FFFFFF', '#FFFDE7', '#D7CCC8', '#8D6E63'] },
      { name: 'roseGold', grad: ['#FFEBEE', '#F48FB1', '#C2185B', '#880E4F'] },
      { name: 'champagne', grad: ['#FFFDE7', '#FFE082', '#FFB300', '#BF360C'] }
    ];

    // Floating 3D Balloons
    for (let i = 0; i < 18; i++) {
      const bType = balloonTypes[i % balloonTypes.length];
      receptionBalloons.push({
        x: Math.random() * (width - 40) + 20,
        y: height + Math.random() * (height * 0.8),
        radius: Math.random() * 10 + 13,
        vy: -(Math.random() * 0.9 + 0.7), // Floating upwards
        swayAmp: Math.random() * 16 + 6,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayPhase: Math.random() * Math.PI * 2,
        type: bType,
        stringWave: Math.random() * Math.PI * 2,
        stringWaveSpeed: Math.random() * 0.03 + 0.02,
        opacity: Math.random() * 0.2 + 0.8
      });
    }

    // Shimmering Lights & Twinkle Star Particles
    for (let i = 0; i < 40; i++) {
      shimmerLights.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 18 + 6,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        baseAlpha: Math.random() * 0.35 + 0.2,
        alphaPulseSpeed: Math.random() * 0.03 + 0.015,
        alphaPhase: Math.random() * Math.PI * 2,
        isStar: Math.random() > 0.4,
        starSize: Math.random() * 5 + 3,
        color: i % 2 === 0 ? '#FFE082' : '#FFFFFF'
      });
    }
  }

  // --- 3. Pheras Particles: Sacred Agni Embers & Cascading Rose Petals ---
  function setupPherasParticles() {
    pherasEmbers = [];
    pherasPetals = [];
    const width = atmosphereCanvas.displayWidth || 360;
    const height = atmosphereCanvas.displayHeight || 640;

    // Sacred Fire Embers Rising Upwards
    const emberColors = ['#FFD54F', '#FFA000', '#FF5722', '#FF7043', '#FFE082'];
    for (let i = 0; i < 42; i++) {
      pherasEmbers.push({
        x: width * 0.5 + (Math.random() - 0.5) * (width * 0.85),
        y: height * 0.75 + Math.random() * (height * 0.35),
        size: Math.random() * 3 + 1.2,
        vy: -(Math.random() * 2.0 + 1.0),
        vx: (Math.random() - 0.5) * 0.8,
        jitter: Math.random() * 0.05 + 0.02,
        color: emberColors[Math.floor(Math.random() * emberColors.length)],
        opacity: Math.random() * 0.4 + 0.6,
        decay: Math.random() * 0.004 + 0.002
      });
    }

    // Sacred Rose Petals Showering Downwards
    const roseColors = ['#C62828', '#D32F2F', '#E53935', '#AD1457', '#F06292'];
    for (let i = 0; i < 24; i++) {
      pherasPetals.push({
        x: Math.random() * width,
        y: Math.random() * height - height * 0.5,
        radius: Math.random() * 6 + 6,
        vy: Math.random() * 1.3 + 0.9,
        swayAmp: Math.random() * 22 + 8,
        swaySpeed: Math.random() * 0.025 + 0.015,
        swayPhase: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        color: roseColors[Math.floor(Math.random() * roseColors.length)],
        opacity: Math.random() * 0.3 + 0.7
      });
    }
  }

  // --- Ambient Golden Dust Motes for Overview ---
  function setupAmbientParticles() {
    ambientMotes = [];
    const width = atmosphereCanvas.displayWidth || 360;
    const height = atmosphereCanvas.displayHeight || 640;

    for (let i = 0; i < 30; i++) {
      ambientMotes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 0.8,
        vy: -(Math.random() * 0.4 + 0.2),
        vx: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.3,
        pulseSpeed: Math.random() * 0.03 + 0.01
      });
    }
  }

  function switchAtmosphereMode(mode) {
    activeAtmosphere = mode;
    // Re-seed or boost particles on mode change
    const width = atmosphereCanvas.displayWidth || 360;
    const height = atmosphereCanvas.displayHeight || 640;

    if (mode === 'haldi') {
      haldiItems.forEach(item => {
        if (item.y > height) item.y = -Math.random() * 100;
      });
    } else if (mode === 'reception') {
      receptionBalloons.forEach(b => {
        if (b.y < -50) b.y = height + Math.random() * 100;
      });
    } else if (mode === 'pheras') {
      pherasEmbers.forEach(e => {
        if (e.y < 0) e.y = height * 0.8 + Math.random() * 80;
      });
      pherasPetals.forEach(p => {
        if (p.y > height) p.y = -Math.random() * 100;
      });
    }
  }

  // Main Atmosphere Render Loop
  let frameCount = 0;
  function animateAtmosphere() {
    if (!atmosCtx || !atmosphereCanvas) return;
    const width = atmosphereCanvas.displayWidth || 360;
    const height = atmosphereCanvas.displayHeight || 640;
    atmosCtx.clearRect(0, 0, width, height);

    frameCount++;

    // 1. Render HALDI atmosphere (Flowers and Garlands in continuous flow from top to bottom)
    if (activeAtmosphere === 'haldi') {
      haldiItems.forEach(item => {
        item.y += item.vy;
        item.swayPhase += item.swaySpeed;
        const currentX = item.x + Math.sin(item.swayPhase) * item.swayAmp;
        item.rot += item.rotSpeed;

        if (item.y > height + 30) {
          item.y = -25;
          item.x = Math.random() * width;
        }

        atmosCtx.save();
        atmosCtx.translate(currentX, item.y);
        atmosCtx.rotate(item.rot);
        atmosCtx.globalAlpha = item.opacity;

        if (item.type === 'flower') {
          const r = item.radius;
          // Outer petal layer
          const petals = 12;
          for (let p = 0; p < petals; p++) {
            const angle = (p / petals) * Math.PI * 2;
            const px = Math.cos(angle) * (r * 0.65);
            const py = Math.sin(angle) * (r * 0.65);
            atmosCtx.beginPath();
            atmosCtx.arc(px, py, r * 0.45, 0, Math.PI * 2);
            atmosCtx.fillStyle = item.palette.outer;
            atmosCtx.fill();
          }
          // Mid petal layer
          for (let p = 0; p < 8; p++) {
            const angle = (p / 8) * Math.PI * 2 + 0.3;
            const px = Math.cos(angle) * (r * 0.4);
            const py = Math.sin(angle) * (r * 0.4);
            atmosCtx.beginPath();
            atmosCtx.arc(px, py, r * 0.35, 0, Math.PI * 2);
            atmosCtx.fillStyle = item.palette.mid;
            atmosCtx.fill();
          }
          // Blossom center core
          atmosCtx.beginPath();
          atmosCtx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
          atmosCtx.fillStyle = item.palette.core;
          atmosCtx.fill();
        } else {
          // Petal
          atmosCtx.beginPath();
          atmosCtx.ellipse(0, 0, item.radius * 1.5, item.radius * 0.7, 0, 0, Math.PI * 2);
          atmosCtx.fillStyle = item.color;
          atmosCtx.fill();
        }

        atmosCtx.restore();
      });
    }

    // 2. Render RECEPTION atmosphere (Balloons & Shimmer Lights in motion)
    else if (activeAtmosphere === 'reception') {
      // Draw Shimmering Bokeh Lights & Twinkles
      shimmerLights.forEach(sl => {
        sl.x += sl.vx;
        sl.y += sl.vy;
        sl.alphaPhase += sl.alphaPulseSpeed;

        if (sl.x < 0) sl.x = width;
        if (sl.x > width) sl.x = 0;
        if (sl.y < 0) sl.y = height;
        if (sl.y > height) sl.y = 0;

        const currentAlpha = sl.baseAlpha + Math.sin(sl.alphaPhase) * 0.25;
        if (currentAlpha <= 0) return;

        atmosCtx.save();
        atmosCtx.globalAlpha = Math.max(0, Math.min(currentAlpha, 0.9));

        if (sl.isStar) {
          // 4-point Diamond Twinkle Star
          const size = sl.starSize * (0.8 + Math.sin(sl.alphaPhase) * 0.3);
          atmosCtx.translate(sl.x, sl.y);
          atmosCtx.fillStyle = sl.color;
          atmosCtx.beginPath();
          atmosCtx.moveTo(0, -size);
          atmosCtx.quadraticCurveTo(0, 0, size, 0);
          atmosCtx.quadraticCurveTo(0, 0, 0, size);
          atmosCtx.quadraticCurveTo(0, 0, -size, 0);
          atmosCtx.quadraticCurveTo(0, 0, 0, -size);
          atmosCtx.fill();
        } else {
          // Soft Bokeh Orb with radial fade
          const grad = atmosCtx.createRadialGradient(sl.x, sl.y, 0, sl.x, sl.y, sl.radius);
          grad.addColorStop(0, 'rgba(255, 244, 208, 0.7)');
          grad.addColorStop(0.5, 'rgba(229, 193, 88, 0.25)');
          grad.addColorStop(1, 'rgba(229, 193, 88, 0)');
          atmosCtx.fillStyle = grad;
          atmosCtx.beginPath();
          atmosCtx.arc(sl.x, sl.y, sl.radius, 0, Math.PI * 2);
          atmosCtx.fill();
        }
        atmosCtx.restore();
      });

      // Draw 3D Metallic Balloons Rising in Motion
      receptionBalloons.forEach(b => {
        b.y += b.vy;
        b.swayPhase += b.swaySpeed;
        b.stringWave += b.stringWaveSpeed;
        const currentX = b.x + Math.sin(b.swayPhase) * b.swayAmp;

        if (b.y < -70) {
          b.y = height + 40;
          b.x = Math.random() * (width - 40) + 20;
        }

        const r = b.radius;
        atmosCtx.save();
        atmosCtx.translate(currentX, b.y);
        atmosCtx.globalAlpha = b.opacity;

        // Balloon 3D Sphere Radial Gradient
        const grad = atmosCtx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.08, 0, 0, r * 1.1);
        grad.addColorStop(0, b.type.grad[0]);
        grad.addColorStop(0.35, b.type.grad[1]);
        grad.addColorStop(0.75, b.type.grad[2]);
        grad.addColorStop(1, b.type.grad[3]);

        // Draw Balloon Body (Egg/Oval Shape)
        atmosCtx.beginPath();
        atmosCtx.ellipse(0, 0, r * 0.88, r * 1.08, 0, 0, Math.PI * 2);
        atmosCtx.fillStyle = grad;
        atmosCtx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        atmosCtx.shadowBlur = 8;
        atmosCtx.fill();

        // Balloon Bottom Knot
        atmosCtx.shadowBlur = 0;
        atmosCtx.beginPath();
        atmosCtx.moveTo(-2.5, r * 1.05);
        atmosCtx.lineTo(2.5, r * 1.05);
        atmosCtx.lineTo(0, r * 1.15);
        atmosCtx.closePath();
        atmosCtx.fillStyle = b.type.grad[2];
        atmosCtx.fill();

        // Curving Dangling String
        const stringWaveOffset = Math.sin(b.stringWave) * 8;
        atmosCtx.beginPath();
        atmosCtx.moveTo(0, r * 1.15);
        atmosCtx.quadraticCurveTo(stringWaveOffset, r * 1.15 + 18, -stringWaveOffset * 0.5, r * 1.15 + 38);
        atmosCtx.strokeStyle = 'rgba(255, 244, 208, 0.45)';
        atmosCtx.lineWidth = 1;
        atmosCtx.stroke();

        atmosCtx.restore();
      });
    }

    // 3. Render PHERAS atmosphere (Sacred Fire Embers & Holy Rose Petals)
    else if (activeAtmosphere === 'pheras') {
      // Golden Sacred Aura Pulse in background
      const auraPulse = 0.15 + Math.sin(frameCount * 0.03) * 0.06;
      atmosCtx.save();
      const auraGrad = atmosCtx.createRadialGradient(width * 0.5, height * 0.7, 10, width * 0.5, height * 0.7, width * 0.8);
      auraGrad.addColorStop(0, `rgba(255, 152, 0, ${auraPulse})`);
      auraGrad.addColorStop(0.5, `rgba(255, 87, 34, ${auraPulse * 0.5})`);
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      atmosCtx.fillStyle = auraGrad;
      atmosCtx.fillRect(0, 0, width, height);
      atmosCtx.restore();

      // Rising Sacred Fire Embers
      pherasEmbers.forEach(e => {
        e.y += e.vy;
        e.x += e.vx + (Math.random() - 0.5) * 0.8;
        e.opacity -= e.decay;

        if (e.y < 30 || e.opacity <= 0) {
          e.y = height * 0.75 + Math.random() * (height * 0.25);
          e.x = width * 0.5 + (Math.random() - 0.5) * (width * 0.8);
          e.opacity = Math.random() * 0.4 + 0.6;
        }

        atmosCtx.save();
        atmosCtx.globalAlpha = Math.max(0, e.opacity);
        atmosCtx.shadowColor = '#FF9800';
        atmosCtx.shadowBlur = 6;
        atmosCtx.fillStyle = e.color;
        atmosCtx.beginPath();
        atmosCtx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        atmosCtx.fill();
        atmosCtx.restore();
      });

      // Cascading Velvet Rose Petals
      pherasPetals.forEach(p => {
        p.y += p.vy;
        p.swayPhase += p.swaySpeed;
        const currentX = p.x + Math.sin(p.swayPhase) * p.swayAmp;
        p.rot += p.rotSpeed;

        if (p.y > height + 25) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        atmosCtx.save();
        atmosCtx.translate(currentX, p.y);
        atmosCtx.rotate(p.rot);
        atmosCtx.globalAlpha = p.opacity;

        atmosCtx.beginPath();
        atmosCtx.ellipse(0, 0, p.radius * 1.3, p.radius * 0.8, 0, 0, Math.PI * 2);
        atmosCtx.fillStyle = p.color;
        atmosCtx.shadowColor = 'rgba(198, 40, 40, 0.4)';
        atmosCtx.shadowBlur = 4;
        atmosCtx.fill();
        atmosCtx.restore();
      });
    }

    // 4. Render Default OVERVIEW / CELEBRATION atmosphere (Ambient Gold Motes)
    else {
      ambientMotes.forEach(m => {
        m.y += m.vy;
        m.x += m.vx;
        m.alpha += Math.sin(frameCount * m.pulseSpeed) * 0.01;

        if (m.y < -10) m.y = height + 10;
        if (m.x < 0) m.x = width;
        if (m.x > width) m.x = 0;

        atmosCtx.save();
        atmosCtx.globalAlpha = Math.max(0.1, Math.min(m.alpha, 0.7));
        atmosCtx.fillStyle = '#FFD54F';
        atmosCtx.beginPath();
        atmosCtx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        atmosCtx.fill();
        atmosCtx.restore();
      });
    }

    atmosAnimationId = requestAnimationFrame(animateAtmosphere);
  }

  // Initialize Atmosphere Canvas Engine
  initAtmosphereEngine();

  // ==========================================================================
  // HIGH-PERFORMANCE IDLE PREFETCH ENGINE & SERVICE WORKER
  // ==========================================================================
  
  // Register Service Worker for 0ms Repeat-Visit Loading
  if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('Service Worker registration skipped:', err);
      });
    });
  }

  // Prefetch secondary doors & videos in background during idle time
  function prefetchSecondaryAssets() {
    const doorIds = ['1', '2', '3', '4', '6'];
    const prefetch = () => {
      doorIds.forEach(id => {
        // Prefetch AVIF/WebP image
        const img = new Image();
        img.src = `/assets/doors/${id}.avif`;

        // Prefetch MP4 video
        const vid = document.createElement('video');
        vid.preload = 'auto';
        vid.src = `/assets/doors/${id}.mp4`;
      });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(prefetch, { timeout: 3000 });
    } else {
      setTimeout(prefetch, 2000);
    }
  }

  // --- Constant Floating Order Bar Minimization / Expansion Logic ---
  const floatingOrderBar = document.getElementById('floatingOrderBar');
  const floatingWidgetClose = document.getElementById('floatingWidgetClose');
  const floatingWidgetTrigger = document.getElementById('floatingWidgetTrigger');

  if (floatingOrderBar && floatingWidgetClose && floatingWidgetTrigger) {
    floatingWidgetClose.addEventListener('click', (e) => {
      e.stopPropagation();
      floatingOrderBar.classList.add('collapsed');
      setTimeout(() => {
        floatingOrderBar.classList.add('hidden');
        floatingWidgetTrigger.classList.remove('hidden');
      }, 300);
    });

    floatingWidgetTrigger.addEventListener('click', () => {
      floatingWidgetTrigger.classList.add('hidden');
      floatingOrderBar.classList.remove('hidden');
      void floatingOrderBar.offsetWidth; // Force reflow
      floatingOrderBar.classList.remove('collapsed');
    });
  }

  prefetchSecondaryAssets();
});

