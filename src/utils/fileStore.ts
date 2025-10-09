import RuleExecution from "@/types/RuleExecutionDto";

type StoredFile = {
  file: File;
  execution?: RuleExecution; 
};

let uploadedFiles: StoredFile[] = [];

export const FileStore = {
  getFiles: () => uploadedFiles,

  addFile: (file: File, execution?: RuleExecution) => {
    uploadedFiles.push({ file, execution });
  },

  removeFile: (fileToRemove: File) => {
    uploadedFiles = uploadedFiles.filter(f => f.file !== fileToRemove);
  },

  setExecution: (file: File, execution: RuleExecution) => {
    uploadedFiles = uploadedFiles.map(f =>
      f.file === file ? { ...f, execution } : f
    );
  },
};
