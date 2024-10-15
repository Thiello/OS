document.addEventListener('DOMContentLoaded', () => {
    const addItemButton = document.getElementById('add-item');
    const valorTotalElement = document.getElementById('valor-total');
    const itensContainer = document.getElementById('itens-container');
    let itens = [];

    // Função para calcular o valor total
    function calcularValorTotal() {
        let total = 0;

        // Soma os itens já adicionados
        itens.forEach(item => {
            total += item.quantidade * item.valor;
        });

        valorTotalElement.textContent = `R$ ${total.toFixed(2)}`; // Exibe o total formatado
    }

    // Função para capturar os dados preenchidos no formulário
    function capturarItemAtual() {
        const quantidade = parseInt(document.querySelector('.quantidade').value) || 0;
        const descricao = document.querySelector('.descricao').value;
        const valor = parseFloat(document.querySelector('.valor').value) || 0;

        if (quantidade && descricao && valor) {
            return {
                quantidade: quantidade,
                descricao: descricao,
                valor: valor
            };
        }
        return null;
    }

    // Atualiza o valor total em tempo real ao modificar os campos
    document.addEventListener('input', () => {
        const itemAtual = capturarItemAtual();
        if (itemAtual) {
            // Se o item atual já existe, o total será atualizado
            if (!itens.includes(itemAtual)) {
                itens.push(itemAtual); // Adiciona o item à lista apenas se for novo
            }
        }
        calcularValorTotal();
    });

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
            itens.push(itemAtual); // Adiciona o item à lista
            limparFormulario(); // Limpa o formulário
        } else {
            alert('Por favor, preencha todos os campos corretamente antes de adicionar o item.');
        }

        calcularValorTotal(); // Atualiza o valor total ao adicionar o item
    });

    // Função para gerar o PDF
    document.getElementById('orcamento-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const cliente = document.getElementById('cliente').value;
        const total = valorTotalElement.textContent;

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFont('Arial'); // Define a fonte
        doc.setFontSize(10); // Define o tamanho da fonte

        // Carregar o template de fundo
        const img = new Image();
        img.src = 'img/template.png';  // Caminho correto para o template do PDF

        img.onload = function () {
            // Adiciona a imagem de fundo
            doc.addImage(img, 'PNG', 0, 0, 210, 297); // Ajuste conforme necessário

            // Exibe o nome do cliente
            doc.text(`${cliente}`, 35, 68.5); // Ajuste conforme necessário

            // Coordenadas específicas para cada item
            itens.forEach((item, index) => {
                const y = 82.5 + (index * 5); // Incrementa a linha a cada item

                // Exibe as informações do item no PDF
                doc.text(item.quantidade.toString(), 23, y);
                doc.text(item.descricao, 35, y);
                doc.text(item.valor.toFixed(2), 141.5, y);
                doc.text((item.quantidade * item.valor).toFixed(2), 164, y);
            });

            // Exibe o valor total
            doc.text(`Total: ${total}`, 164, 100); // Ajuste conforme necessário

            // Salva o PDF
            doc.save('orcamento.pdf');
        };
    });
});
