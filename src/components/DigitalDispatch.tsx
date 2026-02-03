"use client";

import { useState } from "react";

export default function DigitalDispatch() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle: "",
    description: "",
    urgency: "standard",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to a backend/API
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-20 lg:py-32 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Info */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#2C3E50]/50 border border-[#34495e] rounded-full px-4 py-2 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E74C3C] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E74C3C]"></span>
              </span>
              <span className="text-xs font-semibold text-[#bdc3c7] uppercase tracking-wider">
                24/7 Digital Dispatch Active
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-white mb-6">
              Request a Precision Estimate
            </h2>

            <p className="text-[#bdc3c7] text-lg mb-8 leading-relaxed">
              Submit your vehicle details for a comprehensive estimate. Our team monitors submissions around the clock and will respond within 24 hours with a detailed assessment.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-[#2C3E50] flex items-center justify-center flex-shrink-0">
                  <svg className="h-5 w-5 text-[#E74C3C]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">24-Hour Response Guarantee</p>
                  <p className="text-sm text-[#bdc3c7]">Every submission reviewed by a certified technician</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-[#2C3E50] flex items-center justify-center flex-shrink-0">
                  <svg className="h-5 w-5 text-[#E74C3C]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">Free, No-Obligation Quote</p>
                  <p className="text-sm text-[#bdc3c7]">Detailed breakdown with OEM parts pricing</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-[#2C3E50] flex items-center justify-center flex-shrink-0">
                  <svg className="h-5 w-5 text-[#E74C3C]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">Prefer to Call?</p>
                  <p className="text-sm text-[#bdc3c7]">
                    Reach us directly at{" "}
                    <a href="tel:6017872000" className="text-[#E74C3C] hover:underline">
                      (601) 787-2000
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <div className="bg-[#2d2d2d] rounded-lg border border-[#34495e]/50 p-6 lg:p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                    <svg className="h-8 w-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white uppercase mb-4">
                    Dispatch Received
                  </h3>
                  <p className="text-[#bdc3c7] mb-6">
                    Your request has been logged. A certified technician will review your submission and contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-[#E74C3C] hover:underline text-sm"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-[#bdc3c7] uppercase tracking-wide mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#34495e] rounded text-white placeholder-[#bdc3c7]/50 focus:outline-none focus:border-[#E74C3C] transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-[#bdc3c7] uppercase tracking-wide mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#34495e] rounded text-white placeholder-[#bdc3c7]/50 focus:outline-none focus:border-[#E74C3C] transition-colors"
                        placeholder="(601) 555-0123"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#bdc3c7] uppercase tracking-wide mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#34495e] rounded text-white placeholder-[#bdc3c7]/50 focus:outline-none focus:border-[#E74C3C] transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="vehicle" className="block text-sm font-semibold text-[#bdc3c7] uppercase tracking-wide mb-2">
                      Vehicle (Year, Make, Model) *
                    </label>
                    <input
                      type="text"
                      id="vehicle"
                      name="vehicle"
                      required
                      value={formData.vehicle}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#34495e] rounded text-white placeholder-[#bdc3c7]/50 focus:outline-none focus:border-[#E74C3C] transition-colors"
                      placeholder="2022 Toyota Camry"
                    />
                  </div>

                  <div>
                    <label htmlFor="urgency" className="block text-sm font-semibold text-[#bdc3c7] uppercase tracking-wide mb-2">
                      Urgency Level
                    </label>
                    <select
                      id="urgency"
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#34495e] rounded text-white focus:outline-none focus:border-[#E74C3C] transition-colors"
                    >
                      <option value="standard">Standard - Schedule at convenience</option>
                      <option value="priority">Priority - Within the week</option>
                      <option value="urgent">Urgent - Immediate assistance needed</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-[#bdc3c7] uppercase tracking-wide mb-2">
                      Describe the Damage *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#34495e] rounded text-white placeholder-[#bdc3c7]/50 focus:outline-none focus:border-[#E74C3C] transition-colors resize-none"
                      placeholder="Please describe the collision damage, affected areas, and any other relevant details..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#E74C3C] hover:bg-[#c0392b] text-white px-6 py-4 rounded font-display font-semibold uppercase tracking-wide transition-all hover:scale-[1.02] shadow-lg shadow-[#E74C3C]/20 flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                    Submit Dispatch Request
                  </button>

                  <p className="text-xs text-[#bdc3c7]/70 text-center">
                    By submitting, you agree to be contacted regarding your estimate request.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
