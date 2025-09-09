import { useState, useEffect } from "react";
import axios from "axios";
import NativeFile from "../types/NativeFileDto";
import LayoutField from "../types/LayoutFieldDto";
import LayoutValue from "../types/LayoutValueDto";
import { API_BASE_URL } from "@/helpers/backend";
import { getLayoutFields } from "@/services/layoutFieldsService";
import { getLayoutValueByFileId } from "../services/layoutValuesService";

interface UseNativeFileDetailsProps {
    fileId: number;
}

export const useNativeFileDetails = ({ fileId }: UseNativeFileDetailsProps) => {
    const [file, setFile] = useState<NativeFile | null>(null);
    const [layoutFields, setLayoutFields] = useState<LayoutField[]>([]);
    const [layoutValues, setLayoutValues] = useState<LayoutValue[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFileDetails = async () => {
            setLoading(true);
            try {
                const fieldsResponse = await getLayoutFields();
                setLayoutFields(fieldsResponse);

                const valuesResponse = await getLayoutValueByFileId(fileId);
                setLayoutValues(valuesResponse);
            } catch (err: any) {
                setError(err.message || "Error al cargar los detalles del archivo");
            } finally {
                setLoading(false);
            }
        };

        fetchFileDetails();
    }, [fileId]);

    return { file, layoutFields, layoutValues, loading, error };
};
