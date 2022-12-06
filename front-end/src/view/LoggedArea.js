import React, { useState } from 'react'
import {
  Switch,
  Route
} from "react-router-dom";
import ListarProjetos from '../components/pages/ListarProjetos';
import CadastrarProjeto from '../components/pages/CadastrarProjeto/CadastrarProjeto';
import EditarProjetoContext from '../context/EditarProjetoContext';


const LoggedArea = (props) => {
  const [projetoCadastro, setProjetoCadastro] = useState({ novoProjeto: true, projeto: {} })

  return (
    <>
      <Switch>
        <EditarProjetoContext.Provider value={{ projetoCadastro, setProjetoCadastro }}>
          <Route exact path={props.match.path} component={ListarProjetos}></Route>
          <Route exact path={`${props.match.path}projetos`} component={ListarProjetos}></Route>
          <Route exact path={`${props.match.path}projetos/criar`} component={CadastrarProjeto}></Route>
        </EditarProjetoContext.Provider>

      </Switch>
    </>
  )
}

export default LoggedArea
