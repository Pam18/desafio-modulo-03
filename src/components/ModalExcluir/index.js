import { useState } from "react/cjs/react.development";


function ModalExcluir({ userId, urlBase, handleMostrarRegistros }) {
    const [carregando, setCarregando] = useState(false);
    const [erros, setErros] = useState(false);

    function cancelarEFecharModal(event) {
        event.target.offsetParent.parentElement.classList.add('hidden');
    }

    async function handleExcluirRegistroEFecharModal(event, userId) {

        setCarregando(false);

        try {
            await fetch(`${urlBase}/${userId}`, {
                method: 'DELETE',
            });

            await handleMostrarRegistros();
        } catch (error) {
            setCarregando(false);
            setErros(true);

            console.log(error.message);
        }
        
        event.target.parentElement.parentElement.parentElement.classList.add('hidden');
        await handleMostrarRegistros();

    }

    return (
        <div className="modal-confirm hidden">
            <img className="img-span" src="./assets/triangulo-span.svg" alt="" />

            <div className="container-confirm-delete">
                <span>Apagar item?</span>
                <div className="btn-actions">
                    {
                        (!carregando && !erros) &&
                        <button
                            className="btn-actions-confirm-delete confirm"
                            onClick={(e) => handleExcluirRegistroEFecharModal(e, userId)}
                        >Sim</button>
                    }

                    <button
                        className="btn-actions-confirm-delete delete"
                        onClick={(e) => cancelarEFecharModal(e)}
                    >Não</button>
                </div>
            </div>
        </div>
    )
}

export default ModalExcluir;
