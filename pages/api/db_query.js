import executeQuery from "../../lib/db";

// Build the condition for the SQL request from the quey in a logical format
// Ex: A && B || C => WHERE X LIKE A AND X LIKE B OR X LIKE C
const buildLogicalQuery = (filter_query, selected_columns) => {

    let new_query = "";
    let new_values = [];

    const splitted_query = filter_query.replaceAll("&&", " AND ").replaceAll("||", " OR ").replaceAll("(", " ( ").replaceAll(")", " ) ").split(" ").filter(x => x !== "");

    for (let column of selected_columns) {
        new_query += "(";
        splitted_query.map((symbol) => {
            if (symbol === "(" || symbol === ")") { new_query += symbol; }
            else if (symbol === "AND" || symbol === "OR") { new_query += ` ${symbol} `; }
            else {
                new_query += `${column} LIKE ?`;    
                new_values.push(`%${symbol}%`);
            }
        });
        new_query += ") OR ";
    }
    new_query = new_query.substring(0, new_query.length - 4);   // Remove the last ' OR '

    return {new_query, new_values};
}

// Api used to filter data using the name and description entries
export default async function handler(req, res) {
    const { action, table } = JSON.parse(req.body);

    let query;
    let values;

    
    if ( action === "get_all" ) {
        
        query = "SELECT * FROM ??";
        values = [table];
    }
    
    else if ( action === "filter" ) {
        const { filter, cols, limit, currentPage } = JSON.parse(req.body);
        
        query = "SELECT * FROM ??";
        values = [table];

        if (cols && cols.length > 0 && filter !== "") {
            query += " WHERE ";
            const {new_query, new_values} = buildLogicalQuery(filter, cols);
            query += new_query;
            values = values.concat(new_values);
        }

        const { order } = JSON.parse(req.body);
        if (order.column) {
            query += ` ORDER BY ${order.column} ${order.state === "up" ? "DESC" : "ASC"}`;
        }

        query += " LIMIT ?, ?";

        values.push((currentPage-1)*limit);
        values.push(limit);
                
    }

    else if ( action === "get_columns" ) {
        query = "SELECT column_name FROM information_schema.columns WHERE table_name=?"
        values = [table];
    }

    else if (action === "count") {
        const { filter, cols } = JSON.parse(req.body);

        query = "SELECT COUNT(*) FROM ??";
        values = [table];

        if (cols && cols.length > 0 && filter !== "") {
            query += " WHERE ";
            const {new_query, new_values} = buildLogicalQuery(filter, cols);
            query += new_query;
            values = values.concat(new_values);
        }
    }

    
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