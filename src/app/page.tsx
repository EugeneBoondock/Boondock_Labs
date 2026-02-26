"use client";

import React from 'react';
import { Win7Provider } from './win7/Win7Context';
import Win7Desktop from './win7/Win7Desktop';
import './win7/win7.css';

export default function Home() {
  return (
    <Win7Provider>
      <Win7Desktop />
    </Win7Provider>
  );
}
