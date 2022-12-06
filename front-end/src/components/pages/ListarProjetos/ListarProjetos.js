import React, { useEffect, useState, useCallback, useContext } from "react";
import classes from "./listar-projetos.module.css";
import Projeto from "../../../services/projeto";
import Loader from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import AlertDialog from "../../general/alerts/AlertDialog";
import { Link } from "react-router-dom";
import {
  useHistory
} from "react-router-dom";
import EditarProjetoContext from '../../../context/EditarProjetoContext';
import { getUserId } from "../../../config/auth";

function ListarProjetos() {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoaded] = useState(false);
  const [projetosLength, setProjetosLength] = useState(0)
  const [showExclusionAlert, setShowExclusionAlert] = useState(false)
  const [exclusionAlert, setExclusionAlert] = useState({ projeto: '', deletarProjeto: deletarProjeto, delete: true })
  const [showDoneAlert, setShowDoneAlert] = useState(false)
  const [doneAlert, setDoneAlert] = useState({ projeto: '', finalizarProjeto: finalizarProjeto })
  const editar = useContext(EditarProjetoContext)
  const username = getUserId()
  const history = useHistory()



  const getList = useCallback(async () => {
    try {
      const projetosR = await Projeto.listarProjetos(username);
      if (projetosR.data.length === 0) {
        history.push('/projetos/criar')
      }
      setProjetos(projetosR.data);
      setProjetosLength(projetosR.data.length)
      setLoaded(true);
    } catch (error) {
    }
  }, [history, username]);

  useEffect(() => {
    document.title = 'Projetos'
    getList();
  }, [getList]);

  useEffect(() => {
    return () => {
      setProjetos([])
    };
  }, []);

  function navigateToCadastrarProjetosHandler() {
    editar.setProjetoCadastro({ novoProjeto: true })
  }

  function navigateToEditarProjetosHandler(projeto) {
    editar.setProjetoCadastro({ novoProjeto: false, projeto })
  }

  function handleDone({ id, nomeProjeto }) {
    const projeto = {
      id,
      nome: nomeProjeto
    }
    setShowDoneAlert(true)

    setDoneAlert({ projeto: projeto, finalizarProjeto: finalizarProjeto })
  }

  function handleDelete({ id, nomeProjeto }) {
    const projeto = {
      id,
      nome: nomeProjeto
    }
    setShowExclusionAlert(true)

    setExclusionAlert({ projeto: projeto, deletarProjeto: deletarProjeto, delete: true })
  }

  async function deletarProjeto({ id, nome }, confirmDelete) {
    if (confirmDelete === true) {
      try {
        await Projeto.deletarProjeto(id)
        getList();
      } catch (error) {
      }
    }
    setShowExclusionAlert(false)
  }

  async function finalizarProjeto({ id, nome }, confirmDelete) {
    if (confirmDelete === true) {
      try {
        await Projeto.finalizarProjeto(id)
        getList();
      } catch (error) {
      }
    }
    setShowDoneAlert(false)
  }

  const mostrarProjetos = () =>
    projetos.map((projeto, index) => {
      return (
        <section key={index} className={classes.projectCard}>
          <div className={classes.projectCard__rowTitle}>
            <h2 className={classes.projectCard__title}>{projeto.title}</h2>

            {projeto.done ? '' : <FontAwesomeIcon aria-label={`Finalizar projeto ${projeto.title}`}
              onClick={() => handleDone({ id: projeto.id, nomeProjeto: projeto.title })}
              className={classes.projectCard__done}
              size="1x"
              icon={faCheck}
            />}
            <Link to="/projetos/criar" onClick={() => navigateToEditarProjetosHandler(projeto)}>
              <FontAwesomeIcon aria-label={`Editar projeto ${projeto.title}`}
                className={classes.projectCard__edit}
                size="1x"
                icon={faEdit} />
            </Link>

            <FontAwesomeIcon aria-label={`Remover projeto ${projeto.title}`}
              onClick={() => handleDelete({ id: projeto.id, nomeProjeto: projeto.title })}
              className={classes.projectCard__trash}
              size="1x"
              icon={faTrashAlt}
            />
          </div>
          <div className={classes.projectCard__content}>
            <ul className={classes.projectCard__lista}>
              <li className={classes.projectCard__listItem}>{`Data de término: ${formatarData(new Date(projeto.deadline.substring(0, 10)))}`}</li>
              <li className={classes.projectCard__listItem}>{`Custo: ${projeto.cost}`}</li>
              <li className={classes.projectCard__listItem}>{`CEP: ${projeto.zip_code}`}</li>
              <li className={classes.projectCard__listItem}>{`Finalizado? ${projeto.done ? 'Sim' : 'Não'}`}</li>
            </ul>
          </div>
        </section>
      );
    });

  function formatarData(dataAtual) {
    function adicionaZero(numero) {
      if (numero <= 9)
        return "0" + numero;
      else
        return numero;
    }
    return (adicionaZero(dataAtual.getUTCDate().toString()) + "/" + (adicionaZero(dataAtual.getUTCMonth() + 1).toString()) + "/" + dataAtual.getUTCFullYear())
  }

  return (
    <div className={[classes.listarProjetos, "container"].join(" ")}>
      <h2 className={[classes.title, 'centered-title'].join(" ")}>Meus Projetos</h2>

      <section className={projetosLength <= 2 ? [classes.projects, classes.projectsWithTwoElements].join(' ') : classes.projects}>
        {!loading ? (
          <Loader className={classes.loader}
            type={"ThreeDots"}
            color={"#4385F5"}
            width={100}
            height={100}
          />
        ) : (
          mostrarProjetos()
        )}


      </section>
      {showExclusionAlert ? <AlertDialog {...exclusionAlert}></AlertDialog> : ''}
      {showDoneAlert ? <AlertDialog {...doneAlert}></AlertDialog> : ''}
      <div className={classes.addJogo}>
        <Link to='/projetos/criar' onClick={navigateToCadastrarProjetosHandler}>
          <Fab color="primary" aria-label="Criar um novo projeto">
            <AddIcon />
          </Fab>
        </Link>
      </div>

    </div>
  );
}

export default ListarProjetos;
