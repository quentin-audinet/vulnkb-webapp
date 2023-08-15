import styles from '../styles/Home.module.css';

const PageSelector = ({totalPage, currentPage, onPageChange}) => {

    const first = Math.max(1, currentPage - 3);
    const last = Math.min(totalPage, first+6);

    const pageNumbers = Array.from({length: last-first+1}, (_, i) => i + first);

    return (
        <nav>
            <ul className={styles.pagination}>
                {
                    currentPage !== 1 && (
                    <li key="first" onClick={() => onPageChange(1)}>
                        1 ... &lt;&lt;
                    </li>
                    )
                }

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

                {
                    (currentPage !== totalPage && totalPage !== 0) && (
                    <li key="last" onClick={() => onPageChange(totalPage)}>
                        &gt;&gt; ... {totalPage}
                    </li>
                    )
                }
            </ul>
        </nav>
    );
}

export default PageSelector;