import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaGithub, 
  FaTwitter, 
  FaLinkedin, 
  FaEnvelope, 
  FaHeart,
  FaCrown,
  FaFileAlt,
  FaDollarSign,
  FaQuestionCircle,
  FaShieldAlt,
  FaGavel
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';

const Footer = ({ variant = "default" }) => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  // Footer links configuration
  const footerSections = {
    company: {
      title: "AI Resume Builder",
      links: [
        { label: "Dashboard", href: "/dashboard", icon: FaFileAlt, internal: true },
        { label: "Pricing", href: "/pricing", icon: FaDollarSign, internal: true },
        { label: "Support", href: "mailto:mehdibenlekhale@gmail.com", icon: FaQuestionCircle, internal: false }
      ]
    },
    legal: {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#", icon: FaShieldAlt, internal: true },
        { label: "Terms of Service", href: "#", icon: FaGavel, internal: true }
      ]
    },
    social: {
      title: "Connect",
      links: [
        { label: "GitHub", href: "https://github.com/basic-kali-box/resume-builder", icon: FaGithub, internal: false },
        { label: "Twitter", href: "#", icon: FaTwitter, internal: false },
        { label: "LinkedIn", href: "#", icon: FaLinkedin, internal: false }
      ]
    }
  };

  const handleInternalLink = (href) => {
    navigate(href);
  };

  const handleExternalLink = (href) => {
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  // Compact footer for specific pages
  if (variant === "compact") {
    return (
      <footer className="bg-white border-t border-gray-200 py-3">
        <div className="mobile-container">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Made By Mehdi Benlekhal</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleExternalLink("https://github.com/basic-kali-box/resume-builder")}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="View on GitHub"
              >
                <FaGithub className="h-4 w-4" />
              </button>
              <span className="text-xs text-gray-400">© {currentYear} AI Resume Builder</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
      <div className="mobile-container py-6 lg:py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Resume Builder
              </h3>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                Create professional, ATS-friendly resumes with the power of AI. 
                Stand out from the crowd and land your dream job.
              </p>
            </div>
            
            {/* Premium CTA */}
            <div className="mb-6">
              <Button
                onClick={() => handleInternalLink('/pricing')}
                variant="gradient"
                size="sm"
                className="btn-touch interactive-button"
              >
                <FaCrown className="mr-2 h-3 w-3" />
                Upgrade to Premium
              </Button>
            </div>

            {/* Contact Info */}
            <div className="space-y-1">
              <h4 className="font-semibold text-gray-800 text-sm">Contact</h4>
              <a
                href="mailto:mehdibenlekhale@gmail.com"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <FaEnvelope className="h-3 w-3" />
                mehdibenlekhale@gmail.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {footerSections.company.links.map((link, index) => {
                const Icon = link.icon;
                return (
                  <li key={index}>
                    <button
                      onClick={() => link.internal ? handleInternalLink(link.href) : handleExternalLink(link.href)}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 btn-touch"
                    >
                      <Icon className="h-3 w-3" />
                      {link.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Legal & Social</h4>
            <ul className="space-y-2 mb-4">
              {footerSections.legal.links.map((link, index) => {
                const Icon = link.icon;
                return (
                  <li key={index}>
                    <button
                      onClick={() => link.internal ? handleInternalLink(link.href) : handleExternalLink(link.href)}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 btn-touch"
                    >
                      <Icon className="h-3 w-3" />
                      {link.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Social Media Icons */}
            <div>
              <h5 className="font-medium text-gray-700 mb-2 text-sm">Follow Us</h5>
              <div className="flex gap-2">
                {footerSections.social.links.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleExternalLink(social.href)}
                      className="w-8 h-8 bg-white rounded-full shadow-sm border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all duration-200 interactive-button"
                      aria-label={social.label}
                    >
                      <Icon className="h-3 w-3" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            {/* Made by */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Made By Mehdi Benlekhal</span>
            </div>

            {/* GitHub Link */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleExternalLink("https://github.com/basic-kali-box/resume-builder")}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 btn-touch"
              >
                <FaGithub className="h-4 w-4" />
                <span className="hidden sm:inline">View on GitHub</span>
              </button>

              {/* Copyright */}
              <span className="text-sm text-gray-500">
                © {currentYear} AI Resume Builder. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
