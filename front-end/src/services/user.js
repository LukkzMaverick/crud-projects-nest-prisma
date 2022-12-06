import http from '../config/config';

const logar = (data) => http.post('/auth/login', data)
const registrar = (data) => http.post('/auth/register', data)

export default { logar, registrar }