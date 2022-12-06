import http from '../config/config'

const listarProjetos = () => http.get(`/projects`)
const deletarProjeto = (id) => http.delete(`/projects/${id}`)
const criarProjeto = (title, zip_code, deadline, cost) => http.post('/projects', { title, zip_code, deadline, cost })
const editarProjeto = (id, title, zip_code, deadline, cost) => http.put(`/projects/${id}`, { title, zip_code, deadline, cost })
const finalizarProjeto = (id) => http.patch(`projects/${id}/done`)

export default { listarProjetos, deletarProjeto, criarProjeto, editarProjeto, finalizarProjeto }