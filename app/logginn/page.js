'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function LoggInn() {
  const [epost, setEpost] = useState('')
  const [passord, setPassord] = useState('')
  const [feil, setFeil] = useState(null)
  const [laster, setLaster] = useState(false)

  async function loggInn() {
    setLaster(true)
    setFeil(null)
    const { error } = await supabase.auth.signInWithPassword({
      email: epost,
      password: passord
    })
    if (error) {
      setFeil('Feil e-post eller passord')
      setLaster(false)
    } else {
      window.location.href = '/lag-annonse'
    }
  }

  return (
    <main style={{maxWidth: '400px', margin: '120px auto', padding: '0 24px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px'}}>
        <div style={{width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981'}}></div>
        <span style={{fontWeight: '500', fontSize: '18px'}}>OmTur</span>
      </div>
      <h1 style={{fontSize: '24px', fontWeight: '500', marginBottom: '8px'}}>Logg inn</h1>
      <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '32px'}}>Kun for godkjente selgere.</p>

      <div style={{marginBottom: '16px'}}>
        <label style={{fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px'}}>E-post</label>
        <input
          type="email"
          value={epost}
          onChange={e => setEpost(e.target.value)}
          style={{width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box'}}
          placeholder="din@epost.no"
        />
      </div>

      <div style={{marginBottom: '24px'}}>
        <label style={{fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '4px'}}>Passord</label>
        <input
          type="password"
          value={passord}
          onChange={e => setPassord(e.target.value)}
          style={{width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box'}}
          placeholder="••••••••"
        />
      </div>

      {feil && <p style={{color: '#ef4444', fontSize: '14px', marginBottom: '16px'}}>{feil}</p>}

      <button
        onClick={loggInn}
        disabled={laster}
        style={{width: '100%', backgroundColor: '#059669', color: 'white', padding: '12px', borderRadius: '10px', fontWeight: '500', fontSize: '15px', border: 'none', cursor: 'pointer', opacity: laster ? 0.5 : 1}}
      >
        {laster ? 'Logger inn...' : 'Logg inn'}
      </button>

      <div style={{textAlign: 'center', marginTop: '24px'}}>
        <p style={{fontSize: '13px', color: '#9ca3af', marginBottom: '8px'}}>
          <a href="/annonser" style={{color: '#059669', textDecoration: 'none'}}>Se annonser uten innlogging</a>
        </p>
        <p style={{fontSize: '13px', color: '#9ca3af'}}>
          Ønsker du å teste tjenesten? Ta kontakt på <a href="mailto:hei@omtur.no" style={{color: '#059669', textDecoration: 'none'}}>hei@omtur.no</a>
        </p>
      </div>
    </main>
  )
}