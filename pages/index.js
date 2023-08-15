import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import NUSLogo from "../public/logo_nus.png"
import PageSelector from '../components/PageSelector';
import HomeTitle from '../components/HomeTitle';
import Filter from '../components/Filter';
import TableHeader from '../components/TableHeader';
import DataTable from '../components/DataTable';


// Return the columns used to filter
const getSelectedColumns = () => {
  let cols = []
  for (let col of document.getElementsByClassName(styles.columnSelector))
    if (col.getAttribute("select") === "true") cols.push(col.id);
  return cols;
}

const Home = () => {

  let fetchData;

  // States used for dynamic filtering
  const [filter, setFilter] = useState('')      // The current filter
  const [columns, setColumns] = useState([]);   // Colums of selected table
  const [itemsNumber, setItemsNumber] = useState(25); // Number of items by page
  const [currentPage, setCurrentPage] = useState(1);  // The current page
  const [totalItems, setTotalItems] = useState(0);
  const [totalPage, setTotalPage] = useState(Math.ceil(totalItems / itemsNumber));
  const [table, setTable] = useState('default')
  const [data, setData] = useState([])

  // Get data with the filter and update the content
  fetchData = async (filter) => {
    if (table === "default") return;

    const selected_columns=getSelectedColumns();

    const res = await fetch(`/api/db_query`, {
      method: "post",
      body: JSON.stringify({
        "action": "filter",
        filter,
        cols: selected_columns,
        table,
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
        table
      })
    });
    const count = (await res_count.json())[0]["COUNT(*)"];
    setTotalItems(count);

    setData(newData);
  };

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
        

        <div className={styles.tableContainer}>
          <DataTable
            columns={columns}
            data={data}
            filter={filter}
            fetchData={fetchData}
          />
        </div>

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