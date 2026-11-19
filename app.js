'use strict';
const imageDialog = document.querySelector('#image-dialog');
document.querySelectorAll('[data-zoom]').forEach(button => button.addEventListener('click', () => {
  const image = imageDialog.querySelector('img');
  image.src = button.dataset.zoom;
  image.alt = button.dataset.caption;
  document.querySelector('#image-caption').textContent = button.dataset.caption;
  imageDialog.showModal();
  document.body.classList.add('no-scroll');
}));
imageDialog.querySelector('.dialog-close').addEventListener('click', () => imageDialog.close());
imageDialog.addEventListener('click', event => {
  if (event.target !== imageDialog) return;
  const rect = imageDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) imageDialog.close();
});
imageDialog.addEventListener('close', () => document.body.classList.remove('no-scroll'));

const copyButton = document.querySelector('.copy-email');
copyButton.addEventListener('click', async () => {
  const status = document.querySelector('.copy-status');
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard is unavailable');
    await navigator.clipboard.writeText(copyButton.dataset.email);
    status.textContent = '이메일 주소를 복사했습니다.';
    copyButton.textContent = '복사 완료';
  } catch {
    status.textContent = '주소를 직접 선택해 복사하거나 이메일 링크를 눌러 주세요.';
  }
});

if ('IntersectionObserver' in window) {
  const links = [...document.querySelectorAll('.contents nav a')];
  const observer = new IntersectionObserver(entries => {
    const entry = entries.find(item => item.isIntersecting);
    if (!entry) return;
    links.forEach(link => {
      if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-12% 0px -65% 0px', threshold: 0 });
  document.querySelectorAll('.document-section').forEach(section => observer.observe(section));
}
document.querySelector('#year').textContent = String(new Date().getFullYear());


// Unity runs in an iframe that is created only after an explicit play action.
const chessPlayer = document.querySelector('#chess-player');
const chessPlayButton = document.querySelector('#chess-play');

if (chessPlayer && chessPlayButton) {
  const frameHost = document.querySelector('#chess-frame-host');
  const viewport = document.querySelector('#chess-viewport');
  const loading = document.querySelector('#chess-loading');
  const progress = document.querySelector('#chess-progress');
  const progressLabel = document.querySelector('#chess-progress-label');
  const loadError = document.querySelector('#chess-load-error');
  const loadErrorMessage = document.querySelector('#chess-load-error-message');
  const defaultLoadErrorMessage = loadErrorMessage.textContent;
  const playerStatus = document.querySelector('#chess-player-status');
  const fullscreenButton = document.querySelector('#chess-fullscreen');
  let frame = null;
  let loadingTimeout = null;

  function stopLoadingTimer() {
    window.clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }

  function showLoadingError(message) {
    if (!frame) return;
    stopLoadingTimer();
    viewport.setAttribute('aria-busy', 'false');
    loading.hidden = true;
    loadErrorMessage.textContent = typeof message === 'string' && message.trim()
      ? message.trim().slice(0, 500)
      : defaultLoadErrorMessage;
    loadError.hidden = false;
  }

  function unloadGame() {
    stopLoadingTimer();
    if (frame) {
      frame.src = 'about:blank';
      frame.remove();
      frame = null;
    }
  }

  function loadGame() {
    unloadGame();
    chessPlayer.hidden = false;
    chessPlayButton.setAttribute('aria-expanded', 'true');
    chessPlayButton.textContent = '플레이 화면 보기';
    playerStatus.textContent = '';
    viewport.setAttribute('aria-busy', 'true');
    loading.hidden = false;
    loadError.hidden = true;
    loadErrorMessage.textContent = defaultLoadErrorMessage;
    progress.value = 0;
    progressLabel.textContent = '0%';

    frame = document.createElement('iframe');
    frame.title = 'Chess 3D 체스 게임';
    frame.className = 'chess-frame';
    frame.allowFullscreen = true;
    frame.allow = 'fullscreen';
    frame.setAttribute('aria-describedby', 'chess-player-help');
    frame.src = 'games/chess/';
    const loadingFrame = frame;
    frame.addEventListener('error', () => {
      if (frame === loadingFrame) showLoadingError();
    });
    frameHost.append(frame);
    loadingTimeout = window.setTimeout(showLoadingError, 120000);
  }

  chessPlayButton.addEventListener('click', () => {
    if (!frame) loadGame();
    chessPlayer.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
    document.querySelector('#chess-close').focus({ preventScroll: true });
  });

  document.querySelector('#chess-retry').addEventListener('click', loadGame);

  document.querySelector('#chess-close').addEventListener('click', async () => {
    if (document.fullscreenElement === chessPlayer) {
      try { await document.exitFullscreen(); } catch { /* Closing must still unload the game. */ }
    }
    unloadGame();
    chessPlayer.hidden = true;
    chessPlayButton.setAttribute('aria-expanded', 'false');
    chessPlayButton.textContent = '이 페이지에서 플레이';
    chessPlayButton.focus({ preventScroll: true });
  });

  fullscreenButton.hidden = !document.fullscreenEnabled || !chessPlayer.requestFullscreen;
  fullscreenButton.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement === chessPlayer) await document.exitFullscreen();
      else await chessPlayer.requestFullscreen();
      playerStatus.textContent = '';
    } catch {
      playerStatus.textContent = '이 브라우저에서는 전체화면을 열 수 없습니다. 현재 화면에서 플레이할 수 있습니다.';
    }
  });

  document.addEventListener('fullscreenchange', () => {
    fullscreenButton.textContent = document.fullscreenElement === chessPlayer ? '전체화면 종료' : '전체화면';
  });

  window.addEventListener('message', event => {
    if (!frame || event.origin !== window.location.origin || event.source !== frame.contentWindow) return;
    const message = event.data;
    if (!message || typeof message !== 'object') return;

    if (message.type === 'chess-player-progress' && Number.isFinite(message.progress)) {
      const percentage = Math.round(Math.min(1, Math.max(0, message.progress)) * 100);
      progress.value = percentage;
      progressLabel.textContent = percentage + '%';
    } else if (message.type === 'chess-player-ready') {
      stopLoadingTimer();
      viewport.setAttribute('aria-busy', 'false');
      loading.hidden = true;
      loadError.hidden = true;
      playerStatus.textContent = '게임이 준비되었습니다. 체스판을 눌러 플레이하세요.';
    } else if (message.type === 'chess-player-error') {
      showLoadingError(message.message);
    }
  });
}
