import styles from '../styles/Home.module.css';

// Component used to create the page title
const HomeTitle = ({onTableChange, currentTable}) => {

    const available_tables = {"attack_ddos" : "Attack DDoS", "cwe" : "CWEs", "cve" : "CVEs"};

    const options = [];

    for (const key in available_tables) {
        if (available_tables.hasOwnProperty(key)) {
            options.push(
                <option key={key} value={key}>{available_tables[key]}</option>
            );
        }
    }

    const selector = (
        <select defaultValue="default" className={styles.tableSelector} id="table_selector" type="list" onChange={(e) => onTableChange(e.target.value)} >
            <option disabled value="default"> -- select a table -- </   option>
            {options}
        </select>
    );

    if (currentTable === "default") {
        return (
        <h1 className={styles.title}>Please&nbsp;
            {selector}
        </h1>
    )} else {
        return (
            <h1 className={styles.title}>
              Query the &nbsp;
              {selector}
              &nbsp;table
            </h1>
        )
    }
}

export default HomeTitle;   