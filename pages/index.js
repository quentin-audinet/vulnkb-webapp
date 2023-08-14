import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import NUSLogo from "../public/logo_nus.png"

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

  const tableHeader = (<thead>
    <tr key="idxs">
      {
        // Get column names and create selection buttons
        columns.map((index) => (
          <th key={`idx_${index}`} className={styles.cells}><button id={index} select={isColumnSelected(index) ? "true" : "false"} className={styles.columnSelector} onClick={(e) => {changeState(e.target);fetchData(filter)}}>{index}</button></th>
        ))
      }
    </tr>
    </thead>);

  // Check is data is empty
  if (data[0] !== undefined && columns.length > 0) {
    
    return (
      <table className={`${styles.cells} ${styles.table}`}>
        {tableHeader}
        
        <tbody>
        {
          // Go through the table and create cells
          data.map((row) => (
          <tr key={`elem_+${row['id']}`}>
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

  // Get data with the filter and update the content
  fetchData = async (filter) => {
    if (getTableName() === "default") return;
    const cols=getSelectedColumns();
    const res = await fetch(`/api/db_query`, {
      method: "post",
      body: JSON.stringify({
        "action": "filter",
        filter,
        cols,
        table: getTableName()
      })
    });
    const newData = await res.json();
    setContent(createTable(columns, newData, filter, fetchData));
  };

  updateTable = async (table) => {
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

  // Allows instant refresh
  useEffect(() => {
    fetchData(filter);
  }, [filter]);

  useEffect(() => {
    fetchData(filter);
  }, [columns]);
  

  return (
    <div className={styles.container}>

      <Head>
        <title>Vulnerable Knowledge Database</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>

        <h1 className={styles.title}>
          Query the &nbsp;
          <select defaultValue="default" className={styles.tableSelector} id="table_selector" type="list" onChange={(e) => updateTable(e.target.value)} >
            <option disabled value="default"> -- select a table -- </option>
            <option value="attack_ddos">Attack DDoS</option>
            <option value="attack_bof">Attack BoF</option>
          </select>
          &nbsp;table
        </h1>

        
        <input className={styles.filter_input} id="query_input" type="text" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder='Filter' />
        

        <div className={styles.tableContainer}>{content}</div>
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