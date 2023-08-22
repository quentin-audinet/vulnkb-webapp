import styles from '../styles/Home.module.css';

// Highlight the text searched
const highlight = (text, filter) => {
  text = String(text);
  const SPACE = "%nbsp;";
  // Save spaces
  filter = filter.replace(/ +/g, ' ').replace(/(\w) (\w)/g, `$1${SPACE}$2`).replaceAll(/(\w+,)*\w+:/g, '');

  // Remove the end of the query while it isn'd valid to keep previous results
  while (filter.endsWith("&") ||
        filter.endsWith("|") ||
        filter.endsWith("(") ||
        filter.endsWith(" ")) {
          filter = filter.replace(/.$/,'');
        }

  // Match on the keywords        
  let regex = new RegExp(`(${filter.replace(/(&)+/g, "|").replaceAll(/(\|)+/g, "|").replaceAll(/( |\(|\))/g, "").replaceAll(SPACE, " ")})`, 'gi');

  const parts = text.split(regex);

  // Replace the text with highlight
  const highlighted = parts.map((part, index) => (
    regex.test(part) ? <span key={index}><b className={styles.highlight}>{part}</b></span> : <span key={index}>{part}</span>
  ));

  return highlighted;
}

// Component to create the body of the table used to display the results
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