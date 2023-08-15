import styles from '../styles/Home.module.css';

const PageSelector = ({totalPage, currentPage, onPageChange}) => {

    const first = Math.max(1, currentPage - 3);
    const last = Math.min(totalPage, first+6);

    const pageNumbers = Array.from({length: last-first+1}, (_, i) => i + first);

    return (
        <nav>
            <ul className={styles.pagination}>
                <li key="first">
                    &lt;&lt;
                </li>

                {   
                    pageNumbers.map((page) => (
                        <li
                            key={page}
                            className={currentPage === page ? styles.active : ''}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </li>
                    ))
                }

                <li key="last">
                    &gt;&gt;
                </li>
            </ul>
        </nav>
    );
}

export default PageSelector;