/* =========================================================================
   Botão flutuante de WhatsApp da ORBEEX
   -------------------------------------------------------------------------
   Injeta o botão em qualquer página que inclua este arquivo. A mensagem já
   vai preenchida conforme a página, pra você saber de onde a pessoa veio
   sem precisar perguntar.

   Para trocar o número, mude só a constante NUMERO (formato internacional,
   só dígitos: 55 + DDD + número).
   ========================================================================= */
(function () {
  'use strict';

  var NUMERO = '5554996074361';

  /* A mensagem é escolhida pelo começo do caminho da URL. A primeira
     entrada que casar vence; '' é o padrão. */
  var MENSAGENS = [
    ['/kit-auditoria-interna', 'Oi, Luana! Vim pela página do Kit de Auditoria Interna e queria tirar uma dúvida antes de comprar.'],
    ['/fornecedor-sob-controle', 'Oi, Luana! Vim pela página do Fornecedor Sob Controle e queria tirar uma dúvida antes de comprar.'],
    ['/produtos', 'Oi, Luana! Vi os produtos digitais da ORBEEX no site e queria entender qual faz mais sentido pra minha empresa.'],
    ['/guia/', 'Oi, Luana! Li o guia das 10 não conformidades e queria conversar sobre o sistema de gestão da minha empresa.'],
    ['', 'Oi, Luana! Vim pelo site da ORBEEX e queria entender a assessoria em ISO 9001.']
  ];

  function mensagem() {
    var caminho = location.pathname;
    for (var i = 0; i < MENSAGENS.length; i++) {
      if (MENSAGENS[i][0] === '' || caminho.indexOf(MENSAGENS[i][0]) === 0) {
        return MENSAGENS[i][1];
      }
    }
    return MENSAGENS[MENSAGENS.length - 1][1];
  }

  function origem() {
    var caminho = location.pathname.replace(/^\/|\/$/g, '');
    return caminho || 'home';
  }

  function montar() {
    if (document.querySelector('.ox-zap')) { return; }

    var estilo = document.createElement('style');
    estilo.textContent =
      '.ox-zap{position:fixed;right:18px;bottom:18px;z-index:70;display:inline-flex;align-items:center;gap:10px;' +
        'background:#25d366;color:#fff;text-decoration:none;font-family:inherit;font-size:15px;font-weight:600;' +
        'padding:13px 18px;border-radius:999px;box-shadow:0 8px 24px rgba(21,21,42,.24);' +
        'transition:transform .18s ease,box-shadow .18s ease}' +
      '.ox-zap:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(21,21,42,.3);color:#fff}' +
      '.ox-zap svg{flex:0 0 auto}' +
      '.ox-zap .ox-zap-txt{white-space:nowrap}' +
      '@media (max-width:640px){.ox-zap{right:14px;bottom:14px;padding:14px;border-radius:50%}' +
        '.ox-zap .ox-zap-txt{display:none}}' +
      '@media (prefers-reduced-motion:reduce){.ox-zap{transition:none}}' +
      '@media print{.ox-zap{display:none}}';
    document.head.appendChild(estilo);

    var a = document.createElement('a');
    a.className = 'ox-zap';
    a.href = 'https://wa.me/' + NUMERO + '?text=' + encodeURIComponent(mensagem());
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Falar com a ORBEEX no WhatsApp');
    a.setAttribute('data-track', 'clique_whatsapp');
    a.setAttribute('data-track-item', origem());
    a.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z"/>' +
      '<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23a8.19 8.19 0 0 1 8.23 8.24c0 4.54-3.7 8.23-8.24 8.23z"/>' +
      '</svg>' +
      '<span class="ox-zap-txt">WhatsApp</span>';
    document.body.appendChild(a);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', montar);
  } else {
    montar();
  }
})();
