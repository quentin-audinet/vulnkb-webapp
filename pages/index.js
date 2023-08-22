import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import NUSLogo from "../public/logo_nus.png"
import PageSelector from '../components/PageSelector';
import HomeTitle from '../components/HomeTitle';
import Filter from '../components/Filter';
import DataTable from '../components/DataTable';


// Return the columns used to filter
const getSelectedColumns = () => {
  let cols = []
  for (let col of document.getElementsByClassName(styles.columnSelector))
    if (col.getAttribute("select") === "true") cols.push(col.id);
  return cols;
}

// Remove all the column from the filter
const resetColumnsState = () => {
  for (let col of document.getElementsByClassName(styles.columnSelector))
    if (col.getAttribute("select") === "true") col.setAttribute("select", "false");
}

// Return true if the filter is valid for querying the database, else false
const isFilterValid = (filter) => {
  filter = filter.trim()
  // the filter doesn't end with (, | or &
  if (filter.search(/(\(|\||&)$/g) !== -1) return false;
  // the filter doesn't start with ), | or &
  if (filter.search(/^(\)|\||&)/g) !== -1) return false;
  
  return true;
}

// Main function to render the page 
const Home = () => {

  let fetchData;

  // States used for dynamic interactions
  const [filter, setFilter] = useState('')                                          // The current filter. Default: nothing
  const [columns, setColumns] = useState([]);                                       // Colums name of selected table. Default: an empty array 
  const [itemsNumber, setItemsNumber] = useState(25);                               // Number of items by page. Default: 25
  const [currentPage, setCurrentPage] = useState(1);                                // The current page. Default the first one
  const [totalItems, setTotalItems] = useState(0);                                  // Total of item returned. Default: 0
  const [totalPage, setTotalPage] = useState(Math.ceil(totalItems / itemsNumber));  // Number of pages. Default 0 - Optional 
  const [table, setTable] = useState('default')                                     // Table to use. Default; default - fake table
  const [data, setData] = useState([])                                              // Data collected in the database. Default: an empty array
  const [sortedColumn, setSortedColumn] = useState({});                               // The column used to sort and the order. Default: an empty object

  // Get data with the filter and update the content
  fetchData = async (filter) => {
    // the 'default' table means that no table is selected
    if (table === "default") return;
    // If the filter isn't valid, don't query teh database
    if (!isFilterValid(filter)) return;

    // Get the column used for the filter
    const selected_columns=getSelectedColumns();

    // Query the database
    const res = await fetch(`/api/db_query`, {
      method: "post",
      body: JSON.stringify({
        "action": "filter",
        filter,
        cols: selected_columns,
        table,
        limit: itemsNumber,
        currentPage,
        order: sortedColumn
      })
    });
    const newData = await res.json();

    // Count all items satisfying this query in the database
    const res_count = await fetch(`/api/db_query`, {
      method: "post",
      body: JSON.stringify({
        "action": "count",
        filter,
        cols: selected_columns,
        table
      })
    });

    // Set the total of items
    try {
      const count = (await res_count.json())[0]["COUNT(*)"];
      setTotalItems(count);
    }
    catch {
      setTotalItems(0);
    }

    // Set the data
    setData(newData);
  };

  // Refresh data when the query, the columns, the number of items per page or the page have changed
  useEffect(() => {
    fetchData(filter);
  }, [filter, columns, itemsNumber, currentPage, sortedColumn]);

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
      resetColumnsState();
      setSortedColumn({});
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
        

        <div className={styles.tableContainer}>
          <DataTable
            columns={columns}
            sortedColumn={sortedColumn}
            data={data}
            filter={filter}
            fetchData={fetchData}
            onSortedColumnChange={setSortedColumn}
          />
        </div>
        
        <div>
          <PageSelector
            totalPage={totalPage}
            currentPage={currentPage}
            onPageChange={(page) => {setCurrentPage(page)}}
          />
        </div>

        <select className={styles.pageSizeSelector} value={itemsNumber} onChange={(e) => {setItemsNumber(parseInt(e.target.value)); setCurrentPage(1)}}>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
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