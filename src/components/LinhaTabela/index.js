import ModalExcluir from "../ModalExcluir";

import { parseISO, format } from 'date-fns'

function LinhaTabela({ urlBase, registros, registro, handleMostrarRegistros, mostrarModalEditar, setMostrarModalEditar, setRegistroEditavel }) {

  function dataTela(data) {
    if (!data) return;

    const dataFormatadaParaTela = format(parseISO(data), "dd/MM/yyyy");

    return dataFormatadaParaTela;
  }

  function valorTela(valor) {
    const valorReais = valor / 100;
    const valorReaisString = valorReais.toString();
    const valorReaisStringVirgula = valorReaisString.replace('.', ',');

    return valorReaisStringVirgula;
  }

  function mostrarModalConfirmacao(event) {
    if (event.target.nextElementSibling.classList.contains('hidden')) {
      event.target.nextElementSibling.classList.remove('hidden');
    } else {
      event.target.nextElementSibling.classList.add('hidden');
    }
  }

  function filtrarRegistroEditar(event) {
    if (registros.length === 0) return;

    const registroIndividual = registros.filter(registro => registro.id === Number(event.target.id));

    setRegistroEditavel(registroIndividual[0]);
    setMostrarModalEditar(!mostrarModalEditar);
  }


  return (
    <div className="table-body">
      <div key={registro.id} className="table-line">
        <div className="line-items data">{dataTela(registro.date)}</div>
        <div className="line-items dia-da-semana">{registro.week_day}</div>
        <div className="line-items descricao">{registro.description}</div>
        <div className="line-items categoria">{registro.category}</div>
        <div
          className="line-items valor"
          style={registro.type === 'credit' ? { color: "#7B61FF" } : { color: "#FA8C10" }}>
          {`${registro.type === 'debit' ? '-' : ''} R$ ${valorTela(registro.value)}${valorTela(registro.value).includes(',') ? '' : ',00'}`}
        </div>

        <div className="editar-deletar">
          <img id={registro.id} className=" line-items edit-icon" src="./assets/editar.svg" alt="Editar item" onClick={(e) => filtrarRegistroEditar(e)} />
          <div className="exclusao">
            <img className="line-items delete-icon" src="./assets/excluir.svg" alt="Excluir item" onClick={(e) => mostrarModalConfirmacao(e)} />

            {
              <ModalExcluir
                userId={registro.id}
                urlBase={urlBase}
                handleMostrarRegistros={handleMostrarRegistros}
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default LinhaTabela;
