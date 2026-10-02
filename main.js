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
  const weddingBgAudio = document.getElementById('weddingBgAudio');
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

    // 0. Play Royal Wedding Background Music
    if (weddingBgAudio) {
      weddingBgAudio.currentTime = 0;
      weddingBgAudio.volume = 0.85;
      weddingBgAudio.muted = isAudioMuted;
      const audioPromise = weddingBgAudio.play();
      if (audioPromise !== undefined) {
        audioPromise.then(() => {
          console.log('Wedding background music playing smoothly');
        }).catch(err => {
          console.warn('Audio auto-play prevented by browser policy, unlocking on next user tap:', err);
          const unlockAudio = () => {
            if (!isAudioMuted && weddingBgAudio.paused) {
              weddingBgAudio.play().catch(() => {});
            }
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
          };
          document.addEventListener('click', unlockAudio, { once: true });
          document.addEventListener('touchstart', unlockAudio, { once: true });
        });
      }
    }

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

    if (weddingBgAudio) {
      weddingBgAudio.pause();
      weddingBgAudio.currentTime = 0;
    }

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

  // --- Optional Door & Editor Modal Controls (Guarded) ---
  if (doorSelectBtn && doorModal) {
    doorSelectBtn.addEventListener('click', () => doorModal.classList.remove('hidden'));
  }
  if (closeDoorModal && doorModal) {
    closeDoorModal.addEventListener('click', () => doorModal.classList.add('hidden'));
  }
  
  document.querySelectorAll('.door-option-card').forEach(card => {
    card.addEventListener('click', () => {
      switchDoorStyle(card.dataset.door);
    });
  });

  if (editDetailsBtn && editorModal) {
    editDetailsBtn.addEventListener('click', () => editorModal.classList.remove('hidden'));
  }
  if (closeEditorModal && editorModal) {
    closeEditorModal.addEventListener('click', () => editorModal.classList.add('hidden'));
  }

  if (editorForm) {
    editorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const groomInput = document.getElementById('inputGroom');
      const brideInput = document.getElementById('inputBride');
      if (groomInput) document.getElementById('displayGroom').innerText = groomInput.value;
      if (brideInput) document.getElementById('displayBride').innerText = brideInput.value;

      editorModal.classList.add('hidden');
    });
  }

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
    
    if (weddingBgAudio) {
      weddingBgAudio.muted = isAudioMuted;
      if (!isAudioMuted && weddingBgAudio.paused) {
        weddingBgAudio.play().catch(() => {});
      }
    }

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
  [doorModal, editorModal, mapModal].filter(Boolean).forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });

  // --- Add to Google Calendar (Main Wedding Celebration) ---
  // ==========================================================================
  // CONTINUOUS SCROLL ATMOSPHERE OBSERVER
  // ==========================================================================
  const ceremonySections = [
    { id: 'section-haldi', mode: 'haldi' },
    { id: 'section-sangeet', mode: 'sangeet' },
    { id: 'section-wedding', mode: 'wedding' },
    { id: 'section-rsvp', mode: 'wedding' },
    { id: 'section-venue', mode: 'wedding' }
  ];

  if ('IntersectionObserver' in window && contentScrollable) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          const match = ceremonySections.find(s => s.id === entry.target.id);
          if (match) {
            switchAtmosphereMode(match.mode);
          }
        }
      });
    }, {
      root: contentScrollable,
      threshold: [0.35, 0.6]
    });

    ceremonySections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) sectionObserver.observe(el);
    });
  }

  // ==========================================================================
  // GOOGLE CALENDAR ADD BUTTONS
  // ==========================================================================
  document.querySelectorAll('.ceremony-calendar-btn, #addToCalendarBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const eventName = btn.dataset.event || 'Wedding Celebration';
      const eventDates = btn.dataset.date || '20261119T043000Z/20261120T183000Z';
      const venue = 'Devalaya Resort';
      const location = 'Jhansi Road, Sithouli, Gwalior, Madhya Pradesh';

      const title = encodeURIComponent(`${eventName} — Shivani & Prajjual Wedding`);
      const details = encodeURIComponent(`We cordially invite you to celebrate the ${eventName} of Shivani & Prajjual at ${venue}, Gwalior.`);
      const loc = encodeURIComponent(`${venue}, ${location}`);

      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${loc}&dates=${eventDates}`;
      window.open(googleCalendarUrl, '_blank', 'noopener,noreferrer');
    });
  });

  // ==========================================================================
  // RSVP ENGINE WITH LOCALSTORAGE & WHATSAPP INTEGRATION
  // ==========================================================================
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSuccessCard = document.getElementById('rsvpSuccessCard');
  const confirmedGuestName = document.getElementById('confirmedGuestName');
  const confirmedSummaryBox = document.getElementById('confirmedSummaryBox');
  const editRsvpBtn = document.getElementById('editRsvpBtn');
  const whatsappRsvpBtn = document.getElementById('whatsappRsvpBtn');

  function getRsvpFormData() {
    const name = (document.getElementById('rsvpGuestName')?.value || '').trim();
    const guestCount = document.getElementById('rsvpGuestCount')?.value || '2 Guests';
    const contact = (document.getElementById('rsvpContact')?.value || '').trim();
    const note = (document.getElementById('rsvpNote')?.value || '').trim();

    const selectedEvents = [];
    document.querySelectorAll('input[name="rsvpCeremonies"]:checked').forEach(cb => {
      selectedEvents.push(cb.value);
    });

    return {
      name: name || 'Guest',
      events: selectedEvents.length > 0 ? selectedEvents.join(', ') : 'All Celebrations',
      guests: guestCount,
      contact: contact,
      note: note,
      timestamp: new Date().toISOString()
    };
  }

  function displayRsvpSuccess(data) {
    if (!rsvpForm || !rsvpSuccessCard) return;
    rsvpForm.classList.add('hidden');
    rsvpSuccessCard.classList.remove('hidden');

    if (confirmedGuestName) confirmedGuestName.textContent = data.name;
    if (confirmedSummaryBox) {
      confirmedSummaryBox.innerHTML = `
        <div><strong>Attending:</strong> ${data.events}</div>
        <div><strong>Guests:</strong> ${data.guests}</div>
        ${data.contact ? `<div><strong>Phone:</strong> ${data.contact}</div>` : ''}
      `;
    }
  }

  // Restore previous RSVP if saved
  try {
    const savedRsvp = localStorage.getItem('shivani_prajjual_rsvp');
    if (savedRsvp) {
      const data = JSON.parse(savedRsvp);
      displayRsvpSuccess(data);
    }
  } catch (err) {
    console.warn('LocalStorage RSVP read error:', err);
  }

  // --- Smooth Scroll Down Trigger from First Page ---
  const scrollDownTrigger = document.getElementById('scrollDownTrigger');
  if (scrollDownTrigger && contentScrollable) {
    scrollDownTrigger.addEventListener('click', () => {
      const ceremoniesContainer = document.getElementById('ceremoniesScrollContainer');
      if (ceremoniesContainer) {
        ceremoniesContainer.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = getRsvpFormData();

      try {
        localStorage.setItem('shivani_prajjual_rsvp', JSON.stringify(data));
      } catch (err) {
        console.warn('LocalStorage RSVP save error:', err);
      }

      displayRsvpSuccess(data);
      triggerConfetti();

      // Launch WhatsApp confirmation with pre-filled guest details
      const message = `Namaste Shivani & Prajjual! ✨\n\nI am delighted to confirm my RSVP for your royal wedding celebrations!\n\n• Guest: ${data.name}\n• Attending: ${data.events}\n• Total Guests: ${data.guests}${data.contact ? `\n• Contact: ${data.contact}` : ''}${data.note ? `\n• Message: "${data.note}"` : ''}\n\nLooking forward to celebrating with you at Devalaya Resort, Gwalior! 💖`;
      
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  if (editRsvpBtn) {
    editRsvpBtn.addEventListener('click', () => {
      if (rsvpSuccessCard && rsvpForm) {
        rsvpSuccessCard.classList.add('hidden');
        rsvpForm.classList.remove('hidden');
      }
    });
  }

  // ==========================================================================
  // DYNAMIC ATMOSPHERE CANVAS ENGINE
  // Haldi: Subtle warm golden glimmer motes (NO balloons, NO garlands)
  // Sangeet: Elegant evening starlight twinkles & soft bokeh (NO balloons)
  // Wedding: Sacred Agni fire embers & cascading rose petals
  // Venue & RSVP: Delicate ambient golden stardust
  // ==========================================================================
  const atmosphereCanvas = document.getElementById('atmosphereCanvas');
  let atmosCtx = null;
  let activeAtmosphere = 'haldi'; // Default first page is Haldi!
  let atmosAnimationId = null;

  // Particle Stores
  let haldiSparkles = [];
  let shimmerLights = [];
  let pherasEmbers = [];
  let pherasPetals = [];
  let ambientMotes = [];

  function initAtmosphereEngine() {
    if (!atmosphereCanvas) return;
    atmosCtx = atmosphereCanvas.getContext('2d');
    resizeAtmosphereCanvas();
    window.addEventListener('resize', resizeAtmosphereCanvas);

    setupHaldiSparkles();
    setupSangeetLights();
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

  // --- 1. Haldi Particles: Gentle Warm Golden Candlelight Glimmers (Simple & Elegant) ---
  function setupHaldiSparkles() {
    haldiSparkles = [];
    const width = atmosphereCanvas.displayWidth || 360;
    const height = atmosphereCanvas.displayHeight || 640;
    const goldTones = ['#FFD54F', '#FFE082', '#FFA000', '#FFCA28', '#FFF9C4'];

    for (let i = 0; i < 35; i++) {
      haldiSparkles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.2 + 0.8,
        vy: -(Math.random() * 0.45 + 0.25),
        vx: (Math.random() - 0.5) * 0.35,
        baseAlpha: Math.random() * 0.35 + 0.25,
        alphaPulse: Math.random() * 0.03 + 0.015,
        phase: Math.random() * Math.PI * 2,
        color: goldTones[Math.floor(Math.random() * goldTones.length)]
      });
    }
  }

  // --- 2. Sangeet Particles: Evening Starlight Twinkles & Soft Bokeh (Classy & Modern) ---
  function setupSangeetLights() {
    shimmerLights = [];
    const width = atmosphereCanvas.displayWidth || 360;
    const height = atmosphereCanvas.displayHeight || 640;

    for (let i = 0; i < 36; i++) {
      shimmerLights.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 12 + 4,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        baseAlpha: Math.random() * 0.3 + 0.2,
        alphaPulseSpeed: Math.random() * 0.03 + 0.015,
        alphaPhase: Math.random() * Math.PI * 2,
        isStar: Math.random() > 0.35,
        starSize: Math.random() * 4 + 2.5,
        color: i % 3 === 0 ? '#F48FB1' : (i % 2 === 0 ? '#FFE082' : '#FFFFFF')
      });
    }
  }

  // --- 3. Wedding Particles: Sacred Fire Embers & Rose Petals ---
  function setupPherasParticles() {
    pherasEmbers = [];
    pherasPetals = [];
    const width = atmosphereCanvas.displayWidth || 360;
    const height = atmosphereCanvas.displayHeight || 640;

    const emberColors = ['#FFD54F', '#FFA000', '#FF5722', '#FF7043', '#FFE082'];
    for (let i = 0; i < 35; i++) {
      pherasEmbers.push({
        x: width * 0.5 + (Math.random() - 0.5) * (width * 0.85),
        y: height * 0.75 + Math.random() * (height * 0.35),
        size: Math.random() * 2.5 + 1.2,
        vy: -(Math.random() * 1.8 + 0.9),
        vx: (Math.random() - 0.5) * 0.7,
        color: emberColors[Math.floor(Math.random() * emberColors.length)],
        opacity: Math.random() * 0.4 + 0.5,
        decay: Math.random() * 0.004 + 0.002
      });
    }

    const roseColors = ['#C62828', '#D32F2F', '#E53935', '#AD1457', '#F06292'];
    for (let i = 0; i < 18; i++) {
      pherasPetals.push({
        x: Math.random() * width,
        y: Math.random() * height - height * 0.5,
        radius: Math.random() * 5 + 4,
        vy: Math.random() * 1.1 + 0.8,
        swayAmp: Math.random() * 18 + 6,
        swaySpeed: Math.random() * 0.02 + 0.012,
        swayPhase: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        color: roseColors[Math.floor(Math.random() * roseColors.length)],
        opacity: Math.random() * 0.3 + 0.6
      });
    }
  }

  // --- 4. Ambient Golden Dust Motes (Venue & RSVP) ---
  function setupAmbientParticles() {
    ambientMotes = [];
    const width = atmosphereCanvas.displayWidth || 360;
    const height = atmosphereCanvas.displayHeight || 640;

    for (let i = 0; i < 28; i++) {
      ambientMotes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 0.8,
        vy: -(Math.random() * 0.35 + 0.15),
        vx: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.35 + 0.25,
        pulseSpeed: Math.random() * 0.025 + 0.01
      });
    }
  }

  function switchAtmosphereMode(mode) {
    activeAtmosphere = mode;
  }

  // Main Atmosphere Render Loop
  let frameCount = 0;
  function animateAtmosphere() {
    if (!atmosCtx || !atmosphereCanvas) return;
    const width = atmosphereCanvas.displayWidth || 360;
    const height = atmosphereCanvas.displayHeight || 640;
    atmosCtx.clearRect(0, 0, width, height);

    frameCount++;

    // 1. Render HALDI atmosphere (Simple, elegant golden candlelight glimmer motes)
    if (activeAtmosphere === 'haldi') {
      haldiSparkles.forEach(m => {
        m.y += m.vy;
        m.x += m.vx;
        m.phase += m.alphaPulse;

        if (m.y < -10) m.y = height + 10;
        if (m.x < 0) m.x = width;
        if (m.x > width) m.x = 0;

        const currentAlpha = m.baseAlpha + Math.sin(m.phase) * 0.2;
        if (currentAlpha <= 0) return;

        atmosCtx.save();
        atmosCtx.globalAlpha = Math.max(0.1, Math.min(currentAlpha, 0.75));
        atmosCtx.fillStyle = m.color;
        atmosCtx.beginPath();
        atmosCtx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        atmosCtx.fill();
        atmosCtx.restore();
      });
    }

    // 2. Render SANGEET atmosphere (Classy evening starlight twinkles & soft bokeh)
    else if (activeAtmosphere === 'sangeet') {
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
        atmosCtx.globalAlpha = Math.max(0, Math.min(currentAlpha, 0.85));

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
          // Soft Bokeh Orb
          const grad = atmosCtx.createRadialGradient(sl.x, sl.y, 0, sl.x, sl.y, sl.radius);
          grad.addColorStop(0, 'rgba(255, 244, 208, 0.6)');
          grad.addColorStop(0.5, 'rgba(229, 193, 88, 0.2)');
          grad.addColorStop(1, 'rgba(229, 193, 88, 0)');
          atmosCtx.fillStyle = grad;
          atmosCtx.beginPath();
          atmosCtx.arc(sl.x, sl.y, sl.radius, 0, Math.PI * 2);
          atmosCtx.fill();
        }
        atmosCtx.restore();
      });
    }

    // 3. Render WEDDING atmosphere (Sacred Fire Embers & Rose Petals)
    else if (activeAtmosphere === 'wedding') {
      // Golden Sacred Aura Pulse in background
      const auraPulse = 0.12 + Math.sin(frameCount * 0.03) * 0.05;
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
        e.x += e.vx + (Math.random() - 0.5) * 0.6;
        e.opacity -= e.decay;

        if (e.y < 30 || e.opacity <= 0) {
          e.y = height * 0.75 + Math.random() * (height * 0.25);
          e.x = width * 0.5 + (Math.random() - 0.5) * (width * 0.8);
          e.opacity = Math.random() * 0.4 + 0.5;
        }

        atmosCtx.save();
        atmosCtx.globalAlpha = Math.max(0, e.opacity);
        atmosCtx.shadowColor = '#FF9800';
        atmosCtx.shadowBlur = 5;
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
        atmosCtx.shadowColor = 'rgba(198, 40, 40, 0.35)';
        atmosCtx.shadowBlur = 3;
        atmosCtx.fill();
        atmosCtx.restore();
      });
    }

    // 4. Render Default / VENUE / RSVP atmosphere (Ambient Golden Stardust)
    else {
      ambientMotes.forEach(m => {
        m.y += m.vy;
        m.x += m.vx;
        m.alpha += Math.sin(frameCount * m.pulseSpeed) * 0.01;

        if (m.y < -10) m.y = height + 10;
        if (m.x < 0) m.x = width;
        if (m.x > width) m.x = 0;

        atmosCtx.save();
        atmosCtx.globalAlpha = Math.max(0.1, Math.min(m.alpha, 0.65));
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

