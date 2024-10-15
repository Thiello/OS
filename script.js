document.addEventListener('DOMContentLoaded', () => {
    const addItemButton = document.getElementById('add-item');
    const valorTotalElement = document.getElementById('valor-total');
    let itens = [];

    // Função para capturar os dados preenchidos no formulário
    function capturarItemAtual() {
        const quantidade = parseInt(document.querySelector('.quantidade').value);
        const descricao = document.querySelector('.descricao').value;
        const valor = parseFloat(document.querySelector('.valor').value);

        if (!isNaN(quantidade) && descricao && !isNaN(valor)) {
            return {
                quantidade: quantidade,
                descricao: descricao,
                valor: valor
            };
        }
        return null;
    }

    // Função para limpar os campos do formulário
    function limparFormulario() {
        document.querySelector('.quantidade').value = '';
        document.querySelector('.descricao').value = '';
        document.querySelector('.valor').value = '';
    }

    // Função para adicionar o item e limpar o formulário
    addItemButton.addEventListener('click', () => {
        const itemAtual = capturarItemAtual();

        if (itemAtual) {
            itens.push(itemAtual);  // Adiciona o item à lista
            limparFormulario();  // Limpa o formulário
            calcularValorTotal();  // Atualiza o valor total
        } else {
            alert('Por favor, preencha todos os campos corretamente antes de adicionar o item.');
        }
    });

    // Função para calcular o valor total
    function calcularValorTotal() {
        let total = 0;

        // Soma os itens já adicionados
        itens.forEach(item => {
            total += item.quantidade * item.valor;
        });

        valorTotalElement.textContent = `R$ ${total.toFixed(2)}`; // Exibe o total formatado
    }

    // Função para gerar o PDF
    document.getElementById('orcamento-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const cliente = document.getElementById('cliente').value;

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFont('Arial'); // Define a fonte
        doc.setFontSize(10); // Define o tamanho da fonte

        // Carregar o template de fundo
        const img = new Image();
        img.src = '/img/template.png';  // Caminho para a sua imagem

        img.onload = function () {
            // Adiciona a imagem de fundo
            doc.addImage(img, 'PNG', 0, 0, 210, 297); // Ajuste as dimensões e posição conforme necessário

            // Exibe o nome do cliente
            doc.text(`${cliente}`, 35, 68.5); // Ajuste a posição conforme necessário

            // Coordenadas específicas para cada item
            const itemCoords = [
                { xQuantidade: 23, yQuantidade: 82.5, xDescricao: 35, yDescricao: 82.5, xValor: 140, yValor: 82.5 },
                { xQuantidade: 23, yQuantidade: 87, xDescricao: 35, yDescricao: 87, xValor: 140, yValor: 87 },
                { xQuantidade: 23, yQuantidade: 91.5, xDescricao: 35, yDescricao: 91.5, xValor: 140, yValor: 91.5 },
                { xQuantidade: 23, yQuantidade: 96, xDescricao: 35, yDescricao: 96, xValor: 140, yValor: 96 },
                { xQuantidade: 23, yQuantidade: 100.5, xDescricao: 35, yDescricao: 100.5, xValor: 140, yValor: 100.5 }
            ];

            // Insere os itens no PDF
            itens.forEach((item, index) => {
                if (index < itemCoords.length) { // Limita a cinco itens
                    const totalPorItem = item.quantidade * item.valor; // Calcula o total por item
                    doc.text(`${item.quantidade}`, itemCoords[index].xQuantidade, itemCoords[index].yQuantidade);
                    doc.text(`${item.descricao}`, itemCoords[index].xDescricao, itemCoords[index].yDescricao);
                    doc.text(`R$ ${totalPorItem.toFixed(2)}`, itemCoords[index].xValor, itemCoords[index].yValor); // Exibe o total por item
                }
            });

            // Exibe apenas o valor total
            doc.text(`R$ ${valorTotalElement.textContent}`, 170, 172.5); // Ajuste a posição conforme necessário
            doc.save('orcamento.pdf'); // Salva o PDF gerado
        };
    });

    // Atualiza o valor total em tempo real conforme os campos forem modificados
    document.querySelector('.quantidade').addEventListener('input', calcularValorTotal);
    document.querySelector('.descricao').addEventListener('input', calcularValorTotal);
    document.querySelector('.valor').addEventListener('input', calcularValorTotal);
});
