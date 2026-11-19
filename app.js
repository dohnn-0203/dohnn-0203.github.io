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
