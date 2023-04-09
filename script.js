const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const directoryPath = path.join('/Users/michalchojnacki/Desktop/GOLFSWINGS');
const files = fs.readdirSync(directoryPath);

const clubTypes = [];

files.forEach((file) => {
  const filePath = path.join(directoryPath, file);
  const workbook = XLSX.readFile(filePath);
  const sheetNameList = workbook.SheetNames;
  sheetNameList.forEach((sheetName) => {
    const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
    const rows = csvData.split('\n');
    const headers = rows[0].split(',');
    const clubTypeIndex = headers.indexOf('Club Type');
    if (clubTypeIndex >= 0) {
      const clubType = rows[1].split(',')[clubTypeIndex];
      if (!clubTypes.includes(clubType)) {
        clubTypes.push(clubType);
      }
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows.slice(1).map(row => row.split(','))]);
      XLSX.utils.book_append_sheet(XLSX.utils.book_new(), ws, clubType);
    }
  });
});

XLSX.writeFile(XLSX.utils.book_new(), 'Master.xlsx');
