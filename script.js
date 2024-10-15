document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orcamento-form');
    const addItemButton = document.getElementById('add-item');
    const itensContainer = document.getElementById('itens-container');
    const valorTotalElement = document.getElementById('valor-total');

    let valorTotal = 0;

    // Função para atualizar o valor total
    const atualizarValorTotal = () => {
        valorTotalElement.textContent = valorTotal.toFixed(2);
    };

    // Função para adicionar um novo item
    addItemButton.addEventListener('click', () => {
        const quantidadeInput = itensContainer.querySelector('.quantidade');
        const valorInput = itensContainer.querySelector('.valor');

        if (quantidadeInput.value && valorInput.value) {
            const quantidade = parseInt(quantidadeInput.value);
            const valorUnitario = parseFloat(valorInput.value);
            const valorItem = quantidade * valorUnitario;

            valorTotal += valorItem;

            // Atualizar valor total
            atualizarValorTotal();

            // Adicionar novo item ao formulário
            const novoItem = document.createElement('div');
            novoItem.classList.add('item');
            novoItem.innerHTML = `
                <label>Quantidade:</label>
                <input type="number" class="quantidade" name="quantidade" min="1" required>
                <label>Descrição:</label>
                <input type="text" class="descricao" name="descricao" required>
                <label>Valor Unitário (R$):</label>
                <input type="number" class="valor" name="valor" min="0.01" step="0.01" required>
            `;
            itensContainer.appendChild(novoItem);

            // Limpar os campos do primeiro item
            quantidadeInput.value = '';
            valorInput.value = '';
        }
    });

    // Gerar PDF
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.addImage('img/template.png', 'PNG', 0, 0, 210, 297); // Adiciona a imagem de fundo do PDF

        const cliente = document.getElementById('cliente').value;
        doc.text(`Cliente: ${cliente}`, 10, 20);
        doc.text(`Valor Total: R$ ${valorTotal.toFixed(2)}`, 10, 30);

        // Adicionar itens ao PDF
        let y = 40;
        const items = itensContainer.querySelectorAll('.item');
        items.forEach((item) => {
            const quantidade = item.querySelector('.quantidade').value;
            const descricao = item.querySelector('.descricao').value;
            const valorUnitario = item.querySelector('.valor').value;
            const valorItem = (quantidade * valorUnitario).toFixed(2);
            doc.text(`Quantidade: ${quantidade}, Descrição: ${descricao}, Valor Unitário: R$ ${valorUnitario}, Valor Total: R$ ${valorItem}`, 10, y);
            y += 10;
        });

        doc.save('orcamento.pdf'); // Baixa o PDF
    });
});
