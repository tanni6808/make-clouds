import { createPortal } from "react-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export default function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;
  return createPortal(
    <div
      className="fixed inset-0 bg-primary-dark/50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl relative outline-4 outline-offset-[-8px]"
        onClick={(e) => e.stopPropagation()}
      >
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="absolute top-3 right-3 cursor-pointer text-2xl hover:text-primary-light"
          onClick={onClose}
        />
        {children}
      </div>
    </div>,
    document.body
  );
}
