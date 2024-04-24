const sql = require("mssql/msnodesqlv8");

const config = {
    connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-OAKT4PO;Database=online_banking;Trusted_Connection=yes;TrustServerCertificate=yes'
};

function badInput(data) {
    let occurrences = 0;
    for (let i = 0; i < data.id.length; i++) {
        if (data.id[i] === "-") {
            occurrences++;
        }
    }
    const bad_id = data.id.length !== 36 || data.id.includes(' ') || occurrences !== 4;
    return bad_id;
}

async function getConnection() {
    try {
        const pool = await sql.connect(config);
        // console.log('Connected to SQL Server successfully!');
        return pool;
    } catch (err) {
        // console.error('Failed to connect to SQL Server:', err);
        throw new Error('Failed to connect to SQL Server');
    }
}

async function fetchData(table = 'creditCards') {
    const pool = await getConnection();
    if (pool) {
        try {
            if (table === 'purchases') {
                const result = await pool.request()
                    .query('SELECT p.*, c.cardNumber FROM purchases p inner join creditCards c on p.cardID = c.id');

                return result.recordset;
            }

            const result = await pool.request()
                .query('SELECT * FROM ' + table);
            // console.log(result.recordset);
            return result.recordset;
        } catch (err) {
            // throw new Error('Error executing query:', err);
            console.log('Error executing query:', err);
        }
    }
}

async function deleteData(table = 'creditCards', data) {
    if (badInput(data)){
        throw new Error('Invalid ID caught in deleteData() function. SQL Injection code');
    }

    const pool = await getConnection();
    if (pool) {
        try {
            if (table === 'creditCards') {
                const initialQuery = "DELETE FROM purchases WHERE cardID = '" + data.id + "'";
                const result = await pool.request().query(initialQuery);
                console.log(result.rowsAffected);
            }

            const query = 'DELETE FROM ' + table + " WHERE id = '" + data.id + "'";
            console.log(query);

            const result = await pool.request()
                .query(query);
            console.log(result.rowsAffected);
        } catch (err) {
            // throw new Error('Error executing query:', err);
            console.log('Error executing query:', err);
        }
    }
}

async function addData(table = 'creditCards', data) {
    const pool = await getConnection();
    if (pool) {
        const dataStr = data.toAddSQLString();
        try {
            const result = await pool.request()
                .query('INSERT INTO ' + table + ' VALUES (' + dataStr + ')');
            console.log(result.rowsAffected);
        } catch (err) {
            // throw new Error('Error executing query:', err);
            console.log('Error executing query:', err);
        }
    }
}

async function updateData(table = 'creditCards', data) {
    const pool = await getConnection();
    if (pool) {
        const dataStr = data.toUpdateSQLString();
        try {
            const result = await pool.request()
                .query('UPDATE ' + table + ' SET ' + dataStr + " WHERE id = '" + data.id + "'");
            console.log(result.rowsAffected);
        } catch (err) {
            // throw new Error('Error executing query:', err);
            console.log('Error executing query:', err);
        }
    }
}

module.exports = {
    fetchData,
    deleteData,
    addData,
    updateData
}