import { useEffect, useRef, useState } from "react";

function Resumo({ setMostrarModal, registros, arrayPrincipal }) {

  const registrosTransacoes = useRef();
  registrosTransacoes.current = registros;

  const [entradas, setEntradas] = useState('0');
  const [saidas, setSaidas] = useState('0');
  const [saldo, setSaldo] = useState('0');

  function valorTotalEntrada(transacoes) {
    const totalDeEntradas = transacoes.filter(registro => registro.type === 'credit');

      if (totalDeEntradas.length === 0) return;

      const totalEntrada = totalDeEntradas.reduce((acc, registro) => {
        const valor = acc;

        return valor + registro.value
      }, 0);


      let valores;

      if (typeof (totalEntrada) !== 'number') {
        valores = totalEntrada.value;

      } else {
        valores = totalEntrada;
      }

      const totalEntradaString = (`${(valores / 100)}`).includes('.') ? (`${(valores / 100)}`).replace('.', ',') : `${(valores / 100)}`;

      setEntradas(totalEntradaString);

      return totalEntradaString;
  }

  function valorTotalSaida(transacoes) {
    const totalDeSaidas = transacoes.filter(registro => registro.type === 'debit');

      if (totalDeSaidas.length === 0) return;

      const totalSaida = totalDeSaidas.reduce((acc, registro) => {
        const valor = acc;

        return valor + registro.value
      }, 0);

      let valores;

      if (typeof (totalSaida) !== 'number') {
        valores = totalSaida.value;

      } else {
        valores = totalSaida;
      }

      const totalSaidaString = (`${(valores.value / 100)}`).includes('.') ? (`${(valores / 100)}`).replace('.', ',') : `${(valores / 100)}`;

      setSaidas(totalSaidaString);

      return totalSaidaString;
  }


  function valorTotal(entrada, saida) {
    if (!entrada) {
      entrada = '0';
    }

    if (!saida) {
      saida = '0';
    }

    const entradaSoma = Number(entrada.replace(',', '.'));
    const saidaSoma = Number(saida.replace(',', '.'));
    const resultado = entradaSoma - saidaSoma;

    const resultadoString = (`${resultado.toFixed(2)}`).includes('.') ? (`${resultado.toFixed(2)}`).replace('.', ',') : `${resultado.toFixed(2)}`;

    setSaldo(resultadoString);
  }

  function calcularSaldo(transacoes) {
    if (transacoes.length === 0) return;

    const entradaEncontrada = valorTotalEntrada(transacoes);
    const saidaEncontrada = valorTotalSaida(transacoes);

    valorTotal(entradaEncontrada, saidaEncontrada);
  }


  useEffect(() => {
    if (registros.length === 0) {
      return;
    }

    calcularSaldo(registrosTransacoes.current);

  }, [registrosTransacoes.current]);


  return (
    <div className="container-resume-btn-add">
      <div className="container-resume">
        <h1>Resumo</h1>

        <div className="entradas-saidas">
          <div className="entrada">
            <span>Entradas</span>
            <span
              className="in">
              {`R$ ${entradas}${(entradas.includes(',')) ? '' : ',00'}`}
            </span>
          </div>

          <div className="saida">
            <span>Saídas</span>
            <span
              className="out">
              {`R$ ${saidas}${(saidas.includes(',')) ? '' : ',00'}`}
            </span>
          </div>
        </div>

        <div className="saldo">
          <span>Saldo</span>
          <span
            className="balance">
            {`${saldo.includes('-') ? '-R$ ' + saldo.replace('-', '') : 'R$ ' + saldo}${(saldo.includes(',')) ? '' : ',00'}`}
          </span>
        </div>
      </div>

      <button className="btn-add" onClick={() => setMostrarModal(true)}>Adicionar Registro</button>
    </div>
  );
}

export default Resumo;