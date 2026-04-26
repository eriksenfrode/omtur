'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Forside() {
  const [annonser, setAnnonser] = useState([])

  useEffect(() => {
    supabase
      .from('annonser')
      .select('*')
      .eq('status', 'aktiv')
      .order('opprettet', { ascending: false })
      .limit(4)
      .then(({ data }) => setAnnonser(data || []))
  }, [])

  return (
    <main>
      {/* Toppmeny */}
      <nav style={{borderBottom: '1px solid #f3f4f6', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '896px', margin: '0 auto'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <div style={{width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981'}}></div>
          <span style={{fontWeight: '500', fontSize: '18px'}}>OmTur</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <a href="/annonser" style={{fontSize: '14px', color: '#6b7280', textDecoration: 'none'}}>Se annonser</a>
          <a href="/logginn" style={{fontSize: '14px', backgroundColor: '#059669', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none'}}>Logg inn</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{maxWidth: '896px', margin: '0 auto', padding: '80px 24px', textAlign: 'center'}}>
        <div style={{display: 'inline-block', backgroundColor: '#ecfdf5', color: '#065f46', fontSize: '12px', fontWeight: '500', padding: '4px 12px', borderRadius: '20px', marginBottom: '20px'}}>
          Helgeland sin egen markedsplass for brukt utstyr
        </div>
        <h1 style={{fontSize: '38px', fontWeight: '500', marginBottom: '20px', lineHeight: '1.3'}}>
          Selg brukt sports- og friluftsutstyr.<br />
          <span style={{color: '#059669'}}>KI gjør jobben for deg.</span>
        </h1>
        <p style={{color: '#6b7280', fontSize: '18px', marginBottom: '40px', maxWidth: '560px', margin: '0 auto 40px', lineHeight: '1.7'}}>
          Last opp et bilde — OmTur analyserer utstyret, skriver annonsen og setter en rettferdig pris automatisk.
        </p>
        <div style={{display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap'}}>
          <a href="/annonser" style={{backgroundColor: '#059669', color: 'white', padding: '14px 40px', borderRadius: '12px', fontWeight: '500', fontSize: '15px', textDecoration: 'none'}}>
            Se annonser
          </a>
          <a href="/logginn" style={{backgroundColor: 'white', color: '#374151', padding: '14px 40px', borderRadius: '12px', fontWeight: '500', fontSize: '15px', textDecoration: 'none', border: '1px solid #e5e7eb'}}>
            Selg utstyr
          </a>
        </div>
      </section>

      {/* Slik fungerer det */}
      <section style={{backgroundColor: '#ecfdf5', paddingTop: '64px', paddingBottom: '80px'}}>
        <div style={{maxWidth: '896px', margin: '0 auto', padding: '0 24px'}}>
          <h2 style={{fontSize: '20px', fontWeight: '500', textAlign: 'center', marginBottom: '40px'}}>Slik fungerer det</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px'}}>
            {[
              { steg: '1', tittel: 'Ta et bilde', tekst: 'Last opp bilde av utstyret. 30 sekunder.' },
              { steg: '2', tittel: 'KI analyserer', tekst: 'Merke, stand og annonsetekst fylles ut automatisk. Prisforslag baseres på lignende utstyr fra nettbutikker og bruktmarkeder.' },,
              { steg: '3', tittel: 'Budrunden starter', tekst: 'Første bud starter 24-timers budrunde.' },
              { steg: '4', tittel: 'Avtal overlevering', tekst: 'Vinneren kontakter deg direkte.' }
            ].map(s => (
              <div key={s.steg} style={{backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'}}>
                <div style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#d1fae5', color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '500', marginBottom: '12px'}}>
                  {s.steg}
                </div>
                <h3 style={{fontWeight: '500', fontSize: '14px', marginBottom: '4px'}}>{s.tittel}</h3>
                <p style={{fontSize: '12px', color: '#6b7280', lineHeight: '1.5', margin: '0'}}>{s.tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hvorfor OmTur */}
      <section style={{backgroundColor: 'white', paddingTop: '80px', paddingBottom: '80px'}}>
        <div style={{maxWidth: '896px', margin: '0 auto', padding: '0 24px'}}>
          <h2 style={{fontSize: '20px', fontWeight: '500', textAlign: 'center', marginBottom: '40px'}}>Hvorfor OmTur?</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px'}}>
            {[
              { ikon: '🤖', tittel: 'KI gjør jobben', tekst: 'Ikke skriv en eneste setning. KI lager hele annonsen fra bildet.' },
              { ikon: '🌿', tittel: 'Bra for miljøet', tekst: 'Brukt utstyr som brukes igjen er det beste valget for planeten.' },
              { ikon: '📍', tittel: 'Lokalt på Helgeland', tekst: 'Kortere transport, raskere salg og folk du kan stole på.' },
              { ikon: '🔨', tittel: 'Rettferdig pris', tekst: 'Åpen budrunde — markedet bestemmer prisen.' },
              { ikon: '📧', tittel: 'Automatiske varsler', tekst: 'Budgivere varsles på e-post når de blir overbydd.' },
              { ikon: '🔒', tittel: 'Personvern', tekst: 'Budgiveres identitet er skjult. Kun vinneren deles med selger.' }
            ].map(k => (
              <div key={k.tittel} style={{padding: '20px', borderRadius: '12px', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6'}}>
                <div style={{fontSize: '22px', marginBottom: '10px'}}>{k.ikon}</div>
                <h3 style={{fontWeight: '500', fontSize: '14px', marginBottom: '4px'}}>{k.tittel}</h3>
                <p style={{fontSize: '12px', color: '#6b7280', lineHeight: '1.5', margin: '0'}}>{k.tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Aktive annonser */}
      {annonser.length > 0 && (
        <section style={{backgroundColor: '#f9fafb', paddingTop: '80px', paddingBottom: '80px'}}>
          <div style={{maxWidth: '896px', margin: '0 auto', padding: '0 24px'}}>
            <h2 style={{fontSize: '20px', fontWeight: '500', textAlign: 'center', marginBottom: '40px'}}>Aktive annonser</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px'}}>
              {annonser.map(annonse => (
                <a key={annonse.id} href={'/annonser/' + annonse.id} style={{backgroundColor: 'white', border: '1px solid #f3f4f6', borderRadius: '12px', overflow: 'hidden', display: 'block', textDecoration: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'}}>
                  <div style={{backgroundColor: '#f9fafb', height: '144px', overflow: 'hidden'}}>
                    {annonse.bilder && annonse.bilder[0] ? (
                      <img src={annonse.bilder[0]} style={{width: '100%', height: '100%', objectFit: 'cover'}} alt={annonse.tittel} />
                    ) : (
                      <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px'}}>🏕️</div>
                    )}
                  </div>
                  <div style={{padding: '12px'}}>
                    <p style={{fontWeight: '500', fontSize: '12px', marginBottom: '4px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: '#111'}}>{annonse.tittel}</p>
                    <p style={{color: '#059669', fontWeight: '500', fontSize: '14px', margin: '0'}}>{annonse.pris} kr</p>
                  </div>
                </a>
              ))}
            </div>
            <div style={{textAlign: 'center', marginTop: '32px'}}>
              <a href="/annonser" style={{color: '#059669', fontSize: '14px', fontWeight: '500', textDecoration: 'none'}}>
                Se alle annonser →
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Prising */}
      <section style={{backgroundColor: 'white', paddingTop: '80px', paddingBottom: '80px', textAlign: 'center'}}>
        <div style={{maxWidth: '896px', margin: '0 auto', padding: '0 24px'}}>
          <h2 style={{fontSize: '20px', fontWeight: '500', marginBottom: '8px'}}>Prising</h2>
          <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '40px'}}>Enkelt og forutsigbart.</p>
          <div style={{maxWidth: '360px', margin: '0 auto', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '16px', padding: '40px'}}>
            <div style={{fontSize: '11px', fontWeight: '600', color: '#065f46', marginBottom: '8px', letterSpacing: '0.05em'}}>INTRODUKSJONSTILBUD</div>
            <div style={{fontSize: '52px', fontWeight: '500', color: '#059669', marginBottom: '4px'}}>Gratis</div>
            <p style={{color: '#6b7280', fontSize: '14px', marginBottom: '24px'}}>i testperioden</p>
            <ul style={{textAlign: 'left', marginBottom: '32px', listStyle: 'none', padding: 0}}>
              {[
                'KI-analyse av bilde',
                'Automatisk annonsetekst og prising',
                '24-timers budrunde',
                'E-postvarsler til budgivere',
                'Personvern for budgivere'
              ].map(f => (
                <li key={f} style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151', marginBottom: '10px'}}>
                  <span style={{color: '#059669'}}>✓</span> {f}
                </li>
              ))}
            </ul>
            <a href="/logginn" style={{display: 'block', backgroundColor: '#059669', color: 'white', padding: '14px', borderRadius: '12px', fontWeight: '500', textDecoration: 'none', fontSize: '15px'}}>
              Kom i gang gratis
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{backgroundColor: '#f9fafb', borderTop: '1px solid #f3f4f6', padding: '32px 24px'}}>
        <div style={{maxWidth: '896px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <div style={{width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981'}}></div>
            <span style={{fontSize: '14px', fontWeight: '500'}}>OmTur</span>
            <span style={{fontSize: '14px', color: '#9ca3af'}}>— Helgeland</span>
          </div>
          <div style={{display: 'flex', gap: '24px'}}>
            <a href="/vilkar" style={{fontSize: '14px', color: '#9ca3af', textDecoration: 'none'}}>Vilkår og personvern</a>
            <a href="mailto:hei@omtur.no" style={{fontSize: '14px', color: '#9ca3af', textDecoration: 'none'}}>hei@omtur.no</a>
          </div>
        </div>
      </footer>
    </main>
  )
}