'use strict';

(() => {
  const canvas = document.querySelector('#unity-canvas');
  const loadingPanel = document.querySelector('#loading-panel');
  const progressBar = document.querySelector('#loading-progress');
  const progressLabel = document.querySelector('#loading-label');
  const errorPanel = document.querySelector('#error-panel');
  const errorMessage = document.querySelector('#error-message');
  const retryButton = document.querySelector('#retry-button');
  const controller = new AbortController();
  let unityInstance = null;
  let stopped = false;
  let failed = false;
  let lastPercent = -1;

  function notifyParent(type, fields = {}) {
    if (window.parent !== window && !stopped) {
      window.parent.postMessage({ type, ...fields }, window.location.origin);
    }
  }

  function showError(message, detail) {
    if (stopped || failed) return;
    failed = true;
    loadingPanel.hidden = true;
    loadingPanel.setAttribute('aria-busy', 'false');
    errorMessage.textContent = message;
    errorPanel.hidden = false;
    canvas.tabIndex = -1;
    notifyParent('chess-player-error', { message });
    if (detail) console.error('Chess player:', detail);
  }

  function updateProgress(value) {
    if (stopped || failed) return;
    const progress = Math.max(0, Math.min(1, Number(value) || 0));
    progressBar.value = progress;
    const percent = Math.round(progress * 100);
    if (percent !== lastPercent) {
      progressLabel.textContent = percent === 100 ? '체스판을 준비하고 있습니다' : `${percent}%`;
      notifyParent('chess-player-progress', { progress });
      lastPercent = percent;
    }
  }

  function localAsset(path, name) {
    if (typeof path !== 'string' || !path.trim()) throw new Error(`Missing ${name} in build-config.json`);
    const url = new URL(path, document.baseURI);
    const directory = new URL('./', document.baseURI);
    if (url.origin !== directory.origin || !url.pathname.startsWith(directory.pathname)) {
      throw new Error(`Invalid local asset path for ${name}`);
    }
    return url.href;
  }

  function loadLoader(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => typeof window.createUnityInstance === 'function'
        ? resolve()
        : reject(new Error('Unity loader did not provide createUnityInstance'));
      script.onerror = () => reject(new Error('Unity loader could not be downloaded'));
      document.body.append(script);
    });
  }

  function supportsWebGL2() {
    try {
      const probe = document.createElement('canvas');
      const context = probe.getContext('webgl2');
      if (!context) return false;
      context.getExtension('WEBGL_lose_context')?.loseContext();
      return true;
    } catch {
      return false;
    }
  }

  async function start() {
    if (!supportsWebGL2()) {
      showError('이 브라우저에서는 게임 화면을 표시할 수 없습니다. WebGL 2를 지원하는 데스크톱 브라우저에서 다시 시도해 주세요.');
      return;
    }
    try {
      const response = await fetch('build-config.json', {
        cache: 'no-cache',
        credentials: 'same-origin',
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`Build configuration request failed: ${response.status}`);
      const build = await response.json();
      const loaderUrl = localAsset(build.loaderUrl, 'loaderUrl');
      const config = {
        dataUrl: localAsset(build.dataUrl, 'dataUrl'),
        frameworkUrl: localAsset(build.frameworkUrl, 'frameworkUrl'),
        codeUrl: localAsset(build.codeUrl, 'codeUrl'),
        companyName: build.companyName || 'dohnn-0203',
        productName: build.productName || 'Chess',
        productVersion: build.productVersion || '1.0',
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
        matchWebGLToCanvasSize: true,
        showBanner(message, type) {
          if (type === 'error') {
            showError('게임을 실행하지 못했습니다. 브라우저를 최신 버전으로 업데이트하거나 다시 불러와 주세요.', message);
          } else {
            console.warn('Chess player:', message);
          }
        }
      };
      if (build.streamingAssetsUrl) config.streamingAssetsUrl = localAsset(build.streamingAssetsUrl, 'streamingAssetsUrl');
      await loadLoader(loaderUrl);
      if (stopped || failed) return;
      unityInstance = await window.createUnityInstance(canvas, config, updateProgress);
      if (stopped || failed) {
        unityInstance.Quit();
        return;
      }
      loadingPanel.hidden = true;
      loadingPanel.setAttribute('aria-busy', 'false');
      canvas.focus({ preventScroll: true });
      notifyParent('chess-player-ready');
    } catch (error) {
      if (error.name !== 'AbortError') {
        showError('인터넷 연결을 확인한 뒤 다시 불러와 주세요. 문제가 계속되면 다른 데스크톱 브라우저에서 시도해 주세요.', error);
      }
    }
  }

  canvas.addEventListener('contextmenu', event => event.preventDefault());
  canvas.addEventListener('pointerdown', () => {
    if (!failed) canvas.focus({ preventScroll: true });
  });
  retryButton.addEventListener('click', () => window.location.reload());
  window.addEventListener('pagehide', () => {
    stopped = true;
    controller.abort();
    if (unityInstance) unityInstance.Quit();
  }, { once: true });

  start();
})();
