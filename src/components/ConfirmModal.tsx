// components/ConfirmModal.tsx
import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { SecondaryColors, PrimaryColors } from "@/helpers/colors";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode; // 👉 aquí permitimos contenido dinámico
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Confirmar acción",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div
        className="p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4"
        style={{ background: SecondaryColors.background_3 }}
      >
        {/* Título */}
        <h2
          className="text-lg font-semibold"
          style={{ color: SecondaryColors.dark_gray }}
        >
          {title}
        </h2>

        {/* Contenido dinámico */}
        <div>{children}</div>

        {/* Botones */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            onClick={onCancel}
            style={{ background: SecondaryColors.content_4 }}
            className="font-semibold"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            style={{
              background: PrimaryColors.red,
              color: SecondaryColors.background_3,
            }}
            className="font-semibold"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
