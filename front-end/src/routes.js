import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import ListarProjetos from './components/pages/ListarProjetos/ListarProjetos';
import CadastrarProjeto from './components/pages/CadastrarProjeto/CadastrarProjeto';

const Routers = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={ListarProjetos}></Route>
        <Route exact path='/projetos/projetos' component={CadastrarProjeto}></Route>
        <Route exact path="*" component={() => (<h1>404 | Not Found</h1>)} />
      </Switch>
    </Router>
  )
}

export default Routers
