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

async function fetchData(table = 'creditCards', offset, limit) {
    const pool = await getConnection();
    if (pool) {
        try {
            let query = 'SELECT * FROM ' + table;
            if (limit > 0) {
                query += `
                    ORDER BY id
                    OFFSET ${offset} ROWS
                    FETCH NEXT ${limit} ROWS ONLY
                    `
            }

            const result = await pool.request()
                .query(query);
            return result.recordset;
        } catch (err) {
            // throw new Error('Error executing query:', err);
            console.log('Error executing query:', err);
        }
    }
}

async function getObjectByID(table = 'creditCards', id) {
    const pool = await getConnection();
    if (pool) {
        try {
            const query = 'SELECT * FROM ' + table + " WHERE id = '" + id + "'";
            const result = await pool.request()
                .query(query);
            return result.recordset;
        } catch (err) {
            // throw new Error('Error executing query:', err);
            console.log('Error executing query:', err);
        }
    }
}

async function deleteData(table = 'creditCards', data, id) {
    const dataID = data ? data.id : id;

    if (data && badInput(data)) {
        throw new Error('Invalid ID caught in deleteData() function. SQL Injection code');
    }

    const pool = await getConnection();
    if (pool) {
        try {
            if (table === 'creditCards') {
                const initialQuery = "DELETE FROM purchases WHERE cardID = '" + dataID + "'";
                const result = await pool.request().query(initialQuery);
                console.log(result.rowsAffected);
            }

            const query = 'DELETE FROM ' + table + " WHERE id = '" + dataID + "'";
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

async function addDataArray(table = 'creditCards', data) {
    const pool = await getConnection();
    if (pool) {
        let query = 'INSERT INTO ' + table + ' VALUES '
        for (let i = 0; i < data.length; i++) {
            const dataStr = data[i].toAddSQLString();
            query += '(' + dataStr + '), ';
        }
        try {
            const result = await pool.request()
                .query(query.slice(0, -2));
            console.log(result.rowsAffected);
        } catch (err) {
            // throw new Error('Error executing query:', err);
            console.log('Error executing query:', err,);
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
    addDataArray,
    getObjectByID,
    updateData
}