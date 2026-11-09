import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, ArrowRight, Menu, X, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';

interface NavItem {
  label: string;
  id: string;
}

const navItems: NavItem[] = [
  { label: 'Problem', id: 'problem' },
  { label: 'Who It Helps', id: 'who-it-helps' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Evidence', id: 'evidence' },
  { label: 'Role-Based', id: 'roles' },
  { label: 'Features', id: 'features' },
  { label: 'Security', id: 'security' },
  { label: 'FAQ', id: 'faq' },
];

export const PublicNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 35) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Scroll spy for sections
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPos = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const topOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {/* Morphing Navbar Container */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled
            ? 'py-2.5 px-3 sm:px-6'
            : 'py-4 sm:py-5 px-4 sm:px-8'
        }`}
      >
        <div
          className={`mx-auto transition-all duration-300 ease-in-out flex items-center justify-between ${
            isScrolled
              ? 'max-w-6xl bg-white/95 backdrop-blur-md border border-[#E5EAE6] rounded-full px-4 sm:px-6 py-2 shadow-resting'
              : 'max-w-7xl bg-transparent px-2 sm:px-4'
          }`}
        >
          {/* Brand: Purple Accent Logo on Crisp White Pill */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#142640] flex items-center justify-center text-white shadow-subtle group-hover:bg-[#0E1C30] transition-colors relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#6366F1]/30 to-[#A855F7]/30 opacity-70" />
              <Layers className="w-5 h-5 text-white relative z-10" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-base tracking-tight text-[#142640]">
                  KNOWFLOW
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-[#218653] bg-[#EBF7F0] px-1.5 py-0.2 rounded-full border border-[#C3E7D3]">
                  NOVYX
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleScrollTo(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                  activeSection === item.id
                    ? 'text-[#218653] bg-[#EBF7F0]'
                    : 'text-[#687570] hover:text-[#142640] hover:bg-slate-100/70'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <Link
              to="/login"
              className="text-xs font-semibold text-[#142640] hover:text-[#218653] px-3.5 py-2 rounded-full hover:bg-slate-100 transition-colors"
              title="Joining a team? Sign in"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="text-[11px] font-semibold text-[#687570] hover:text-[#218653] hidden xl:inline-block"
            >
              Joining a team? Sign in
            </Link>
            <Link
              to="/app/overview"
              className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-[#218653] bg-[#EBF7F0] hover:bg-[#D9ECE1] px-3.5 py-2 rounded-full border border-[#C3E7D3] transition-colors"
            >
              <span>Demo Workspace</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              onClick={() => navigate('/signup')}
              className="bg-[#218653] hover:bg-[#1B6E44] text-white text-xs font-bold px-4 py-2 rounded-full shadow-pill transition-all duration-150 flex items-center gap-1.5 active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => navigate('/signup')}
              className="sm:hidden bg-[#218653] text-white text-[11px] font-bold px-3 py-1.5 rounded-full"
            >
              Start
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#142640] hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sliding Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#142640]/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white p-6 shadow-modal flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5EAE6]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#142640] flex items-center justify-center text-white">
                    <Layers className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-heading font-extrabold text-base text-[#142640]">
                    KNOWFLOW
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#687570] hover:text-[#142640]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleScrollTo(item.id)}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-[#142640] hover:bg-[#EBF7F0] hover:text-[#218653] transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-[#E5EAE6]">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 text-center block rounded-xl text-sm font-bold text-[#142640] border border-[#E5EAE6] hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 text-center block rounded-xl text-sm font-bold bg-[#218653] text-white shadow-pill"
              >
                Get Started
              </Link>
              <Link
                to="/app/overview"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 text-center block text-xs font-semibold text-[#218653] hover:underline"
              >
                Launch Demo Workspace &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
