import { useState, useEffect } from "react";
import { Modal } from "@heroui/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion, AnimatePresence } from "framer-motion";
import loader from "@/app/loader.json";

const messages = [
  "Scanning campaign performance...",
  "Crunching CTR, CPC, CPA, ROAS...",
  "Spotting underperforming campaigns...",
  "Running AI optimization models...",
  "Crafting your playbook of insights...",
];

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const AnalyzeLoadingModal = ({ isOpen, onOpenChange }: Props) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <Modal.Backdrop
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      variant="blur"
      isDismissable={false}
      isKeyboardDismissDisabled
    >
      <Modal.Container>
        <Modal.Dialog aria-label="Analyzing Campaigns">
          <Modal.Body>
            <div className="flex flex-col gap-y-5 items-center">
              <DotLottieReact data={loader} loop autoplay />

              <div className="h-8 w-full relative flex justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={index}
                    initial={{ x: -60, opacity: 0, scale: 0.7 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: 60, opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    className="text-center absolute whitespace-nowrap"
                  >
                    {messages[index]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};

export default AnalyzeLoadingModal;
