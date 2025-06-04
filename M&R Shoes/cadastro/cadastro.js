document.addEventListener('DOMContentLoaded', function() {
    let contadorId = 0;
    // Função para adicionar novo produto
    function adicionarProduto(event) {
        event.preventDefault();
        
        // Validação do formulário
        if (!document.getElementById('formNovoProduto').checkValidity()) {
            alert('Por favor, preencha todos os campos obrigatórios!');
            return;
        }
        
        // Incrementa o contador
        contadorId++;
        
        // Atualiza no localStorage
        localStorage.setItem('contadorIdProdutos', contadorId);
        
        // Coleta dos dados do formulário
        const novoProduto = {
            id: contadorId, // ID numérico progressivo (1, 2, 3...)
            quantidade: document.getElementById('productQuantity').value,
            cor: document.getElementById('productColor').value,
            numeracao: document.getElementById('productSize').value,
            modelo: document.getElementById('productModel').value,
            imagem: document.getElementById('productImage').files[0] 
                ? URL.createObjectURL(document.getElementById('productImage').files[0]) 
                : `https://via.placeholder.com/300x200?text=Produto+${contadorId}`
        };
        
        // Cria o HTML do novo produto
        const novoProdutoHTML = `
            <div class="col novo-produto">
                <div class="card h-100">
                    <img src="${novoProduto.imagem}" class="card-img-top" alt="Foto do Produto">
                    <div class="card-body">
                        <h5 class="card-title">${novoProduto.nome}</h5>
                        <div class="product-info">
                            <span class="info-label">ID:</span> ${novoProduto.id}
                        </div>
                        <div class="product-info">
                            <span class="info-label">Quantidade:</span> ${novoProduto.quantidade}
                        </div>
                        <div class="product-info">
                            <span class="info-label">Cor:</span> ${novoProduto.cor}
                        </div>
                        <div class="product-info">
                            <span class="info-label">Numeração:</span> ${novoProduto.numeracao}
                        </div>
                        <div class="product-info">
                            <span class="info-label">Modelo:</span> ${novoProduto.modelo}
                        </div>
                    </div>
                    <div class="card-footer bg-transparent">
                        <button class="btn btn-primary w-100" onclick="editarProduto(${novoProduto.id})">Editar</button>
                    </div>
                </div>
            </div>
        `;
        
        // Adiciona à lista
        document.getElementById('lista-produtos').insertAdjacentHTML('afterbegin', novoProdutoHTML);
        
        // Fecha o modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
        modal.hide();
        
        // Limpa o formulário
        document.getElementById('formNovoProduto').reset();
        
        // Rolagem suave para o novo produto
        document.querySelector('.novo-produto').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Event Listeners
    document.getElementById('btnSalvarProduto').addEventListener('click', adicionarProduto);
    
    // Função de edição
    window.editarProduto = function(id) {
        console.log(`Editando produto ID: ${id}`);
        alert(`Abrindo edição do produto ID: ${id}`);
    };
});