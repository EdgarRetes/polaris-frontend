import React, { useState } from "react";
import NativeFile from "@/types/NativeFileDto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useBusinessRules } from "../../BusinessRules/hooks/useBusinessRules";
import { BusinessRulesDataTable } from "@/pages/BusinessRules/components/DataTable";
import { columns } from "../../BusinessRules/components/Columns";
import { useRuleExecutions } from "../hooks/useRuleExcecutions";

import { PrimaryColors, SecondaryColors } from "@/helpers/colors";

interface NativeFileFormProps {
  onSubmit: (rule: NativeFile) => void;
  onCancel: () => void;
}

export const NativeFilesForm: React.FC<NativeFileFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");

  const [inputMode, setInputMode] = useState<"rule" | "file">("rule");
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { data } = useBusinessRules();
  const {
    parseFile,
    mapRowToDto,
    getRuleJson,
    createNewNativeFile,
    createNewRuleExecution,
  } = useRuleExecutions();

  const [selectedRuleId, setSelectedRuleId] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    try {
      console.log(file);
      const parsed = await parseFile(file);
      console.log(parsed);
      const mappedData = parsed.map((row) => mapRowToDto(row));
      console.log(mappedData);
      if (selectedRuleId !== null) {
        const ruleJson = await getRuleJson(selectedRuleId);
        const newFile = await createNewNativeFile(
          name,
          "null", // companyId si aplica
          mappedData,
          ruleJson,
          1 // userId actual
        );

        if (newFile) {
          await createNewRuleExecution(newFile.id, selectedRuleId);
        }
      } else {
        console.warn("No hay regla seleccionada");
      }

      setName("");
      setCompany("");
      setPrompt("");
      setFile(null);
      //   setStatus("Activa");
      setInputMode("rule");
      onCancel();
    } catch (err) {
      console.error("Error processing rule:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-6 rounded-lg shadow-sm space-y-4"
      style={{ background: SecondaryColors.background_3 }}
    >
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

      <input
        type="file"
        accept=".csv, .json, .xlsx, .pdf, .doc, .docx, .xml, .txt"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mt-3"
      />
      {file && (
        <p
          className="text-sm mt-1"
          style={{ color: SecondaryColors.dark_gray }}
        >
          Archivo seleccionado: {file.name}
        </p>
      )}

      {/* --- Selector --- */}
      <Tabs
        value={inputMode}
        onValueChange={(v) => setInputMode(v as "rule" | "file")}
      >
        <TabsList className="bg-gray-100 p-1 rounded-md">
          <TabsTrigger value="rule">Procesar Con Reglas</TabsTrigger>
          <TabsTrigger value="file">Procesar Nuevo</TabsTrigger>
        </TabsList>

        <TabsContent value="rule">
          <BusinessRulesDataTable
            columns={columns}
            data={data}
            onRowSelect={(id) => setSelectedRuleId(id)}
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
      </div>
    </div>
  );
};
