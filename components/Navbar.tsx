'use client'

import { useState } from 'react'

interface NavbarProps {
  onOpenModal: () => void
}

export default function Navbar({ onOpenModal }: NavbarProps) {
  return (
    <nav>
      <div className="logo">Meridian <span>Properties</span></div>
      <ul className="nav-links">
        <li><a href="#listings">Listings</a></li>
        <li><a href="#why">Why Us</a></li>
        <li><a href="#agents">Agents</a></li>
        <li><a href="#process">Process</a></li>
      </ul>
      <div className="nav-right">
        <span className="nav-phone">+1 (212) 888-0044</span>
        <button className="nav-cta" onClick={onOpenModal}>Book Consultation</button>
      </div>
    </nav>
  )
}
