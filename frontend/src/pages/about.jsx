import React from "react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[11px] font-body font-semibold tracking-[0.3em] uppercase text-brand-muted mb-3">
            Our Story
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-medium text-brand-black mb-6">
            About SROW
          </h1>
          <p className="font-body text-base text-brand-muted leading-relaxed max-w-xl mx-auto">
            Born from a passion for quality fashion, SROW brings curated style directly to you —
            no middlemen, no compromises.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12 font-body text-base text-brand-text leading-relaxed">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-brand-black mb-4">How It Started</h2>
            <p className="text-brand-muted">
              SROW began as a small social media clothing business, helping customers find quality
              pieces through Instagram and WhatsApp. As demand grew, we built this online store to
              provide a better shopping experience — with proper product browsing, secure checkout,
              and real-time order tracking.
            </p>
          </div>

          <div className="h-px bg-brand-border" />

          <div>
            <h2 className="font-heading text-2xl font-semibold text-brand-black mb-4">What We Offer</h2>
            <p className="text-brand-muted">
              Every item in our collection is handpicked for quality, comfort, and style. We work
              directly with trusted suppliers to bring you premium clothing at fair prices, with
              express shipping and dedicated customer support.
            </p>
          </div>

          <div className="h-px bg-brand-border" />

          <div>
            <h2 className="font-heading text-2xl font-semibold text-brand-black mb-4">Our Promise</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
              {[
                { title: "Quality First", desc: "Every piece meets our high standards before it reaches you." },
                { title: "Fast Delivery", desc: "Swift and reliable shipping to your doorstep." },
                { title: "Always Here", desc: "24/7 support for any questions or concerns." },
              ].map((item, i) => (
                <div key={i} className="text-center p-6 bg-brand-surface">
                  <h3 className="font-heading text-lg font-semibold text-brand-text mb-2">{item.title}</h3>
                  <p className="font-body text-sm text-brand-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;