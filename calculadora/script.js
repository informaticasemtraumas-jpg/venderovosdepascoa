// ============================================
// CALCULADORA DE PREÇOS - OVOS DE PÁSCOA
// ============================================

class CalculadoraOvos {
    constructor() {
        this.modo = 'simples';
        this.inicializar();
    }

    inicializar() {
        this.selecionarElementos();
        this.adicionarEventos();
        this.carregarValoresExemplo();
    }

    selecionarElementos() {
        // Botões de modo
        this.modoBtns = document.querySelectorAll('.mode-btn');
        
        // Formulário
        this.form = document.getElementById('calculadoraForm');
        this.btnCalcular = document.getElementById('btnCalcular');
        this.btnSimularOutro = document.getElementById('btnSimularOutro');
        
        // Campos simples
        this.nomeProduto = document.getElementById('nomeProduto');
        this.pesoCasca = document.getElementById('pesoCasca');
        this.pesoRecheio = document.getElementById('pesoRecheio');
        this.custoCasca = document.getElementById('custoCasca');
        this.custoRecheio = document.getElementById('custoRecheio');
        this.custoEmbalagem = document.getElementById('custoEmbalagem');
        this.tempoProducao = document.getElementById('tempoProducao');
        this.valorHora = document.getElementById('valorHora');
        this.margemLucro = document.getElementById('margemLucro');
        
        // Campos avançados
        this.pesoDecoracao = document.getElementById('pesoDecoracao');
        this.custoDecoracao = document.getElementById('custoDecoracao');
        this.custoColher = document.getElementById('custoColher');
        this.custoFitaTag = document.getElementById('custoFitaTag');
        this.outrosCustos = document.getElementById('outrosCustos');
        this.custoGasEnergia = document.getElementById('custoGasEnergia');
        this.custoAguaLimpeza = document.getElementById('custoAguaLimpeza');
        this.custoFixoMensal = document.getElementById('custoFixoMensal');
        this.quantidadeMedia = document.getElementById('quantidadeMedia');
        this.taxaMaquininha = document.getElementById('taxaMaquininha');
        this.percentualPerdas = document.getElementById('percentualPerdas');
        this.taxaEntrega = document.getElementById('taxaEntrega');
        this.descontoPromocional = document.getElementById('descontoPromocional');
        
        // Seções de resultado
        this.blocoResultado = document.getElementById('bloco-resultado');
        this.avisos = document.getElementById('avisos');
        
        // Valores de resultado
        this.custoIngredientes = document.getElementById('custoIngredientes');
        this.custoEmbalagemTotal = document.getElementById('custoEmbalagemTotal');
        this.custoMaoObra = document.getElementById('custoMaoObra');
        this.custoFixoRateado = document.getElementById('custoFixoRateado');
        this.custoRealTotal = document.getElementById('custoRealTotal');
        this.precoMinimo = document.getElementById('precoMinimo');
        this.precoSugerido = document.getElementById('precoSugerido');
        this.lucroUnidade = document.getElementById('lucroUnidade');
        this.margemFinal = document.getElementById('margemFinal');
    }

    adicionarEventos() {
        // Toggle de modo
        this.modoBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.alternarModo(e.target.dataset.mode));
        });
        
        // Botão calcular
        this.btnCalcular.addEventListener('click', (e) => {
            e.preventDefault();
            this.calcular();
        });
        
        // Botão simular outro
        this.btnSimularOutro.addEventListener('click', () => {
            this.blocoResultado.style.display = 'none';
            this.form.scrollIntoView({ behavior: 'smooth' });
        });
        
        // Enter no formulário
        this.form.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.calcular();
            }
        });
        
        // Atualização automática (opcional - comentado por padrão)
        // this.form.addEventListener('input', () => this.calcular());
    }

    carregarValoresExemplo() {
        // Valores já estão no HTML
    }

    alternarModo(novoModo) {
        this.modo = novoModo;
        
        // Atualizar botões
        this.modoBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === novoModo) {
                btn.classList.add('active');
            }
        });
        
        // Mostrar/ocultar campos avançados
        const camposAvancados = document.querySelectorAll('.avancado-only');
        camposAvancados.forEach(campo => {
            if (novoModo === 'avancado') {
                campo.classList.add('visible');
                if (campo.classList.contains('form-row')) {
                    campo.style.display = 'grid';
                } else if (campo.classList.contains('form-group')) {
                    campo.style.display = 'block';
                } else if (campo.classList.contains('resultado-item')) {
                    campo.style.display = 'block';
                }
            } else {
                campo.classList.remove('visible');
                campo.style.display = 'none';
            }
        });
    }

    validar() {
        const erros = [];
        
        // Validações obrigatórias
        if (!this.pesoCasca.value || parseFloat(this.pesoCasca.value) <= 0) {
            erros.push('Peso da casca é obrigatório e deve ser maior que 0');
        }
        if (!this.pesoRecheio.value || parseFloat(this.pesoRecheio.value) <= 0) {
            erros.push('Peso do recheio é obrigatório e deve ser maior que 0');
        }
        if (!this.custoCasca.value || parseFloat(this.custoCasca.value) < 0) {
            erros.push('Custo do chocolate é obrigatório e não pode ser negativo');
        }
        if (!this.custoRecheio.value || parseFloat(this.custoRecheio.value) < 0) {
            erros.push('Custo do recheio é obrigatório e não pode ser negativo');
        }
        if (!this.custoEmbalagem.value || parseFloat(this.custoEmbalagem.value) < 0) {
            erros.push('Custo da embalagem é obrigatório e não pode ser negativo');
        }
        if (!this.tempoProducao.value || parseFloat(this.tempoProducao.value) <= 0) {
            erros.push('Tempo de produção é obrigatório e deve ser maior que 0');
        }
        if (!this.valorHora.value || parseFloat(this.valorHora.value) <= 0) {
            erros.push('Valor da hora é obrigatório e deve ser maior que 0');
        }
        if (!this.margemLucro.value || parseFloat(this.margemLucro.value) < 0) {
            erros.push('Margem de lucro é obrigatória e não pode ser negativa');
        }
        
        if (erros.length > 0) {
            this.mostrarErro(erros);
            return false;
        }
        
        return true;
    }

    calcular() {
        if (!this.validar()) {
            return;
        }
        
        // Obter valores
        const pesoCasca = parseFloat(this.pesoCasca.value);
        const pesoRecheio = parseFloat(this.pesoRecheio.value);
        const pesoDecoracao = parseFloat(this.pesoDecoracao.value) || 0;
        
        const custoCasca = parseFloat(this.custoCasca.value);
        const custoRecheio = parseFloat(this.custoRecheio.value);
        const custoDecoracao = parseFloat(this.custoDecoracao.value) || 0;
        
        const custoEmbalagem = parseFloat(this.custoEmbalagem.value);
        const custoColher = parseFloat(this.custoColher.value) || 0;
        const custoFitaTag = parseFloat(this.custoFitaTag.value) || 0;
        const outrosCustos = parseFloat(this.outrosCustos.value) || 0;
        
        const tempoProducao = parseFloat(this.tempoProducao.value);
        const valorHora = parseFloat(this.valorHora.value);
        
        const custoGasEnergia = parseFloat(this.custoGasEnergia.value) || 0;
        const custoAguaLimpeza = parseFloat(this.custoAguaLimpeza.value) || 0;
        const custoFixoMensal = parseFloat(this.custoFixoMensal.value) || 0;
        const quantidadeMedia = parseFloat(this.quantidadeMedia.value) || 1;
        
        const margemLucro = parseFloat(this.margemLucro.value);
        const taxaMaquininha = parseFloat(this.taxaMaquininha.value) || 0;
        const percentualPerdas = parseFloat(this.percentualPerdas.value) || 0;
        const taxaEntrega = parseFloat(this.taxaEntrega.value) || 0;
        const descontoPromocional = parseFloat(this.descontoPromocional.value) || 0;
        
        // ============================================
        // FÓRMULAS DE CÁLCULO
        // ============================================
        
        // 1. Custo da casca
        const custoCascaTotal = (pesoCasca / 1000) * custoCasca;
        
        // 2. Custo do recheio
        const custoRecheioTotal = (pesoRecheio / 1000) * custoRecheio;
        
        // 3. Custo da decoração
        const custoDecoracao_Total = (pesoDecoracao / 1000) * custoDecoracao;
        
        // Custo total de ingredientes
        const custoIngredientesTotal = custoCascaTotal + custoRecheioTotal + custoDecoracao_Total;
        
        // 4. Custo de embalagem (soma de todos os itens)
        const custoEmbalagemTotal_Calc = custoEmbalagem + custoColher + custoFitaTag + outrosCustos;
        
        // 5. Mão de obra por unidade
        const custoMaoObraTotal = (tempoProducao / 60) * valorHora;
        
        // 6. Custos fixos rateados
        const custoFixoRateado_Calc = custoFixoMensal / quantidadeMedia;
        
        // 7. Subtotal (ingredientes + embalagem + variáveis + mão de obra + custos fixos)
        const subtotal = custoIngredientesTotal + custoEmbalagemTotal_Calc + custoGasEnergia + custoAguaLimpeza + custoMaoObraTotal + custoFixoRateado_Calc;
        
        // 8. Perdas/imprevistos
        const custoPerdasImprevistos = subtotal * (percentualPerdas / 100);
        
        // 9. Custo real final
        const custoRealFinal = subtotal + custoPerdasImprevistos;
        
        // 10. Preço mínimo (custo real + taxa de maquininha)
        const precoMinimoCalc = custoRealFinal / (1 - (taxaMaquininha / 100));
        
        // 11. Preço sugerido com margem de lucro
        // Fórmula: Preço = (Custo Real + Taxa) / (1 - Margem% - Taxa%)
        const precoSugeridoCalc = (custoRealFinal + taxaEntrega) / (1 - ((margemLucro + taxaMaquininha) / 100));
        
        // Aplicar desconto promocional se houver
        const precoComDesconto = precoSugeridoCalc * (1 - (descontoPromocional / 100));
        
        // Arredondar para valor comercial
        const precoFinal = this.arredondarComercial(precoComDesconto);
        
        // 12. Lucro por unidade (considerando taxa)
        const lucroUnidadeCalc = precoFinal - (precoFinal * (taxaMaquininha / 100)) - custoRealFinal;
        
        // 13. Margem percentual
        const margemPercentual = (lucroUnidadeCalc / precoFinal) * 100;
        
        // ============================================
        // ATUALIZAR INTERFACE
        // ============================================
        
        this.custoIngredientes.textContent = this.formatarMoeda(custoIngredientesTotal);
        this.custoEmbalagemTotal.textContent = this.formatarMoeda(custoEmbalagemTotal_Calc);
        this.custoMaoObra.textContent = this.formatarMoeda(custoMaoObraTotal);
        this.custoFixoRateado.textContent = this.formatarMoeda(custoFixoRateado_Calc);
        this.custoRealTotal.textContent = this.formatarMoeda(custoRealFinal);
        this.precoMinimo.textContent = this.formatarMoeda(precoMinimoCalc);
        this.precoSugerido.textContent = this.formatarMoeda(precoFinal);
        this.lucroUnidade.textContent = this.formatarMoeda(lucroUnidadeCalc);
        this.margemFinal.textContent = margemPercentual.toFixed(2) + '%';
        
        // Mostrar resultado
        this.blocoResultado.style.display = 'block';
        this.blocoResultado.scrollIntoView({ behavior: 'smooth' });
        
        // Validações e avisos
        this.verificarAvisos(custoRealFinal, precoFinal, margemPercentual, margemLucro);
    }

    verificarAvisos(custoReal, preco, margemReal, margemDesejada) {
        const avisos = [];
        
        // Aviso 1: Preço abaixo do custo
        if (preco < custoReal) {
            avisos.push({
                tipo: 'erro',
                mensagem: '⚠️ ATENÇÃO: O preço sugerido está abaixo do custo real! Revise seus valores.'
            });
        }
        
        // Aviso 2: Margem inviável
        if (margemReal < (margemDesejada * 0.5)) {
            avisos.push({
                tipo: 'aviso',
                mensagem: `⚠️ A margem real (${margemReal.toFixed(2)}%) é menor que a desejada (${margemDesejada.toFixed(2)}%). Considere aumentar o preço.`
            });
        }
        
        // Aviso 3: Margem muito baixa
        if (margemReal < 10) {
            avisos.push({
                tipo: 'aviso',
                mensagem: '⚠️ Margem de lucro muito baixa. Considere aumentar o preço para maior sustentabilidade.'
            });
        }
        
        this.mostrarAvisos(avisos);
    }

    mostrarAvisos(avisos) {
        if (avisos.length === 0) {
            this.avisos.classList.remove('ativo');
            this.avisos.innerHTML = '';
            return;
        }
        
        let html = '';
        avisos.forEach(aviso => {
            html += `<div class="aviso ${aviso.tipo}">${aviso.mensagem}</div>`;
        });
        
        this.avisos.innerHTML = html;
        this.avisos.classList.add('ativo');
    }

    mostrarErro(erros) {
        const mensagem = erros.join('\n');
        alert('Erro na validação:\n\n' + mensagem);
    }

    arredondarComercial(valor) {
        // Arredondar para valores comerciais: 9.90, 14.90, 19.90, 24.90, 29.90, 34.90, 39.90, 44.90, 49.90, etc
        const inteiro = Math.floor(valor);
        const decimal = valor - inteiro;
        
        // Se o decimal é menor que 0.90, arredondar para .90 do mesmo inteiro
        // Se o decimal é >= 0.90, arredondar para .90 do próximo inteiro
        if (decimal < 0.90) {
            return inteiro + 0.90;
        } else {
            return (inteiro + 1) + 0.90;
        }
    }

    formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }
}

// ============================================
// INICIALIZAR QUANDO DOM ESTIVER PRONTO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    new CalculadoraOvos();
});
