export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80"
          alt="Luxury vehicle restoration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/80 via-[#1a1a1a]/70 to-[#1a1a1a]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Recovery Protocol Badge */}
        <div className="inline-flex items-center gap-2 bg-[#2C3E50]/80 border border-[#34495e] rounded-full px-4 py-2 mb-8">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E74C3C] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E74C3C]"></span>
          </span>
          <span className="text-sm font-semibold text-[#bdc3c7] uppercase tracking-wider">
            Recovery Protocol Active
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white mb-6 leading-tight">
          Heidelberg&apos;s Standard for
          <br />
          <span className="text-[#E74C3C]">Collision Excellence</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-[#bdc3c7] max-w-3xl mx-auto mb-8 leading-relaxed">
          40+ years of precision collision repair and restoration. Strict OEM safety protocols.
          Jasper County&apos;s highest standards for perfection in every detail.
        </p>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mb-12">
          <div className="text-center">
            <p className="font-display text-3xl sm:text-4xl font-bold text-white">40+</p>
            <p className="text-sm text-[#bdc3c7] uppercase tracking-wide">Years of Excellence</p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl sm:text-4xl font-bold text-white">10K+</p>
            <p className="text-sm text-[#bdc3c7] uppercase tracking-wide">Restorations</p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl sm:text-4xl font-bold text-white">100%</p>
            <p className="text-sm text-[#bdc3c7] uppercase tracking-wide">OEM Standards</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E74C3C] hover:bg-[#c0392b] text-white px-8 py-4 rounded font-display font-semibold uppercase tracking-wide transition-all hover:scale-105 shadow-lg shadow-[#E74C3C]/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
            Request Precision Estimate
          </a>
          <a
            href="tel:6017872000"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2C3E50] hover:bg-[#34495e] text-white px-8 py-4 rounded font-display font-semibold uppercase tracking-wide transition-all border border-[#34495e]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            Immediate Dispatch
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#bdc3c7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
