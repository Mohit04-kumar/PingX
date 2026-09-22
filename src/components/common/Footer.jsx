import React from 'react';
import { CREATOR_CONFIG } from '../../config/creator.config';
import { Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon, YoutubeIcon } from './SocialIcons';

export function Footer({ onEnterApp }) {
  const links = [
    { label: 'Workspace', onClick: onEnterApp },
    { label: 'Direct Messages', onClick: onEnterApp },
    { label: 'AI Assistant', onClick: onEnterApp },
    { label: 'Smart Shop', onClick: onEnterApp },
  ];

  const socialIcons = [
    { Icon: GithubIcon,   href: CREATOR_CONFIG.githubUrl },
    { Icon: LinkedinIcon, href: CREATOR_CONFIG.linkedinUrl },
    { Icon: InstagramIcon,href: CREATOR_CONFIG.instagramUrl },
    { Icon: YoutubeIcon,  href: CREATOR_CONFIG.youtubeUrl },
    { Icon: Mail,         href: `mailto:${CREATOR_CONFIG.email}` },
  ].filter((s) => s.href);

  return (
    <footer
      id="footer"
      className="border-t pt-14 pb-10"
      style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b" style={{ borderColor: 'var(--border)' }}>

          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-2xl font-black font-heading cursor-pointer" style={{ color: 'var(--text-primary)' }}>
              PING<span style={{ color: 'var(--accent)' }}>X</span>
            </button>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Connect, chat, discover deals, and control your AI workflow.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>Product</h4>
            <ul className="space-y-2.5 text-sm font-semibold">
              {links.map((l) => (
                <li key={l.label}>
                  <button onClick={l.onClick} className="cursor-pointer transition-opacity hover:opacity-60" style={{ color: 'var(--text-secondary)' }}>
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Creators */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>Created By</h4>
            <ul className="space-y-2 text-sm">
              <li className="font-bold" style={{ color: 'var(--text-primary)' }}>{CREATOR_CONFIG.name}</li>
              <li className="text-xs" style={{ color: 'var(--text-secondary)' }}>{CREATOR_CONFIG.projectTitle}</li>
              <li className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{CREATOR_CONFIG.collegeName} ({CREATOR_CONFIG.year})</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>Connect</h4>
            <div className="flex flex-wrap gap-3">
              {socialIcons.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center border transition-all hover:scale-110"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div className="py-6 text-center select-none">
          <span className="text-7xl sm:text-9xl font-black" style={{ color: 'var(--border)' }}>PINGX</span>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs gap-4 font-semibold" style={{ color: 'var(--text-muted)' }}>
          <p>© {new Date().getFullYear()} PingX Inc. Built by {CREATOR_CONFIG.name}.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'System Status'].map((l) => (
              <span key={l} className="cursor-pointer hover:opacity-60">{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
