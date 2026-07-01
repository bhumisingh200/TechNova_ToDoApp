const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MYSQL_PATH = `"C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe"`;
const MYSQL_USER = 'root';
const MYSQL_PASS = 'Bhumi@2006';
const MYSQL_DB = 'technova_db';

function runQuery(sql) {
  const tempFile = path.join(__dirname, `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.sql`);
  try {
    fs.writeFileSync(tempFile, sql, 'utf8');
    const cmd = `${MYSQL_PATH} -u ${MYSQL_USER} -p"${MYSQL_PASS}" -D ${MYSQL_DB} < "${tempFile}"`;
    const output = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    return output;
  } finally {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
}

function queryRows(sql) {
  const output = runQuery(sql);
  if (!output) return [];
  const lines = output.trim().split('\n');
  if (lines.length <= 1) return [];
  const headers = lines[0].split('\t');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t');
    const row = {};
    headers.forEach((header, idx) => {
      row[header.trim()] = values[idx] ? values[idx].trim() : '';
    });
    rows.push(row);
  }
  return rows;
}

// Check database connection and report query response
function queryOne(sql) {
  const rows = queryRows(sql);
  return rows.length > 0 ? rows[0] : null;
}

function execute(sql) {
  runQuery(sql);
}

function escape(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val.toString();
  const clean = val.toString().replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return `'${clean}'`;
}

module.exports = {
  queryRows,
  queryOne,
  execute,
  escape
};
