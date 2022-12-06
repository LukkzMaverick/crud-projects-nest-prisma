import React, { useState, Fragment, useEffect, useContext } from 'react'
import classes from './cadastrar-projeto.module.css'
import projeto from '../../../services/projeto'
import Alert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom';
import EditarProjetoContext from '../../../context/EditarProjetoContext';
import { capitalizeFirstLetter } from '../../../config/util';

function CadastrarProjeto() {
    const [mostrarErros, setMostrarErros] = useState(false)
    const [mostrarAlertSucess, setMostrarAlertSucess] = useState(false)
    const [mensagensErro, setMensagensErro] = useState([])
    const [botaoHabilitado, setBotaoHabilitado] = useState(true)
    const history = useHistory()
    const editar = useContext(EditarProjetoContext)
    const novoProjeto = editar.projetoCadastro.novoProjeto
    const [form, setForm] = useState({
        title: '',
        zip_code: null,
        deadline: '',
        cost: null,
    })


    useEffect(() => {
        document.addEventListener('keypress', enviarFormPeloEnter)
        return () => {
            document.removeEventListener('keypress', enviarFormPeloEnter)
        };

        function enviarFormPeloEnter(e) {
            if (e.key === 'Enter') {
                let botaoLogin = document.querySelector('#botaoLogin')
                botaoLogin.click()
            }
        }

    }, [])


    useEffect(() => {
        if (novoProjeto === true) {
            document.title = 'Criar Projeto'
        } else {
            document.title = 'Editar Projeto'
            const projeto = editar.projetoCadastro.projeto
            setForm({ title: projeto.title, deadline: projeto.deadline.substring(0, 10), zip_code: projeto.zip_code, cost: projeto.cost })
        }
        return () => {
        };
    }, [editar.projetoCadastro.projeto, novoProjeto])

    function formHandler(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }

    function isFormValid() {
        let nomeJogoValidation = false
        let quantidadeDePropriedadesValidation = false
        let retorno = []
        if (form.nomeProjeto !== '') {
            nomeJogoValidation = true
        } else {
            retorno.push('O campo Nome do jogo é obrigatório.')
        }
        if (form.quantidadePropriedades !== '') {
            quantidadeDePropriedadesValidation = true
        } else {
            retorno.push('O campo Quantidade de atributos é obrigatório.')
        }
        if (nomeJogoValidation && quantidadeDePropriedadesValidation)
            return true
        else return Array.from(retorno)
    }

    async function requestHandler(requestType) {
        if (isFormValid() === true) {
            setMostrarErros(false)
            setMensagensErro([])
            const { title, zip_code, deadline, cost } = form
            let response;
            try {
                switch (requestType) {
                    case 'post': response = await projeto.criarProjeto(title, parseInt(zip_code), deadline, parseFloat(cost)); break;
                    case 'put': response = await projeto.editarProjeto(editar.projetoCadastro.projeto.id, title, parseInt(zip_code), deadline, parseFloat(cost)); break;
                    default: alert("Ocorreu um erro inesperado. Contate a equipe de desenvolvimento.")
                }
            } catch (error) {
                response = error.response
            }
            if (response?.status === 201 || response?.status === 200) {
                setMostrarAlertSucess(true)
                setBotaoHabilitado(false)
                setTimeout(() => {
                    history.push('/projetos')
                }, 3000);
            } else {
                let erros = []
                if (typeof response.data.message.length == 'string') {
                    erros.push(response.data.message)
                } else {
                    erros = response.data.message
                }
                displayErrors(erros)
            }
        } else {
            const errors = isFormValid()
            displayErrors(errors)
        }
    }

    function displayErrors(errors) {
        let erroList = []
        errors.forEach((erro) => {
            return erroList.push(<Fragment><li>{capitalizeFirstLetter(erro)}</li></Fragment>)
        })

        setMostrarErros(true)
        setMensagensErro(erroList)
    }

    return (
        <div className={[classes.criarJogo, 'container'].join(' ')}>
            <h2 className={[classes.criarJogo__title, "centered-title"].join(" ")}>{novoProjeto ? 'Criar Projeto' : 'Editar Projeto'}</h2>
            <form className={classes.criarJogo__form}>
                {mostrarAlertSucess ? <Alert closeText="Fechar" onClose={() => setMostrarAlertSucess(false)} className={classes.criarJogo__sucessAlert} severity="success">
                    {novoProjeto ? 'Projeto criado com sucesso!' : 'Projeto editado com sucesso!'}
                </Alert> : ''}
                <ul className={classes.criarJogo__errorList}>
                    {mostrarErros ? <Alert closeText="Fechar" onClose={() => setMostrarErros(false)} className={classes.criarJogo__errorMessage} severity="error">
                        {mensagensErro}
                    </Alert> : ''}
                </ul>
                <label htmlFor="title">Nome do Projeto</label>
                <input onChange={formHandler} type="text" name="title" id="title" value={form.title} required />

                <label htmlFor="cost">Custo</label>
                <input onChange={formHandler} type="number" name="cost" id="cost" value={form.cost} required />

                <label htmlFor="deadline">Data de entrega do projeto</label>
                <input onChange={formHandler} type="date" name="deadline" id="deadline" value={form.deadline} required />

                <label htmlFor="zip_code">Código Postal</label>
                <input onChange={formHandler} type="number" name="zip_code" id="zip_code" value={form.zip_code} required />

                <button disabled={!botaoHabilitado} onClick={novoProjeto ? () => requestHandler('post') : () => requestHandler('put')} className={classes.criarJogo__button} type="button">{novoProjeto ? 'Criar' : 'Editar'}</button>
            </form>
        </div>
    )

}

export default CadastrarProjeto