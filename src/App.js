import { useEffect, useState, useRef } from 'react';
import './App.css';

import Filtro from './components/Filtro'
import Resumo from './components/Resumo'
import LinhaTabela from './components/LinhaTabela'
import ModalAdicionar from './components/ModalAdicionar'
import ModalEditar from './components/ModalEditar'

import { parseISO, getTime, getDay } from 'date-fns'

function App() {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarModalAdicionar, setMostrarModalAdicionar] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);


  const urlBase = `http://localhost:3333/transactions`;

  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [registroAlterado, setRegistroAlterado] = useState(false);
  const [registroEditavel, setRegistroEditavel] = useState();

  const [ordemData, setOrdemData] = useState('crescente');
  const [ordemDiaSemana, setOrdemDiaSemana] = useState('neutro');
  const [ordemValor, setOrdemValor] = useState('neutro');

  const arrayPrincipal = useRef([]);
  
  async function handleMostrarRegistros() {

    setCarregando(true);

    try {
      const respostaApi = await fetch(urlBase);
      const respostaApiJson = await respostaApi.json();

      setCarregando(false);
      arrayPrincipal.current = respostaApiJson;
      setRegistros(arrayPrincipal.current);
      setRegistroAlterado(true);
      setErros(false);

    } catch (error) {
      setCarregando(false);
      setRegistros([]);
      setErros(true);

      console.log(error.message);
    }
  }


  useEffect(() => {
    handleMostrarRegistros();
  }, []);


  function ordenarData() {
    if (ordemData === 'neutro' || ordemData === 'decrescente') {
      const dataOrdenada = registros.sort((a, b) => {
        const dataA = getTime(parseISO(a.date));
        const dataB = getTime(parseISO(b.date));

        if (dataB > dataA) {
          return -1;
        } else if (dataB < dataA) {
          return 1;
        } else {
          return 0;
        }

      });

      setOrdemData('crescente');
      setOrdemDiaSemana('neutro');
      setOrdemValor('neutro');

      setRegistros(dataOrdenada);
    }

    if (ordemData === 'crescente') {
      const dataOrdenada = registros.sort((b, a) => {
        const dataA = getTime(parseISO(a.date));
        const dataB = getTime(parseISO(b.date));

        if (dataB > dataA) {
          return -1;
        } else if (dataB < dataA) {
          return 1;
        } else {
          return 0;
        }

      });

      setOrdemData('decrescente');
      setOrdemDiaSemana('neutro');
      setOrdemValor('neutro');

      setRegistros(dataOrdenada);
    }
  }

  function ordenarDiaSemana() {
    if (ordemDiaSemana === 'neutro' || ordemDiaSemana === 'decrescente') {
      const diaOrdenado = registros.sort((a, b) => {
        const dataA = getDay(parseISO(a.date));
        const dataB = getDay(parseISO(b.date));

        if (dataB > dataA) {
          return -1;
        } else if (dataB < dataA) {
          return 1;
        } else {
          return 0;
        }

      });

      setOrdemData('neutro');
      setOrdemDiaSemana('crescente');
      setOrdemValor('neutro');

      setRegistros(diaOrdenado);
    }

    if (ordemDiaSemana === 'crescente') {
      const diaOrdenado = registros.sort((b, a) => {
        const dataA = getDay(parseISO(a.date));
        const dataB = getDay(parseISO(b.date));

        if (dataB > dataA) {
          return -1;
        } else if (dataB < dataA) {
          return 1;
        } else {
          return 0;
        }

      });

      setOrdemData('neutro');
      setOrdemDiaSemana('decrescente');
      setOrdemValor('neutro');

      setRegistros(diaOrdenado);
    }
  }


  function ordenarValor() {
    if (ordemValor === 'neutro' || ordemValor === 'decrescente') {
      const registrosOrdenadosValor = registros.sort((a, b) => a.value - b.value);

      setOrdemValor('crescente');
      setOrdemDiaSemana('neutro');
      setOrdemData('neutro');

      setRegistros(registrosOrdenadosValor);
    }

    if (ordemValor === 'crescente') {
      const registrosOrdenadosValor = registros.sort((a, b) => b.value - a.value);

      setOrdemValor('decrescente');
      setOrdemDiaSemana('neutro');
      setOrdemData('neutro');

      setRegistros(registrosOrdenadosValor);
    }
  }

  return (
    <div className="App">
      <div className="container-header">
        <img src="./assets/logo.svg" alt="" />
        <h1>Dindin</h1>
      </div>

      <div className="container-body">
        <div className="main">
          <button className="open-filters-button" onClick={() => setMostrarFiltros(!mostrarFiltros)}>
            <img src="./assets/icon-filtro.svg" alt="Ícone de filtro" />
            <span>Filtrar</span>
          </button>

          {
            mostrarFiltros &&
            <Filtro
              key={Math.random()}
              registros={registros}
              arrayPrincipal={arrayPrincipal}
              setRegistros={setRegistros}
            />
          }

          <div className="table">
            <div className="table-head">
              <div className="column-title data" onClick={ordenarData}>
                <span id="date">Data</span>
                <img className={ordemData === 'crescente' ? "" : "hidden"}
                  src="./assets/ordenar-crescente.svg"
                  alt=""
                />

                <img className={ordemData === 'decrescente' ? "" : "hidden"}
                  src="./assets/ordenar-decrescente.svg"
                  alt=""
                />
              </div>

              <div className="column-title dia-da-semana" onClick={ordenarDiaSemana}>
                <span id="week-day">Dia da semana</span>
                <img className={ordemDiaSemana === 'crescente' ? "" : "hidden"}
                  src="./assets/ordenar-crescente.svg"
                  alt=""
                />

                <img className={ordemDiaSemana === 'decrescente' ? "" : "hidden"}
                  src="./assets/ordenar-decrescente.svg"
                  alt=""
                />
              </div>

              <div className="column-title descricao" >Descrição</div>
              <div className="column-title categoria" >Categoria</div>

              <div className="column-title valor" onClick={ordenarValor}>
                <span id="value">Valor</span>
                <img className={ordemValor === 'crescente' ? "" : "hidden"}
                  src="./assets/ordenar-crescente.svg"
                  alt=""
                  />

                <img className={ordemValor === 'decrescente' ? "" : "hidden"}
                  src="./assets/ordenar-decrescente.svg"
                  alt=""
                />
              </div>
            </div>

            {
              (!carregando && !erros) &&
              registros.map((registro) => {
                return (
                  <LinhaTabela
                    key={Math.random()}
                    urlBase={urlBase}
                    registros={registros}
                    registro={registro}
                    handleMostrarRegistros={handleMostrarRegistros}
                    mostrarModalEditar={mostrarModalEditar}
                    setMostrarModalEditar={setMostrarModalEditar}
                    setRegistroEditavel={setRegistroEditavel}
                  />
                )
              })
            }
          </div>

        </div>

        {
          (!carregando && !erros && registroAlterado) &&
          <Resumo
            key={Math.random()}
            setMostrarModal={setMostrarModalAdicionar}
            registros={registros}
            arrayPrincipal={arrayPrincipal}
          />
        }
      </div>

      {
        mostrarModalAdicionar &&
        <ModalAdicionar
          key={Math.random()}
          mostrarModalAdicionar={mostrarModalAdicionar}
          setMostrarModalAdicionar={setMostrarModalAdicionar}
          urlBase={urlBase}
          handleMostrarRegistros={handleMostrarRegistros}
        />
      }

      {
        mostrarModalEditar &&
        <ModalEditar
          key={Math.random()}
          mostrarModalEditar={mostrarModalEditar}
          setMostrarModalEditar={setMostrarModalEditar}
          urlBase={urlBase}
          handleMostrarRegistros={handleMostrarRegistros}
          registroEditavel={registroEditavel}
        />
      }
    </div>
  )
}

export default App;
