import styles from '../styles/Home.module.css';

const highlight = (text, filter) => {
  // Transform filter into a regex TODO
  text = String(text);
  filter = filter.replaceAll(/(\w+,)*\w+:/g, '');
  while (filter.endsWith("&") ||
        filter.endsWith("|") ||
        filter.endsWith("(") ||
        filter.endsWith(" ")) {
          filter = filter.replace(/.$/,'');
        }
  let regex = new RegExp(`(${filter.replaceAll("&&", "|").replaceAll("||", "|").replaceAll(" ", "")})`, 'gi');

  const parts = text.split(regex);
  const highlighted = parts.map((part, index) => (
    regex.test(part) ? <span key={index}><b className={styles.highlight}>{part}</b></span> : <span key={index}>{part}</span>
  ));

  return highlighted;
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