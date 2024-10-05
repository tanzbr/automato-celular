var matriz = []; // matriz de células
var geracao = 0; // geração atual
var tamanhoDaGrid = 20; // tamanho da grade de células
var modoAutomatico = false; // controle do modo automático
var taskAutomatico; // manter salvo a task do modo automático para cancelar depois


// Função ao clicar no botão de resetar
function botaoResetar() {
    for (let i = 0; i < tamanhoDaGrid; i++) {
        matriz[i] = []
        for (let i2 = 0; i2 < tamanhoDaGrid; i2++) {
            matriz[i][i2] = false;
        }
    }
    geracao = 0;
    atualizarRenderizacao();
    pararModoAutomatico();
    
}
botaoResetar();

// Função ao clicar no botão de próxima geração
function botaoProximaGeracao() {

    // parar o modo automático se todas as células morrerem
    if (modoAutomatico && contarCelulasVivas == 0) {
        pararModoAutomatico();
    }

    aplicarRegras();
    geracao += 1;
    atualizarRenderizacao();
}

// Função para parar o modo automático
function pararModoAutomatico() {
    modoAutomatico = false;
    if (taskAutomatico != null) {
        window.clearInterval(taskAutomatico);
        taskAutomatico == null;
    }
}

// Função ao clicar no botão de gerações automáticos
function botaoAutomatico() {
    if (!modoAutomatico) {
        modoAutomatico = true;
        taskAutomatico = window.setInterval(botaoProximaGeracao, 200)
    } else {
        pararModoAutomatico();
    }
}

// Criar as células HTML
function renderizar() {
    for (let i = 0; i < matriz.length; i++) {
        for (let i2 = 0; i2 < matriz[i].length; i2++) {
            var cellValue = matriz[i][i2];
            var state = cellValue ? "on" : "off";
            $(".cell-container").append(`<div class='cell ${state}' id='cell_${i}-${i2}'></div>`);
        }
    }
}
renderizar();


// Atualizar as cores das células HTML
function atualizarRenderizacao() {
    for (let i = 0; i < matriz.length; i++) {
        for (let i2 = 0; i2 < matriz[i].length; i2++) {
            var cellValue = matriz[i][i2];
            var state = cellValue ? "on" : "off";
            $(`#cell_${i}-${i2}`).removeClass("on");
            $(`#cell_${i}-${i2}`).removeClass("off");
            $(`#cell_${i}-${i2}`).addClass(state);
        }
    }
    $("#generation").text("Geração " + geracao);
    $("#liveCells").text("Células vivas: " + contarCelulasVivas());
}

// Ao clicar nas células, alterar seu estado de vivo ou morto
$(".cell").on('click', function() {

    if (modoAutomatico) return; // desativar o clique se estiver no modo automático

    if (getCellValue($(this).attr('id'))) {
        setCellValue($(this).attr('id'), false)
    } else if (!getCellValue($(this).attr('id'))) {
        setCellValue($(this).attr('id'), true)
    }
    atualizarRenderizacao();
})

// Retornar o valor de uma celula usando o ID do elemento html
function getCellValue(id) {
    return matriz[id.split("_")[1].split("-")[0]][id.split("_")[1].split("-")[1]];
}

// Definir o valor de uma célula usando o ID do elemento html
function setCellValue(id, value) {
    matriz[id.split("_")[1].split("-")[0]][id.split("_")[1].split("-")[1]] = value;
}

// Retornar a quantidade de vizinhos vivos de uma célula
function contarVizinhos(row, col) {
    // Retorna o número de vizinhos vivos
    let count = 0;
    
    for (let i = -1; i < 2; i++) { // Checar a linha de cima e de baixo
      if (col + i >= 0 && col + i < tamanhoDaGrid - 1) { // Checar por coluna
        if (row > 0 && matriz[row - 1][col + i] == 1) {
          count++;
        }
        if (row < tamanhoDaGrid - 1 && matriz[row + 1][col + i] == 1) { 
          count++;
        }
      }
    }
    
    if (col - 1 >= 0 && matriz[row][col - 1] == 1) { // Checar célula esquerda
      count++;
    }
    if (col + 1 < tamanhoDaGrid - 1 && matriz[row][col + 1] == 1) { // Checar célula direita
      count++;
    }

    return count;
}

// Retornar célula a direita
function getVizinhoDireita(row, col) {   
    // verificar se chegou no final da grade
    if (col + 1 > tamanhoDaGrid - 1) { 
      return false;
    }

    return matriz[row][col + 1];
}

  function aplicarRegras() {
    // Aplicar regras
    let novaMatriz = []; // Matriz da próxima geração

    matriz.forEach((linhaArray, linha) => {
      let novaLinha = [];
      linhaArray.forEach((valor, coluna) => {
        let celula = valor;
        let vizinhos = contarVizinhos(linha, coluna);
        
        if (celula == true && vizinhos % 2 == 0) { // Se a quantidade de vizinhos for par, VIVE
          celula = true;
        } else if (celula == false && vizinhos >= 3) { // Se a quantidade de vizinhos for igual ou maior que 3, NASCE
            celula = true;
        } else if (celula == true && vizinhos == 3) { // Se a quantidade de vizinhos for igual a 3, MORRE
            celula = false;
        } else if (celula == true && vizinhos > 6) { // Se a quantidade de vizinhos for maior que 6, MORRE
            celula = false;
        } else if (celula == false && getVizinhoDireita(linha, coluna) == true) { // Se tiver vizinho a direita, NASCE
            celula = true;
        } 
        novaLinha.push(celula);
      });
      novaMatriz.push(novaLinha);
    });

    matriz = novaMatriz; // Atualizar a matriz de células
}

// Retornar a quantidade células vivas
function contarCelulasVivas() {
    var quant = 0;
    for (let i = 0; i < matriz.length; i++) {
        for (let i2 = 0; i2 < matriz[i].length; i2++) {
            var valorDaCelula = matriz[i][i2];
            if (valorDaCelula) {
                quant++;
            }
        }
    }
    return quant;
}