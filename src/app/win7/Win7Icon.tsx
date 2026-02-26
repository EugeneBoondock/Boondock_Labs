"use client";

import React, { useState } from 'react';

interface Win7IconProps {
  icon: string;
  label: string;
  onDoubleClick: () => void;
}

export default function Win7Icon({ icon, label, onDoubleClick }: Win7IconProps) {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected(true);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDoubleClick();
  };

  return (
    <div 
      className={`desktop-icon ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onBlur={() => setIsSelected(false)}
      tabIndex={0}
    >
      <div className="icon-image">
        <img src={icon} alt={label} draggable={false} />
      </div>
      <span className="icon-label">{label}</span>
    </div>
  );
}
