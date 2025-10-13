import React, { useState } from "react";
import NativeFile from "@/types/NativeFileDto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import FileUpload from "@/components/FileUpload";
import { useBusinessRules } from "../../BusinessRules/hooks/useBusinessRules";
import { BusinessRulesDataTable } from "@/pages/BusinessRules/components/DataTable";
import { columns } from "../../BusinessRules/components/Columns";
import { useRuleExecutions } from "../hooks/useRuleExcecutions";
import { ConfirmModal } from "@/components/ConfirmModal";
import { uploadFile, getFiles, removeFile } from "@/services/fileStoreService";
import { validateLayout } from "@/services/layoutValuesService";

import { PrimaryColors, SecondaryColors } from "@/helpers/colors";

interface NativeFileFormProps {
  onSubmit: (rule: NativeFile) => void;
  onCancel: () => void;
}

type PendingFile = {
  name: string;
  company: string;
  mappedRows: {
    row: number;
    values: {
      fieldName: string;
      value: string;
    }[];
  }[];
  ruleId?: number;
};

export const NativeFilesForm: React.FC<NativeFileFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const selectedRuleIdStr = rowSelection
    ? Number(Object.keys(rowSelection)[0])
    : undefined;

  const selectedRuleId = selectedRuleIdStr ? Number(selectedRuleIdStr) : undefined;

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [inputMode, setInputMode] = useState<"rule" | "file">("rule");
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<PendingFile | null>(null);

  const { data } = useBusinessRules();
  const {
    parseFile,
    mapRowToDto,
    getRuleJson,
    saveConfirmedFile,
    prepareFileMapping,
    createNewRuleExecution,
    saveFileMultiple,
  } = useRuleExecutions();

  // --- Procesamiento de archivo individual ---
  const processSingleFile = async (file: File) => {
    if (!file) return;

    try {
      const parsed = await parseFile(file);
      const mappedData = parsed.map((row) => mapRowToDto(row));

      if (inputMode === "rule") {
        if (selectedRuleId !== undefined) {
          const ruleJson = await getRuleJson(selectedRuleId);
          const prepared = await prepareFileMapping(mappedData, ruleJson);

          setPendingData({
            ...prepared,
            name,
            ruleId: selectedRuleId,
          });
          setShowConfirm(true);
        } else {
          console.warn("No hay regla seleccionada");
        }
      } else {
        const prepared = await prepareFileMapping(mappedData, []);
        setPendingData({
          ...prepared,
          name,
          ruleId: undefined,
        });
        setShowConfirm(true);
      }
    } catch (err) {
      console.error("Error procesando archivo:", err);
    }
  };

  // --- Procesamiento de archivo múltiple ---
  const processMultipleFile = async (file: File, ruleId?: number) => {
    if (!file) return;
    try {
      const newFile = await saveFileMultiple(file.name, 1);
      if (!newFile) return;
      console.log("rule upload", ruleId)
      const execution = await createNewRuleExecution(newFile.id, ruleId);
      await uploadFile(file, execution);
    } catch (err) {
      console.error("Error procesando archivo múltiple:", err);
    }
  };

  // --- Crear LayoutValues ---
  const createLayoutValuesAsync = async () => {
    const filesToProcess = await getFiles();
    console.log(
      "Files to process:",
      filesToProcess.length,
      filesToProcess
    );

    for (const f of filesToProcess) {
      console.log("\n--- Procesando archivo:", f.id, " ---");
      try {
        console.log("Archivo original:", f.file);
        const parsed = await parseFile(f.file);
        console.log(`Archivo ${f.id} parseado correctamente. Filas:`, parsed.length);

        const mappedData = parsed.map((row, idx) => {
          try {
            return mapRowToDto(row);
          } catch (err) {
            console.error(`Error mapeando fila ${idx} del archivo ${f.id}:`, row, err);
            throw err;
          }
        });
        console.log(`Archivo ${f.id} mapeado correctamente. Datos:`, mappedData);

        const ruleId: number | undefined = f.execution?.ruleId ?? undefined;

        if (ruleId !== undefined) {
          console.log("Archivo tiene ruleId:", ruleId);
          const ruleJson = await getRuleJson(ruleId);
          console.log("Regla obtenida:", ruleJson);

          const prepared = await prepareFileMapping(mappedData, ruleJson);
          console.log("Archivo preparado con regla:", prepared);

          await saveConfirmedFile(
            {
              ...prepared,
              name,
              ruleId,
            },
            1,
            true,
            f.execution?.fileId
          );
          console.log(`Archivo ${f.id} guardado con regla.`);
        } else {
          console.log("Archivo sin ruleId, se procesa como nuevo");
          const prepared = await prepareFileMapping(mappedData, []);
          console.log("Archivo preparado sin regla:", prepared);

          await saveConfirmedFile(
            {
              ...prepared,
              name,
              ruleId: undefined,
            },
            1,
            true,
            f.execution?.fileId
          );
          console.log(`Archivo ${f.id} guardado sin regla.`);
        }

        if (f.execution) {
          await validateLayout(f.execution.fileId);
          console.log(`Archivo ${f.id} validado correctamente.`);
        }

        await removeFile(f.id);
        console.log(`Archivo ${f.id} removido de la cola.`);
      } catch (err: any) {
        console.error(
          "Error creando LayoutValues para archivo:",
          f.id,
          err?.message,
          err?.stack
        );
      }
    }

    console.log("Procesamiento de todos los archivos finalizado.");
  };

  // --- Submit de archivos ---
  const handleSubmit = async () => {
    if (files.length === 0) return;
    setLoading(true);

    try {
      if (files.length === 1) {
        await processSingleFile(files[0]);
      } else {
        console.log("rule submit", selectedRuleId)
        await Promise.all(files.map((file) => processMultipleFile(file, selectedRuleId)));
        setName("");
        setCompany("");
        setPrompt("");
        setFiles([]);
        setInputMode("rule");
        setPendingData(null);
        onCancel();
        await createLayoutValuesAsync();
      }
    } catch (err) {
      console.error("Error procesando archivos:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Confirmación ---
  const handleConfirm = async () => {
    if (!pendingData) return;

    setLoading(true);
    try {
      const newFile = await saveConfirmedFile(pendingData, 1, false);

      if (newFile) {
        await createNewRuleExecution(newFile.id, pendingData.ruleId);
        await validateLayout(newFile.id);
      }

      // Reset
      setName("");
      setCompany("");
      setPrompt("");
      setFiles([]);
      setInputMode("rule");
      setPendingData(null);
      onCancel();
    } catch (err) {
      console.error("Error creando archivo:", err);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div
      className="p-6 rounded-lg shadow-sm space-y-4"
      style={{ background: SecondaryColors.background_3 }}
    >
      <LoadingOverlay isLoading={loading} />
      <h2 className="text-xl font-semibold" style={{ color: SecondaryColors.dark_gray }}>
        Procesar archivos
      </h2>

      {/* Datos básicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          className="border-0"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ background: SecondaryColors.background_2 }}
        />
      </div>

      {/* Selector */}
      <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as "rule" | "file")}>
        <TabsList className="bg-gray-100 p-1 rounded-md">
          <TabsTrigger value="rule">Procesar Con Reglas</TabsTrigger>
          <TabsTrigger value="file">Procesar Nuevo</TabsTrigger>
        </TabsList>

        <FileUpload
          uploadMode="multi"
          onFilesUploaded={(uploadedFiles) => {
            const validFiles = (Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles])
              .filter((f): f is File => f !== null);
            setFiles(validFiles);
          }}
        />

        <TabsContent value="rule">
          <BusinessRulesDataTable
            columns={columns(setRowSelection)}
            data={data}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />
        </TabsContent>

        <TabsContent value="file"></TabsContent>
      </Tabs>

      {/* Acciones */}
      <div className="flex justify-end gap-x-2">
        <Button
          onClick={onCancel}
          className="font-semibold"
          style={{ background: SecondaryColors.content_4 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          className="font-semibold"
          style={{ background: PrimaryColors.red, color: SecondaryColors.background_3 }}
        >
          Crear
        </Button>
        <ConfirmModal
          isOpen={showConfirm}
          title="Confirmar creación"
          confirmText="Sí, crear"
          cancelText="Cancelar"
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        >
          <div className="space-y-3">
            <Input
              placeholder="Nombre"
              className="border-gray-100"
              value={pendingData?.name || ""}
              onChange={(e) =>
                setPendingData((prev) =>
                  prev ? { ...prev, name: e.target.value } : prev
                )
              }
            />
            <div className="max-h-60 overflow-auto p-2 space-y-2">
              {pendingData?.mappedRows.map((row, rowIndex) => (
                <div key={row.row} className="py-1 border-b border-gray-200">
                  <p className="font-semibold mb-1" style={{ color: SecondaryColors.dark_gray }}>
                    Fila {rowIndex + 1}:
                  </p>
                  <div className="ml-2 space-y-1">
                    {row.values.map((v, valueIndex) => (
                      <div key={valueIndex} className="flex items-center gap-2">
                        <span className="w-32 font-medium">{v.fieldName}:</span>
                        <Input
                          value={v.value}
                          placeholder={v.fieldName}
                          className="border-gray-100"
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setPendingData((prev) => {
                              if (!prev) return prev;
                              const newMappedRows = [...prev.mappedRows];
                              newMappedRows[rowIndex] = {
                                ...newMappedRows[rowIndex],
                                values: [...newMappedRows[rowIndex].values],
                              };
                              newMappedRows[rowIndex].values[valueIndex] = {
                                ...newMappedRows[rowIndex].values[valueIndex],
                                value: newValue,
                              };
                              return { ...prev, mappedRows: newMappedRows };
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ConfirmModal>
      </div>
    </div>
  );
};
