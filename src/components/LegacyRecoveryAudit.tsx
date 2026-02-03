export default function LegacyRecoveryAudit() {
  const legacyDefects = [
    {
      id: "01",
      title: "Inactive Booking Infrastructure",
      description: "Legacy booking system was non-functional, preventing customers from scheduling appointments online.",
      status: "FIXED",
      solution: "24/7 Digital Dispatch system now active",
    },
    {
      id: "02",
      title: "Static Heritage Data",
      description: "Company history and credentials were not prominently displayed, reducing trust signals.",
      status: "FIXED",
      solution: "Dynamic heritage showcase implemented",
    },
    {
      id: "03",
      title: "No Mobile Optimization",
      description: "Previous site was not responsive, creating poor user experience on mobile devices.",
      status: "FIXED",
      solution: "Fully responsive design deployed",
    },
    {
      id: "04",
      title: "Missing Lead Capture",
      description: "No mechanism for 24/7 lead capture, losing potential customers after hours.",
      status: "FIXED",
      solution: "Precision estimate form active",
    },
  ];

  return (
    <section id="recovery" className="py-20 lg:py-32 bg-[#2d2d2d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#E74C3C]/10 border border-[#E74C3C]/30 rounded-full px-4 py-2 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">
              All Systems Operational
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-white mb-4">
            Legacy Recovery: Performance Audit
          </h2>
          <p className="text-[#bdc3c7] text-lg max-w-2xl mx-auto">
            Our digital infrastructure has been completely rebuilt. Every legacy defect has been identified and resolved.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
          {legacyDefects.map((defect) => (
            <div
              key={defect.id}
              className="group bg-[#1a1a1a] rounded-lg border border-[#34495e]/50 overflow-hidden hover:border-[#2C3E50] transition-all"
            >
              {/* Defect Header */}
              <div className="flex items-start justify-between p-6 border-b border-[#34495e]/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-[#2C3E50] flex items-center justify-center">
                    <span className="font-display text-lg font-bold text-[#bdc3c7]">#{defect.id}</span>
                  </div>
                  <div>
                    <p className="text-xs text-[#bdc3c7] uppercase tracking-wider mb-1">Legacy Defect</p>
                    <h3 className="font-display text-lg font-semibold text-white uppercase tracking-wide">
                      {defect.title}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded px-3 py-1">
                  <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-display text-sm font-bold text-green-400 uppercase">{defect.status}</span>
                </div>
              </div>

              {/* Defect Content */}
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-[#bdc3c7]/70 uppercase tracking-wider mb-2">Issue Identified</p>
                  <p className="text-[#bdc3c7]">{defect.description}</p>
                </div>
                <div className="flex items-start gap-3 bg-[#2C3E50]/30 rounded p-4">
                  <svg className="h-5 w-5 text-[#E74C3C] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm text-[#E74C3C] uppercase tracking-wider font-semibold mb-1">Resolution</p>
                    <p className="text-white font-medium">{defect.solution}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Bar */}
        <div className="mt-8 bg-[#1a1a1a] rounded-lg border border-[#34495e]/50 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <svg className="h-7 w-7 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-display text-xl font-bold text-white uppercase tracking-wide">
                  Recovery Complete
                </p>
                <p className="text-[#bdc3c7]">All 4 legacy defects have been resolved. Digital Storefront is fully operational.</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-green-400">4/4</p>
                <p className="text-xs text-[#bdc3c7] uppercase tracking-wide">Issues Fixed</p>
              </div>
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-green-400">100%</p>
                <p className="text-xs text-[#bdc3c7] uppercase tracking-wide">Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
