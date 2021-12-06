import { useState } from 'react';

import InputMask from 'react-input-mask';
import { parseISO, parseJSON, getDay, format } from 'date-fns';

function ModalEditar({ mostrarModalEditar, setMostrarModalEditar, urlBase, handleMostrarRegistros, registroEditavel }) {

    const [valorEdicao, setValorEdicao] = useState((registroEditavel.value) / 100);
    const [categoriaEdicao, setCategoriaEdicao] = useState(registroEditavel.category);
    const [dataEdicao, setDataEdicao] = useState(dataTela(registroEditavel.date));
    const [descricaoEdicao, setDescricaoEdicao] = useState(registroEditavel.description);
    const [tipoEdicao, setTipoEdicao] = useState(registroEditavel.type);

    const [carregando, setCarregando] = useState(false);
    const [erros, setErros] = useState(false);


    function dataTela(data) {
        if (!data) return;

        const dataFormatadaParaTela = format(parseISO(data), "dd/MM/yyyy");

        return dataFormatadaParaTela;
    }

    function handleClickEntradaSaida(e) {
        if (e.target.classList[0] === 'entrada-button') {
            e.target.parentElement.firstChild.style.background = 'linear-gradient(91.26deg, #05EDE3 0%, #3A9FF1 97.77%)';
            e.target.parentElement.lastChild.style.background = '#B9B9B9';

            setTipoEdicao('credit');
        }

        if (e.target.classList[0] === 'saida-button') {
            e.target.parentElement.firstChild.style.background = '#B9B9B9';
            e.target.parentElement.lastChild.style.background = 'linear-gradient(91.66deg, #FA8C10 0%, #FF576B 90.32%)';

            setTipoEdicao('debit');
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

        const valorDecimal = valor * 100;

        setValorEdicao(valorDecimal);

        return valorDecimal;
    }

    function handleOnsubmit(event) {
        event.preventDefault();

        if (!valorEdicao || !categoriaEdicao || !dataEdicao || !descricaoEdicao) {
            return;
        }
    }

    async function handleEditarRegistro() {
        const testeValor = parseFloat(valorEdicao);

        if (!testeValor) {
            console.log("O campo 'valor' deve ser preenchido apenas com números.");
            return;
        }

        if (!valorEdicao || !categoriaEdicao || !dataEdicao || !descricaoEdicao) {
            console.log('Todos os campos são obrigatórios!')
            return;
        }

        const dataUTC = converterData(dataEdicao);

        const valorEmCentavos = converterValor(valorEdicao);

        setCarregando(true);

        try {
            const dadosDoRegistro = {
                date: dataUTC[1],
                week_day: dataUTC[0],
                description: descricaoEdicao,
                value: valorEmCentavos,
                category: categoriaEdicao,
                type: tipoEdicao
            }

            await fetch(`${urlBase}/${registroEditavel.id}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(dadosDoRegistro)
            });


            setCarregando(false);
            setErros(false);
            setMostrarModalEditar(!mostrarModalEditar);

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
                    <h1>Editar Registro</h1>
                    <img className="close-icon" src="./assets/close-modal.svg" alt="Ícone de fechar" onClick={() => setMostrarModalEditar(!mostrarModalEditar)} />
                </div>

                <div className="botoes-entrada-saida" onClick={handleClickEntradaSaida}>
                    <button
                        className="entrada-button"
                        id="credit-button"
                        style={registroEditavel.type === 'credit' ? { background: "linear-gradient(91.26deg, #05EDE3 0%, #3A9FF1 97.77%)" } : { background: "#B9B9B9" }}
                    >Entrada</button>

                    <button
                        className="saida-button"
                        id="debit-button"
                        style={registroEditavel.type === 'debit' ? { background: "linear-gradient(91.66deg, #FA8C10 0%, #FF576B 90.32%)" } : { background: "#B9B9B9" }}
                    >Saída</button>
                </div>

                <div className="inputs">
                    <form onSubmit={(e) => handleOnsubmit(e)}>
                        <label>Valor</label>
                        <InputMask
                            type="number"
                            name="value"
                            value={valorEdicao}
                            onChange={(e) => setValorEdicao(e.target.value)}
                        />
                    </form>
                    <form onSubmit={(e) => handleOnsubmit(e)}>
                        <label htmlFor="">Categoria</label>
                        <input
                            name="category"
                            value={categoriaEdicao}
                            onChange={(e) => setCategoriaEdicao(e.target.value)}
                        />
                    </form>
                    <form onSubmit={(e) => handleOnsubmit(e)}>
                        <label htmlFor="">Data</label>
                        <InputMask
                            name="date"
                            value={dataEdicao}
                            onChange={(e) => setDataEdicao(e.target.value)}
                            mask="99/99/9999"
                        />
                    </form>
                    <form onSubmit={(e) => handleOnsubmit(e)}>
                        <label htmlFor="">Descrição</label>
                        <input
                            value={descricaoEdicao}
                            onChange={(e) => setDescricaoEdicao(e.target.value)}
                        />
                    </form>
                </div>

                <button
                    className="btn-insert"
                    onClick={() => handleEditarRegistro()}>Confirmar</button>
            </div>
        </div>
    );
}

export default ModalEditar;