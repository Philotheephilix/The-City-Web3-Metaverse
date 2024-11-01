// Modal.tsx
import React from 'react';
import Modal from 'react-modal';

interface CustomModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onRequestClose, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
        content: {
          backgroundColor: 'black',
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          borderRadius: '15px',
          border: '2px solid grey',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      }}
      ariaHideApp={false}
    >
      <button onClick={onRequestClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
        &times;
      </button>
      {children}
    </Modal>
  );
};

export default CustomModal;
