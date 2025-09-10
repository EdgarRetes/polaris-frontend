export const CREATE_RULE_ASSISTANT_ID = import.meta.env.VITE_OPENAI_CREATE_RULE_ASSISTANT_ID;
export const CREATE_JSON_ASSISTANT_ID = import.meta.env.VITE_OPENAI_CREATE_JSON_ASSISTANT_ID;
export const OPENAI_API_URL_FILES = "/files";
export const OPENAI_API_URL_THREADS = "/threads";
import { openAiClient } from "@/helpers/openai";
import { Theater } from "lucide-react";

export interface PaymentMapping {
    operationCode?: string;
    idCode?: string;
    originAccount?: string;
    destinationAccount?: string;
    paymentAmount?: number;
    reference?: string;
    paymentDescription?: string;
    originCurrency?: string;
    destinationCurrency?: string;
    rfc?: string;
    iva?: number;
    email?: string;
    emailBeneficiary?: string;
    applicationDate?: string;
    paymentInstruction?: string;
}

export interface JsonMapping {
    key: string;
    value: string;
}

export const uploadFileToOpenAI = async (file: File): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("purpose", "assistants");

        const response = await openAiClient.post(OPENAI_API_URL_FILES, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data.id;
    } catch (error) {
        console.error("Error subiendo archivo a OpenAI:", error);
        throw error;
    }
};

export const deleteFileFromOpenAI = async (fileId: string): Promise<boolean> => {
    try {
        const response = await openAiClient.delete(
            `${OPENAI_API_URL_FILES}/${fileId}`
        );

        if (response.data?.deleted) {
            return true;
        } else {
            console.warn(`No se pudo eliminar el archivo ${fileId}. Respuesta:`, response.data);
            return false;
        }
    } catch (error) {
        console.error(`Error eliminando archivo ${fileId} en OpenAI:`, error);
        return false;
    }
};



export const mapPaymentFileToJSON = async (
    fileId: string
): Promise<PaymentMapping[] | null> => {
    try {
        const thread = await openAiClient.post(
            OPENAI_API_URL_THREADS,
            {
                tool_resources: {
                    code_interpreter: {
                        file_ids: [fileId],
                    },
                },
            },
            { headers: { "OpenAI-Beta": "assistants=v2" } }
        );
        const threadId = thread.data.id;


        await openAiClient.post(
            `${OPENAI_API_URL_THREADS}/${threadId}/messages`,
            {
                role: "user",
                content: `Analiza el archivo adjunto y extrae la información de TODOS los pagos. Devuelve SOLAMENTE un array de objetos JSON válido que siga esta estructura: ${JSON.stringify({ operationCode: "", idCode: "", originAccount: "", destinationAccount: "", paymentAmount: 0, reference: "", paymentDescription: "", originCurrency: "", destinationCurrency: "", rfc: "", iva: 0, email: "", emailBeneficiary: "", applicationDate: "", paymentInstruction: "" })}. No incluyas texto explicativo, solo el JSON.`,
            },
            { headers: { "OpenAI-Beta": "assistants=v2" } }
        );
        const run = await openAiClient.post(
            `${OPENAI_API_URL_THREADS}/${threadId}/runs`,
            { assistant_id: CREATE_RULE_ASSISTANT_ID },
            { headers: { "OpenAI-Beta": "assistants=v2" } }
        );
        const runId = run.data.id;

        let runStatus = run.data.status;
        while (runStatus === "queued" || runStatus === "in_progress") {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const runCheck = await openAiClient.get(
                `${OPENAI_API_URL_THREADS}/${threadId}/runs/${runId}`,
                { headers: { "OpenAI-Beta": "assistants=v2" } }
            );
            runStatus = runCheck.data.status;
        }

        if (runStatus !== "completed") {
            throw new Error(`El run no se completó. Estado final: ${runStatus}`);
        }
        const messageResponse = await openAiClient.get(
            `${OPENAI_API_URL_THREADS}/${threadId}/messages`,
            {
                headers: { "OpenAI-Beta": "assistants=v2" },
                params: { order: "desc", limit: 1 },
            }
        );

        const lastMessage = messageResponse.data.data[0];
        if (!lastMessage || lastMessage.role !== 'assistant' || !lastMessage.content[0]) {
            throw new Error("No se recibió una respuesta válida del asistente.");
        }

        const jsonText = lastMessage.content[0].text.value;

        const cleanedJsonText = jsonText.replace(/```json\n|```/g, "").trim();

        try {
            const jsonData: PaymentMapping[] = JSON.parse(cleanedJsonText);
            await deleteFileFromOpenAI(fileId);

            return jsonData;
        } catch (parseError) {
            console.error("Error al parsear el JSON de la respuesta:", parseError);
            console.error("Respuesta recibida del asistente:", cleanedJsonText);
            throw new Error("La respuesta del asistente no es un JSON válido.");
        }
    } catch (error) {
        console.error("Error procesando archivo con OpenAI:", error);
        return null;
    }
};

export const getJSONValues = async (
    fileStrings: string[]
): Promise<PaymentMapping[] | null> => {
    try {
        const thread = await openAiClient.post(
            OPENAI_API_URL_THREADS,
            {},
            { headers: { "OpenAI-Beta": "assistants=v2" } }
        );
        const threadId = thread.data.id;

        const fileString = fileStrings.join("\n");

        await openAiClient.post(
            `${OPENAI_API_URL_THREADS}/${threadId}/messages`,
            {
                role: "user",
                content: `Analiza el string adjunto ${fileString} y extrae la información de TODOS los pagos. Devuelve SOLAMENTE un array de objetos JSON válido que mappea cada valor a cada columna. No incluyas texto explicativo, solo el JSON.`,
            },
            { headers: { "OpenAI-Beta": "assistants=v2" } }
        );
        const run = await openAiClient.post(
            `${OPENAI_API_URL_THREADS}/${threadId}/runs`,
            { assistant_id: CREATE_JSON_ASSISTANT_ID },
            { headers: { "OpenAI-Beta": "assistants=v2" } }
        );
        const runId = run.data.id;

        let runStatus = run.data.status;
        while (runStatus === "queued" || runStatus === "in_progress") {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const runCheck = await openAiClient.get(
                `${OPENAI_API_URL_THREADS}/${threadId}/runs/${runId}`,
                { headers: { "OpenAI-Beta": "assistants=v2" } }
            );
            runStatus = runCheck.data.status;
        }

        if (runStatus !== "completed") {
            throw new Error(`El run no se completó. Estado final: ${runStatus}`);
        }
        const messageResponse = await openAiClient.get(
            `${OPENAI_API_URL_THREADS}/${threadId}/messages`,
            {
                headers: { "OpenAI-Beta": "assistants=v2" },
                params: { order: "desc", limit: 1 },
            }
        );

        const lastMessage = messageResponse.data.data[0];
        if (!lastMessage || lastMessage.role !== 'assistant' || !lastMessage.content[0]) {
            throw new Error("No se recibió una respuesta válida del asistente.");
        }

        const jsonText = lastMessage.content[0].text.value;

        const cleanedJsonText = jsonText.replace(/```json\n|```/g, "").trim();

        try {
            const jsonData: PaymentMapping[] = JSON.parse(cleanedJsonText);
            return jsonData;
        } catch (parseError) {
            console.error("Error al parsear el JSON de la respuesta:", parseError);
            console.error("Respuesta recibida del asistente:", cleanedJsonText);
            throw new Error("La respuesta del asistente no es un JSON válido.");
        }
    }
    catch (error) {
        console.error("Error procesando archivo con OpenAI:", error);
        return null;
    }
};

