"use client";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

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
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null; // 確保有document

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-primary-dark/50 z-50 flex justify-center items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-white p-6 rounded-xl relative outline-4 outline-offset-[-8px]"
            onClick={(e) => e.stopPropagation()}
          >
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="absolute top-3 right-3 cursor-pointer text-2xl hover:text-primary-light"
              onClick={onClose}
            />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
