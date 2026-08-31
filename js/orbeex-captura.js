/* =========================================================================
   Captura de e-mail da ORBEEX
   -------------------------------------------------------------------------
   Monta o formulário dentro de qualquer <div class="ox-captura" data-modo="...">
   e entrega a inscrição por e-mail via Web3Forms (mesma chave do formulário
   de contato). Cada inscrição chega em luana.civardi@orbeex.com.br com o
   assunto identificando a origem, pra você montar a lista.

   PARA MIGRAR PRA UM SERVIÇO DE E-MAIL MARKETING (MailerLite, Brevo...):
   troque só a função `entregar()` no fim deste arquivo. O visual, a
   validação e as mensagens continuam iguais.

   Modos disponíveis (atributo data-modo no elemento):
     "isca"   → entrega o guia das 10 não conformidades (padrão)
     "espera" → lista de espera do Pack Certificação SGQ
   ========================================================================= */
(function () {
  'use strict';

  var CHAVE = '2025e857-c051-4472-9b60-1570e1ab978d';
  var EMAIL = 'luana.civardi@orbeex.com.br';
  var GUIA = '/guia/nao-conformidades-iso-9001/';

  var MODOS = {
    isca: {
      kicker: 'Material gratuito',
      titulo: 'As 10 não conformidades mais comuns em auditoria ISO 9001',
      sub: 'O que o auditor encontra, por que acontece e como corrigir antes de virar constatação no relatório. Escrito a partir de auditoria real, não de teoria de norma.',
      itens: [
        'As dez constatações que mais se repetem, com o requisito de cada uma',
        'A causa por trás de cada uma — quase nunca é falta de conhecimento técnico',
        'A correção estrutural, não o remendo que fecha o registro'
      ],
      botao: 'Quero o guia gratuito',
      nota: 'Sem spam. Você recebe o guia e, no máximo, uma newsletter por mês.',
      assunto: 'Nova inscrição — guia das 10 não conformidades',
      evento: 'lead_isca',
      sucessoTitulo: 'Pronto, {nome}. O guia está liberado.',
      sucessoTexto: 'Guardei seu contato. Abra o guia agora — ele fica salvo nesse endereço, então dá pra voltar quando quiser.',
      destino: GUIA,
      destinoRotulo: 'Abrir o guia agora'
    },
    espera: {
      kicker: 'Lista de espera',
      titulo: 'Quer ser avisada quando o Pack Certificação SGQ sair?',
      sub: 'O pacote completo para quem vai buscar a certificação ISO 9001 do zero. Ainda está em produção — quem entrar na lista recebe o aviso antes e a condição de lançamento.',
      itens: [
        'Aviso antes de abrir para o público geral',
        'Condição de lançamento reservada para a lista',
        'Nenhuma cobrança e nenhum compromisso agora'
      ],
      botao: 'Avise-me quando lançar',
      nota: 'Só te escrevo quando tiver novidade real sobre o pacote.',
      assunto: 'Lista de espera — Pack Certificação SGQ',
      evento: 'lista_espera',
      sucessoTitulo: 'Anotado, {nome}.',
      sucessoTexto: 'Você entra na lista do Pack Certificação SGQ. Enquanto isso, os dois kits que já existem estão na página de produtos.',
      destino: '/produtos/',
      destinoRotulo: 'Ver os produtos disponíveis'
    }
  };

  var SVG_SETA = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var SVG_CHECK = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function montar(caixa, cfg, id) {
    caixa.innerHTML =
      '<div class="ox-captura-grade">' +
        '<div>' +
          '<p class="ox-captura-kicker">' + cfg.kicker + '</p>' +
          '<p class="ox-titulo">' + cfg.titulo + '</p>' +
          '<p class="ox-sub">' + cfg.sub + '</p>' +
          '<ul class="ox-itens">' + cfg.itens.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>' +
        '</div>' +
        '<form class="ox-captura-form" novalidate>' +
          '<div class="ox-captura-erro" role="alert" aria-live="polite"></div>' +
          '<div>' +
            '<label for="' + id + '-nome">Seu nome</label>' +
            '<input type="text" id="' + id + '-nome" name="nome" placeholder="Como posso te chamar" autocomplete="given-name" required>' +
          '</div>' +
          '<div>' +
            '<label for="' + id + '-email">Seu melhor e-mail</label>' +
            '<input type="email" id="' + id + '-email" name="email" placeholder="voce@empresa.com.br" autocomplete="email" required>' +
          '</div>' +
          '<div class="ox-hp" aria-hidden="true">' +
            '<label for="' + id + '-site">Não preencha este campo</label>' +
            '<input type="text" id="' + id + '-site" name="site" tabindex="-1" autocomplete="off">' +
          '</div>' +
          '<div class="ox-captura-consent">' +
            '<input type="checkbox" id="' + id + '-ok">' +
            '<label for="' + id + '-ok">Autorizo a ORBEEX a usar meu e-mail para enviar este material e comunicações ocasionais, conforme a <a href="/privacidade/">Política de Privacidade</a>. Posso sair quando quiser.</label>' +
          '</div>' +
          '<button type="submit" class="ox-captura-btn"><span class="ox-btn-txt">' + cfg.botao + '</span>' + SVG_SETA + '</button>' +
          '<p class="ox-captura-nota">' + cfg.nota + '</p>' +
        '</form>' +
      '</div>';
  }

  function sucesso(caixa, cfg, nome) {
    var primeiro = esc(String(nome).trim().split(/\s+/)[0] || '');
    caixa.innerHTML =
      '<div class="ox-captura-ok" role="status">' +
        '<div class="ox-check" aria-hidden="true">' + SVG_CHECK + '</div>' +
        '<h3>' + cfg.sucessoTitulo.replace('{nome}', primeiro) + '</h3>' +
        '<p>' + cfg.sucessoTexto + '</p>' +
        '<a class="ox-link-guia" href="' + cfg.destino + '">' + cfg.destinoRotulo + SVG_SETA + '</a>' +
      '</div>';
  }

  /* Único ponto de integração: troque isto para migrar de serviço. */
  function entregar(cfg, dados) {
    return fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: CHAVE,
        subject: '[Lista ORBEEX] ' + cfg.assunto,
        from_name: 'Site ORBEEX',
        name: dados.nome,
        email: dados.email,
        origem: dados.origem,
        pagina: dados.pagina,
        message: 'Nova inscrição pela ' + dados.origem + ' (' + dados.pagina + ').'
      })
    }).then(function (r) {
      return r.json().catch(function () { return { success: r.ok }; });
    }).then(function (resposta) {
      if (!resposta || !resposta.success) { throw new Error('falha no envio'); }
      return true;
    });
  }

  function ligar(caixa, indice) {
    var modo = caixa.getAttribute('data-modo') || 'isca';
    var cfg = MODOS[modo];
    if (!cfg) { return; }

    var id = 'ox-' + modo + '-' + indice;
    var origem = caixa.getAttribute('data-origem') || modo;
    montar(caixa, cfg, id);

    var form = caixa.querySelector('form');
    var erro = caixa.querySelector('.ox-captura-erro');
    var botao = caixa.querySelector('.ox-captura-btn');
    var btnTxt = caixa.querySelector('.ox-btn-txt');

    function mostrarErro(html) {
      erro.innerHTML = html;
      erro.classList.add('ox-visivel');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      erro.classList.remove('ox-visivel');

      var nome = (document.getElementById(id + '-nome').value || '').trim();
      var email = (document.getElementById(id + '-email').value || '').trim();
      var isca = (document.getElementById(id + '-site').value || '').trim();

      if (!nome) { return mostrarErro('Me diz seu nome pra eu saber como te chamar.'); }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        return mostrarErro('Confira o e-mail: ele parece incompleto, e é por ele que o material chega.');
      }
      if (!document.getElementById(id + '-ok').checked) {
        return mostrarErro('Marque a autorização de uso do e-mail para eu poder te enviar o material.');
      }

      /* Campo isca preenchido = robô. Fingimos sucesso e não enviamos nada. */
      if (isca) { return sucesso(caixa, cfg, nome); }

      botao.disabled = true;
      btnTxt.textContent = 'Enviando…';

      if (window.orbeexEvento) {
        window.orbeexEvento(cfg.evento, { item: origem });
      }

      entregar(cfg, { nome: nome, email: email, origem: origem, pagina: location.pathname })
        .then(function () { sucesso(caixa, cfg, nome); })
        .catch(function () {
          botao.disabled = false;
          btnTxt.textContent = cfg.botao;
          mostrarErro(
            'Não consegui registrar agora — pode ser instabilidade de conexão. Tente de novo em instantes, ' +
            'ou escreva para <a href="mailto:' + EMAIL + '?subject=' +
            encodeURIComponent(cfg.assunto) + '">' + EMAIL + '</a> que eu envio na mão.'
          );
        });
    });
  }

  function iniciar() {
    var caixas = document.querySelectorAll('.ox-captura');
    for (var i = 0; i < caixas.length; i++) { ligar(caixas[i], i); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
