import React, { useState } from 'react';
import Header from './components/general/Header';
import Login from './components/pages/Login/Login';

import {
  Switch,
  Route,
  Redirect, BrowserRouter
} from "react-router-dom";
import { Router } from 'react-router';
import LoggedArea from './view/LoggedArea';
import { isAuthenticated } from './config/auth';
import LoginContext from './context/LoginContext';
import Register from './components/pages/Register';
import history from './config/history';
import Login401 from './components/pages/Login/Login401';

function App() {

  const [isLogged, setIsLogged] = useState(isAuthenticated())

  const PrivateRoute = ({ ...rest }) => {
    if (!isAuthenticated()) {
      return <Redirect to='/login'></Redirect>
    }
    return <Route {...rest}></Route>

  }

  return (
    <BrowserRouter>
      <Router history={history}>
        <LoginContext.Provider value={{ isLogged: isLogged, setIsLogged: setIsLogged }}>
          <Header></Header>
          <main>
            <Switch>

              <Route exact path='/login' component={Login}></Route>
              <Route exact path='/logint' component={Login401}></Route>
              <Route exact path='/register' component={Register}></Route>
              <PrivateRoute path='/' component={LoggedArea}></PrivateRoute>

            </Switch>
          </main>
        </LoginContext.Provider>
      </Router>
    </BrowserRouter>
  );

}

export default App;
