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
  ruleId?: number | null;
};

export const NativeFilesForm: React.FC<NativeFileFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const selectedRuleIdStr = rowSelection
    ? Number(Object.keys(rowSelection)[0])
    : null;

  const selectedRuleId = selectedRuleIdStr ? Number(selectedRuleIdStr) : null;

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");

  const [inputMode, setInputMode] = useState<"rule" | "file">("rule");
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
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
  } = useRuleExecutions();

  const handleSubmit = async () => {
    if (!file) return;

    try {
      setLoading(true);

      const parsed = await parseFile(file);

      if (inputMode === "rule") {
        if (selectedRuleId !== null) {
          const ruleJson = await getRuleJson(selectedRuleId);
          const mappedData = parsed.map((row) => mapRowToDto(row));
        

          const prepared = await prepareFileMapping(mappedData, ruleJson);

          setPendingData({
            ...prepared,
            name,
            // company,
            ruleId: selectedRuleId,
          });
          setShowConfirm(true);
        } else {
          console.warn("No hay regla seleccionada");
        }
      } else if (inputMode === "file") {
        const mappedData = parsed.map((row) => mapRowToDto(row));

        const prepared = await prepareFileMapping(mappedData, []);

        setPendingData({
          ...prepared,
          name,
          // company,
          ruleId: null,
        });
        setShowConfirm(true);
      }
    } catch (err) {
      console.error("Error processing file:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!pendingData) return;

    setLoading(true);
    try {
      const newFile = await saveConfirmedFile(pendingData, 1);

      if (newFile) {
        await createNewRuleExecution(
          newFile.id,
          pendingData.ruleId ?? undefined
        );
      }

      // 🔹 Reset después de crear
      setName("");
      setCompany("");
      setPrompt("");
      setFile(null);
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
      <h2
        className="text-xl font-semibold"
        style={{ color: SecondaryColors.dark_gray }}
      >
        Procesar archivo
      </h2>

      {/* --- Datos básicos --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          className="border-0"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ background: SecondaryColors.background_2 }}
        />
        <Input
          className="border-0"
          placeholder="Compañía"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={{ background: SecondaryColors.background_2 }}
        />
      </div>

      {/* --- Selector --- */}
      <Tabs
        value={inputMode}
        onValueChange={(v) => setInputMode(v as "rule" | "file")}
      >
        <TabsList className="bg-gray-100 p-1 rounded-md">
          <TabsTrigger value="rule">Procesar Con Reglas</TabsTrigger>
          <TabsTrigger value="file">Procesar Nuevo</TabsTrigger>
        </TabsList>
        <FileUpload
          uploadMode="single"
          onFilesUploaded={(files) =>
            setFile(Array.isArray(files) ? files[0] : files)
          }
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

      {/* --- Acciones --- */}
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
          style={{
            background: PrimaryColors.red,
            color: SecondaryColors.background_3,
          }}
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
              value={pendingData?.name || ""}
              onChange={(e) =>
                setPendingData((prev) =>
                  prev ? { ...prev, name: e.target.value } : prev
                )
              }
            />
            <Input
              placeholder="Compañía"
              value={pendingData?.company || ""}
              onChange={(e) =>
                setPendingData((prev) =>
                  prev ? { ...prev, company: e.target.value } : prev
                )
              }
            />

            {/* Vista previa editable de filas con fieldName al lado */}
            <div className="max-h-60 overflow-auto unded p-2 space-y-2">
              {pendingData?.mappedRows.map((row, rowIndex) => (
                <div key={row.row} className="py-1">
                  {/* <p className="font-semibold mb-1">Fila {row.row}</p> */}
                  <div className="ml-2 space-y-1">
                    {row.values.map((v, valueIndex) => (
                      <div key={valueIndex} className="flex items-center gap-2">
                        <span className="w-32 font-medium mr-3">
                          {v.fieldName}:
                        </span>
                        <Input
                          value={v.value}
                          placeholder={v.fieldName}
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
