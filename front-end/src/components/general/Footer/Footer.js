import React from 'react'
import classes from './footer.module.css'

function Footer() {
    return (
        <footer className={classes.footer}>
            <div className="container">
                <p className='footer__description'>©2022 Gerenciador de Projetos – Todos os direitos reservados.</p>
            </div>
        </footer>
    )
}

export default Footer