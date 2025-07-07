"use client";
import { createContext, useContext, useState } from "react";
import AlertModal from "../components/alertModal";

const AlertContext = createContext<{ showAlert: (msg: string) => void } | null>(
  null
);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const showAlert = (msg: string) => {
    setMessage(msg);
    setIsOpen(true);
  };

  return (
    <AlertContext value={{ showAlert }}>
      {children}
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen((s) => !s)}
        message={message}
      />
    </AlertContext>
  );
}

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within AlertProvider");
  return context;
};
