const db = require('../db');

module.exports = {
    upsertStocks: async (userID, symbol, shareUnits) => {
        console.log('WARNING: Updating/Inserting into Stocks DB');

        const query = `INSERT INTO stocks (user_id, company_symbol, share_units)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, company_symbol) DO UPDATE SET share_units = stocks.share_units + EXCLUDED.share_units`

        await db.query(query, [userID, symbol, shareUnits]);
    },

    getShareUnits: async(userID, symbol) => {
        console.log('WARNING: Retrieving shares from Stocks DB');

        let query = `SELECT share_units from stocks WHERE user_id=$1 AND company_symbol=$2`;
        const { rows } = await db.query(query, [userID, symbol]);

        return rows.length > 0 ? rows[0].share_units:0;
    },

    reduceShareUnits: async(userID, symbol, shareUnits) => {
        console.log('WARNING: Reducing shares from Stocks DB');

        query = `UPDATE stocks SET share_units = stocks.share_units - $1
        WHERE user_id=$2 AND company_symbol=$3 
        RETURNING share_units`;

        const { rows } = await db.query(query, [shareUnits, userID, symbol]);
        return rows[0].share_units;
    },

    deleteStock: async(userID, symbol) => {
        console.log('WARNING: Deleting from Stocks DB');

        const query = `DELETE FROM stocks WHERE user_id=$1 AND company_symbol=$2`;
        console.log("Working");
        await db.query(query, [userID, symbol]);
    },

    getAllStocks: async(userID) => {
        console.log('WARNING: retrieving all stocks from Stocks DB');

        const query = `SELECT company_symbol, share_units FROM stocks WHERE user_id=$1`;

        const { rows } =  await db.query(query, [userID]);
        return rows;
    }
};