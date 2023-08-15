import executeQuery from "./db";

// Api used to filter data using the name and description entries
// PLEASE NOTE :    the query is specific to the attack_ddos table. To scale to further tables,
//                  it could be required to have a file with the columns to filter according to the table
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

        if (cols && cols.length > 0) {
            query += " WHERE ";
            cols.map((col) => {query += `${col} LIKE ? OR `})
            query = query.substring(0, query.length - 4);   // Remove the last ' OR '
            values = values.concat([...Array(cols.length)].fill(`%${filter}%`));
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

        if (cols && cols.length > 0) {
            query += " WHERE ";
            cols.map((col) => {query += `${col} LIKE ? OR `})
            query = query.substring(0, query.length - 4);   // Remove the last ' OR '
            values = values.concat([...Array(cols.length)].fill(`%${filter}%`));
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