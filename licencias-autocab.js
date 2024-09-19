const XLSX = require("xlsx");
const { licencias } = require("./licencias-conductores");

const list = () => {
  let count = 0;
  // Array vacio
  const dataExcel = [];

  licencias.map((licencia) => {

    //Verifica que id empiecé empiecé con 3 y que lleve - 
    if (
      (licencia.mdtID.toString().startsWith("3") ||
        licencia.mdtID.toString().includes("-")) &&
      licencia.isRegistered === true
    ) {
      count = count + 1;
      console.log("movil: ", licencia.mdtID, "Email: ", licencia.userName);

      // Se llena el array en cada iteración
      dataExcel.push({
        movil: `${licencia.mdtID}`,
        email: licencia.userName,
      });
    }
  });
  console.log(" total de conductores activos: ", count);

  if (dataExcel.length > 0) {
    exportExcel(dataExcel);
  }
};

// Función para generar el excel
const exportExcel = (data) => {
  const workSheet = XLSX.utils.json_to_sheet(data);
  const workBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook, workSheet, "Licencias-autocab");

  XLSX.writeFile(workBook, "licencias-conductores.xlsx");
};

list();
