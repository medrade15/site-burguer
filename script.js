const lanches = [
    { 
        id: 1,
        nome: 'Fire Sky Burge', 
        preco: 22.90, 
        descricao: 'Um hambúrguer picante com pimenta jalapeño, queijo pepper jack e molho especial de chipotle.',
        imagem: 'https://www.estilozzo.com/wp-content/uploads/2020/05/Original-Burger_-Thiago-Melo-scaled.jpg'
    },
    { 
        id: 2,
        nome: 'Classic American Burger', 
        preco: 19.90, 
        descricao: 'Um hambúrguer tradicional de 200g com alface, tomate, queijo cheddar e molho barbecue.',
        imagem: 'https://static.itdg.com.br/images/auto-auto/14cca074c0f16f3e840e06f2b7fbdd66/shutterstock-614932352.jpg'
    },
    { 
        id: 3,
        nome: 'Bacon Delight', 
        preco: 21.50, 
        descricao: 'Hambúrguer suculento coberto com fatias generosas de bacon crocante e queijo derretido.',
        imagem: 'https://s2-casavogue.glbimg.com/GRF9KCq-1hiz5uSs-xX9Go_KqIc=/0x0:2048x1365/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_d72fd4bf0af74c0c89d27a5a226dbbf8/internal_photos/bs/2022/p/X/eb4KQdToys327cGqnRGg/receita-ceboloni-bacon.jpg'
    },
    { 
        id: 4,
        nome: 'Veggie Supreme', 
        preco: 18.90, 
        descricao: 'Hambúrguer vegetariano com patty de grão-de-bico, abobrinha grelhada, queijo de cabra e molho pesto',
        imagem: 'https://guiadacozinha.com.br/wp-content/uploads/2020/03/hamburguer-de-quinoa-vegetariano.jpg'
    }
];

const lancheLista = document.getElementById('lanche-lista');
const pedidoLista = document.getElementById('pedido-lista');
const subtotalSpan = document.getElementById('subtotal');
const totalSpan = document.getElementById('total');
const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
const modal = document.getElementById('modal');
const modalPedidoLista = document.getElementById('modal-pedido-lista');
const modalSubtotalSpan = document.getElementById('modal-subtotal');
const modalTotalSpan = document.getElementById('modal-total');
const confirmarPedidoBtn = document.getElementById('confirmar-pedido');
const cancelarPedidoBtn = document.getElementById('cancelar-pedido');
const enderecoInput = document.getElementById('endereco');

const TAXA_ENTREGA = 5.00;
let pedido = JSON.parse(localStorage.getItem('pedido')) || [];

function salvarPedido() {
    localStorage.setItem('pedido', JSON.stringify(pedido));
}

function atualizarTotal() {
    const subtotal = pedido.reduce((sum, item) => sum + item.preco, 0);
    const total = subtotal + TAXA_ENTREGA;
    subtotalSpan.textContent = subtotal.toFixed(2);
    totalSpan.textContent = total.toFixed(2);
}

function removerDoPedido(index) {
    pedido.splice(index, 1);
    salvarPedido();
    atualizarPedidoLista();
    atualizarTotal();
}

function atualizarPedidoLista() {
    pedidoLista.innerHTML = '';
    pedido.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'pedido-item';
        li.innerHTML = `
            <div>
                <strong>${item.nome}</strong> - R$ ${item.preco.toFixed(2)}
                ${item.obs ? `<p class="pedido-item-obs">Obs: ${item.obs}</p>` : ''}
            </div>
            <button class="remover-item" data-index="${index}">X</button>
        `;
        pedidoLista.appendChild(li);
    });

    document.querySelectorAll('.remover-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            removerDoPedido(index);
        });
    });
}

function adicionarAoPedido(lanche, obs) {
    const itemPedido = { ...lanche, obs };
    pedido.push(itemPedido);
    salvarPedido();
    atualizarPedidoLista();
    atualizarTotal();

    if (window.innerWidth <= 768) {
        const pedidoSection = document.getElementById('pedido');
        pedidoSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function atualizarModalPedido() {
    modalPedidoLista.innerHTML = '';
    pedido.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${item.nome}</strong> - R$ ${item.preco.toFixed(2)}
            ${item.obs ? `<p class="pedido-item-obs">Obs: ${item.obs}</p>` : ''}
        `;
        modalPedidoLista.appendChild(li);
    });

    const subtotal = pedido.reduce((sum, item) => sum + item.preco, 0);
    const total = subtotal + TAXA_ENTREGA;
    modalSubtotalSpan.textContent = subtotal.toFixed(2);
    modalTotalSpan.textContent = total.toFixed(2);
}

function inicializarLanches() {
    lancheLista.innerHTML = '';
    lanches.forEach(lanche => {
        const lancheItem = document.createElement('div');
        lancheItem.className = 'lanche-item';
        
        lancheItem.innerHTML = `
            <img src="${lanche.imagem}" alt="${lanche.nome}" class="lanche-imagem">
            <div class="lanche-info">
                <h3 class="lanche-nome">${lanche.nome}</h3>
                <p class="lanche-descricao">${lanche.descricao}</p>
                <p class="lanche-preco">R$ ${lanche.preco.toFixed(2)}</p>
                <textarea class="lanche-obs" placeholder="Alguma observação?"></textarea>
                <button class="adicionar-lanche" data-id="${lanche.id}">Adicionar ao Pedido</button>
            </div>
        `;
        
        lancheLista.appendChild(lancheItem);
    });
}

lancheLista.addEventListener('click', (e) => {
    if (e.target.classList.contains('adicionar-lanche')) {
        const lancheId = parseInt(e.target.getAttribute('data-id'));
        const lanche = lanches.find(l => l.id === lancheId);
        const obs = e.target.parentElement.querySelector('.lanche-obs').value.trim();
        adicionarAoPedido(lanche, obs);
        e.target.parentElement.querySelector('.lanche-obs').value = ''; 
    }    
});

finalizarPedidoBtn.addEventListener('click', () => {
    if (pedido.length === 0) {
        alert('Seu pedido está vazio!');
        return;
    }
    atualizarModalPedido();
    modal.style.display = 'block';
});

confirmarPedidoBtn.addEventListener('click', () => {
    const endereco = enderecoInput.value.trim();
    const formaPagamento = document.querySelector('input[name="forma-pagamento"]:checked');

    if (!endereco) {
        alert('Por favor, preencha o endereço de entrega.');
        return;
    }

    if (!formaPagamento) {
        alert('Por favor, selecione uma forma de pagamento.');
        return;
    }

    const dataHora = new Date().toLocaleString('pt-BR');
    const pedidoFormatado = pedido.map((item, index) => 
        `${index + 1}. ${item.nome}\nPreço: R$ ${item.preco.toFixed(2)}${item.obs ? `\nObservação: ${item.obs}` : ''}`
    ).join('\n\n');
    const subtotal = pedido.reduce((sum, item) => sum + item.preco, 0);
    const total = subtotal + TAXA_ENTREGA;

    const mensagem = encodeURIComponent(
`Novo Pedido - King Burger
Data e Hora: ${dataHora}

Itens do Pedido:
${pedidoFormatado}

Subtotal: R$ ${subtotal.toFixed(2)}
Taxa de Entrega: R$ ${TAXA_ENTREGA.toFixed(2)}
Total do Pedido: R$ ${total.toFixed(2)}

Endereço de Entrega:
${endereco}

Forma de Pagamento:
${formaPagamento.value}

Agradecemos pela sua preferência!`
    );

    const numeroWhatsApp = '5561996125274'; 

    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensagem}`);

    
    pedido = [];
    salvarPedido();
    atualizarPedidoLista();
    atualizarTotal();
    modal.style.display = 'none';
});

cancelarPedidoBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});


window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    inicializarLanches();
    atualizarPedidoLista();
    atualizarTotal();
});