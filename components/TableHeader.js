import styles from '../styles/Home.module.css';

const TableHeader = ({ columns, isColumnSelected, onColumnClicked}) => {

    return <thead>
        <tr key="idxs">
          {
            // Get column names and create selection buttons
            columns.map((index) => (
              <th key={`${index}`} className={styles.cells}><button id={index} select={isColumnSelected(index) ? "true" : "false"} className={styles.columnSelector} onClick={(e) => onColumnClicked(e.target)}>{index}</button></th>
            ))
          }
        </tr>
        </thead>
}

export default TableHeader;