import Papa from "papaparse";

export const parseCSV = async (file: File): Promise<Record<string, any>[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data as Record<string, any>[]),
      error: (err) => reject(err),
    });
  });
};
