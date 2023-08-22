import styles from '../styles/Home.module.css';
import TableBody from './TableBody';
import TableHeader from './TableHeader';

// Change the status of a column by a click on it. The status defines if a column has to be filtered or not
const changeState = (button) => {
    button.setAttribute("select", button.getAttribute("select") === "true" ? "false" : "true");
}

// Return true if the according column is selected
const isColumnSelected = (column) => {
    let element = document.getElementById(column);
    return element ? element.getAttribute("select") === "true" : false;
}

// Component used as a layer for the table
const DataTable = ({ columns, sortedColumn, data, filter, fetchData, onSortedColumnChange }) => {

    return (
    <table className={`${styles.cells} ${styles.table}`}>
    
        <TableHeader 
            columns={columns}
            isColumnSelected={isColumnSelected}
            onColumnClicked={(col) => {changeState(col);fetchData(filter)}}
            onSortedColumnChange={(column, state) => onSortedColumnChange({column, state})}
            sortedColumn={sortedColumn}
        />

        {
            (data.length > 0 && columns.length > 0) ? (
                <TableBody
                    data={data}
                    columns={columns}
                    filter={filter}
                    isColumnSelected={isColumnSelected}
                />
            ) : (
                <tbody></tbody>
            )
        }
    </table>
        )
  };

export default DataTable;