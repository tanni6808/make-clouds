import Modal from "./modal";
import Button from "./button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

export default function AlertModal({
  isOpen,
  onClose,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {
        <div className="flex flex-col items-center px-6 py-3 gap-3">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className="text-4xl text-red"
          />
          <div className="max-w-[320px]">{message}</div>
          <Button style="solid" onClick={onClose} className="px-5">
            確定
          </Button>
        </div>
      }
    </Modal>
  );
}
