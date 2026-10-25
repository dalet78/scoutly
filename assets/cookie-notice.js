(() => {
  const key = 'scoutly-cookie-notice-v1';
  try { if (localStorage.getItem(key) === 'acknowledged') return; } catch {}
  const style = document.createElement('style');
  style.textContent = `.sc-cookie{position:fixed;inset:auto 20px 20px;z-index:10000;max-width:620px;margin:auto;padding:24px;background:#fffef9;color:#19303a;border:1px solid #b8c4be;border-radius:14px;box-shadow:0 12px 50px #0003;font:14px/1.6 Arial,sans-serif}.sc-cookie h2{font:600 20px/1.3 Arial,sans-serif;margin:0 0 10px}.sc-cookie p{margin:0 0 18px}.sc-cookie button{padding:12px 20px;border:0;border-radius:6px;background:#193d31;color:white;font:600 14px Arial,sans-serif;cursor:pointer;min-height:44px}.sc-cookie button:focus-visible{outline:3px solid #a56b4e;outline-offset:4px}@media(max-width:480px){.sc-cookie{inset:auto 12px 12px;padding:20px}}`;
  document.head.append(style);
  const notice = document.createElement('section');
  notice.className = 'sc-cookie';
  notice.setAttribute('role', 'region');
  notice.setAttribute('aria-labelledby', 'sc-cookie-title');
  const title = document.createElement('h2');
  title.id = 'sc-cookie-title';
  title.textContent = 'Cookie e memoria del browser';
  const copy = document.createElement('p');
  copy.textContent = 'Scoutly usa la memoria tecnica del browser per gestire gli invii e ricordare la chiusura di questo avviso. Nelle pagine attuali non utilizziamo cookie di profilazione o strumenti pubblicitari e di analisi. Non è richiesto un consenso per queste funzioni tecniche.';
  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = 'Ho capito';
  close.addEventListener('click', () => {
    try { localStorage.setItem(key, 'acknowledged'); } catch {}
    notice.remove();
  });
  notice.append(title, copy, close);
  document.body.append(notice);
})();
