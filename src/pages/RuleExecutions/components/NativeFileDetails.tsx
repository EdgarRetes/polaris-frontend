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

export const NativeFileDetails: React.FC<NativeFileDetailsProps> = ({
  file,
  onClose,
}) => {
  const { fetchedFile, layoutFields, layoutValues, loading, error } =
    useNativeFileDetails({ file });

  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [isChanged, setIsChanged] = useState(false);
  const [saving, setSaving] = useState(false);

  // Inicializar los valores editables
  useEffect(() => {
    if (layoutFields.length > 0) {
      const initialValues: Record<string, string> = {};
      layoutFields.forEach((field) => {
        const valueObj = layoutValues.find((v) => v.fieldId === field.id);
        initialValues[field.name] = valueObj ? valueObj.value : "";
      });
      setEditedValues(initialValues);
    }
  }, [layoutFields, layoutValues]);

  // Detectar cambios
  useEffect(() => {
    const originalValues: Record<string, string> = {};
    layoutFields.forEach((field) => {
      const valueObj = layoutValues.find((v) => v.fieldId === field.id);
      originalValues[field.name] = valueObj ? valueObj.value : "";
    });

    const changed =
      JSON.stringify(originalValues) !== JSON.stringify(editedValues);
    setIsChanged(changed);
  }, [editedValues, layoutFields, layoutValues]);

  // Exportar XML
  const handleExportXML = () => {
    if (!file) return;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<payment>\n`;
    for (const [key, value] of Object.entries(editedValues)) {
      xml += `  <${key}>${value}</${key}>\n`;
    }
    xml += `</payment>`;

    const blob = new Blob([xml], { type: "application/xml" });
    const link = document.createElement("a");
    const fileName = file.name ? `${file.name}.xml` : "archivo_default.xml";
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  // Guardar cambios
  const handleSave = async () => {
    if (!file) return;
    setSaving(true);

    try {
      // Prepara el arreglo de valores a guardar
      const valuesArray: LayoutValue[] = layoutFields.map((field) => ({
        fileId: file.id,
        fieldId: field.id,
        value: editedValues[field.name] ?? "",
        row: 0,
      }));

      // Guardar cambios en el backend
      await saveLayoutValues(valuesArray);

      // Volver a obtener los valores actualizados
      const updatedValues = await getLayoutValueByFileId(file.id);

      // Reconstruir el estado editable
      const newEditedValues: Record<string, string> = {};
      layoutFields.forEach((field) => {
        const valueObj = updatedValues.find((v) => v.fieldId === field.id);
        newEditedValues[field.name] = valueObj ? valueObj.value : "";
      });

      setEditedValues(newEditedValues);
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
        {/* <div className="flex flex-col">
          <p className="font-bold" style={{ color: SecondaryColors.dark_gray }}>
            Compañía:
          </p>
          <Input
            className="border-0"
            value={file?.company || ""}
            readOnly
            style={{ background: SecondaryColors.background_3 }}
          />
        </div> */}
      </div>

      {/* --- Campos dinámicos editables --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {layoutFields.map((field) => (
          <div key={field.id} className="flex flex-col">
            <p
              className="font-bold"
              style={{ color: SecondaryColors.dark_gray }}
            >
              {field.name}:
            </p>
            <Input
              className="border-0"
              value={editedValues[field.name] ?? ""}
              onChange={(e) =>
                setEditedValues({
                  ...editedValues,
                  [field.name]: e.target.value,
                })
              }
              style={{ background: SecondaryColors.background_3 }}
            />
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
          disabled={saving} // Solo dependemos de saving
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
