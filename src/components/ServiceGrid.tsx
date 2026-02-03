export default function ServiceGrid() {
  const services = [
    {
      title: "Expert Painting",
      subtitle: "Climate-Controlled Perfection",
      description: "State-of-the-art climate-controlled paint booth ensures flawless color matching and finish quality. Factory-grade results on every vehicle.",
      image: "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&w=800&q=80",
      features: ["Computerized Color Matching", "Dustless Environment", "OEM Paint Standards"],
    },
    {
      title: "Precision Bodywork",
      subtitle: "Structural Integrity Restored",
      description: "Advanced frame straightening and structural repair using industry-leading equipment. We restore your vehicle to pre-collision specifications.",
      image: "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=800&q=80",
      features: ["Frame Straightening", "Unibody Repair", "Structural Welding"],
    },
    {
      title: "New & Used Parts",
      subtitle: "OEM Component Access",
      description: "Direct access to genuine OEM parts and quality certified pre-owned components. We source the right parts for every repair, every time.",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80",
      features: ["OEM Parts Network", "Certified Pre-Owned", "Warranty Coverage"],
    },
  ];

  return (
    <section id="services" className="py-20 lg:py-32 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#E74C3C] text-sm font-semibold uppercase tracking-widest mb-4">
            Our Expertise
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-white mb-4">
            Premium Collision Services
          </h2>
          <p className="text-[#bdc3c7] text-lg max-w-2xl mx-auto">
            Comprehensive automotive restoration services delivered with 40+ years of expertise and strict adherence to OEM safety protocols.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg border border-[#34495e]/50 bg-[#2d2d2d] hover:border-[#2C3E50] transition-all"
            >
              {/* Image */}
              <div className="relative h-48 lg:h-56 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/50 to-transparent"></div>

                {/* Service Badge */}
                <div className="absolute top-4 left-4">
                  <div className="bg-[#2C3E50]/90 backdrop-blur-sm border border-[#34495e] rounded px-3 py-1">
                    <span className="font-display text-xs font-semibold text-white uppercase tracking-wider">
                      {service.subtitle}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl lg:text-2xl font-bold uppercase text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-[#bdc3c7] mb-5 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-[#bdc3c7]">
                      <svg className="h-4 w-4 text-[#E74C3C] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-[#E74C3C] hover:text-white font-semibold text-sm uppercase tracking-wide transition-colors group/link"
                >
                  Request Service
                  <svg
                    className="h-4 w-4 transition-transform group-hover/link:translate-x-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Services Banner */}
        <div className="mt-12 bg-[#2C3E50] rounded-lg p-6 lg:p-8 border border-[#34495e]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#E74C3C]/20 border border-[#E74C3C]/30 flex items-center justify-center flex-shrink-0">
                <svg className="h-7 w-7 text-[#E74C3C]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white uppercase tracking-wide">
                  Insurance Claims Assistance
                </h3>
                <p className="text-[#bdc3c7]">
                  We work directly with all major insurance providers to streamline your claims process.
                </p>
              </div>
            </div>
            <a
              href="tel:6017872000"
              className="w-full lg:w-auto flex items-center justify-center gap-2 bg-[#E74C3C] hover:bg-[#c0392b] text-white px-6 py-3 rounded font-display font-semibold uppercase tracking-wide transition-all hover:scale-105 whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Call for Claims Help
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
