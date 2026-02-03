"use client";

import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-[#34495e]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#2C3E50] rounded flex items-center justify-center">
                <span className="font-display text-xl lg:text-2xl font-bold text-white">F</span>
              </div>
              <div className="hidden sm:block">
                <p className="font-display text-lg lg:text-xl font-bold uppercase tracking-wide text-white">
                  Forthner&apos;s
                </p>
                <p className="text-xs text-[#bdc3c7] uppercase tracking-widest">Body Shop</p>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#services" className="text-[#bdc3c7] hover:text-white transition-colors text-sm uppercase tracking-wide">
              Services
            </a>
            <a href="#heritage" className="text-[#bdc3c7] hover:text-white transition-colors text-sm uppercase tracking-wide">
              Heritage
            </a>
            <a href="#recovery" className="text-[#bdc3c7] hover:text-white transition-colors text-sm uppercase tracking-wide">
              Recovery Audit
            </a>
            <a href="#contact" className="text-[#bdc3c7] hover:text-white transition-colors text-sm uppercase tracking-wide">
              Contact
            </a>
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <a
              href="tel:6017872000"
              className="hidden sm:flex items-center gap-2 bg-[#E74C3C] hover:bg-[#c0392b] text-white px-4 lg:px-6 py-2 lg:py-3 rounded font-display font-semibold uppercase tracking-wide transition-all hover:scale-105 shadow-lg shadow-[#E74C3C]/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 lg:h-5 lg:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="text-sm lg:text-base">(601) 787-2000</span>
            </a>

            {/* Mobile Call Button */}
            <a
              href="tel:6017872000"
              className="sm:hidden flex items-center justify-center w-10 h-10 bg-[#E74C3C] hover:bg-[#c0392b] text-white rounded transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 text-[#bdc3c7] hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#34495e]/30">
            <div className="flex flex-col gap-4">
              <a href="#services" className="text-[#bdc3c7] hover:text-white transition-colors text-sm uppercase tracking-wide">
                Services
              </a>
              <a href="#heritage" className="text-[#bdc3c7] hover:text-white transition-colors text-sm uppercase tracking-wide">
                Heritage
              </a>
              <a href="#recovery" className="text-[#bdc3c7] hover:text-white transition-colors text-sm uppercase tracking-wide">
                Recovery Audit
              </a>
              <a href="#contact" className="text-[#bdc3c7] hover:text-white transition-colors text-sm uppercase tracking-wide">
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
