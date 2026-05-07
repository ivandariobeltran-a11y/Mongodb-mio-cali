// ============================================================
// TAREA 4 - BIG DATA - UNAD
// Base de Datos NoSQL con MongoDB
// Caso de uso: Logs de transacciones Sistema MIO - Cali
// Estudiante: Iván Darío Beltrán
// ============================================================

// PASO 1: Seleccionar base de datos
use mio_cali_db

// PASO 2: Crear colecciones
db.createCollection("transacciones")
db.createCollection("rutas")
db.createCollection("estaciones")

// ============================================================
// INSERCIÓN DE DATOS
// ============================================================

// INSERT ONE - Un documento individual
db.transacciones.insertOne({
  id_transaccion: "TRX-2024-000001",
  fecha_hora: new Date("2024-10-15T06:05:12Z"),
  tipo_tarjeta: "estudiantil",
  numero_tarjeta: "MIO-0010000001",
  id_ruta: "T31A",
  nombre_ruta: "Troncal Cañasgordas",
  id_estacion: "EST-TERMINAL-SUR",
  nombre_estacion: "Terminal del Sur",
  sentido: "norte_sur",
  valor_debitado: 1550,
  saldo_anterior: 20000,
  saldo_resultante: 18450,
  hora_pico: true,
  dia_semana: "lunes",
  validado_en: "estacion"
})

// INSERT MANY - 105 documentos de prueba
const rutas=["T31A","T31B","T45","P19A","A01","C20","C26"];
const estaciones=["Terminal del Sur","Unidad Deportiva",
  "Chiminangos","Granada","Santa Librada","Portada al Mar"];
const tipos=["ordinaria","estudiantil","adulto_mayor"];
const dias=["lunes","martes","miercoles","jueves","viernes","sabado"];
const tarifas={ordinaria:3100,estudiantil:1550,adulto_mayor:0};
let docs=[];
for(let i=1;i<=105;i++){
  const tipo=tipos[i%3];
  const sa=Math.floor(Math.random()*50000)+5000;
  const val=tarifas[tipo];
  const h=Math.floor(Math.random()*14)+5;
  docs.push({
    id_transaccion:"TRX-2024-"+String(i).padStart(6,"0"),
    fecha_hora:new Date("2024-10-"+String((i%28)+1).padStart(2,"0")
      +"T"+String(h).padStart(2,"0")+":00:00Z"),
    tipo_tarjeta:tipo,
    id_ruta:rutas[i%rutas.length],
    nombre_ruta:"Ruta "+rutas[i%rutas.length],
    nombre_estacion:estaciones[i%estaciones.length],
    sentido:i%2===0?"norte_sur":"sur_norte",
    valor_debitado:val,
    saldo_anterior:sa,
    saldo_resultante:sa-val,
    hora_pico:(h>=6&&h<=9)||(h>=17&&h<=20),
    dia_semana:dias[i%dias.length],
    validado_en:i%3===0?"estacion":(i%3===1?"bus":"portal")
  });
}
db.transacciones.insertMany(docs);

// INSERT MANY - 7 rutas del MIO
db.rutas.insertMany([
  {id_ruta:"T31A",nombre:"Troncal Cañasgordas",tipo:"troncal",capacidad_buses:42,tarifa_base:3100,activa:true},
  {id_ruta:"T31B",nombre:"Troncal Aguablanca",tipo:"troncal",capacidad_buses:38,tarifa_base:3100,activa:true},
  {id_ruta:"T45",nombre:"Troncal Universidades",tipo:"troncal",capacidad_buses:35,tarifa_base:3100,activa:true},
  {id_ruta:"P19A",nombre:"Pretroncal 19A",tipo:"pretroncal",capacidad_buses:25,tarifa_base:3100,activa:true},
  {id_ruta:"A01",nombre:"Alimentador Norte",tipo:"alimentadora",capacidad_buses:20,tarifa_base:0,activa:true},
  {id_ruta:"C20",nombre:"Complementaria 20",tipo:"complementaria",capacidad_buses:18,tarifa_base:3100,activa:true},
  {id_ruta:"C26",nombre:"Complementaria 26",tipo:"complementaria",capacidad_buses:22,tarifa_base:3100,activa:true}
])

// ============================================================
// CONSULTAS BÁSICAS CRUD
// ============================================================

// SELECT - Ver todos los documentos
db.transacciones.find().limit(10).pretty()

// SELECT - Contar documentos
db.transacciones.countDocuments()

// SELECT - Con proyección de campos específicos
db.transacciones.find({},
  {id_transaccion:1,tipo_tarjeta:1,valor_debitado:1,dia_semana:1,_id:0}
).limit(5)

// UPDATE - Actualizar un documento
db.transacciones.updateOne(
  {id_transaccion:"TRX-2024-000001"},
  {$set:{saldo_resultante:19000}}
)

// UPDATE - Actualizar múltiples documentos
db.transacciones.updateMany(
  {tipo_tarjeta:"adulto_mayor"},
  {$set:{exento:true,valor_debitado:0}}
)

// DELETE - Eliminar un documento
db.transacciones.deleteOne(
  {id_transaccion:"TRX-2024-000001"}
)

// DELETE - Eliminar con condición
db.transacciones.deleteMany(
  {saldo_resultante:{$lt:0}}
)

// ============================================================
// CONSULTAS CON FILTROS Y OPERADORES
// ============================================================

// Filtro por ruta y hora pico
db.transacciones.find({
  id_ruta:"T31A",
  hora_pico:true
}).limit(5)

// Operador $gte y $lte
db.transacciones.find({
  valor_debitado:{$gte:1000,$lte:3200}
})

// Operador $in - múltiples rutas y tipos
db.transacciones.find({
  id_ruta:{$in:["T31A","T31B","T45"]},
  tipo_tarjeta:{$in:["ordinaria","estudiantil"]}
}).limit(5)

// Operador $or
db.transacciones.find({
  $or:[
    {hora_pico:true,dia_semana:"lunes"},
    {tipo_tarjeta:"adulto_mayor"}
  ]
}).limit(5)

// JOIN con $lookup
db.transacciones.aggregate([
  {$lookup:{
    from:"rutas",
    localField:"id_ruta",
    foreignField:"id_ruta",
    as:"info_ruta"
  }},
  {$unwind:"$info_ruta"},
  {$project:{
    id_transaccion:1,
    tipo_tarjeta:1,
    valor_debitado:1,
    id_ruta:1,
    "info_ruta.nombre":1,
    "info_ruta.tipo":1,
    "info_ruta.capacidad_buses":1,
    _id:0
  }},
  {$limit:3}
])

// ============================================================
// CONSULTAS DE AGREGACIÓN ESTADÍSTICA
// ============================================================

// Contar, sumar y promediar por tipo de tarjeta
db.transacciones.aggregate([
  {$group:{
    _id:"$tipo_tarjeta",
    total_transacciones:{$sum:1},
    total_recaudado:{$sum:"$valor_debitado"},
    promedio_saldo:{$avg:"$saldo_resultante"}
  }},
  {$sort:{total_transacciones:-1}}
])

// Recaudo total por ruta
db.transacciones.aggregate([
  {$group:{
    _id:"$id_ruta",
    nombre_ruta:{$first:"$nombre_ruta"},
    total_pasajeros:{$sum:1},
    recaudo_total:{$sum:"$valor_debitado"},
    recaudo_promedio:{$avg:"$valor_debitado"}
  }},
  {$sort:{recaudo_total:-1}}
])

// Hora pico vs hora valle
db.transacciones.aggregate([
  {$group:{
    _id:"$hora_pico",
    transacciones:{$sum:1},
    recaudo:{$sum:"$valor_debitado"}
  }},
  {$project:{
    periodo:{$cond:["$_id","Hora Pico","Hora Valle"]},
    transacciones:1,
    recaudo:1
  }}
])

// Top estaciones por afluencia
db.transacciones.aggregate([
  {$group:{
    _id:"$nombre_estacion",
    total_validaciones:{$sum:1}
  }},
  {$sort:{total_validaciones:-1}},
  {$limit:6},
  {$project:{
    estacion:"$_id",
    total_validaciones:1,
    _id:0
  }}
])
