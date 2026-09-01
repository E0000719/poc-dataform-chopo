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
  apellido: "Apellido(s) del paciente",
  fecha_nacimiento: "Fecha de nacimiento del paciente (YYYY-MM-DD)",
  fecha_registro: "Fecha y hora en que el paciente fue registrado en el sistema",
  genero: "Género biológico registrado del paciente",
  email: "Correo electrónico de contacto del paciente",

  // Datos de Estudios
  codigo_estudio: "Código clave del catálogo de estudios (ej. BH, QS30)",
  nombre_estudio: "Nombre oficial del estudio o prueba médica",
  categoria: "Categoría médica a la que pertenece el estudio (ej. Hematología, Química Clínica)",
  precio: "Precio de lista del estudio médico",
  unidad_medida: "Unidad de medida del resultado del estudio (ej. mg/dL, mmol/L)",
  rango_referencia: "Rango de referencia normal para el resultado del estudio",

  // Datos de Órdenes y Sucursales
  fecha_orden: "Fecha y hora en que se creó la orden de servicio",
  nombre_sucursal: "Nombre comercial de la sucursal de atención",
  ciudad: "Ciudad donde se ubica la sucursal",
  fecha_apertura: "Fecha oficial de apertura de la sucursal",
  estado: "Estado de la orden (ej. Completado, Pendiente, Cancelado)",

  // Datos de Resultados
  valor_resultado: "Valor obtenido en la lectura del estudio (numérico, cualitativo o rango)",
  fecha_resultado: "Fecha y hora en que se generó el resultado del estudio",

  // Campos técnicos
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
    descriptions[fieldName] = col.description || COLUMNS_DICTIONARY[fieldName] || `Campo de negocio ${fieldName}`;
  });

  return descriptions;
}

module.exports = {
  COLUMNS_DICTIONARY,
  get_column_descriptions
};