/* eslint-disable react/prop-types */
import { useState } from 'react';
import styles from './Filter.module.scss';
function Filter({ buttons }) {
    const [activeButton, setActiveButton] = useState(0);
    const handleActiveButton = (id) => {
        setActiveButton(id);
    };
    return ( 
        <div className={styles.container}>
            {buttons.map((button) => (
                <button 
                    key={button.id}
                    className={activeButton === button.id ? styles.active : ''}
                    onClick={() => {
                        handleActiveButton(button.id)
                        button.onClick()
                    }}
                    >
                        {button.name}
                </button>
            ))}
        </div>
     );
}

export default Filter;