# Base de Datos NoSQL con MongoDB – Sistema MIO Cali
### Tarea 4 – Almacenamiento y Consultas de Datos en Big Data
**Universidad Nacional Abierta y a Distancia – UNAD**  
**Curso:** Big Data – Código: 202016911  
**Estudiante:** Iván Darío Beltrán  

---

## Descripción del caso de uso

Implementación de una base de datos NoSQL con MongoDB Atlas para el almacenamiento y análisis de logs de transacciones del Sistema MIO (Masivo Integrado de Occidente) de Cali, Colombia. El MIO moviliza aproximadamente 600.000 pasajeros diarios, generando millones de registros de transacciones que incluyen información sobre rutas, estaciones, tipo de usuario, valor cobrado y horario. MongoDB fue seleccionado por su capacidad de manejar documentos con estructura variable, escalar horizontalmente y ejecutar consultas analíticas complejas directamente sobre la base de datos.

---

## Estructura de la Base de Datos

Base de datos: mio_cali_db

| Colección | Descripción | Documentos |
|---|---|---|
| transacciones | Log de cada validación de tarjeta | 105 |
| rutas | Información de cada ruta del MIO | 7 |
| estaciones | Datos de estaciones y paraderos | Diseño |

---

## Consultas implementadas

### 1. Consultas básicas CRUD
- Inserción de un documento individual con insertOne
- Inserción masiva de 105 documentos con insertMany
- Selección de documentos con find y proyección de campos
- Conteo total de documentos con countDocuments
- Actualización individual con updateOne
- Actualización masiva de usuarios adulto mayor con updateMany
- Eliminación individual con deleteOne
- Eliminación con condición con deleteMany

### 2. Consultas con filtros y operadores
- Filtro por ruta específica y hora pico
- Operadores de comparación para rango de valores debitados
- Operador de selección múltiple para rutas y tipos de tarjeta
- Condiciones combinadas con operador lógico OR
- JOIN entre colecciones transacciones y rutas con lookup

### 3. Consultas de agregación estadística
- Recaudo total y promedio de saldo por tipo de tarjeta
- Total de pasajeros y recaudo por ruta ordenado de mayor a menor
- Análisis comparativo entre hora pico y hora valle
- Ranking de estaciones con mayor afluencia de pasajeros

## Herramientas utilizadas

- MongoDB Atlas – Base de datos en la nube con plan gratuito M0
- MongoDB Compass – Interfaz gráfica para gestión y consultas
- MongoDB Shell – Ejecución de comandos y consultas
