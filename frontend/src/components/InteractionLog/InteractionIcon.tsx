import React from 'react';
import { FiPhone } from "react-icons/fi";
import { FiMail } from "react-icons/fi";
import { FiMessageSquare } from "react-icons/fi";



interface InteractionIconProps {
  type: 'Phone' | 'Message' | 'Email';
}

const InteractionIcon: React.FC<InteractionIconProps> = ({ type }) => {
  switch (type) {
    case 'Phone':
      return (
        <div className="interaction-icon">
          <FiPhone size={22}/>
        </div>
      );
    case 'Message':
      return (
        <div className="interaction-icon">
          <FiMessageSquare size={22}/>
        </div>
      );
    case 'Email':
      return (
        <div className="interaction-icon">
          <FiMail size={22}/>
        </div>
      );
    default:
      return null;
  }
};

export default InteractionIcon;