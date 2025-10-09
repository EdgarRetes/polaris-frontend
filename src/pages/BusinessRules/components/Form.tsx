import React, { useState } from "react";
import BusinessRule from "@/types/BusinessRuleDto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { ConfirmModal } from "@/components/ConfirmModal";
import FileUpload from "@/components/FileUpload";

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

type PendingRule = {
  name: string;
  company: string;
  status: BusinessRule["status"];
  definition: PaymentMapping[];
};

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

  const [pendingRule, setPendingRule] = useState<PendingRule | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const { addBusinessRule, getAIJsonFromFile, parseFile } = useBusinessRules(
    []
  );

  /** PREPARAR: solo obtiene los datos, no toca la BD */
  const handlePrepare = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      let definition: PaymentMapping[] = [];

      const processEntry = (
        entry: Partial<PaymentMapping>
      ): PaymentMapping => ({
        operationCode: entry.operationCode ?? "",
        idCode: entry.idCode ?? "",
        originAccount: entry.originAccount ?? "",
        destinationAccount: entry.destinationAccount ?? "",
        paymentAmount: entry.paymentAmount ?? 0,
        reference: entry.reference ?? "",
        paymentDescription: entry.paymentDescription ?? "",
        originCurrency: entry.originCurrency ?? "",
        destinationCurrency: entry.destinationCurrency ?? "",
        rfc: entry.rfc ?? "",
        iva: entry.iva ?? 0,
        email: entry.email ?? "",
        emailBeneficiary: entry.emailBeneficiary ?? "",
        applicationDate: entry.applicationDate ?? "",
        paymentInstruction: entry.paymentInstruction ?? "",
      });

      if (inputMode === "file") {
        if (!file) return;
        
        const parsedData = await parseFile(file);
        const aiResponse = await getAIJsonFromFile(parsedData);
        if (!aiResponse) return;

        definition = aiResponse.map(processEntry);
      } else if (inputMode === "text") {
        if (!prompt.trim()) return;

        const aiResponse = await getAIJsonFromFile(prompt);
        console.log(aiResponse)
        if (!aiResponse) return;

        definition = aiResponse.map(processEntry);
      }

      // SOLO prepara la regla para el modal
      setPendingRule({ name, company, status, definition });
      setShowConfirm(true);
    } catch (err) {
      console.error("Error preparando la regla:", err);
    } finally {
      setLoading(false);
    }
  };

  /** CONFIRMAR: guarda la regla en la BD */
  const handleConfirm = async () => {
    if (!pendingRule) return;

    setLoading(true);
    try {
      const firstDefinition = pendingRule.definition[0];
      const ruleToSend: Partial<BusinessRule> = {
        name: pendingRule.name,
        // companyId: Number(pendingRule.company),
        // status: pendingRule.status,
        definition: firstDefinition,
      };

      await addBusinessRule(ruleToSend);

      // Limpiar form solo después de guardar
      setName("");
      setCompany("");
      setPrompt("");
      setFile(null);
      setStatus("Activa");
      setInputMode("text");
      setPendingRule(null);
      setShowConfirm(false);

      onCancel();
    } catch (err) {
      console.error("Error creando la regla:", err);
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

      {/* Datos básicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          className="border-0"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ background: SecondaryColors.background_2 }}
        />
        {/* <Input
          className="border-0"
          placeholder="Compañía"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={{ background: SecondaryColors.background_2 }}
        /> */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md p-2">
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

      {/* Tabs entrada IA */}
      <Tabs
        value={inputMode}
        onValueChange={(v) => setInputMode(v as "text" | "file")}
      >
        <TabsList>
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
          <FileUpload
            uploadMode="single"
            onFilesUploaded={(files) =>
              setFile(Array.isArray(files) ? files[0] : files)
            }
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
          onClick={handlePrepare}
          className="font-semibold"
          style={{
            background: PrimaryColors.red,
            color: SecondaryColors.background_3,
          }}
        >
          Crear
        </Button>
      </div>

      {/* Modal */}
      {pendingRule && (
        <ConfirmModal
          isOpen={showConfirm}
          title="Confirmar creación de regla"
          confirmText="Sí, crear"
          cancelText="Cancelar"
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        >
          <div className="space-y-3">
            <Input
              placeholder="Nombre"
              value={pendingRule.name}
              className="border-gray-200"
              onChange={(e) =>
                setPendingRule((prev) =>
                  prev ? { ...prev, name: e.target.value } : prev
                )
              }
            />
            {/* <Input
              placeholder="Compañía"
              value={pendingRule.company}
              onChange={(e) =>
                setPendingRule((prev) =>
                  prev ? { ...prev, company: e.target.value } : prev
                )
              }
            /> */}
            <div className="max-h-60 overflow-auto p-2 space-y-2">
              {pendingRule.definition.map((entry, idx) => (
                <div key={idx} className="pb-2 mb-2">
                  {Object.entries(entry).map(([field, value], i) => (
                    <div key={i} className="flex items-center gap-2 w-full py-1">
                      <span className="font-medium w-48">{field}:</span>
                      <Input
                        value={value}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setPendingRule((prev) => {
                            if (!prev) return prev;
                            const newDef = [...prev.definition];
                            newDef[idx] = { ...newDef[idx], [field]: newValue };
                            return { ...prev, definition: newDef };
                          });
                        }}
                        className="flex-1 border-gray-200"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </ConfirmModal>
      )}
    </div>
  );
};
