import React from "react";
import { Button } from "@/components/ui/button";
import { SecondaryColors, PrimaryColors } from "@/helpers/colors";
import { useNativeFileDetails } from "../hooks/useNativeFiles";
import NativeFile from "../types/NativeFileDto";

interface NativeFileDetailsProps {
  fileId: number;
  onClose: () => void;
}

export const NativeFileDetails: React.FC<NativeFileDetailsProps> = ({ fileId, onClose }) => {
  const { file, layoutFields, layoutValues, loading, error } = useNativeFileDetails({ fileId });

  if (loading) return <p>Cargando detalles...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div
      className="p-6 rounded-lg shadow-md space-y-4"
      style={{ background: SecondaryColors.background_2 }}
    >
      {/* --- Título y botón en la misma línea --- */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold" style={{ color: SecondaryColors.dark_gray }}>
          Detalles del archivo
        </h2>
        <Button
          onClick={() => console.log("Exportar XML")}
          className="font-semibold"
          style={{ background: SecondaryColors.dark_gray, color: SecondaryColors.background_3 }}
        >
          Exportar XML
        </Button>
      </div>

      {/* --- Información básica del archivo --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-bold" style={{ color: SecondaryColors.dark_gray }}>
            Nombre:
          </p>
          <p style={{ color: SecondaryColors.content_2 }}>{file?.name}</p>
        </div>
        <div>
          <p className="font-bold" style={{ color: SecondaryColors.dark_gray }}>
            Compañía:
          </p>
          <p style={{ color: SecondaryColors.content_2 }}>{file?.company}</p>
        </div>
      </div>

      {/* --- Campos dinámicos del layout --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {layoutFields.map((field) => {
          const valueObj = layoutValues.find((v) => v.fieldId === field.id);
          const value = valueObj ? valueObj.value : "-";

          return (
            <div key={field.id}>
              <p className="font-bold" style={{ color: SecondaryColors.dark_gray }}>
                {field.name}:
              </p>
              <p style={{ color: SecondaryColors.content_2 }}>{value}</p>
            </div>
          );
        })}
      </div>

      {/* --- Botón cerrar --- */}
      <div className="flex justify-end mt-4">
        <Button
          onClick={onClose}
          className="font-semibold"
          style={{ background: PrimaryColors.red, color: SecondaryColors.background_3 }}
        >
          Cerrar
        </Button>
      </div>
    </div>
  );
};
