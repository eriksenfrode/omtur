'use client'
import { useState } from 'react'

export default function Navbar() {
  const [menyApen, setMenyApen] = useState(false)

  return (
    <nav style={{borderBottom: '1px solid #f3f4f6', padding: '0 24px', position: 'relative'}}>
      <div style={{maxWidth: '896px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px'}}>
        {/* Logo */}
        <a href="/" style={{display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit'}}>
          <img src="/logo.svg" alt="OmTur logo" style={{height: '32px', width: 'auto'}} />
          <span style={{fontWeight: '500', fontSize: '18px'}}>OmTur</span>
        </a>

        {/* Desktop-meny */}
        <div className="navbar-desktop" style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <a href="/annonser" style={{fontSize: '14px', color: '#6b7280', textDecoration: 'none'}}>Annonser</a>
          <a href="/om-oss" style={{fontSize: '14px', color: '#6b7280', textDecoration: 'none'}}>Om oss</a>
          <a href="/logginn" style={{fontSize: '14px', backgroundColor: '#059669', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none'}}>Logg inn</a>
        </div>

        {/* Hamburger-knapp (mobil) */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenyApen(p => !p)}
          style={{background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'none'}}
          aria-label="Åpne meny"
        >
          {menyApen ? (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <line x1="4" y1="4" x2="18" y2="18" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
              <line x1="18" y1="4" x2="4" y2="18" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <line x1="3" y1="6" x2="19" y2="6" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="11" x2="19" y2="11" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="16" x2="19" y2="16" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobil-dropdown */}
      {menyApen && (
        <div className="navbar-mobile-menu" style={{position: 'absolute', top: '64px', left: 0, right: 0, backgroundColor: 'white', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
          <a href="/annonser" onClick={() => setMenyApen(false)} style={{fontSize: '15px', color: '#374151', textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid #f3f4f6'}}>Annonser</a>
          <a href="/om-oss" onClick={() => setMenyApen(false)} style={{fontSize: '15px', color: '#374151', textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid #f3f4f6'}}>Om oss</a>
          <a href="/logginn" onClick={() => setMenyApen(false)} style={{fontSize: '15px', backgroundColor: '#059669', color: 'white', padding: '12px 20px', borderRadius: '8px', textDecoration: 'none', textAlign: 'center', fontWeight: '500'}}>Logg inn</a>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .navbar-desktop { display: none !important; }
          .navbar-hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
