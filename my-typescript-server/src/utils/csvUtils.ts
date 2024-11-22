import fs from 'fs';
import csvParser from 'csv-parser';

interface CsvRow {
  id: string;
  name: string;
  apiKey: string;
  timestamp: string;
}

// Fungsi untuk membaca CSV
export const readCsv = async (filePath: string): Promise<CsvRow[]> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      console.error(`CSV file not found at path: ${filePath}`);
      resolve([]);
      return;
    }

    const results: CsvRow[] = [];
    console.log(`Reading CSV file at path: ${filePath}`);

    fs.createReadStream(filePath)
      .pipe(csvParser({ headers: ['id', 'name', 'apiKey', 'timestamp'] })) // Tentukan header secara eksplisit
      .on('data', (row: Partial<CsvRow>) => {
        // Validasi setiap row
        if (row.id && row.name && row.apiKey && row.timestamp) {
          results.push({
            id: row.id,
            name: row.name,
            apiKey: row.apiKey,
            timestamp: row.timestamp,
          });
        } else {
          console.warn('Invalid row detected and skipped:', row);
        }
      })
      .on('error', (error: Error) => {
        console.error('Error reading CSV:', error);
        reject(error);
      })
      .on('end', () => {
        console.log(`Finished reading CSV. Total valid rows: ${results.length}`);
        resolve(results);
      });
  });
};



// Fungsi untuk menulis ke CSV
export const writeToCsv = async (filePath: string, data: CsvRow): Promise<void> => {
  const header = 'id,name,apiKey,timestamp\n';
  const row = `${data.id},${data.name},${data.apiKey},${data.timestamp}\n`;

  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, header);
    }
    fs.appendFileSync(filePath, row);
  } catch (error) {
    throw new Error(`Error writing to CSV: ${error}`);
  }
};
