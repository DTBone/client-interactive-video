/* eslint-disable react/prop-types */
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '~/index.css';
function GoogleLoginButton( {onClick} ) {
    return ( 
        <button className="h-full bg-white rounded p-1 flex flex-row gap-2 items-center justify-center"
        onClick={onClick}
        >
            <FontAwesomeIcon icon={faGoogle} size="lg" />
        GOOGLE
        </button>
     );
}

export default GoogleLoginButton;