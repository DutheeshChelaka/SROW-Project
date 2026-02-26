import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

const Footer = () => {
  return (
    <footer className="bg-brand-black text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-heading text-2xl font-semibold mb-4 tracking-wide">SROW</h3>
            <p className="text-neutral-400 text-sm leading-relaxed font-body">
              Luxury, style, and comfort — all in one place. Curated fashion for the modern individual.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-xs font-body font-semibold tracking-[0.2em] uppercase mb-5 text-neutral-300">
              Shop
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", to: "/home" },
                { label: "New Arrivals", to: "/home" },
                { label: "Collections", to: "/home" },
                { label: "About Us", to: "/about" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-neutral-400 text-sm font-body hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="text-xs font-body font-semibold tracking-[0.2em] uppercase mb-5 text-neutral-300">
              Help
            </h4>
            <ul className="space-y-3">
              {[
                { label: "My Account", to: "/profile" },
                { label: "Order History", to: "/orderHistory" },
                { label: "Shopping Cart", to: "/cart" },
                { label: "Contact Us", to: "/about" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-neutral-400 text-sm font-body hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-body font-semibold tracking-[0.2em] uppercase mb-5 text-neutral-300">
              Stay Updated
            </h4>
            <p className="text-neutral-400 text-sm mb-4 font-body">
              Subscribe for new arrivals and exclusive offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent border border-neutral-700 px-4 py-2.5 text-sm text-white 
                           placeholder-neutral-500 focus:outline-none focus:border-neutral-400 font-body"
              />
              <button className="bg-white text-black px-5 py-2.5 text-xs font-semibold tracking-wider uppercase 
                                 hover:bg-neutral-200 transition-colors font-body">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-neutral-500 text-xs font-body">
            © {new Date().getFullYear()} SROW. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <span
                key={item}
                className="text-neutral-500 text-xs font-body hover:text-neutral-300 transition-colors cursor-pointer"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 pt-[120px] lg:pt-[140px]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;