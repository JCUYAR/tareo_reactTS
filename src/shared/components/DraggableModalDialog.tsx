import { ModalDialog } from "react-bootstrap";
import Draggable from 'react-draggable';

const DraggableModalDialog = ({
  handleSelector = ".modal-header",
  ...props
}) => {
//   const isMobile = useIsMobile();

//   if (isMobile && handleSelector !== ".modal-header") {
//     return <ModalDialog {...props} />;
//   }

  return (
    <Draggable handle={handleSelector} cancel=".btn-close">
      <div style={{ height: "100%" }}>
        <ModalDialog {...props} />
      </div>
    </Draggable>
  );
};

export default DraggableModalDialog;