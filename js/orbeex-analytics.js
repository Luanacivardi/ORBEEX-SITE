/* ORBEEX · Medição, anúncios e consentimento
 * ---------------------------------------------------------------------------
 * Um arquivo só, usado pelas páginas do site. Faz cinco coisas:
 *   1. Carrega o Google Analytics 4 com Consent Mode (cookie só depois do "aceitar")
 *   2. Carrega o Meta Pixel (Facebook/Instagram Ads), também só depois do "aceitar"
 *   3. Carrega o Microsoft Clarity (heatmap/gravação de sessão), idem
 *   4. Mostra o banner de consentimento e guarda a escolha da pessoa
 *   5. Dispara eventos nos elementos marcados com data-track
 *
 * PARA ATIVAR O GA4: troque MEASUREMENT_ID abaixo pelo ID da propriedade
 * (formato G-XXXXXXXXXX, em Administrar > Fluxos de dados no painel do GA4).
 * PARA ATIVAR O PIXEL: troque PIXEL_ID pelo ID do Pixel (Gerenciador de Eventos
 * da Meta). PARA ATIVAR O CLARITY: troque CLARITY_ID pelo Project ID (painel
 * do Clarity > Configurações > Código de acompanhamento). Enquanto os valores
 * forem os placeholders, nada é carregado — o site funciona normalmente, só
 * não mede/anuncia.
 * ------------------------------------------------------------------------- */

(function () {
  'use strict';

  var MEASUREMENT_ID = 'G-WP1CM0PVEK';
  var PLACEHOLDER = 'G-XXXXXXXXXX';

  var PIXEL_ID = '3606285859527015';
  var PIXEL_PLACEHOLDER = '0000000000000000';

  var CLARITY_ID = 'ymb7snbdk4';
  var CLARITY_PLACEHOLDER = 'xxxxxxxxxx';

  var CHAVE = 'orbeex_consentimento';
  var VERSAO = 1;
  var ativo = MEASUREMENT_ID !== PLACEHOLDER && /^G-[A-Z0-9]{6,}$/.test(MEASUREMENT_ID);
  var pixelAtivo = PIXEL_ID !== PIXEL_PLACEHOLDER && /^\d{10,}$/.test(PIXEL_ID);
  var clarityAtivo = CLARITY_ID !== CLARITY_PLACEHOLDER && /^[a-z0-9]{6,}$/i.test(CLARITY_ID);

  /* ---------- base do gtag ---------------------------------------------- */

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  // Tudo negado por padrão. Só muda se a pessoa aceitar.
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    personalization_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted'
  });

  /* ---------- leitura da escolha guardada -------------------------------- */

  function lerEscolha() {
    try {
      var bruto = localStorage.getItem(CHAVE);
      if (!bruto) return null;
      var dado = JSON.parse(bruto);
      if (!dado || dado.versao !== VERSAO) return null;
      return dado.escolha === 'aceito' ? 'aceito' : 'recusado';
    } catch (e) {
      return null;
    }
  }

  function guardarEscolha(escolha) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify({
        escolha: escolha,
        versao: VERSAO,
        data: new Date().toISOString()
      }));
    } catch (e) {
      /* navegação anônima ou cookies bloqueados: a escolha vale só nesta visita */
    }
  }

  function aplicarConsentimento(escolha) {
    gtag('consent', 'update', {
      analytics_storage: escolha === 'aceito' ? 'granted' : 'denied',
      ad_storage: escolha === 'aceito' ? 'granted' : 'denied',
      ad_user_data: escolha === 'aceito' ? 'granted' : 'denied',
      ad_personalization: escolha === 'aceito' ? 'granted' : 'denied'
    });
    if (escolha === 'aceito') {
      carregarPixel();
      carregarClarity();
    }
  }

  /* ---------- carregamento do Meta Pixel ---------------------------------- */

  var pixelCarregado = false;

  function carregarPixel() {
    if (!pixelAtivo || pixelCarregado) return;
    pixelCarregado = true;

    /* eslint-disable */
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */

    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  /* ---------- carregamento do Microsoft Clarity --------------------------- */

  var clarityCarregado = false;

  function carregarClarity() {
    if (!clarityAtivo || clarityCarregado) return;
    clarityCarregado = true;

    /* eslint-disable */
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", CLARITY_ID);
    /* eslint-enable */
  }

  /* ---------- carregamento do GA4 ---------------------------------------- */

  function carregarGA() {
    if (!ativo) {
      if (window.console && console.info) {
        console.info('[ORBEEX] Medição desligada: troque MEASUREMENT_ID em js/orbeex-analytics.js');
      }
      return;
    }
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    document.head.appendChild(s);

    gtag('js', new Date());
    gtag('config', MEASUREMENT_ID, { anonymize_ip: true });
  }

  var escolhaAtual = lerEscolha();
  if (escolhaAtual) aplicarConsentimento(escolhaAtual);
  carregarGA();

  /* ---------- disparo de eventos ----------------------------------------- */

  /* Uso: orbeexEvento('nome_do_evento', { chave: 'valor' }) */
  function orbeexEvento(nome, params) {
    if (!nome) return;
    gtag('event', nome, params || {});
    if (window.fbq && nome === 'clique_checkout') {
      window.fbq('track', 'InitiateCheckout', {
        content_name: (params && params.item) || '',
        value: params && params.value,
        currency: (params && params.value) ? 'BRL' : undefined
      });
    }
  }
  window.orbeexEvento = orbeexEvento;

  /* Qualquer elemento com data-track vira um evento ao ser clicado.
     data-track       = nome do evento
     data-track-item  = o que foi clicado (produto, seção, destino)
     data-track-valor = valor em reais, quando fizer sentido */
  document.addEventListener('click', function (e) {
    var alvo = e.target && e.target.closest ? e.target.closest('[data-track]') : null;
    if (!alvo) return;

    var params = { item: alvo.getAttribute('data-track-item') || '' };
    var valor = alvo.getAttribute('data-track-valor');
    if (valor) {
      params.value = parseFloat(valor);
      params.currency = 'BRL';
    }
    orbeexEvento(alvo.getAttribute('data-track'), params);
  }, true);

  /* ---------- banner de consentimento ------------------------------------ */

  var CSS = [
    '.ox-consent{position:fixed;left:0;right:0;bottom:0;z-index:9999;',
    'background:#181830;color:#f2efe3;border-top:2px solid #e8b84b;',
    'box-shadow:0 -8px 32px rgba(21,21,42,.28);',
    "font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;",
    'transform:translateY(100%);transition:transform .32s cubic-bezier(.2,.7,.3,1)}',
    '.ox-consent.ox-abre{transform:translateY(0)}',
    '.ox-consent-in{max-width:1180px;margin:0 auto;padding:18px 24px;',
    'display:flex;flex-wrap:wrap;align-items:center;gap:14px 28px}',
    '.ox-consent-txt{flex:1 1 320px;font-size:14px;line-height:1.55;color:#c9c6db;margin:0}',
    '.ox-consent-txt b{color:#f2efe3;font-weight:600}',
    '.ox-consent-txt a{color:#e8b84b;text-underline-offset:2px}',
    '.ox-consent-btns{display:flex;gap:10px;flex-wrap:wrap}',
    '.ox-consent button{font:inherit;font-size:14px;font-weight:600;cursor:pointer;',
    'padding:11px 22px;border-radius:10px;border:1px solid transparent;transition:.18s}',
    '.ox-consent .ox-sim{background:#e8b84b;color:#181830}',
    '.ox-consent .ox-sim:hover{background:#f2cd72}',
    '.ox-consent .ox-nao{background:transparent;color:#f2efe3;border-color:rgba(242,239,227,.32)}',
    '.ox-consent .ox-nao:hover{border-color:#f2efe3;background:rgba(242,239,227,.08)}',
    '.ox-consent button:focus-visible{outline:2px solid #e8b84b;outline-offset:3px}',
    '@media (max-width:620px){.ox-consent-in{padding:14px 18px;gap:12px}',
    '.ox-consent-txt{font-size:13px;line-height:1.5;flex-basis:100%}',
    '.ox-consent-btns{width:100%}.ox-consent-btns button{flex:1;padding:12px 16px}}',
    '@media (prefers-reduced-motion:reduce){.ox-consent{transition:none}}'
  ].join('');

  function caminhoPrivacidade() {
    // A página de privacidade fica na raiz; as páginas internas precisam subir um nível.
    var partes = location.pathname.split('/').filter(Boolean);
    var profundidade = partes.length;
    if (/\.html?$/i.test(partes[partes.length - 1] || '')) profundidade -= 1;
    return (profundidade > 0 ? '../'.repeat(profundidade) : '') + 'privacidade/';
  }

  function montarBanner() {
    var estilo = document.createElement('style');
    estilo.textContent = CSS;
    document.head.appendChild(estilo);

    var barra = document.createElement('div');
    barra.className = 'ox-consent';
    barra.setAttribute('role', 'region');
    barra.setAttribute('aria-label', 'Aviso de cookies');
    barra.innerHTML =
      '<div class="ox-consent-in">' +
        '<p class="ox-consent-txt"><b>Este site usa cookies para medir audiência e anúncios.</b> ' +
        'Uso pra saber quantas pessoas visitam, quais páginas são lidas, onde clicam, ' +
        'pra mostrar meus anúncios pra quem já conhece o site. Recusar não atrapalha a navegação. ' +
        '<a href="' + caminhoPrivacidade() + '">Política de Privacidade</a>.</p>' +
        '<div class="ox-consent-btns">' +
          '<button type="button" class="ox-nao">Recusar</button>' +
          '<button type="button" class="ox-sim">Aceitar</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(barra);
    requestAnimationFrame(function () { barra.classList.add('ox-abre'); });

    function responder(escolha) {
      guardarEscolha(escolha);
      aplicarConsentimento(escolha);
      orbeexEvento('consentimento_cookies', { item: escolha });
      barra.classList.remove('ox-abre');
      setTimeout(function () { barra.remove(); }, 340);
    }

    barra.querySelector('.ox-sim').addEventListener('click', function () { responder('aceito'); });
    barra.querySelector('.ox-nao').addEventListener('click', function () { responder('recusado'); });
  }

  /* Reabrir o banner a partir do rodapé: <a href="#" data-consent-refazer> */
  document.addEventListener('click', function (e) {
    var link = e.target && e.target.closest ? e.target.closest('[data-consent-refazer]') : null;
    if (!link) return;
    e.preventDefault();
    try { localStorage.removeItem(CHAVE); } catch (err) {}
    if (!document.querySelector('.ox-consent')) montarBanner();
  });

  if (!escolhaAtual) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', montarBanner);
    } else {
      montarBanner();
    }
  }
})();
