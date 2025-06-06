let estoque = [];
let editandoId = null;
let modalAction = null;
let modalParams = null;

// Inicialização  
document.addEventListener('DOMContentLoaded', () => {
    carregarEstoque();
    atualizarListaEstoque();
});

// Função para gerar ID único
function gerarIdUnico() {
	return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Carregar estoque do localStorage
function carregarEstoque() {
    const dados = localStorage.getItem("estoqueSapatos");
    estoque = dados ? JSON.parse(dados) : [];
    console.log("Dados carregados:", estoque); 
}

// Salvar estoque no localStorage
function salvarEstoque() {
    localStorage.setItem('estoqueSapatos', JSON.stringify(estoque));
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
    
    const fileInput = document.getElementById('foto-upload');
    if (!fileInput.files || !fileInput.files[0]) {
        document.getElementById('foto-error').textContent = 'Foto é obrigatória';
        valido = false;
    }
    
	return valido;
}

// Processar foto (Upload)
async function processarFoto() {
    const fileInput = document.getElementById('foto-upload');
    if (fileInput.files && fileInput.files[0]) {
        return await lerArquivoComoBase64(fileInput.files[0]);
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
async function adicionarSapato(){
    if (!validarFormulario()) return;

    let modelo = document.getElementById('modelo').value;
    let cor = document.getElementById('cor').value;
    let numeracao = document.getElementById('numeracao').value;
    let valor = parseFloat(document.getElementById('valor').value);
	let quantidade = document.getElementById('quantidade').value
    let foto = await processarFoto();

    // Novo cadastro
    const novoSapato = {
        id: gerarIdUnico(),
        modelo,
        cor,
        numeracao,
        valor,
		quantidade,
        foto,
        dataCadastro: new Date().toLocaleString()
    };

    estoque.push(novoSapato);
    salvarEstoque();
    limparFormulario();
        
    // REDIRECIONAMENTO IMEDIATO
    window.location.href = '#produtos';
	atualizarListaEstoque();
    
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
	document.getElementById('quantidade').value = sapato.quantidade;
    
	  document.getElementById('foto-upload').value = '';

	document.getElementById('form-title').textContent = 'Editar Sapato';
	document.getElementById('btn-adicionar').textContent = 'Salvar Alterações';
	document.getElementById('btn-cancelar').classList.remove('hidden');
    
	// Scroll para o formulário
	document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
}

// Limpar formulário
function limparFormulario() {
	document.getElementById('modelo').value = '';
    document.getElementById('cor').value = '';
    document.getElementById('numeracao').value = '';
    document.getElementById('valor').value = '';
	document.getElementById('quantidade').value = '';
    document.getElementById('foto-upload').value = '';
    
    document.getElementById('modelo-error').textContent = '';
    document.getElementById('cor-error').textContent = '';
    document.getElementById('numeracao-error').textContent = '';
    document.getElementById('valor-error').textContent = '';
    document.getElementById('foto-error').textContent = '';
    
    /*if (editandoId) {
        document.getElementById('form-title').textContent = 'Adicionar Novo Sapato';
        document.getElementById('btn-adicionar').textContent = 'Adicionar ao Estoque';
        document.getElementById('btn-cancelar').classList.add('hidden');
        editandoId = null;
    }*/
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

// Renderizar lista de estoque
function atualizarListaEstoque() {
    carregarEstoque(); // Recarrega os dados
    
    const listaSapatos = document.getElementById('listaSapatos');
    const totalItens = document.getElementById('total-itens');
    
    // Verificação robusta dos elementos DOM
    if (!listaSapatos || !totalItens) {
        console.error("Elementos não encontrados!");
        return;
    }
    
    // Limpa a lista
    listaSapatos.innerHTML = '';
    
    // Atualiza contador
    totalItens.textContent = estoque.length.toString();
    
    // Trata estoque vazio
    if (estoque.length === 0) {
        listaSapatos.innerHTML = '<div class="col-12"><p class="text-center py-4">Nenhum sapato encontrado.</p></div>';
        return;
    }
    
    // Gera os cards
    estoque.forEach(sapato => {
        // Tratamento para valores undefined
        const foto = sapato.foto || "placeholder.jpg";
        const modelo = sapato.modelo || "Modelo desconhecido";
        const valor = sapato.valor ? sapato.valor.toFixed(2) : "0.00";
		const quantidade = sapato.quantidade || "0";
        const data = sapato.dataCadastro || "Data desconhecida";
        
        const sapatoCard = document.createElement('div');
        sapatoCard.className = 'col-md-3 mb-4';
        sapatoCard.innerHTML = `
            <div class="card h-100">
                <img src="${foto}" class="card-img-top" alt="${modelo}" style="height: 200px; object-fit: cover">
                <div class="card-body">
                    <h5 class="card-title"><strong>${modelo}</strong></h5>
                    <p class="card-text" style="margin-bottom: 0px"><strong>COR:</strong> ${sapato.cor || "Não informada"}</p>
                    <p class="card-text" style="margin-bottom: 0px"><strong>NUMERAÇÃO:</strong> ${sapato.numeracao || "N/I"}</p>
                    <p class="card-text" style="margin-bottom: 0px"><strong>VALOR:</strong> R$ ${valor}</p>
					<p class="card-text"><strong>QUANTIDADE:</strong> ${quantidade}</p>
                    <p class="card-text"><small class="text-muted">Cadastrado em: ${data}</small></p>
                </div>
                <div class="card-footer bg-white" style="display: flex; justify-content: center">
                    <div class="d-grid gap-2 d-md-flex">
                        <button class="btn btn-outline-primary btn-lg" data-id="${sapato.id}" id="btn-editar">Editar</button>
                        <button class="btn btn-outline-danger btn-lg" data-id="${sapato.id}" id="btn-remover">Remover</button>
						<button class="btn btn-outline-success btn-lg" data-id="${sapato.id}" id="btn-venda">Venda</button>
                    </div>
                </div>
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

