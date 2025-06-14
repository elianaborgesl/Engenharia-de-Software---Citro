// Variáveis globais
let estoque = [];
let editandoId = null;
let modalAction = null;
let modalParams = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
	carregarEstoque();
	atualizarListaEstoque();
});

// Função para gerar ID único
function gerarIdUnico() {
	return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Carregar estoque do localStorage
function carregarEstoque() {
	const estoqueSalvo = localStorage.getItem('estoqueSapatos');
	estoque = estoqueSalvo ? JSON.parse(estoqueSalvo) : [];
	return estoque;
}

// Salvar estoque no localStorage
function salvarEstoque() {
	localStorage.setItem('estoqueSapatos', JSON.stringify(estoque));
}

// Alternar entre URL e Upload de foto
function toggleFotoInput() {
	const urlContainer = document.getElementById('url-foto-container');
	const uploadContainer = document.getElementById('upload-foto-container');
	const urlChecked = document.getElementById('url-tipo').checked;
    
	urlContainer.classList.toggle('hidden', !urlChecked);
	uploadContainer.classList.toggle('hidden', urlChecked);
}

// Validar formulário
function validarFormulario() {
	let valido = true;
	const modelo = document.getElementById('modelo').value;
	const cor = document.getElementById('cor').value;
	const numeracao = document.getElementById('numeracao').value;
	const valor = document.getElementById('valor').value;
    
	// Limpar erros anteriores
	document.querySelectorAll('.error').forEach(el => el.textContent = '');
    
	if (!modelo) {
    	document.getElementById('modelo-error').textContent = 'Modelo é obrigatório';
    	valido = false;
	}
    
	if (!cor) {
    	document.getElementById('cor-error').textContent = 'Cor é obrigatória';
    	valido = false;
	}
    
	if (!numeracao) {
    	document.getElementById('numeracao-error').textContent = 'Numeração é obrigatória';
    	valido = false;
	}
    
	if (!valor || isNaN(valor) || parseFloat(valor) <= 0) {
    	document.getElementById('valor-error').textContent = 'Valor inválido';
    	valido = false;
	}
    
	return valido;
}

// Processar foto (URL ou Upload)
async function processarFoto() {
	const isUpload = document.getElementById('upload-tipo').checked;
    
	if (isUpload) {
    	const fileInput = document.getElementById('foto-upload');
    	if (fileInput.files && fileInput.files[0]) {
        	return await lerArquivoComoBase64(fileInput.files[0]);
    	}
	} else {
    	const url = document.getElementById('foto-url').value;
    	return url || 'https://via.placeholder.com/200?text=Sapato+sem+imagem';
	}
    
	return 'https://via.placeholder.com/200?text=Sapato+sem+imagem';
}

// Converter arquivo para Base64
function lerArquivoComoBase64(file) {
	return new Promise((resolve, reject) => {
    	const reader = new FileReader();
    	reader.onload = () => resolve(reader.result);
    	reader.onerror = error => reject(error);
    	reader.readAsDataURL(file);
	});
}

// Adicionar/Editar sapato
async function adicionarSapato() {
	if (!validarFormulario()) return;
    
	const modelo = document.getElementById('modelo').value;
	const cor = document.getElementById('cor').value;
	const numeracao = document.getElementById('numeracao').value;
	const valor = parseFloat(document.getElementById('valor').value);
	const foto = await processarFoto();
    
	if (editandoId) {
    	// Edição
    	const index = estoque.findIndex(s => s.id === editandoId);
    	if (index !== -1) {
        	estoque[index] = {
            	...estoque[index],
            	modelo,
            	cor,
            	numeracao,
            	valor,
            	foto
        	};
    	}
    	cancelarEdicao();
	} else {
    	// Novo item
    	const novoSapato = {
        	id: gerarIdUnico(),
        	modelo,
        	cor,
        	numeracao,
        	valor,
        	foto,
        	dataCadastro: new Date().toLocaleString()
    	};
    	estoque.push(novoSapato);
	}
    
	salvarEstoque();
	atualizarListaEstoque();
	limparFormulario();
}

// Editar sapato
function editarSapato(id) {
	const sapato = estoque.find(s => s.id === id);
	if (!sapato) return;
    
	editandoId = id;
	document.getElementById('sapato-id').value = id;
	document.getElementById('modelo').value = sapato.modelo;
	document.getElementById('cor').value = sapato.cor;
	document.getElementById('numeracao').value = sapato.numeracao;
	document.getElementById('valor').value = sapato.valor;
    
	// Verificar se a foto é base64 (upload) ou URL
	if (sapato.foto.startsWith('data:image')) {
    	document.getElementById('upload-tipo').checked = true;
    	toggleFotoInput();
    	// Não podemos colocar o base64 no input file, mas mostramos que foi um upload
	} else {
    	document.getElementById('url-tipo').checked = true;
    	document.getElementById('foto-url').value = sapato.foto;
    	toggleFotoInput();
	}
    
	document.getElementById('form-title').textContent = 'Editar Sapato';
	document.getElementById('btn-adicionar').textContent = 'Salvar Alterações';
	document.getElementById('btn-cancelar').classList.remove('hidden');
    
	// Scroll para o formulário
	document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
}

// Cancelar edição
function cancelarEdicao() {
	editandoId = null;
	document.getElementById('form-title').textContent = 'Adicionar Novo Sapato';
	document.getElementById('btn-adicionar').textContent = 'Adicionar ao Estoque';
	document.getElementById('btn-cancelar').classList.add('hidden');
	limparFormulario();
}

// Limpar formulário
function limparFormulario() {
	document.getElementById('modelo').value = '';
	document.getElementById('cor').value = '';
	document.getElementById('numeracao').value = '';
	document.getElementById('valor').value = '';
	document.getElementById('foto-url').value = '';
	document.getElementById('foto-upload').value = '';
	document.getElementById('url-tipo').checked = true;
	toggleFotoInput();
	document.querySelectorAll('.error').forEach(el => el.textContent = '');
}

// Abrir modal de confirmação
function abrirModal(mensagem, action, params = null) {
	modalAction = action;
	modalParams = params;
	document.getElementById('modal-message').textContent = mensagem;
	document.getElementById('confirm-modal').style.display = 'block';
}

// Fechar modal
function fecharModal() {
	document.getElementById('confirm-modal').style.display = 'none';
	modalAction = null;
	modalParams = null;
}

// Confirmar ação no modal
function confirmarAcao() {
	if (modalAction) {
    	modalAction(modalParams);
	}
	fecharModal();
}

// Remover sapato
function removerSapato(id) {
	abrirModal('Tem certeza que deseja remover este sapato do estoque?', confirmarRemocao, id);
}

// Confirmação de remoção
function confirmarRemocao(id) {
	estoque = estoque.filter(sapato => sapato.id !== id);
	salvarEstoque();
	atualizarListaEstoque();
}

// Filtrar estoque
function filtrarEstoque() {
	const filtroModelo = document.getElementById('filtro-modelo').value.toLowerCase();
	const filtroCor = document.getElementById('filtro-cor').value.toLowerCase();
	const filtroNumeracao = document.getElementById('filtro-numeracao').value;
    
	const estoqueFiltrado = carregarEstoque().filter(sapato => {
    	const modeloMatch = sapato.modelo.toLowerCase().includes(filtroModelo);
    	const corMatch = sapato.cor.toLowerCase().includes(filtroCor);
    	const numeracaoMatch = filtroNumeracao ? sapato.numeracao === filtroNumeracao : true;
   	 
    	return modeloMatch && corMatch && numeracaoMatch;
	});
    
	renderizarListaEstoque(estoqueFiltrado);
}

// Limpar filtros
function limparFiltros() {
	document.getElementById('filtro-modelo').value = '';
	document.getElementById('filtro-cor').value = '';
	document.getElementById('filtro-numeracao').value = '';
	atualizarListaEstoque();
}

// Atualizar lista de estoque
function atualizarListaEstoque() {
	renderizarListaEstoque(estoque);
}

// Renderizar lista de estoque
function renderizarListaEstoque(lista) {
	const listaSapatos = document.getElementById('lista-sapatos');
	listaSapatos.innerHTML = '';
    
	document.getElementById('total-itens').textContent = lista.length;
    
	if (lista.length === 0) {
    	listaSapatos.innerHTML = '<p>Nenhum sapato encontrado.</p>';
    	return;
	}
    
	lista.forEach(sapato => {
    	const sapatoCard = document.createElement('div');
    	sapatoCard.className = 'sapato-card';
   	 
    	sapatoCard.innerHTML = `
        	<img src="${sapato.foto}" alt="${sapato.modelo}">
        	<h3>${sapato.modelo}</h3>
        	<p><strong>Cor:</strong> ${sapato.cor}</p>
        	<p><strong>Numeração:</strong> ${sapato.numeracao}</p>
        	<p><strong>Valor:</strong> R$ ${sapato.valor.toFixed(2)}</p>
        	<p><small>Cadastrado em: ${sapato.dataCadastro}</small></p>
        	<div class="acoes">
            	<button class="btn-secondary" onclick="editarSapato('${sapato.id}')">Editar</button>
            	<button class="btn-danger" onclick="removerSapato('${sapato.id}')">Remover</button>
        	</div>
    	`;
   	 
    	listaSapatos.appendChild(sapatoCard);
	});
}

// Exportar estoque para JSON
function exportarEstoque() {
	const dataStr = JSON.stringify(estoque, null, 2);
	const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
	const exportFileDefaultName = `estoque-sapatos-${new Date().toISOString().slice(0,10)}.json`;
    
	const linkElement = document.createElement('a');
	linkElement.setAttribute('href', dataUri);
	linkElement.setAttribute('download', exportFileDefaultName);
	linkElement.click();
}

// Importar estoque de JSON
function importarEstoque(input) {
	const file = input.files[0];
	if (!file) return;
    
	abrirModal('Importar estoque substituirá todos os dados atuais. Continuar?', confirmarImportacao, file);
    
	// Limpar o input para permitir nova seleção do mesmo arquivo
	input.value = '';
}

// Confirmar importação
function confirmarImportacao(file) {
	const reader = new FileReader();
	reader.onload = function(e) {
    	try {
        	const novoEstoque = JSON.parse(e.target.result);
        	if (Array.isArray(novoEstoque)) {
            	estoque = novoEstoque;
            	salvarEstoque();
            	atualizarListaEstoque();
            	alert('Estoque importado com sucesso!');
        	} else {
            	throw new Error('Formato inválido');
        	}
    	} catch (error) {
        	alert('Erro ao importar estoque: arquivo inválido');
        	console.error(error);
    	}
	};
	reader.readAsText(file);
}

