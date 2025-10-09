import { useState, useEffect } from "react";
import NativeFile from "@/types/NativeFileDto";
import LayoutField from "@/types/LayoutFieldDto";
import LayoutValue from "@/types/LayoutValueDto";
import { getLayoutFields } from "@/services/layoutFieldsService";
import { getLayoutValueByFileId } from "@/services/layoutValuesService";

interface UseNativeFileDetailsProps {
    file: NativeFile; 
}

export const useNativeFileDetails = ({ file }: UseNativeFileDetailsProps) => {
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

                const valuesResponse = await getLayoutValueByFileId(file.id); 
                setLayoutValues(valuesResponse);
            } catch (err: any) {
                setError(err.message || "Error al cargar los detalles del archivo");
            } finally {
                setLoading(false);
            }
        };

        fetchFileDetails();
    }, [file]);

    return { fetchedFile: file, layoutFields, layoutValues, loading, error };
};
