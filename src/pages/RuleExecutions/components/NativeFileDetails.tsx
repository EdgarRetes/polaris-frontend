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

  // Rellena texto a la derecha
  const padRight = (value: string, length: number, padChar = " ") =>
    value.padEnd(length, padChar);

  // Rellena número a la izquierda
  const padLeft = (value: number | string, length: number, padChar = "0") =>
    String(value).padStart(length, padChar);

  // Formatear importes con 13 enteros + 2 decimales
  const formatAmount = (value: number) =>
    padLeft(Math.round(value * 100), 15, "0"); // multiplica por 100 para centavos

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

    let txt = "";

    // --- Encabezado (fila 1) ---
    const header = editedRows[0]?.values || {};

    txt += padRight("H", 1); // Tipo de Registro
    txt += padRight("NE", 2); // Clave de Servicio
    const emisora = (file.name?.replace(/\..+$/, "") ?? "").slice(0, 5);
    txt += padRight(emisora, 5, " "); // 5 caracteres exactos
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const currentDate = `${yyyy}${mm}${dd}`; // AAAAMMDD

    txt += padLeft(currentDate, 8, "0"); // Fecha de Proceso
    txt += padLeft("01", 2, "0"); // Consecutivo
    txt += padLeft(editedRows.length - 1, 6, "0"); // Total registros detalle

    // Total de importes de detalle
    const detailRows = editedRows.filter((r) => r.row > 0);
    const totalAmount = detailRows.reduce((sum, r) => {
      const value = r.values["paymentAmount"]?.trim() || "0";
      const num = parseFloat(value);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
    txt += formatAmount(totalAmount); // Importe Total de Registros Enviados

    txt += padLeft("0", 6, "0"); // Total ALTAS
    txt += formatAmount(0); // Importe ALTAS
    txt += padLeft("0", 6, "0"); // Total BAJAS
    txt += formatAmount(0); // Importe BAJAS
    txt += padLeft("0", 6, "0"); // Total cuentas a verificar
    txt += padRight("0", 1); // Tipo de Pago
    txt += padRight("", 4); // CR Chequera vacío
    txt += padRight(currentDate, 8); // Fecha Adelanto Fin
    txt += padRight("0", 10); // Cuenta Cargo
    txt += padRight("", 59); // Filler
    txt += "\n";

    // --- Detalle ---
    for (let i = 1; i < editedRows.length; i++) {
      const row = editedRows[i];
      const v = row.values;

      txt += padRight("D", 1); // Tipo de registro
      txt += padLeft(
        v["applicationDate"]?.replace(/-/g, "") || currentDate,
        8,
        "0"
      ); // Fecha de Aplicación
      txt += padRight(v["idCode"] || "", 10); // Número de empleado
      txt += padRight(v["reference"] || "", 40); // Referencia del servicio
      txt += padRight(v["paymentDescription"] || "", 40); // Leyenda ordenante
      txt += formatAmount(parseFloat(v["paymentAmount"] || "0")); // Importe 13+2 decimales
      txt += padLeft(v["originAccount"] || "0", 3, "0"); // Banco Receptor
      txt += padLeft("01", 2, "0"); // Tipo de cuenta
      txt += padRight(v["destinationAccount"] || "", 18, " "); // Cuenta destino
      txt += padLeft("0", 1, "0"); // Tipo de Movimiento
      txt += padRight("0", 1, "0"); // Acción
      txt += padLeft(Math.round(parseFloat(v["iva"] || "0") * 100), 8, "0"); // IVA
      txt += padRight("", 18); // Filler
      txt += "\n";
    }

    // Descargar archivo
    const blob = new Blob([txt], { type: "text/plain" });
    const fileName = file.name
      ? `${file.name.replace(/\..+$/, "")}.txt`
      : "archivo_default.txt";
    const link = document.createElement("a");
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
      <div
        className="space-y-4 max-h-80 overflow-auto mt-4"
        style={{ background: SecondaryColors.background_3 }}
      >
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
                          values: {
                            ...copy[rowIndex].values,
                            [field.name]: newValue,
                          },
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
