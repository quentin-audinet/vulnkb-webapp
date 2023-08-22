import styles from '../styles/Home.module.css';

//Component used to create the filter input
const Filter = ({filter, onFilterChange}) => {

    return (<input className={styles.filter_input} id="query_input" type="text" value={filter} onChange={(e) => onFilterChange(e.target.value)} placeholder='Filter' />)
}

export default Filter;