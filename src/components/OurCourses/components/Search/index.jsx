
import styles from './Search.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function Search() {
    
    return (
        
            <div className={styles.groupSearchWrapper}>
                <div className={styles.groupSearch}>
                    <div className={styles.inputArea}>
                        <input
                            className={styles.inputSearch}
                            type="text"
                            placeholder="Tìm kiếm"
                            spellCheck="false"
                            >
                        </input>
                    </div>
                    <button className={styles.btnSearch}>
                        <FontAwesomeIcon color="black" size='2xl' icon={faMagnifyingGlass} />
                    </button>
                </div>
            </div>
    );
}

export default Search;