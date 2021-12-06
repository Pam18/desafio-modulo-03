import { useRef, useState } from "react";

function Selecao({ id, children, classe, diasDaSemana, categorias, arrayDeFiltrosDiaSemana, arrayDeFiltrosCategoria, estadoDeClique, idDoClique, refChange }) {

    const [clique, setClique] = useState(estadoDeClique.current);
    const referencia = useRef();

    let primeiravez;

    if (idDoClique && arrayDeFiltrosDiaSemana) {
        if (idDoClique.current && arrayDeFiltrosDiaSemana.current.length > 0) {

            brancoRoxo(referencia);
            refChange.current = false;

        } else {
            primeiravez = false;
        }
    }

    if (idDoClique && arrayDeFiltrosCategoria) {
        if (idDoClique.current && arrayDeFiltrosCategoria.current.length > 0) {
            brancoRoxo(referencia);
            refChange.current = false;

        } else {

            primeiravez = false;
        }
    }

    function brancoRoxo(referencia) {
        if (arrayDeFiltrosDiaSemana) {

            if (arrayDeFiltrosDiaSemana.current.length > 0) {

                if (referencia.current) {
                    if ((arrayDeFiltrosDiaSemana.current.includes(referencia.current.innerText))) {

                        referencia.current.style.background = '#7B61FF';

                        referencia.current.lastChild.src = 'http://localhost:3000/assets/close-categoria.svg';

                    } else {
                        referencia.current.style.background = '#FAFAFA';
                        referencia.current.lastChild.src = 'http://localhost:3000/assets/adicionar-categoria.svg';
                    }

                } else {

                    const verificacao = diasDaSemana.map(dia => {
                        return arrayDeFiltrosDiaSemana.current.filter
                            (item => item[0] !== dia);
                    })

                    primeiravez = verificacao[0];
                }
            } else {

                referencia.current.style.background = '#FAFAFA';
                referencia.current.lastChild.src = 'http://localhost:3000/assets/adicionar-categoria.svg';
            }

            return;
        }

        if (arrayDeFiltrosCategoria) {
            if (arrayDeFiltrosCategoria.current.length > 0) {
                if (referencia.current) {
                    if ((arrayDeFiltrosCategoria.current.includes(referencia.current.innerText))) {

                        referencia.current.style.background = '#7B61FF';

                        referencia.current.lastChild.src = 'http://localhost:3000/assets/close-categoria.svg';
                    } else {
                        referencia.current.style.background = '#FAFAFA';

                        referencia.current.lastChild.src = 'http://localhost:3000/assets/adicionar-categoria.svg';
                    }

                } else {

                    const verificacao = categorias.map(categoria => {
                        return arrayDeFiltrosCategoria.current.filter
                            (item => item[0] !== categoria);
                    })

                    primeiravez = verificacao[0];
                }

            } else {
                referencia.current.style.background = '#FAFAFA';
                referencia.current.lastChild.src = 'http://localhost:3000/assets/adicionar-categoria.svg';
            }
            return;
        }
    }

    function alternarClique() {
        estadoDeClique.current = !estadoDeClique.current;

        setClique(estadoDeClique.current);


        return clique;
    }

    function handleClick(event) {
        alternarClique();

        if (diasDaSemana) {
            const botaoClicado = diasDaSemana[event.target.id];

            if (!arrayDeFiltrosDiaSemana.current.includes(botaoClicado)) {

                arrayDeFiltrosDiaSemana.current.push(botaoClicado);

            } else {
                const filtroExcluido = arrayDeFiltrosDiaSemana.current.findIndex(item => item === diasDaSemana[event.target.id]);

                arrayDeFiltrosDiaSemana.current.splice(filtroExcluido, 1);
            }


        } else if (categorias) {
            const botaoClicado = categorias[event.target.id];

            if (!arrayDeFiltrosCategoria.current.includes(botaoClicado)) {

                arrayDeFiltrosCategoria.current.push(botaoClicado);

            } else {
                const filtroExcluido = arrayDeFiltrosCategoria.current.findIndex(item => item === categorias[event.target.id]);

                arrayDeFiltrosCategoria.current.splice(filtroExcluido, 1);
            }

        }

        brancoRoxo(referencia);
    }

    return (
        <div
            className={classe}
            id={id}
            ref={referencia}
            style={{ background: (primeiravez && primeiravez.includes(children)) ? '#7B61FF' : '#FAFAFA' }}
            onClick={(e) => handleClick(e)}
            on
        >

            <span id={id}>{children}</span>

            <img
                id={id}
                className="icon-filter"
                src={(primeiravez && primeiravez.includes(children)) ? './assets/close-categoria.svg' : './assets/adicionar-categoria.svg'}
                alt="Filtro"
            />
        </div>
    )
}

export default Selecao;

