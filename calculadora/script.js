// script.js - Versão com Força Bruta para Exibição
console.log("Calculadora de Páscoa: Iniciada!");

document.addEventListener('DOMContentLoaded', function() {
    const btnCalcular = document.getElementById('btnCalcular');
    const btnBaixarPDF = document.getElementById('btnBaixarPDF');
    const btnSimularOutro = document.getElementById('btnSimularOutro');
    const blocoResultado = document.getElementById('bloco-resultado');
    const modoBtns = document.querySelectorAll('.mode-btn');

    // 1. Alternar entre Modo Simples e Avançado (COM FORÇA BRUTA)
    modoBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Botão clicado:", this.getAttribute('data-mode'));
            
            modoBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const modo = this.getAttribute('data-mode');
            const camposAvancados = document.querySelectorAll('.avancado-only');
            
            camposAvancados.forEach(campo => {
                if (modo === 'avancado') {
                    // Usamos !important via style.setProperty para garantir que apareça
                    campo.style.setProperty('display', 'block', 'important');
                    // Se for uma linha de formulário, tentamos manter o layout original
                    if (campo.classList.contains('form-row')) {
                        campo.style.setProperty('display', 'grid', 'important');
                    }
                } else {
                    campo.style.setProperty('display', 'none', 'important');
                }
            });
        });
    });

    const formatarMoeda = (valor) => {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    function realizarCalculo() {
        try {
            const getV = (id) => parseFloat(document.getElementById(id)?.value) || 0;

            const pesoCasca = getV('pesoCasca');
            const pesoRecheio = getV('pesoRecheio');
            const custoCasca = getV('custoCasca');
            const custoRecheio = getV('custoRecheio');
            const custoEmbalagem = getV('custoEmbalagem');
            const tempoProducao = getV('tempoProducao');
            const valorHora = getV('valorHora');
            const margemLucro = getV('margemLucro');

            // Avançados
            const pesoDecoracao = getV('pesoDecoracao');
            const custoDecoracao = getV('custoDecoracao');
            const custoColher = getV('custoColher');
            const custoFitaTag = getV('custoFitaTag');
            const outrosCustos = getV('outrosCustos');
            const custoGasEnergia = getV('custoGasEnergia');
            const custoAguaLimpeza = getV('custoAguaLimpeza');
            const custoFixoMensal = getV('custoFixoMensal');
            const quantidadeMedia = getV('quantidadeMedia') || 1;
            const taxaMaquininha = getV('taxaMaquininha');
            const percentualPerdas = getV('percentualPerdas');
            const taxaEntrega = getV('taxaEntrega');
            const descontoPromocional = getV('descontoPromocional');

            const custoIngredientes = ((pesoCasca / 1000) * custoCasca) + ((pesoRecheio / 1000) * custoRecheio) + ((pesoDecoracao / 1000) * custoDecoracao);
            const custoEmbalagemTotal = custoEmbalagem + custoColher + custoFitaTag + outrosCustos;
            const custoMaoObra = (tempoProducao / 60) * valorHora;
            const custoFixoRateado = custoFixoMensal / quantidadeMedia;
            const subtotal = custoIngredientes + custoEmbalagemTotal + custoMaoObra + custoFixoRateado + custoGasEnergia + custoAguaLimpeza;
            const custoRealTotal = subtotal * (1 + (percentualPerdas / 100));
            
            const precoSugerido = (custoRealTotal + taxaEntrega) / (1 - ((margemLucro + taxaMaquininha) / 100));
            const precoFinal = precoSugerido * (1 - (descontoPromocional / 100));
            const lucro = precoFinal - (precoFinal * (taxaMaquininha / 100)) - custoRealTotal;

            document.getElementById('custoIngredientes').textContent = formatarMoeda(custoIngredientes);
            document.getElementById('custoEmbalagemTotal').textContent = formatarMoeda(custoEmbalagemTotal);
            document.getElementById('custoMaoObra').textContent = formatarMoeda(custoMaoObra);
            document.getElementById('custoRealTotal').textContent = formatarMoeda(custoRealTotal);
            document.getElementById('precoSugerido').textContent = formatarMoeda(precoFinal);
            document.getElementById('lucroUnidade').textContent = formatarMoeda(lucro);
            
            if (document.getElementById('custoFixoRateado')) {
                document.getElementById('custoFixoRateado').textContent = formatarMoeda(custoFixoRateado);
            }

            blocoResultado.style.setProperty('display', 'block', 'important');
            blocoResultado.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error("Erro no cálculo:", error);
            alert("Erro ao calcular. Verifique os campos.");
        }
    }

    if (btnCalcular) btnCalcular.addEventListener('click', realizarCalculo);

    if (btnSimularOutro) {
        btnSimularOutro.addEventListener('click', function() {
            blocoResultado.style.display = 'none';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (btnBaixarPDF) {
        btnBaixarPDF.addEventListener('click', function() {
            const element = document.getElementById('bloco-resultado');
            const nomeProd = document.getElementById('nomeProduto').value || 'Ovo_de_Pascoa';
            const opt = {
                margin: 10,
                filename: `Orcamento_${nomeProd}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save();
        });
    }
});
