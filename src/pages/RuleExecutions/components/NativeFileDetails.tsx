import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SecondaryColors, PrimaryColors } from "@/helpers/colors";
import { useNativeFileDetails } from "../hooks/useNativeFiles";
import {
  saveLayoutValues,
  getLayoutValueByFileId,
} from "@/services/layoutValuesService";
import NativeFile from "@/types/NativeFileDto";
import LayoutValue from "@/types/LayoutValueDto";

interface NativeFileDetailsProps {
  file: NativeFile;
  onClose: () => void;
}

type EditedRow = {
  row: number;
  values: Record<string, string>;
};

export const NativeFileDetails: React.FC<NativeFileDetailsProps> = ({
  file,
  onClose,
}) => {
  const { fetchedFile, layoutFields, layoutValues, loading, error } =
    useNativeFileDetails({ file });

  const [editedRows, setEditedRows] = useState<EditedRow[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const [saving, setSaving] = useState(false);

  // Inicializar los valores editables por fila
  useEffect(() => {
    if (layoutFields.length > 0 && layoutValues.length > 0) {
      const rowsMap: Record<number, Record<string, string>> = {};
      layoutValues.forEach((v) => {
        if (!rowsMap[v.row]) rowsMap[v.row] = {};
        const field = layoutFields.find((f) => f.id === v.fieldId);
        if (field) rowsMap[v.row][field.name] = v.value;
      });

      const initialRows: EditedRow[] = Object.entries(rowsMap).map(
        ([row, values]) => ({
          row: Number(row),
          values,
        })
      );

      setEditedRows(initialRows);
    }
  }, [layoutFields, layoutValues]);

  // Detectar cambios
  useEffect(() => {
    const originalRows: EditedRow[] = [];
    const rowsMap: Record<number, Record<string, string>> = {};
    layoutValues.forEach((v) => {
      if (!rowsMap[v.row]) rowsMap[v.row] = {};
      const field = layoutFields.find((f) => f.id === v.fieldId);
      if (field) rowsMap[v.row][field.name] = v.value;
    });
    Object.entries(rowsMap).forEach(([row, values]) => {
      originalRows.push({ row: Number(row), values });
    });

    setIsChanged(JSON.stringify(originalRows) !== JSON.stringify(editedRows));
  }, [editedRows, layoutFields, layoutValues]);

  // Exportar XML de todas las filas
  const handleExportXML = () => {
    if (!file) return;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<payments>\n`;
    editedRows.forEach((row) => {
      xml += `  <row number="${row.row}">\n`;
      Object.entries(row.values).forEach(([key, value]) => {
        xml += `    <${key}>${value}</${key}>\n`;
      });
      xml += `  </row>\n`;
    });
    xml += `</payments>`;

    const blob = new Blob([xml], { type: "application/xml" });
    const link = document.createElement("a");
    const fileName = file.name ? `${file.name}.xml` : "archivo_default.xml";
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  // Exportar TXT de todas las filas
  const handleExportTXT = () => {
    if (!file) return;

    let txt = `Archivo: ${file.name}\n\n`;
    editedRows.forEach((row, idx) => {
      txt += `Fila ${idx + 1}:\n`;
      Object.entries(row.values).forEach(([key, value]) => {
        txt += `  ${key}: ${value}\n`;
      });
      txt += "\n";
    });

    const blob = new Blob([txt], { type: "text/plain" });
    const link = document.createElement("a");
    const fileName = file.name ? `${file.name}.txt` : "archivo_default.txt";
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  // Guardar cambios en backend
  const handleSave = async () => {
    if (!file) return;
    setSaving(true);

    try {
      const valuesArray: LayoutValue[] = [];
      editedRows.forEach((row) => {
        layoutFields.forEach((field) => {
          valuesArray.push({
            fileId: file.id,
            fieldId: field.id,
            value: row.values[field.name] ?? "",
            row: row.row,
          });
        });
      });

      await saveLayoutValues(valuesArray);

      // Re-fetch para actualizar estado
      const updatedValues = await getLayoutValueByFileId(file.id);

      const rowsMap: Record<number, Record<string, string>> = {};
      updatedValues.forEach((v) => {
        if (!rowsMap[v.row]) rowsMap[v.row] = {};
        const field = layoutFields.find((f) => f.id === v.fieldId);
        if (field) rowsMap[v.row][field.name] = v.value;
      });

      const newEditedRows: EditedRow[] = Object.entries(rowsMap).map(
        ([row, values]) => ({
          row: Number(row),
          values,
        })
      );
      setEditedRows(newEditedRows);
      setIsChanged(false);
    } catch (err) {
      console.error("Error guardando cambios:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Cargando detalles...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div
      className="p-6 rounded-lg shadow-md space-y-4"
      style={{ background: SecondaryColors.background_2 }}
    >
      {/* --- Título y botones --- */}
      <div className="flex justify-between items-center">
        <h2
          className="text-xl font-semibold"
          style={{ color: SecondaryColors.dark_gray }}
        >
          Detalles del archivo
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={handleExportXML}
            className="font-semibold cursor-pointer"
            style={{
              background: SecondaryColors.dark_gray,
              color: SecondaryColors.background_3,
            }}
          >
            Exportar XML
          </Button>
          <Button
            onClick={handleExportTXT}
            className="font-semibold cursor-pointer"
            style={{
              background: SecondaryColors.dark_gray,
              color: SecondaryColors.background_3,
            }}
          >
            Exportar TXT
          </Button>
        </div>
      </div>

      {/* --- Información básica --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <p className="font-bold" style={{ color: SecondaryColors.dark_gray }}>
            Nombre:
          </p>
          <Input
            className="border-0"
            value={file?.name || ""}
            readOnly
            style={{ background: SecondaryColors.background_3 }}
          />
        </div>
      </div>

      {/* --- Campos dinámicos editables por fila --- */}
      <div className="space-y-4 max-h-80 overflow-auto mt-4" style={{ background: SecondaryColors.background_3 }}>
        {editedRows.map((row, rowIndex) => (
          <div key={row.row} className="p-2 border border-gray-200 rounded">
            <p className="font-semibold mb-2">Fila {rowIndex + 1}:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {layoutFields.map((field) => (
                <div key={field.id} className="flex flex-col">
                  <span className="font-medium mb-1">{field.name}:</span>
                  <Input
                    value={row.values[field.name] ?? ""}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setEditedRows((prev) => {
                        const copy = [...prev];
                        copy[rowIndex] = {
                          ...copy[rowIndex],
                          values: { ...copy[rowIndex].values, [field.name]: newValue },
                        };
                        return copy;
                      });
                    }}
                    className="border-gray-100"
                    style={{ background: SecondaryColors.background_3 }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* --- Botones --- */}
      <div className="flex justify-end gap-2 mt-4">
        <Button
          onClick={onClose}
          className="font-semibold"
          style={{
            background: PrimaryColors.red,
            color: SecondaryColors.background_3,
          }}
        >
          Cerrar
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving || !isChanged}
          className="font-semibold"
          style={{
            background: saving
              ? SecondaryColors.content_3
              : SecondaryColors.dark_gray,
            color: SecondaryColors.background_3,
          }}
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
};

export default NativeFileDetails;
