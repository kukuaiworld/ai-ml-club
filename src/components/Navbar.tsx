import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  User, 
  LayoutDashboard, 
  LogOut,
  ChevronDown,
  Camera,
  Users,
  Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ClubLogo } from './ClubLogo';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tabId: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenSearch,
}) => {
  const { role, isAuthenticated, logout, switchDemoRole } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const moreRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside and Escape key handler for clean dropdown & mobile UX
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (moreRef.current && !moreRef.current.contains(target)) {
        setMoreDropdownOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(target)) {
        setRoleDropdownOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(target)) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMoreDropdownOpen(false);
        setRoleDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Primary navigation links shown directly in top bar
  const primaryNavLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'notices', label: 'Notices' },
    { id: 'activities', label: 'Events' },
    { id: 'workshops', label: 'Workshops' },
    { id: 'projects', label: 'Projects' },
    { id: 'resources', label: 'Resources' },
    { id: 'drives', label: 'Drive' },
  ];

  // Secondary links grouped inside a clean "More" dropdown
  const moreNavLinks = [
    { id: 'team', label: 'Team & Leadership', icon: <Users className="w-3.5 h-3.5" />, desc: '10 official officers & leads' },
    { id: 'gallery', label: 'Gallery', icon: <Camera className="w-3.5 h-3.5" />, desc: 'Hackathons & lab photos' },
    { id: 'lab', label: 'AI Virtual Lab', icon: <Cpu className="w-3.5 h-3.5" />, desc: 'Interactive neural simulation' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    setRoleDropdownOpen(false);
  };

  const isMoreActive = ['team', 'gallery', 'lab'].includes(currentTab);

  return (
    <nav
      className={`w-full transition-all duration-200 select-none ${
        isScrolled
          ? 'py-2 sm:py-2.5'
          : 'py-3 sm:py-3.5'
      }`}
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="cursor-pointer group hover:opacity-95 transition-transform duration-150 active:scale-95 flex items-center"
          title="AI/ML Club - Back to Home"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleNavClick('home'); }}
        >
          <ClubLogo size="sm" className="sm:hidden" />
          <ClubLogo size="md" className="hidden sm:flex" />
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden xl:flex items-center gap-1 bg-[#150c20]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-inner">
          {primaryNavLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                data-allow-visitor={link.id === 'notices' || link.id === 'home' ? 'true' : undefined}
                onClick={() => handleNavClick(link.id)}
                className={`relative px-3.5 py-1 text-xs font-medium rounded-full transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'text-white bg-purple-600/30 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc] inline-block ml-1 align-middle" />
                )}
              </button>
            );
          })}

          {/* "More" Dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 active:scale-95 ${
                isMoreActive
                  ? 'text-white bg-purple-600/30 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              aria-expanded={moreDropdownOpen}
              aria-haspopup="true"
            >
              <span>More</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180 text-purple-300' : ''}`} />
            </button>

            {moreDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-56 rounded-2xl glass-panel border border-white/15 shadow-2xl py-2 z-50 bg-[#160d24] animate-fade-in"
              >
                {moreNavLinks.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-3.5 py-2 hover:bg-white/5 active:bg-purple-600/20 transition-all duration-150 flex items-start gap-2.5 ${
                      currentTab === item.id ? 'text-purple-300 bg-purple-600/10' : 'text-slate-300'
                    }`}
                  >
                    <span className="p-1.5 rounded-lg bg-dark-surface border border-white/10 text-purple-400 shrink-0 mt-0.5">
                      {item.icon}
                    </span>
                    <div>
                      <div className="text-xs font-semibold">{item.label}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Contact Link */}
          <button
            onClick={() => handleNavClick('contact')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 active:scale-95 ${
              currentTab === 'contact'
                ? 'text-white bg-purple-600/30 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            Contact
          </button>
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-surface border border-white/10 hover:border-purple-400/40 text-slate-400 hover:text-white text-xs font-mono transition-all duration-150 active:scale-95 shadow-sm"
            title="Search Club Content (Cmd+K / Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline">Search</span>
            <kbd className="text-[10px] bg-dark-bg px-1.5 py-0.5 rounded text-slate-400 border border-white/10 font-mono">
              ⌘K
            </kbd>
          </button>



          {/* Auth / Member Dashboard / Admin Portal Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {role === 'Registered User' ? (
                <button
                  onClick={() => handleNavClick('join-us')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-medium text-xs transition-all duration-150 shadow-sm"
                  title="Apply for Membership"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Join Us</span>
                </button>
              ) : role === 'Member' ? (
                <button
                  onClick={() => handleNavClick('member-dashboard')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-medium text-xs transition-all duration-150 shadow-sm"
                  title="Open Member Workspace"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Member Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={() => handleNavClick('admin')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-medium text-xs transition-all duration-150 shadow-sm"
                  title="Open Admin Console"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </button>
              )}

              <button
                onClick={logout}
                className="p-1.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 active:scale-90 transition-all duration-150"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('login')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-white/15 bg-dark-surface hover:bg-white/10 active:scale-95 text-slate-200 font-medium text-xs transition-all duration-150"
              >
                <span>Login</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger & Search */}
        <div className="flex items-center gap-2 xl:hidden">
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-xl text-slate-400 hover:text-white active:scale-90 transition-all duration-150"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white active:scale-90 transition-all duration-150"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-purple-300" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div 
          ref={mobileRef}
          className="relative z-50 xl:hidden bg-[#150c20]/95 border-b border-white/10 px-4 py-6 backdrop-blur-2xl animate-fade-in max-h-[85vh] overflow-y-auto shadow-2xl"
        >
          {/* Group 1: Core Navigation */}
          <div className="mb-4">
            <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider mb-2 px-2">
              Main Pages
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About Club' },
                { id: 'notices', label: 'Notices' },
                { id: 'activities', label: 'Events' },
                { id: 'workshops', label: 'Workshops' },
                { id: 'projects', label: 'Projects' },
              ].map((link) => (
                <button
                  key={link.id}
                  data-allow-visitor={link.id === 'notices' || link.id === 'home' ? 'true' : undefined}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-medium active:scale-95 transition-all duration-150 ${
                    currentTab === link.id
                      ? 'bg-purple-600/25 text-purple-300 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Group 2: Community & Lab */}
          <div className="mb-4">
            <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider mb-2 px-2">
              Community & Exploration
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'team', label: 'Team Leadership' },
                { id: 'resources', label: 'Resources' },
                { id: 'gallery', label: 'Gallery' },
                { id: 'lab', label: 'AI Virtual Lab' },
                { id: 'contact', label: 'Contact Us' },
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-medium active:scale-95 transition-all duration-150 ${
                    currentTab === link.id
                      ? 'bg-purple-600/25 text-purple-300 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Role & Auth */}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            {isAuthenticated && (
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-2">
                <span>ACTIVE ROLE:</span>
                <strong className="text-purple-400">{role}</strong>
              </div>
            )}

            {isAuthenticated ? (
              <div className="flex gap-2">
                {role === 'Registered User' ? (
                  <button
                    onClick={() => handleNavClick('join-us')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 active:scale-95 text-white font-medium text-xs shadow-md transition-transform duration-150"
                  >
                    <User className="w-4 h-4" />
                    Join Us
                  </button>
                ) : role === 'Member' ? (
                  <button
                    onClick={() => handleNavClick('member-dashboard')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 active:scale-95 text-white font-medium text-xs shadow-md transition-transform duration-150"
                  >
                    <User className="w-4 h-4" />
                    Member Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 active:scale-95 text-white font-medium text-xs shadow-md transition-transform duration-150"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Portal
                  </button>
                )}
                <button
                  onClick={logout}
                  className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-xs font-medium active:scale-95 transition-transform duration-150"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/15 bg-dark-surface hover:bg-white/10 active:scale-95 text-slate-200 font-medium text-xs shadow-md transition-all duration-150"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
