import styles from '../styles/Home.module.css';

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

const TableBody = ({ data, columns, filter, isColumnSelected}) => {

    return(
    
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
  )}

export default TableBody;