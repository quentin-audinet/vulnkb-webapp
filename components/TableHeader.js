import styles from '../styles/Home.module.css';
import Image from 'next/image';

const TableHeader = ({ columns, isColumnSelected, onColumnClicked, sortedColumn, onSortedColumnChange }) => {

    return <thead>
        <tr key="idxs">
          {
            // Get column names and create selection buttons
            columns.map((index) => (
              <th key={`${index}`} className={styles.cells}>
                <button id={index} select={isColumnSelected(index) ? "true" : "false"} className={styles.columnSelector} onClick={(e) => onColumnClicked(e.target)}>
                <span>{index}</span><Image
                    src={`/triangle_${index === sortedColumn.column ? sortedColumn.state : "right"}.png`}
                    width={12}
                    height={12}
                    className={styles.sortTriangle}
                    onClick={(e) => {onSortedColumnChange(e.target.parentElement.id, e.target.alt === "down" ? "up" : "down")}}
                    alt={index === sortedColumn.column ? sortedColumn.state : "right"}
                  />
                </button>
              </th>
            ))
          }
        </tr>
        </thead>
}

export default TableHeader;