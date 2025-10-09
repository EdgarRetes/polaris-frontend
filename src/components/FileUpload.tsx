import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ZodSchema } from "zod";

interface FileUploadProps {
  layout?: "vertical" | "horizontal";
  uploadMode?: "single" | "multi";
  defaultText?: string;
  otherText?: string;
  maxSize?: number;
  acceptedFileTypes?: Record<string, string[]>;
  onFilesUploaded: (files: File[] | File | null) => void;
  zodSchema?: ZodSchema<any>;
  errors?: string | string[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  layout = "vertical",
  uploadMode = "single",
  defaultText = "Selecciona o arrastra los archivos de pago aquí",
  otherText = "(PDF, DOC, DOCX, CSV, XML, TXT up to 20MB)",
  maxSize = 20 * 1024 * 1024, // 20MB
  acceptedFileTypes = {
    "text/csv": [".csv"],
    "application/json": [".json"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "application/xml": [".xml", ".txt"],
    "text/plain": [".txt"],
  },
  onFilesUploaded,
  zodSchema,
  errors: externalErrors,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [internalErrors, setInternalErrors] = useState<string | null>(null);

  /**
   * Validates a file using the provided Zod schema.
   */
  const validateFile = (file: File | undefined): string | null => {
    if (!file) {
      return "No file selected";
    }

    if (zodSchema) {
      try {
        zodSchema.parse({ file });
        return null;
      } catch (error: any) {
        console.log("Validation error:", error);
        return error.errors?.[0]?.message || "Invalid file";
      }
    }

    return null;
  };

  /**
   * Handles the files dropped into the component.
   */
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        setInternalErrors("No valid files were dropped");
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      let validationError: string | null = null;
      if (uploadMode === "single") {
        validationError = validateFile(newFiles[0]);

        if (!validationError) {
          setFiles(newFiles.slice(0, 1));
          onFilesUploaded(newFiles[0]);
          setInternalErrors(null);
        } else {
          setInternalErrors(validationError);
        }
      } else {
        const errors = newFiles.map(validateFile).filter(Boolean);

        if (errors.length === 0) {
          setFiles((prev) => [...prev, ...newFiles]);
          onFilesUploaded(newFiles);
          setInternalErrors(null);
        } else {
          setInternalErrors(errors[0] as string);
        }
      }
    },
    [uploadMode, onFilesUploaded, zodSchema]
  );

  // Configure the dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes as any,
    maxSize,
    multiple: uploadMode === "multi",
  });

  /**
   * Removes a file from the list of selected files.
   */
  const removeFile = (file: File) => {
    const newFiles = files.filter((f) => f !== file);
    setFiles(newFiles);
    onFilesUploaded(uploadMode === "single" ? null : newFiles);
    setInternalErrors(null);
  };

  // dynamic styling
  const dropzoneClasses = cn(
    "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
    isDragActive
      ? "border-blue-500 bg-blue-50"
      : internalErrors || externalErrors
      ? "border-red-500"
      : "border-gray-300 hover:border-gray-400",
    layout === "horizontal"
      ? "flex items-center justify-center space-x-4"
      : "flex flex-col justify-center items-center space-y-2"
  );

  const renderDropzone = () => (
    <>
      <div {...getRootProps({ className: dropzoneClasses })}>
        <input {...getInputProps()} />
        <UploadIcon className="w-8 h-8 text-gray-400" />
        <p className="text-sm text-gray-600">{defaultText}</p>
        <p className="text-xs text-gray-500">{otherText}</p>
      </div>

      {(internalErrors || externalErrors) && (
        <p className="text-xs font-medium text-red-500 mt-2">
          {internalErrors ||
            (Array.isArray(externalErrors)
              ? externalErrors.join(", ")
              : externalErrors)}
        </p>
      )}
    </>
  );

  const renderFileList = () => (
    <div className="mt-4 space-y-2">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 shadow"
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center p-5">
              <span className="text-xs font-medium">
                {file.name.split(".").pop()?.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium truncate max-w-xs">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={() => removeFile(file)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {(uploadMode === "multi" || files.length === 0) && renderDropzone()}
      {renderFileList()}
    </div>
  );
};

export default FileUpload;
