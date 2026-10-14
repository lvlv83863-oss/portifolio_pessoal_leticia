const NASCIMENTO = new Date(2007, 0, 1);

function calcularIdade(nascimento) {
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
  if (aindaNaoFezAniversario) idade--;
  return idade;
}

document.getElementById('idade').textContent = calcularIdade(NASCIMENTO);
document.getElementById('ano').textContent = new Date().getFullYear();

const raiz = document.documentElement;
const botaoClaro = document.getElementById('tema-claro');
const botaoEscuro = document.getElementById('tema-escuro');

function aplicarTema(tema) {
  raiz.setAttribute('data-theme', tema);
  botaoClaro.setAttribute('aria-pressed', tema === 'light');
  botaoEscuro.setAttribute('aria-pressed', tema === 'dark');
  try { localStorage.setItem('tema', tema); } catch (e) {}
}

let temaSalvo = 'dark';
try { temaSalvo = localStorage.getItem('tema') || 'dark'; } catch (e) {}
aplicarTema(temaSalvo);

botaoClaro.addEventListener('click', () => aplicarTema('light'));
botaoEscuro.addEventListener('click', () => aplicarTema('dark'));

document.querySelectorAll('.card__botao').forEach((botao) => {
  botao.addEventListener('click', () => {
    const card = botao.closest('.card');
    const abrir = botao.getAttribute('aria-expanded') === 'false';
    card.classList.toggle('aberto', abrir);
    botao.setAttribute('aria-expanded', abrir);
    botao.firstChild.textContent = abrir ? 'Fechar detalhes ' : 'Ver detalhes ';
  });
});
const linksMenu = document.querySelectorAll('.menu a');
const secoes = [...linksMenu].map((link) => document.querySelector(link.getAttribute('href')));

function atualizarMenu() {
  let atual = secoes[0].id;
  secoes.forEach((secao) => {
    if (secao.getBoundingClientRect().top < window.innerHeight * 0.4) atual = secao.id;
  });
  linksMenu.forEach((link) => {
    link.classList.toggle('ativo', link.getAttribute('href') === '#' + atual);
  });
}

window.addEventListener('scroll', atualizarMenu, { passive: true });
atualizarMenu();

document.getElementById('botao-topo').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const avisoCopiado = document.getElementById('aviso-copiado');
const textoAviso = avisoCopiado.querySelector('span');
let temporizadorAviso;

function mostrarAviso(mensagem) {
  textoAviso.textContent = mensagem;
  avisoCopiado.classList.add('visivel');
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => avisoCopiado.classList.remove('visivel'), 2500);
}

function copiarComPlanoB(texto) {
  const campo = document.createElement('textarea');
  campo.value = texto;
  campo.setAttribute('readonly', '');
  campo.className = 'visualmente-oculto';
  document.body.appendChild(campo);
  campo.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
  document.body.removeChild(campo);
  return ok;
}

document.querySelectorAll('[data-email]').forEach((botao) => {
  botao.addEventListener('click', async () => {
    const email = botao.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      mostrarAviso('E-mail copiado!');
    } catch (erro) {
      mostrarAviso(copiarComPlanoB(email) ? 'E-mail copiado!' : 'Não foi possível copiar');
    }
  });
});