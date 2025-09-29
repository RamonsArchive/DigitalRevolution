import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FOOTER_LINKS, FOOTER_CONTACT, QUICK_LINKS } from "@/constants";
import {
  Facebook,
  Instagram,
  Linkedin,
  Music,
  Mail,
  Phone,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="w-5 h-5" />;
      case "instagram":
        return <Instagram className="w-5 h-5" />;
      case "linkedin":
        return <Linkedin className="w-5 h-5" />;
      case "tiktok":
        return <Music className="w-5 h-5" />;
      default:
        return <ExternalLink className="w-5 h-5" />;
    }
  };

  return (
    <>
      <footer className="bg-gradient-to-b from-bg-primary via-slate-900 to-bg-primary">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🌐</span>
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-primary-200 to-secondary-200 bg-clip-text text-transparent">
                      Digital Revolution
                    </h3>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Bridging the digital divide through technology education and
                    community empowerment.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6 pl-2 md:pl-0">
              <div>
                <h4 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-primary-400" />
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  {QUICK_LINKS.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        href={link.href}
                        className="text-slate-300 hover:text-primary-200 transition-colors duration-200 text-base flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full group-hover:bg-primary-400 transition-colors"></span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6 pl-2 md:pl-0">
              <div>
                <h4 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary-400" />
                  Contact Us
                </h4>
                <div className="space-y-3">
                  {FOOTER_CONTACT.map((contact, idx) => (
                    <div key={idx} className="space-y-2">
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-slate-300 hover:text-primary-200 transition-colors duration-200 text-sm flex items-center gap-2 group"
                      >
                        <Mail className="w-4 h-4 text-slate-400 group-hover:text-primary-400 transition-colors" />
                        {contact.email}
                      </a>
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-slate-300 hover:text-primary-200 transition-colors duration-200 text-sm flex items-center gap-2 group"
                      >
                        <Phone className="w-4 h-4 text-slate-400 group-hover:text-primary-400 transition-colors" />
                        {contact.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-6 pl-2 md:pl-0">
              <div>
                <h4 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <span className="text-primary-400">📱</span>
                  Follow Us
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {FOOTER_LINKS.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50 group-hover:border-primary-500/50 transition-all duration-300 group-hover:scale-105">
                        <div className="flex items-center gap-2">
                          <div className="text-primary-400 group-hover:text-primary-200 transition-colors">
                            {getSocialIcon(social.platform)}
                          </div>
                          <span className="text-slate-300 group-hover:text-slate-100 transition-colors text-xs font-medium">
                            {social.label}
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="mt-12 pt-8 border-t border-slate-700/50">
            <div className="text-center">
              <p className="text-slate-400 text-sm leading-relaxed max-w-4xl mx-auto">
                <span className="text-primary-200 font-semibold">
                  Our Mission:
                </span>{" "}
                Creating pathways from digital exclusion to STEM opportunities,
                ensuring technology serves democratic values and creates
                opportunities for all.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright */}
      <div className="bg-black border-t border-slate-700/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-xs sm:text-sm">
              &copy; {new Date().getFullYear()} Digital Revolution. All rights
              reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>Made with ❤️ for digital equity</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
