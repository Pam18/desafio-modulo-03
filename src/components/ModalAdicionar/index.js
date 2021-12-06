import { useState } from 'react';
import InputMask from 'react-input-mask';

import { parseISO, parseJSON, getDay, format } from 'date-fns';

function ModalAdicionar({ mostrarModalAdicionar, setMostrarModalAdicionar, urlBase, handleMostrarRegistros }) {
    const [valor, setValor] = useState(Number);
    const [categoria, setCategoria] = useState('');
    const [data, setData] = useState('');
    const [descricao, setDescricao] = useState('');
    const [tipo, setTipo] = useState('debit');

    const [carregando, setCarregando] = useState(false);
    const [erros, setErros] = useState(false);

    function handleClickEntradaSaida(e) {
        if (e.target.classList[0] === 'entrada-button') {
            e.target.parentElement.firstChild.style.background = 'linear-gradient(91.26deg, #05EDE3 0%, #3A9FF1 97.77%)';
            e.target.parentElement.lastChild.style.background = '#B9B9B9';

            setTipo('credit');
        }

        if (e.target.classList[0] === 'saida-button') {
            e.target.parentElement.firstChild.style.background = '#B9B9B9';
            e.target.parentElement.lastChild.style.background = 'linear-gradient(91.66deg, #FA8C10 0%, #FF576B 90.32%)';

            setTipo('debit');
        }
    }

    function converterData(data) {
        if (!data) return;

        const arrayData = data.split('/').reverse();

        const dataFormatada = new Date(arrayData[0], `${Number(arrayData[1]) - 1}`, `${Number(arrayData[2])}`, 9, 0, 0);

        const dataFormatadaParaBD = format(parseJSON(dataFormatada), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

        const diaDaSemana = getDay(parseISO(dataFormatadaParaBD));

        let diaFormatadoParaBD = '';
        switch (diaDaSemana) {
            case 0: diaFormatadoParaBD = 'Domingo'; break;
            case 1: diaFormatadoParaBD = 'Segunda'; break;
            case 2: diaFormatadoParaBD = 'Terça'; break;
            case 3: diaFormatadoParaBD = 'Quarta'; break;
            case 4: diaFormatadoParaBD = 'Quinta'; break;
            case 5: diaFormatadoParaBD = 'Sexta'; break;
            case 6: diaFormatadoParaBD = 'Sábado'; break;
            default:
        }

        return [diaFormatadoParaBD, dataFormatadaParaBD];
    }

    function converterValor(valor) {
        if (!valor) return;

        const valorDecimal = parseFloat(valor) * 100;
        setValor(valorDecimal);

        return valorDecimal;
    }

    function handleOnsubmit(event) {
        event.preventDefault();

        if (!valor || !categoria || !data || !descricao) {
            return;
        }
    }

    async function handleAdicionarRegistro() {
        const testeValor = parseFloat(valor);

        if (!testeValor) {
            console.log("O campo 'valor' deve ser preenchido apenas com números.");
            return;
        }

        if (!valor || !categoria || !data || !descricao) {
            console.log('Todos os campos são obrigatórios!')
            return;
        }

        const dataUTC = converterData(data);

        const valorEmCentavos = converterValor(valor);

        setCarregando(true);

        try {
            const dadosDoRegistro = {
                date: dataUTC[1],
                week_day: dataUTC[0],
                description: descricao,
                value: valorEmCentavos,
                category: categoria,
                type: tipo
            }

            await fetch(urlBase, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(dadosDoRegistro)
            });


            setCarregando(false);
            setErros(false);
            setMostrarModalAdicionar(!mostrarModalAdicionar);

            setValor(0);
            setCategoria('');
            setData('');
            setDescricao('');
            setTipo('debit');

        } catch (error) {
            console.log(error.message);

            setCarregando(false);
            setErros(true);
        }

        await handleMostrarRegistros();
    }

    return (
        <div className="back-drop">
            <div className="modal-container">
                <div className="modal-container-header">
                    <h1>Adicionar Registro</h1>
                    <img className="close-icon" src="./assets/close-modal.svg" alt="Ícone de fechar" onClick={() => setMostrarModalAdicionar(!mostrarModalAdicionar)} />
                </div>

                <div className="botoes-entrada-saida" onClick={handleClickEntradaSaida}>
                    <button className="entrada-button" id="credit-button">Entrada</button>
                    <button className="saida-button" id="debit-button">Saída</button>
                </div>

                <div className="inputs">
                    <form onSubmit={(e) => handleOnsubmit(e)}>
                        <label>Valor</label>
                        <InputMask
                            type="number"
                            name="value"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                        />
                    </form>
                    <form onSubmit={(e) => handleOnsubmit(e)}>
                        <label htmlFor="">Categoria</label>
                        <input
                            name="category"
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                        />
                    </form>
                    <form onSubmit={(e) => handleOnsubmit(e)}>
                        <label htmlFor="">Data</label>
                        <InputMask
                            name="date"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            mask="99/99/9999"
                        />
                    </form>
                    <form onSubmit={(e) => handleOnsubmit(e)}>
                        <label htmlFor="">Descrição</label>
                        <input
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </form>
                </div>

                <button
                    className="btn-insert"
                    onClick={() => handleAdicionarRegistro()}>Confirmar</button>
            </div>
        </div>
    );
}

export default ModalAdicionar;