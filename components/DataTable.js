import styles from '../styles/Home.module.css';
import TableBody from './TableBody';
import TableHeader from './TableHeader';

// Change the stat of a column by a click on it. The state define is a column has to be filtered or not
const changeState = (button) => {
    button.setAttribute("select", button.getAttribute("select") === "true" ? "false" : "true");
}

// Return true if the according column is selected
const isColumnSelected = (column) => {
    let element = document.getElementById(column);
    return element ? element.getAttribute("select") === "true" : false;
}

const DataTable = ({ columns, data, filter, fetchData }) => {

    return (
    <table className={`${styles.cells} ${styles.table}`}>
    
        <TableHeader 
            columns={columns}
            isColumnSelected={isColumnSelected}
            onColumnClicked={(col) => {changeState(col);fetchData(filter)}}
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