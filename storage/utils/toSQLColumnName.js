const toSQLColumnName = c => c.replace(/[^0-9a-zA-Z_]/g, '').replace(/^[^a-zA-Z_]+/, '');
module.exports = toSQLColumnName;