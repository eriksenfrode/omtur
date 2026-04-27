export default function OmOss() {
  return (
    <main>
      {/* Toppmeny */}
      <nav style={{borderBottom: '1px solid #f3f4f6', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '896px', margin: '0 auto'}}>
        <a href="/" style={{display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit'}}>
          <img src="/logo.svg" alt="OmTur logo" style={{height: '32px', width: 'auto'}} />
          <span style={{fontWeight: '500', fontSize: '18px'}}>OmTur</span>
        </a>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <a href="/annonser" style={{fontSize: '14px', color: '#6b7280', textDecoration: 'none'}}>Se annonser</a>
          <a href="/om-oss" style={{fontSize: '14px', color: '#059669', fontWeight: '500', textDecoration: 'none'}}>Om oss</a>
          <a href="/logginn" style={{fontSize: '14px', backgroundColor: '#059669', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none'}}>Logg inn</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{maxWidth: '896px', margin: '0 auto', padding: '72px 24px 64px', textAlign: 'center'}}>
        <div style={{display: 'inline-block', backgroundColor: '#ecfdf5', color: '#065f46', fontSize: '12px', fontWeight: '500', padding: '4px 12px', borderRadius: '20px', marginBottom: '20px'}}>
          Mo i Rana · 2026
        </div>
        <h1 style={{fontSize: '38px', fontWeight: '500', marginBottom: '20px', lineHeight: '1.3'}}>
          Om <span style={{color: '#059669'}}>OmTur</span>
        </h1>
        <p style={{color: '#6b7280', fontSize: '18px', maxWidth: '540px', margin: '0 auto', lineHeight: '1.7'}}>
          Vi gjør det enkelt å gi brukt utstyr nytt liv — bra for lommeboka og bra for miljøet.
        </p>
      </section>

      {/* Historien */}
      <section style={{backgroundColor: '#ecfdf5', paddingTop: '64px', paddingBottom: '64px'}}>
        <div style={{maxWidth: '640px', margin: '0 auto', padding: '0 24px'}}>
          <h2 style={{fontSize: '20px', fontWeight: '500', marginBottom: '24px'}}>Historien</h2>
          <p style={{fontSize: '16px', color: '#374151', lineHeight: '1.8', marginBottom: '16px'}}>
            OmTur ble startet av Frode Eriksen i Mo i Rana i 2026. Ideen kom fra observasjonen av at kjøp og salg i Facebook-grupper er tungvint — man må skrive annonsen selv, håndtere spørsmål, forhandle om pris og avtale møtetider. OmTur forenkler hele denne prosessen ved hjelp av kunstig intelligens.
          </p>
          <p style={{fontSize: '16px', color: '#374151', lineHeight: '1.8', marginBottom: '16px'}}>
            I tillegg handler OmTur om noe større: ved å gjøre det enkelt å selge brukt utstyr, bidrar vi til at færre ting kastes og mer utstyr får et nytt liv. Det er bra for lommeboka og bra for miljøet.
          </p>
          <p style={{fontSize: '16px', color: '#374151', lineHeight: '1.8'}}>
            OmTur er startet på Helgeland og fokuserer på lokale kjøpere og selgere i første omgang.
          </p>
        </div>
      </section>

      {/* Vår misjon */}
      <section style={{backgroundColor: 'white', paddingTop: '64px', paddingBottom: '64px'}}>
        <div style={{maxWidth: '640px', margin: '0 auto', padding: '0 24px'}}>
          <h2 style={{fontSize: '20px', fontWeight: '500', marginBottom: '24px'}}>Vår misjon</h2>
          <div style={{backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '16px', padding: '32px'}}>
            <p style={{fontSize: '20px', fontWeight: '500', color: '#065f46', lineHeight: '1.6', margin: '0', textAlign: 'center'}}>
              Gjøre det enkelt å gi brukt utstyr nytt liv — bra for lommeboka og bra for miljøet.
            </p>
          </div>
        </div>
      </section>

      {/* Verdier */}
      <section style={{backgroundColor: '#f9fafb', paddingTop: '64px', paddingBottom: '64px'}}>
        <div style={{maxWidth: '896px', margin: '0 auto', padding: '0 24px'}}>
          <h2 style={{fontSize: '20px', fontWeight: '500', textAlign: 'center', marginBottom: '40px'}}>Våre verdier</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px'}}>
            {[
              { ikon: '⚡', tittel: 'Enkelhet', tekst: 'Teknologi skal gjøre livet enklere, ikke mer komplisert. Tre minutter fra bilde til annonse.' },
              { ikon: '🤝', tittel: 'Ærlighet', tekst: 'Åpen budrunde der markedet setter prisen. Ingen skjulte kostnader.' },
              { ikon: '🌿', tittel: 'Bærekraft', tekst: 'Brukt utstyr som brukes igjen er det beste valget for planeten.' },
              { ikon: '📍', tittel: 'Lokalsamfunn', tekst: 'Bygget for Helgeland — kortere transport og folk du kan stole på.' }
            ].map(v => (
              <div key={v.tittel} style={{backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'}}>
                <div style={{fontSize: '24px', marginBottom: '12px'}}>{v.ikon}</div>
                <h3 style={{fontWeight: '500', fontSize: '14px', marginBottom: '8px'}}>{v.tittel}</h3>
                <p style={{fontSize: '12px', color: '#6b7280', lineHeight: '1.6', margin: '0'}}>{v.tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kontakt */}
      <section style={{backgroundColor: 'white', paddingTop: '64px', paddingBottom: '80px', textAlign: 'center'}}>
        <div style={{maxWidth: '480px', margin: '0 auto', padding: '0 24px'}}>
          <h2 style={{fontSize: '20px', fontWeight: '500', marginBottom: '16px'}}>Ta kontakt</h2>
          <p style={{color: '#6b7280', fontSize: '16px', marginBottom: '32px', lineHeight: '1.7'}}>
            Har du spørsmål, tilbakemeldinger eller vil prøve OmTur som selger? Vi hører gjerne fra deg.
          </p>
          <a
            href="mailto:hei@omtur.no"
            style={{display: 'inline-block', backgroundColor: '#059669', color: 'white', padding: '14px 40px', borderRadius: '12px', fontWeight: '500', fontSize: '15px', textDecoration: 'none', marginBottom: '40px'}}
          >
            hei@omtur.no
          </a>
          <div style={{display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap'}}>
            <a href="/annonser" style={{color: '#059669', fontSize: '14px', fontWeight: '500', textDecoration: 'none'}}>
              ← Se annonser
            </a>
            <span style={{color: '#e5e7eb'}}>|</span>
            <a href="/" style={{color: '#059669', fontSize: '14px', fontWeight: '500', textDecoration: 'none'}}>
              Tilbake til forsiden →
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
            <a href="/om-oss" style={{fontSize: '14px', color: '#9ca3af', textDecoration: 'none'}}>Om oss</a>
            <a href="/vilkar" style={{fontSize: '14px', color: '#9ca3af', textDecoration: 'none'}}>Vilkår og personvern</a>
            <a href="mailto:hei@omtur.no" style={{fontSize: '14px', color: '#9ca3af', textDecoration: 'none'}}>hei@omtur.no</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
