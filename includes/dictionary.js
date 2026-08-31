/**
 * Diccionario centralizado de descripciones de campos para el LLM y BigQuery.
 */
const COLUMNS_DICTIONARY = {
  // Identificadores
  id_paciente: "Identificador único del paciente en el sistema del laboratorio",
  id_estudio: "Identificador único del estudio médico realizado",
  id_orden: "Identificador único de la orden de laboratorio",
  id_sucursal: "Identificador único de la sucursal de atención",
  id_resultado: "Identificador único del resultado analítico",

  // Datos de Pacientes
  nombre_paciente: "Nombre(s) y apellidos del paciente",
  fecha_nacimiento: "Fecha de nacimiento del paciente (YYYY-MM-DD)",
  genero: "Género biológico registrado del paciente",
  correo: "Correo electrónico de contacto del paciente",

  // Datos de Estudios
  codigo_estudio: "Código clave del catálogo de estudios (ej. BH, QS30)",
  nombre_estudio: "Nombre oficial del estudio o prueba médica",
  categoria: "Categoría médica a la que pertenece el estudio (ej. Hematología, Química Clínica)",
  precio: "Precio de lista del estudio médico",

  // Datos de Órdenes y Sucursales
  fecha_orden: "Fecha y hora en que se creó la orden de servicio",
  nombre_sucursal: "Nombre comercial de la sucursal de atención",
  estado: "Estado de la orden (ej. Completado, Pendiente, Cancelado)",
  monto_total: "Monto total pagado por la orden en pesos mexicanos",

  // Campos técnicos
  row_hash: "Código Hash MD5 técnico para detectar cambios en la fila",
  ts_dataform_process: "Marca de tiempo UTC indicando cuándo Dataform procesó el registro"
};

/**
 * Función que extrae las descripciones para la configuración de Dataform.
 */
function get_column_descriptions(columns_config) {
  const descriptions = {};
  
  // Asigna descripción a cada columna del modelo según el diccionario
  columns_config.forEach(col => {
    const fieldName = col.to || col;
    descriptions[fieldName] = COLUMNS_DICTIONARY[fieldName] || `Campo de negocio ${fieldName}`;
  });

  // Agrega descripciones técnicas automáticas
  descriptions['row_hash'] = COLUMNS_DICTIONARY['row_hash'];
  descriptions['ts_dataform_process'] = COLUMNS_DICTIONARY['ts_dataform_process'];

  return descriptions;
}

module.exports = {
  COLUMNS_DICTIONARY,
  get_column_descriptions
};