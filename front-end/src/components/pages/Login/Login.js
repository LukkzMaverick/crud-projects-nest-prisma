import React, { useState, useContext, Fragment, useEffect } from 'react';
import classes from './login.module.css'
import user from '../../../services/user'
import { saveToken, getToken } from '../../../config/auth';
import { useHistory } from 'react-router-dom';
import LoginContext from '../../../context/LoginContext';
import http from '../../../config/config';
import Alert from '@material-ui/lab/Alert';
import { CircularProgress } from '@material-ui/core';
import { capitalizeFirstLetter, parseJwt } from '../../../config/util';

function Login() {
  const [loading, setLoading] = useState(false)
  const [mostrarAlertError, setMostrarAlertError] = useState(false)
  const [mensagensErro, setMensagensErro] = useState([])
  const history = useHistory()
  const [form, setForm] = useState({
    username: '',
    password: '',
  })
  const login = useContext(LoginContext)

  useEffect(() => {
    document.title = 'Login'
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

  function formHandler(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  const handleLogin = async () => {
    setLoading(true)
    try {
      const { data } = await user.logar(form)
      const objToken = parseJwt(data.token)
      saveToken(data.token, objToken.username)
      login.setIsLogged(true)
      http.defaults.headers.Authorization = `Bearer ${getToken()}`
      http.defaults.headers.username = objToken.username
      history.push('/projetos')
    } catch (error) {
      let erros = []
      if (typeof error.response.data.message == "string") {
        erros.push(<li key={'fixed'} >{capitalizeFirstLetter(error.response.data.message)}</li>)
      } else {
        error.response.data.message.map((error, index) => {
          return erros.push(<li key={index} >{capitalizeFirstLetter(error)}</li>)
        })
      }

      setLoading(false)
      setMostrarAlertError(true)
      setMensagensErro(<Fragment>{erros}</Fragment>)
    }
  }

  return (


    <div className='container'>
      <form className={classes.login}>
        <h2 className={[classes.login__title, "centered-title"].join(" ")}>Login</h2>
        {mostrarAlertError ? <Alert closeText="Fechar" onClose={() => setMostrarAlertError(false)} className={classes.alertError} severity="error">
          <ul>
            {mensagensErro}
          </ul>
        </Alert> : ''}
        <label className={classes.login__label} htmlFor='username'>Username</label>
        <input onChange={formHandler} value={form.username} className={classes.login__input} id='username' name='username' type='text'></input>
        <label className={classes.login__label} htmlFor='password'>Senha</label>
        <input onChange={formHandler} value={form.password} className={classes.login__input} id='password' name='password' type='password'></input>
        {loading ? <CircularProgress size={40}></CircularProgress> : ''}
        <button id={'botaoLogin'} type='button' onClick={() => handleLogin()} className={classes.login__button}>Entrar</button>
      </form>
    </div>
  )
}

export default Login;