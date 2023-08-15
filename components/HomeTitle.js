import styles from '../styles/Home.module.css';

const HomeTitle = ({onTableChange, currentTable}) => {

    if (currentTable === "default") {
        return (
        <h1 className={styles.title}>Please&nbsp;
            <select defaultValue="default" className={styles.tableSelector} id="table_selector" type="list" onChange={(e) => onTableChange(e.target.value)} >
                <option disabled value="default"> -- select a table -- </   option>
                <option value="attack_ddos">Attack DDoS</   option>
                <option value="cwe">CWEs</option>
            </select>
        </h1>
    )} else {
        return (
            <h1 className={styles.title}>
              Query the &nbsp;
              <select defaultValue="default" className={styles.tableSelector} id="table_selector" type="list" onChange={(e) => onTableChange(e.target.value)} >
                <option disabled value="default"> -- select a table -- </option>
                <option value="attack_ddos">Attack DDoS</option>
                <option value="cwe">CWEs</option>
              </select>
              &nbsp;table
            </h1>
        )
    }
}

export default HomeTitle;