import { useEffect, useRef, useState } from "react";

import Selecao from '../Selecao'

function Filtro({ registros, arrayPrincipal, setRegistros }) {
  const diasDaSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState(false);

  const arrayFiltrado = useRef();
  arrayFiltrado.current = registros;


  const estadoDeClique = useRef(true);
  const idDoClique = useRef(false);
  const refChange = useRef(true);

  const arrayDeFiltrosDiaSemana = useRef([]);
  const arrayDeFiltrosCategoria = useRef([]);
  const [valorMinimo, setValorMinimo] = useState(0);
  const [valorMaximo, setValorMaximo] = useState(0);

  const [limpar, setLimpar] = useState(false);

  function aplicarFiltros() {
    if (arrayDeFiltrosDiaSemana.current.length === 0 &&
      arrayDeFiltrosCategoria.current.length === 0 &&
      valorMinimo === 0 && valorMaximo === 0) {

      return;
    }

    const filtro = [arrayDeFiltrosDiaSemana.current, arrayDeFiltrosCategoria.current, valorMinimo * 100, valorMaximo * 100];


    const arrayFiltradoResultado = arrayPrincipal.current.filter(registro => {

      if (filtro[0].length > 0 && filtro[1].length > 0 && filtro[2] > 0 && filtro[3] > 0) {
        if (filtro[0].includes(registro.week_day) &&
          filtro[1].includes(registro.category) &&
          registro.value >= filtro[2] && registro.value <= filtro[3]) {

          return registro;
        }
      }

      if (filtro[0].length > 0 && filtro[1].length > 0 && filtro[2] === 0 && filtro[3] > 0) {
        if (filtro[0].includes(registro.week_day) &&
          filtro[1].includes(registro.category) &&
          registro.value <= filtro[3]) {

          return registro;
        }
      }

      if (filtro[0].length > 0 && filtro[1].length > 0 && filtro[2] > 0 && filtro[3] === 0) {
        if (filtro[0].includes(registro.week_day) &&
          filtro[1].includes(registro.category) &&
          registro.value >= filtro[2]) {

          return registro;
        }
      }

      if (filtro[0].length > 0 && filtro[1].length === 0 && filtro[2] === 0 && filtro[3] > 0) {
        if (filtro[0].includes(registro.week_day) &&
          registro.value <= filtro[3]) {

          return registro;
        }
      }

      if (filtro[0].length > 0 && filtro[1].length === 0 && filtro[2] > 0 && filtro[3] === 0) {
        if (filtro[0].includes(registro.week_day) &&
          registro.value >= filtro[2]) {

          return registro;
        }
      }

      if (filtro[0].length > 0 && filtro[1].length > 0 && filtro[2] === 0 && filtro[3] === 0) {
        if (filtro[0].includes(registro.week_day) &&
          filtro[1].includes(registro.category)) {

          return registro;
        }
      }

      if (filtro[0].length > 0 && filtro[1].length === 0 && filtro[2] === 0 && filtro[3] === 0) {
        if (filtro[0].includes(registro.week_day)) {

          return registro;
        }
      }

      if (filtro[0].length === 0 && filtro[1].length > 0 && filtro[2] > 0 && filtro[3] > 0) {
        if (filtro[1].includes(registro.category) &&
          registro.value >= filtro[2] && registro.value <= filtro[3]) {

          return registro;
        }
      }

      if (filtro[0].length === 0 && filtro[1].length > 0 && filtro[2] === 0 && filtro[3] > 0) {
        if (filtro[1].includes(registro.category) &&
          registro.value <= filtro[3]) {

          return registro;
        }
      }

      if (filtro[0].length === 0 && filtro[1].length > 0 && filtro[2] > 0 && filtro[3] === 0) {
        if (filtro[1].includes(registro.category) &&
          registro.value >= filtro[2]) {

          return registro;
        }
      }

      if (filtro[0].length === 0 && filtro[1].length > 0 && filtro[2] === 0 && filtro[3] === 0) {
        if (filtro[1].includes(registro.category)) {
          return registro;
        }
      }

      if (filtro[0].length === 0 && filtro[1].length === 0 && filtro[2] > 0 && filtro[3] > 0) {
        if (registro.value >= filtro[2] && registro.value <= filtro[3]) {
          return registro;
        }
      }

      if (filtro[0].length === 0 && filtro[1].length === 0 && filtro[2] === 0 && filtro[3] > 0) {
        if (registro.value <= filtro[3]) {
          return registro;
        }
      }

      if (filtro[0].length === 0 && filtro[1].length === 0 && filtro[2] > 0 && filtro[3] === 0) {
        if (registro.value >= filtro[2]) {
          return registro;
        }
      }

    });


    setRegistros(arrayFiltradoResultado);

    arrayDeFiltrosDiaSemana.current = [];
    arrayDeFiltrosCategoria.current = [];
    
    setValorMinimo(0);
    setValorMaximo(0);
  }


  function limparFiltros() {
    arrayDeFiltrosDiaSemana.current = [];
    arrayDeFiltrosCategoria.current = [];
    
    setValorMinimo(0);
    setValorMaximo(0);
    
    setRegistros(arrayPrincipal.current);
    setLimpar(!limpar);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (arrayDeFiltrosDiaSemana.current.length === 0 &&
      arrayDeFiltrosCategoria.current.length === 0 &&
      valorMinimo === 0 && valorMaximo === 0) {

      return;
    }
  }

  function handleChangeMin(event) { 

    setValorMinimo(event.target.value);

    estadoDeClique.current = !estadoDeClique.current;

    idDoClique.current = true;
    refChange.current = false;
  }

  function handleChangeMax(event) {

    setValorMaximo(event.target.value);

    estadoDeClique.current = !estadoDeClique.current;

    idDoClique.current = true;
    refChange.current = false;
  }

  useEffect(() => {
    const novaCategoria = arrayPrincipal.current.map(item => item.category);

    const categorias = novaCategoria.filter((item, index) => {
      return novaCategoria.indexOf(item) === index;
    });

    setCarregando(false);
    setCategorias(categorias);
    setErros(false);
  }, []);

  useEffect(() => {
    if(limpar) {
      limparFiltros();
    }
  }, [])
  

  return (
    <div className="container-filters">
      <div className="container-filters-header">
        <p>Dia da semana</p>
        <div className="container-chip dias-da-semana">
          {
            diasDaSemana.map((dia, index) => {
              return (
                <Selecao
                  key={Math.random()}
                  id={index}
                  children={dia}
                  classe={'mini-card'}
                  diasDaSemana={diasDaSemana}
                  arrayDeFiltrosDiaSemana={arrayDeFiltrosDiaSemana}
                  estadoDeClique={estadoDeClique}
                  idDoClique={idDoClique}
                  refChange={refChange}
                />
              )
            })
          }
        </div>
      </div>

      <div className="container-filters-header">
        <p>Categoria</p>
        <div className="container-chip categorias">
          {
            (!carregando && !erros) &&
            categorias.map((item, index) => {
              return (
                <Selecao
                  key={Math.random()}
                  id={index}
                  children={item}
                  classe={'mini-card-categoria'}
                  categorias={categorias}
                  arrayDeFiltrosCategoria={arrayDeFiltrosCategoria}
                  estadoDeClique={estadoDeClique}
                  idDoClique={idDoClique}
                  refChange={refChange}
                />
              )
            })
          }
        </div>
      </div>

      <div className="container-filters-header valores">
        <p>Valor</p>
        <form>
          <label htmlFor="min-value">Min</label>
          <input
            id="min-value"
            type="number"
            value={valorMinimo}
            onChange={(e) => handleChangeMin(e)}
          />
        </form>

        <form>
          <label htmlFor="max-value">Max</label>
          <input
            id="max-value"
            type="number"
            value={valorMaximo}
            onChange={(e) => handleChangeMax(e)}
          />
        </form>
      </div>

      <button
        className="btn-clear-filters"
        onSubmit={(e) => handleSubmit(e)}
        onClick={() => limparFiltros()}
      >Limpar Filtros</button>

      <button
        className="btn-apply-filters"
        onSubmit={(e) => handleSubmit(e)}
        onClick={() => aplicarFiltros()}
      >Aplicar Filtros</button>
    </div>
  );
}

export default Filtro;