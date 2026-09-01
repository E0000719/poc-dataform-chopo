/**
 * Data-quality helpers for the bronze -> silver .
 * Each function returns a SQL expression
 */

// STRING: trims whitespace, collapses empty string to NULL.
function trimToNull(column) {
  return `NULLIF(TRIM(CAST(${column} AS STRING)), '')`;
}

// STRING: trimToNull + upper case (for codes/keys that must compare case-insensitively).
function trimUpperToNull(column) {
  return `NULLIF(TRIM(UPPER(CAST(${column} AS STRING))), '')`;
}

// STRING: trimToNull + lower case (for emails and other case-insensitive text).
function lowerToNull(column) {
  return `NULLIF(TRIM(LOWER(CAST(${column} AS STRING))), '')`;
}

// TIMESTAMP: tolerant cast, invalid literals become NULL instead of failing the query.
function safeCastTimestamp(column) {
  return `SAFE_CAST(${column} AS TIMESTAMP)`;
}

function safeCastDate(column) {
  return `SAFE_CAST(${column} AS DATE)`;
}

// Any type: tolerant cast to a target BigQuery type, invalid values become NULL.
function safeCast(column, bqType) {
  return `SAFE_CAST(${column} AS ${bqType})`;
}

// Fills NULL with a default expression (literal or SQL fragment).
function defaultIfNull(expression, defaultExpr) {
  return `COALESCE(${expression}, ${defaultExpr})`;
}

// SQL predicate 
function keepLatestByKey(partitionByColumns, orderByColumn) {
  const partitionBy = partitionByColumns.join(", ");
  return `ROW_NUMBER() OVER (PARTITION BY ${partitionBy} ORDER BY ${orderByColumn} DESC) = 1`;
}

module.exports = {
  trimToNull,
  trimUpperToNull,
  lowerToNull,
  safeCastTimestamp,
  safeCastDate,
  safeCast,
  defaultIfNull,
  keepLatestByKey
};

