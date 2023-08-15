import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import NUSLogo from "../public/logo_nus.png"
import PageSelector from '../components/PageSelector';
import HomeTitle from '../components/HomeTitle';
import Filter from '../components/Filter';
import TableHeader from '../components/TableHeader';

// Highlight some text
const highlight = (text, needle) => {
  if (text === undefined || text === null) return (text);
  let parts = String(text).split(RegExp(needle, "gi"));
  let id = 0;

  return (
    <div>
      {parts[0]}
      {
        parts.slice(1).map((part) => (
         <span key={id++}><b className={styles.highlight}>{needle}</b>{part}</span>
        ))
      }
    </div>
  )
}

// Change the stat of a column by a click on it. The state define is a column has to be filtered or not
const changeState = (button) => {
  button.setAttribute("select", button.getAttribute("select") === "true" ? "false" : "true");
}


// Return true if the according column is selected
const isColumnSelected = (column) => {
  let element = document.getElementById(column);
  return element ? element.getAttribute("select") === "true" : false;
}

// Return the columns used to filter
const getSelectedColumns = () => {
  let cols = []
  for (let col of document.getElementsByClassName(styles.columnSelector))
    if (col.getAttribute("select") === "true") cols.push(col.id);
  return cols;
}

const getTableName = () => {
  return document.getElementById("table_selector").value;
}

// Format row data from database into a HTML table
// If data is empty, display a nothing message
// The table is formatted independantly of the fetched table in the database
const createTable = (columns, data, filter, fetchData) => {

  const tableHeader =
  <TableHeader 
    columns={columns}
    isColumnSelected={isColumnSelected}
    onColumnClicked={(col) => {changeState(col);fetchData(filter)}}
  />;

  // Check is data is empty
  if (data[0] !== undefined && columns.length > 0) {
    
    return (
      <table className={`${styles.cells} ${styles.table}`}>
        {tableHeader}
        
        <tbody>
        {
          // Go through the table and create cells
          data.map((row) => (
          <tr key={`${row['id']}`}>
            {columns.map((index) => (
            <td key={index+row['id']} className={styles.cells}>{filter && filter.length >= 2 && isColumnSelected(index) ? highlight(row[index], filter) : row[index]}</td>
          ))}
          </tr>
        )
        )}
        </tbody>
      </table>
    )
    } else {
      // data is empty
      return (<div><table className={`${styles.cells} ${styles.table}`}>{tableHeader}<tbody><tr></tr></tbody></table><p className={styles.noResult}>Nothing to display !</p></div>)
    }
}

const Home = () => {

  let fetchData;
  let updateTable;

  // States used for dynamic filtering
  const [filter, setFilter] = useState('')      // The current filter
  const [columns, setColumns] = useState([]);   // Colums of selected table
  const [content, setContent] = useState('');   // The current HTML table to display
  const [itemsNumber, setItemsNumber] = useState(25); // Number of items by page
  const [currentPage, setCurrentPage] = useState(1);  // The current page
  const [totalItems, setTotalItems] = useState(0);
  const [totalPage, setTotalPage] = useState(Math.ceil(totalItems / itemsNumber));
  const [table, setTable] = useState('default')

  // Get data with the filter and update the content
  fetchData = async (filter) => {
    if (getTableName() === "default") return;

    const selected_columns=getSelectedColumns();

    const res = await fetch(`/api/db_query`, {
      method: "post",
      body: JSON.stringify({
        "action": "filter",
        filter,
        cols: selected_columns,
        table: getTableName(),
        limit: itemsNumber,
        currentPage
      })
    });
    const newData = await res.json();


    const res_count = await fetch(`/api/db_query`, {
      method: "post",
      body: JSON.stringify({
        "action": "count",
        filter,
        cols: selected_columns,
        table: getTableName()
      })
    });
    const count = (await res_count.json())[0]["COUNT(*)"];
    setTotalItems(count);

    setContent(createTable(columns, newData, filter, fetchData));
  };

  updateTable = async (new_table) => {
    setTable(new_table)
    const res = await fetch(`/api/db_query`, {
      method: "post",
      body: JSON.stringify({
        "action": "get_columns",
        table,
      })
    });
    
  }

  // Refresh data when the query, the columns, the number of items per page or the page have changed
  useEffect(() => {
    fetchData(filter);
  }, [filter, columns, itemsNumber, currentPage]);

  // Change the PageSelector when either the total of all items or the amount of items per page have changed
  useEffect(() => {
    setTotalPage(Math.ceil(totalItems / itemsNumber));
  }, [totalItems, itemsNumber]);

  // When the table has changed, get the new columns and update the content
  useEffect(() => {
    const fetch_columns = async () => {
      const res = await fetch(`/api/db_query`, {
        method: "post",
        body: JSON.stringify({
          "action": "get_columns",
          table,
        })
      });
      const newColumns = (await res.json()).map((c) => (c["column_name"]));
      setColumns(newColumns);
    }
    fetch_columns();
  }, [table]);

  // After updating columns, go back to first page
  useEffect(() => {
    setCurrentPage(1);
  }, [columns])

  

  return (
    <div className={styles.container}>

      <Head>
        <title>Vulnerable Knowledge Database</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>

        <HomeTitle
          currentTable={table}
          onTableChange={setTable}
        />

        
        <Filter
          filter={filter}
          onFilterChange={setFilter}
        />
        

        <div className={styles.tableContainer}>{content}</div>
        <div>
          <PageSelector
            totalPage={totalPage}
            currentPage={currentPage}
            onPageChange={(page) => {setCurrentPage(page)}}
          />
          <select value={itemsNumber} onChange={(e) => {setItemsNumber(parseInt(e.target.value)); setCurrentPage(1)}}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </main>


      <footer>
          <Image
            src={NUSLogo} 
            alt="NUS School of Computing"
            height={70}
            />
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        footer {
          width: 100%;
          height: 150px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

export default Home;