const dictionary = require("./dictionary");

/**
 * Genera el SELECT de estandarización con conversiones de tipo y depuración de texto.
 */
function build_standardized_select(columns_config) {
  return columns_config.map(col => {
    const src = col.from;
    const target = col.to;
    const type = col.type || 'string';

    switch (type) {
      case 'int':
        return `SAFE_CAST(${src} AS INT64) AS ${target}`;
      case 'numeric':
        return `SAFE_CAST(${src} AS NUMERIC) AS ${target}`;
      case 'timestamp':
        return `SAFE_CAST(${src} AS TIMESTAMP) AS ${target}`;
      case 'date':
        return `SAFE_CAST(${src} AS DATE) AS ${target}`;
      case 'boolean':
      case 'bool':
        // Manejo seguro de booleanos (S/N, 1/0, TRUE/FALSE)
        return `CASE
          WHEN ${src} IS NULL THEN NULL
          WHEN SAFE_CAST(${src} AS BOOL) IS NOT NULL THEN SAFE_CAST(${src} AS BOOL)
          WHEN UPPER(CAST(${src} AS STRING)) IN ('S', 'Y', '1', 'TRUE') THEN TRUE
          WHEN UPPER(CAST(${src} AS STRING)) IN ('N', '0', 'FALSE') THEN FALSE
          ELSE NULL
        END AS ${target}`;
      case 'string':
      default:
        // Limpieza profunda de codificación UTF-8
        return `UPPER(NULLIF(TRIM(
          REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
            ${src},
            'ÃA', 'ÍA'),
            'Ã¡', 'Á'),
            'Ã¡LISIS', 'ÁLISIS'),
            'Ãa', 'ÍA'),
            'Ã', 'Í'),
            'Â', ''),
            'Ã±', 'Ñ'),
            'Ã\u0081', 'Á')
        ), '')) AS ${target}`;
    }
  }).join(',\n        ');
}

/**
 * Genera la consulta SQL completa de la capa Silver.
 */
function render_silver(source_ref, primary_key, columns_config, order_by_clause) {
  const select_fields = build_standardized_select(columns_config);
  const sort_clause = order_by_clause || `${primary_key} ASC`;
  
  // MEJORA 2: Generación automática de Hash MD5 para detectar cambios en la fila
  const target_columns = columns_config.map(col => col.to);
  const hash_expression = `TO_HEX(MD5(TO_JSON_STRING(STRUCT(${target_columns.join(", ")}))))`;

  return `
WITH source AS (

    SELECT * FROM ${source_ref}

),

standardized AS (

    SELECT
        ${select_fields}
    FROM source

),

deduplicated AS (

    SELECT *
    FROM standardized
    QUALIFY ROW_NUMBER() OVER (
        PARTITION BY ${primary_key}
        ORDER BY ${sort_clause}
    ) = 1

)

SELECT
    *,
    ${hash_expression} AS row_hash,
    CURRENT_TIMESTAMP() AS ts_dataform_process
FROM deduplicated
  `;
}

module.exports = {
  render_silver,
  get_column_descriptions: dictionary.get_column_descriptions
};