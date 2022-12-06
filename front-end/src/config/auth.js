const TOKEN_KEY = 'tuba-card-token'
const USERNAME = 'tuba-card-username'

const getToken = () => localStorage.getItem(TOKEN_KEY)

const getUserId = () => localStorage.getItem(USERNAME)

const saveToken = (token, username) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USERNAME, username)
}

const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USERNAME)
    isAuthenticated()
}


const isAuthenticated = () => {
    return getToken() !== null
}


export {
    isAuthenticated,
    getToken,
    saveToken,
    removeToken,
    getUserId
}
