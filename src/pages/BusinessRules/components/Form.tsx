import React, { useState } from "react";
import BusinessRule from "@/types/BusinessRuleDto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoadingOverlay } from "@/components/LoadingOverlay";

import { useBusinessRules } from "../hooks/useBusinessRules";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown } from "lucide-react";
import { PrimaryColors, SecondaryColors } from "@/helpers/colors";

import { PaymentMapping } from "../../../services/openAiService";

interface BusinessRuleFormProps {
  onSubmit: (rule: BusinessRule) => void;
  onCancel: () => void;
}

export const BusinessRuleForm: React.FC<BusinessRuleFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<BusinessRule["status"]>("Activa");

  const [inputMode, setInputMode] = useState<"text" | "file">("text");
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { addBusinessRule, getAIJsonFromFile, parseFile } = useBusinessRules(
    []
  );

  const handleSubmit = async () => {
    if (!name.trim() || !company.trim()) return;
    setLoading(true);

    try {
      let definition: PaymentMapping[] | string | null = null;

      if (inputMode === "file") {
        if (!file) {
          console.warn("No se seleccionó archivo");
          return;
        }

        // 🔹 Parsear el archivo
        const parsedData = await parseFile(file);

        // 🔹 Obtener la definición desde la IA
        const aiResponse = await getAIJsonFromFile(parsedData);
        if (!aiResponse) {
          console.error("No se pudo obtener información del archivo.");
          return;
        }

        definition = aiResponse;
      } else if (inputMode === "text") {
        // 🔹 Definición desde el prompt
        if (!prompt.trim()) {
          console.warn("No se proporcionó texto para la regla.");
          return;
        }

        // 🔹 Obtener la definición desde la IA
        const aiResponse = await getAIJsonFromFile(prompt);
        if (!aiResponse) {
          console.error("No se pudo obtener información del archivo.");
          return;
        }

        definition = aiResponse;
      }

      // 🔹 Crear la regla
      const newRule: Partial<BusinessRule> = {
        name,
        company,
        status,
        definition: definition ?? [],
      };

      await addBusinessRule(newRule);

      // 🔹 Resetear formulario
      setName("");
      setCompany("");
      setPrompt("");
      setFile(null);
      setStatus("Activa");
      setInputMode("text");

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
      <LoadingOverlay isLoading={loading} />
      <h2
        className="text-xl font-semibold"
        style={{ color: SecondaryColors.dark_gray }}
      >
        Crear Nueva Regla
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
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 rounded-md p-2"
            style={{
              backgroundColor: SecondaryColors.background,
              color: SecondaryColors.content_2,
            }}
          >
            <span>{status}</span>
            <ChevronDown className="w-3 h-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="border-0"
            style={{
              backgroundColor: SecondaryColors.background_2,
              color: SecondaryColors.dark_gray,
            }}
          >
            <DropdownMenuItem onClick={() => setStatus("Activa")}>
              Activa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatus("Inactiva")}>
              Inactiva
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatus("Borrador")}>
              Borrador
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* --- Selector de fuente para la IA --- */}
      <Tabs
        value={inputMode}
        onValueChange={(v) => setInputMode(v as "text" | "file")}
      >
        <TabsList className="bg-gray-100 p-1 rounded-md">
          <TabsTrigger value="text">Texto</TabsTrigger>
          <TabsTrigger value="file">Archivo</TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <Input
            className="border-0 mt-3"
            placeholder='Describe la regla para la compañía "A"...'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{ background: SecondaryColors.background_2 }}
          />
        </TabsContent>

        <TabsContent value="file">
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
        </TabsContent>
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
