import './SessionButton.css';

function SessionButton( { saltarAUrl, email, icono } ) {

    return (
        <button className="btn btn-light btn-sm" 
                onClick={ ()=> saltarAUrl('/Cliente/LoginRegistro')} 
                >
            {/* mostrar icono y el email del usuario si no son NULL (sesion iniciada) sino mostrar "Mi Cuenta" */}
            {
                (email && icono) ?
                <>
                    <img src={icono} alt="icono usuario" className="rounded-circle me-2" style={{ width: '30px', height: '30px' }} />   
                    {email}
                </>
                :
                <>
                    <i className="fa-regular fa-user"></i> Mi Cuenta
                </>
            }
        </button>        
    )
}

export default SessionButton;