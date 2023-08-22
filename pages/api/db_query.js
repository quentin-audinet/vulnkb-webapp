import executeQuery from "../../lib/db";

// Build the condition for the SQL request from the quey in a logical format
// Ex: A && B || C => WHERE X LIKE A AND X LIKE B OR X LIKE C
const buildLogicalQuery = (filter_query, selected_columns) => {

    const SPACE = '%nbsp;'

    let new_query = "";
    let new_values = [];

    // Replace all meaning spaces by a special value to replace again later
    filter_query = filter_query.replace(/ +/g, ' ').replace(/(\w) (\w)/g, `$1${SPACE}$2`);

    // Replace | and & symbols by their SQL equivalent
    filter_query = filter_query.replace(/(&)+/g, " AND ");
    filter_query = filter_query.replace(/(\|)+/g, " OR ");
    // Add spaces to facilitate the split and remove all empty items 
    const splitted_query = filter_query.replaceAll("(", " ( ").replaceAll(")", " ) ").split(" ").filter(x => x !== "");

    // Start the condition here
    new_query += "(";

    splitted_query.map((symbol) => {

        // Replace again the symbol by the space for the query
        symbol = symbol.replaceAll(SPACE, " ");

        // If the symbol is a bracket, nothing to do just add it
        if (symbol === "(" || symbol === ")") { new_query += symbol; }

        // If the symbol is A logic contition, add spaces around
        else if (symbol === "AND" || symbol === "OR") { new_query += ` ${symbol} `; }

        // For all other symbols, process them
        else {
            // Get columns to filter on
            let selection = symbol.split(':');
            // If nothing was specified, loop over all selected columns
            if (selection.length === 1) {
                new_query += "(";
                selected_columns.map((column) => {
                    // Use like to find the keyword inside an entry
                    new_query += `${column} LIKE ? OR `;
                    new_values.push(`%${selection[0]}%`);
                });
                new_query = new_query.substring(0, new_query.length - 4);   // Remove the last ' OR '
                new_query += ")";
            }
            // Add the condition for all selected columns
            else {
                // get all columns to filter on
                let selected_cols = selection[0].split(',');
                new_query += "(";
                selected_cols.map((column) => {
                    new_query += `${column} LIKE ? OR `;
                    new_values.push(`%${selection[1]}%`);
                });
                new_query = new_query.substring(0, new_query.length - 4);   // Remove the last ' OR '
                new_query += ")";
            }        
        }
    });
    // End the query
    new_query += ")";
    
    return {new_query, new_values};
}

// Api used to filter data using the name and description entries
export default async function handler(req, res) {
    // get the action to execute and the table used
    const { action, table } = JSON.parse(req.body);

    let query;
    let values;

    // Get all data in the table
    if ( action === "get_all" ) {
        
        query = "SELECT * FROM ??";
        values = [table];
    }
    
    // Filter on data
    else if ( action === "filter" ) {
        // Parameters used to filter and create a paging system
        const { filter, cols, limit, currentPage } = JSON.parse(req.body);
        
        query = "SELECT * FROM ??";
        values = [table];

        // Create the condition
        if (cols && cols.length > 0 && filter !== "") {
            query += " WHERE ";
            const {new_query, new_values} = buildLogicalQuery(filter, cols);
            query += new_query;
            values = values.concat(new_values);
        }

        // Order according to what the user has chosen
        const { order } = JSON.parse(req.body);
        if (order.column) {
            query += ` ORDER BY ${order.column} ${order.state === "up" ? "DESC" : "ASC"}`;
        }

        // Limit the result to get the right page
        query += " LIMIT ?, ?";

        values.push((currentPage-1)*limit);
        values.push(limit);
        
    }

    // Get all columns in one table
    else if ( action === "get_columns" ) {
        query = "SELECT column_name FROM information_schema.columns WHERE table_name=?"
        values = [table];
    }

    // Count all results given by a query with filter
    else if (action === "count") {
        const { filter, cols } = JSON.parse(req.body);

        query = "SELECT COUNT(*) FROM ??";
        values = [table];

        // Use the same condition as with the FILTER action
        if (cols && cols.length > 0 && filter !== "") {
            query += " WHERE ";
            const {new_query, new_values} = buildLogicalQuery(filter, cols);
            query += new_query;
            values = values.concat(new_values);
        }
    }

    
    // Execute the query and return a server error if unsuccessful
    try {
        const results = await executeQuery({
            query,
            values
        });
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching data" ,error);
        res.status(500).json({ error: "Error fetching data" });
    }
}