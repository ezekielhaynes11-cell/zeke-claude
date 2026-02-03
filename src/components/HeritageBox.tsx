export default function HeritageBox() {
  return (
    <section id="heritage" className="py-20 lg:py-32 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#E74C3C] text-sm font-semibold uppercase tracking-widest mb-4">
            The Founder&apos;s Commitment
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-white">
            A Legacy of Perfection
          </h2>
        </div>

        {/* Heritage Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Quote Box */}
          <div className="relative">
            <div className="bg-[#2C3E50] rounded-lg p-8 lg:p-12 border border-[#34495e]">
              {/* Quote Mark */}
              <svg
                className="absolute top-6 left-6 h-12 w-12 text-[#E74C3C]/30"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>

              <blockquote className="relative z-10">
                <p className="text-xl lg:text-2xl text-white leading-relaxed italic mb-8">
                  &ldquo;Every vehicle that leaves our shop carries our family name. That&apos;s why we accept nothing less than perfection in every detail. From the first weld to the final polish, we treat your car as if it were our own.&rdquo;
                </p>
                <footer className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#34495e] flex items-center justify-center">
                    <span className="font-display text-2xl font-bold text-white">DF</span>
                  </div>
                  <div>
                    <cite className="not-italic font-display text-lg font-semibold text-white block">
                      Desmond Forthner Sr.
                    </cite>
                    <span className="text-[#bdc3c7] text-sm">
                      Founder, 1984
                    </span>
                  </div>
                </footer>
              </blockquote>
            </div>

            {/* Decorative Element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#E74C3C]/10 rounded-lg -z-10"></div>
          </div>

          {/* Stats and Info */}
          <div className="space-y-6">
            {/* Heritage Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#2d2d2d] rounded-lg p-6 border border-[#34495e]/50">
                <p className="font-display text-4xl font-bold text-[#E74C3C] mb-2">1984</p>
                <p className="text-[#bdc3c7] text-sm uppercase tracking-wide">Year Established</p>
              </div>
              <div className="bg-[#2d2d2d] rounded-lg p-6 border border-[#34495e]/50">
                <p className="font-display text-4xl font-bold text-[#E74C3C] mb-2">10K+</p>
                <p className="text-[#bdc3c7] text-sm uppercase tracking-wide">Vehicles Restored</p>
              </div>
              <div className="bg-[#2d2d2d] rounded-lg p-6 border border-[#34495e]/50">
                <p className="font-display text-4xl font-bold text-[#E74C3C] mb-2">3</p>
                <p className="text-[#bdc3c7] text-sm uppercase tracking-wide">Generations</p>
              </div>
              <div className="bg-[#2d2d2d] rounded-lg p-6 border border-[#34495e]/50">
                <p className="font-display text-4xl font-bold text-[#E74C3C] mb-2">100%</p>
                <p className="text-[#bdc3c7] text-sm uppercase tracking-wide">Family Owned</p>
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-[#2d2d2d] rounded-lg p-6 border border-[#34495e]/50">
              <h3 className="font-display text-lg font-semibold text-white uppercase tracking-wide mb-4">
                Certifications & Standards
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-[#bdc3c7]">
                  <svg className="h-5 w-5 text-[#E74C3C] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Strict OEM Safety Protocols
                </li>
                <li className="flex items-center gap-3 text-[#bdc3c7]">
                  <svg className="h-5 w-5 text-[#E74C3C] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  I-CAR Gold Class Recognition
                </li>
                <li className="flex items-center gap-3 text-[#bdc3c7]">
                  <svg className="h-5 w-5 text-[#E74C3C] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  ASE Certified Technicians
                </li>
                <li className="flex items-center gap-3 text-[#bdc3c7]">
                  <svg className="h-5 w-5 text-[#E74C3C] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Jasper County&apos;s Highest Standards
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
