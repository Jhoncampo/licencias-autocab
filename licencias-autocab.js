const XLSX = require("xlsx");
const { licencias } = require("./licencias-conductores-data");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Función para mostrar el menú de opciones
function showMenu() {
  console.log(`
    Selecciona una opción:
    1. Ver licencias activas
    2. Moviles que no han ingresado en los ultimos 15 días
    3. Generar archivo excel licencias activas
    4. Salir
  `);

  rl.question("Escribe el número de la opción: ", (answer) => {
    switch (answer) {
      case "1":
        licenciasActivas();
        break;
      case "2":
        ultimoIngreso();
        break;
      case "3":
        exportarExcel();
        break;
      case "4":
        console.log("Adiós!");
        rl.close();
        return;
      default:
        console.log("Opción no válida. Inténtalo de nuevo.");
    }
    if (licencias.length === 0) {
      rl.close()
    }else{

      showMenu();
    }
  });
}

showMenu();

// Función para ver las licencias activas
const licenciasActivas = () => {
  if (licencias.length === 0)
    return console.log(
      "--[ No hay ninguna licencia, por favor ingrese las licencias en el archivo licencias-conductores-data.js ]--"
    );
  let count = 0;
  licencias.map((licencia) => {
    //Verifica que id empiecé empiecé con 3 y que lleve -
    if (
      (licencia.mdtID.toString().startsWith("3") ||
        licencia.mdtID.toString().includes("-")) &&
      licencia.isRegistered === true
    ) {
      count = count + 1;
      console.log("movil: ", licencia.mdtID, "Email: ", licencia.userName);
    }
  });
  console.log("Las licencias activas son: ", count);
};

// Función para ver a los usuarios que no han ingresado a la aplicación en los últimos 15 días
const ultimoIngreso = () => {
  if (licencias.length === 0)
    return console.log(
      "No hay ninguna licencia, por favor ingrese las licencias en el archivo licencias-conductores-data.js"
    );
  let count = 0;
  licencias.map((licencia) => {
    //Verifica que id empiecé empiecé con 3 y que lleve -
    if (
      (licencia.mdtID.toString().startsWith("3") ||
        licencia.mdtID.toString().includes("-")) &&
      licencia.isRegistered === true
    ) {
      const fechaActual = new Date();
      const fechaHace15Dias = new Date();

      const fecha = new Date(licencia.lastLogOn);
      const fechaInicio = fechaHace15Dias.setDate(fechaActual.getDate() - 15);
      const fechaFormateada = new Date(fecha).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      if (fecha <= fechaInicio) {
        count++;
        console.log(
          "movil: ",
          licencia.mdtID,
          "Email: ",
          licencia.userName,
          "Ultimo ingreso: ",
          fechaFormateada
        );
      }
    }
  });
  console.log("Los ultimos ingresos registrados son: ", count);
};

// Función para exportar todas las licencias activas
const exportarExcel = () => {
  if (licencias.length === 0)
    return console.log(
      "No hay ninguna licencia, por favor ingrese las licencias en el archivo licencias-conductores-data.js"
    );
  const dataExcel = [];
  licencias.map((licencia) => {
    //Verifica que id empiecé empiecé con 3 y que lleve -
    if (
      (licencia.mdtID.toString().startsWith("3") ||
        licencia.mdtID.toString().includes("-")) &&
      licencia.isRegistered === true
    ) {
      dataExcel.push({
        movil: `${licencia.mdtID}`,
        email: licencia.userName,
      });
    }
  });

  if (dataExcel.length > 0) {
    const workSheet = XLSX.utils.json_to_sheet(dataExcel);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Licencias-autocab");
    XLSX.writeFile(workBook, "licencias-conductores.xlsx");
    console.log("Excel exportado con exito");
  }
};
