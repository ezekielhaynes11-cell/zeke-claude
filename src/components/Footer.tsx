export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] border-t border-[#34495e]/30">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#2C3E50] rounded flex items-center justify-center">
                <span className="font-display text-2xl font-bold text-white">F</span>
              </div>
              <div>
                <p className="font-display text-lg font-bold uppercase tracking-wide text-white">
                  Forthner&apos;s
                </p>
                <p className="text-xs text-[#bdc3c7] uppercase tracking-widest">Body Shop</p>
              </div>
            </div>
            <p className="text-[#bdc3c7] text-sm leading-relaxed mb-6">
              Heidelberg&apos;s trusted name in precision collision repair for over 40 years. Family-owned, quality-driven.
            </p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs text-green-400 uppercase tracking-wider font-semibold">
                Digital Dispatch Active
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#services" className="text-[#bdc3c7] hover:text-white text-sm transition-colors">
                  Our Services
                </a>
              </li>
              <li>
                <a href="#heritage" className="text-[#bdc3c7] hover:text-white text-sm transition-colors">
                  Our Heritage
                </a>
              </li>
              <li>
                <a href="#recovery" className="text-[#bdc3c7] hover:text-white text-sm transition-colors">
                  Recovery Audit
                </a>
              </li>
              <li>
                <a href="#contact" className="text-[#bdc3c7] hover:text-white text-sm transition-colors">
                  Request Estimate
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#services" className="text-[#bdc3c7] hover:text-white text-sm transition-colors">
                  Expert Painting
                </a>
              </li>
              <li>
                <a href="#services" className="text-[#bdc3c7] hover:text-white text-sm transition-colors">
                  Precision Bodywork
                </a>
              </li>
              <li>
                <a href="#services" className="text-[#bdc3c7] hover:text-white text-sm transition-colors">
                  Frame Straightening
                </a>
              </li>
              <li>
                <a href="#services" className="text-[#bdc3c7] hover:text-white text-sm transition-colors">
                  OEM Parts
                </a>
              </li>
              <li>
                <a href="#services" className="text-[#bdc3c7] hover:text-white text-sm transition-colors">
                  Insurance Claims
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg className="h-5 w-5 text-[#E74C3C] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-[#bdc3c7]">
                  <p>Heidelberg, MS</p>
                  <p>Jasper County</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 text-[#E74C3C] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <a href="tel:6017872000" className="text-sm text-[#bdc3c7] hover:text-white transition-colors">
                  (601) 787-2000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 text-[#E74C3C] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-[#bdc3c7]">
                  <p>Mon-Fri: 8AM - 5PM</p>
                  <p>Sat: By Appointment</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#34495e]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#bdc3c7]">
              &copy; {currentYear} Forthner&apos;s Body Shop. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-[#bdc3c7]/60 uppercase tracking-wider">
                Serving Jasper County Since 1984
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
