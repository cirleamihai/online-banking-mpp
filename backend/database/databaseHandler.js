require('dotenv').config();
const sql = require('mssql');

const USERNAME = process.env.AWS_USERNAME;
const PASSWORD = process.env.AWS_PASSWORD;
const SERVER = process.env.AWS_SERVER;
const DBNAME = process.env.AWS_DATABASE;

// Configuration object
const config = {
    user: USERNAME,
    password: PASSWORD,
    server: SERVER,
    database: DBNAME,
    options: {
        encrypt: true, // Use encryption
        trustServerCertificate: true // Change to true for local dev / self-signed certs
    }
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
        console.error('Failed to connect to SQL Server:', err);
        throw new Error('Failed to connect to SQL Server');
    }
}

async function fetchGeneralData(table = 'creditCards', offset, limit) {
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

async function fetchUserData(procedure = 'getUserCards', userId, offset, limit) {
    const pool = await getConnection();
    if (pool) {
        try {
            let query = `EXEC ${procedure} '${userId}'`;
            if (limit > 0) {
                query += `, ${limit}, ${offset}`;
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

async function getObjectByID(table = 'creditCards', parameter_value, parameter = 'id', userId = null) {
    const pool = await getConnection();
    if (pool) {
        try {
            let query = 'SELECT * FROM ' + table + ` WHERE ${parameter} = '` + parameter_value + "'";
            if (userId) {
                query += ` AND userId = '${userId}'`;
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
            const query = 'UPDATE ' + table + ' SET ' + dataStr + " WHERE id = '" + data.id + "'";
            const result = await pool.request()
                .query(query);
            console.log(result.rowsAffected);
        } catch (err) {
            // throw new Error('Error executing query:', err);
            console.log('Error executing query:', err);
        }
    }
}

getConnection();

module.exports = {
    fetchGeneralData,
    fetchUserData,
    deleteData,
    addData,
    addDataArray,
    getObjectByID,
    updateData
}

/*
create table users (
    id varchar(255) primary key,
    username varchar(255),
    passwordHash varchar(255),
    email varchar(255)
);

create table creditCards (
	id varchar(255) primary key,
	title varchar(255),
	cardType varchar(255) check (cardType in ('Visa', 'MasterCard')),
	placeHolder varchar(255),
	cardNumber varchar(23) unique,
	expiryMo int,
	expiryYr int,
	cvv varchar(3),
	userId varchar(255) foreign key references users(id)
);


create table purchases (
	id varchar(255) primary key,
	totalValue int,
	merchant varchar(255),
	cardID varchar(255) foreign key references creditCards(id)
);

admin: admin
cirlea mihai: testing
alice johnson: mylady

create or alter view usersCards as
select u.username, c.title, c.cardType, c.placeHolder, c.cardNumber, c.expiryMo, c.expiryYr, c.cvv
from users u
inner join creditCards c on u.id = c.userId;

create or alter procedure getUserCards(@id varchar(255)) as
begin
    select c.title, c.cardType, c.placeHolder, c.cardNumber, c.expiryMo, c.expiryYr, c.cvv
    from creditCards c
    where c.userId = @id;
end;

create or alter procedure getUserCards
	@id varchar(255),
    @limit INT = 10, -- Default value for limit
    @offset INT = 0  -- Default value for offset
as
begin
    select c.title, c.cardType, c.placeHolder, c.cardNumber, c.expiryMo, c.expiryYr, c.cvv, c.UsageCount
    from CardsWithUsage c
    where c.userId = @id
	order by c.userId
	OFFSET @offset ROWS
    FETCH NEXT @limit ROWS ONLY;
end;

exec getUserCards '4544e0eb-0ac1-4dee-bbd1-d53d3c6f4fad'


create or alter procedure getUserPurchaes
    @id varchar(255),
 */