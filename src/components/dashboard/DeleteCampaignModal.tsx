import { Button, Modal } from "@heroui/react";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
}

const DeleteCampaignModal = ({ isOpen, onOpenChange, onConfirm }: Props) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange} variant="blur">
      <Modal.Container>
        <Modal.Dialog aria-label="Delete Campaign">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Delete Campaign</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-y-4 items-center">
              <p className="text-muted-foreground">
                Are you sure you want to delete this campaign?
              </p>

              <div className="flex items-center gap-x-4">
                <Button variant="outline" onPress={() => onOpenChange(false)}>Cancel</Button>

                <Button variant="danger" onPress={handleConfirm}>Delete</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};

export default DeleteCampaignModal;
