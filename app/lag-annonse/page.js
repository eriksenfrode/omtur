'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function LagAnnonse() {
  const router = useRouter()
  const [session, setSession] = useState(undefined)
  const [mineAnnonser, setMineAnnonser] = useState([])
  const [erMobil, setErMobil] = useState(false)

  const [bilder, setBilder] = useState([])
  const [forhåndsvisninger, setForhåndsvisninger] = useState([])
  const [forsideBildeIndex, setForsideBildeIndex] = useState(0)
  const [laster, setLaster] = useState(false)
  const [publiserer, setPubliserer] = useState(false)
  const [resultat, setResultat] = useState(null)

  useEffect(() => {
    function sjekkBredde() {
      setErMobil(window.innerWidth < 768)
    }
    sjekkBredde()
    window.addEventListener('resize', sjekkBredde)
    return () => window.removeEventListener('resize', sjekkBredde)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/logginn')
      } else {
        setSession(data.session)
        hentMineAnnonser(data.session.user.id)
      }
    })
  }, [])

  async function hentMineAnnonser(userId) {
    const { data } = await supabase
      .from('annonser')
      .select('id, tittel, bilder, pris, status')
      .eq('bruker_id', userId)
      .order('opprettet', { ascending: false })
    setMineAnnonser(data || [])
  }

  function håndterBilder(e) {
    const filer = Array.from(e.target.files)
    const nyeFiler = filer.slice(0, 5 - bilder.length)
    setBilder(prev => [...prev, ...nyeFiler])
    setForhåndsvisninger(prev => [...prev, ...nyeFiler.map(f => URL.createObjectURL(f))])
  }

  function fjernBilde(index) {
    setBilder(prev => prev.filter((_, i) => i !== index))
    setForhåndsvisninger(prev => prev.filter((_, i) => i !== index))
    setForsideBildeIndex(prev => (index === prev ? 0 : index < prev ? prev - 1 : prev))
  }

  async function analyserBilder() {
    if (bilder.length === 0) return
    setLaster(true)
    setResultat(null)

    const base64Bilder = await Promise.all(
      bilder.map(async bilde => ({
        data: await tilBase64(bilde),
        type: bilde.type
      }))
    )

    const svar = await fetch('/api/analyser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bilder: base64Bilder })
    })
    const data = await svar.json()
    setResultat({ ...data, minimumshopp: 50, postnummer: '' })
    setLaster(false)
  }

  function tilBase64(fil) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result.split(',')[1])
      reader.readAsDataURL(fil)
    })
  }

  function oppdater(felt, verdi) {
    setResultat(prev => ({ ...prev, [felt]: verdi }))
  }

  async function publiserAnnonse() {
    setPubliserer(true)

    const sorterteBilder = [
      bilder[forsideBildeIndex],
      ...bilder.filter((_, i) => i !== forsideBildeIndex)
    ]

    const bildeUrler = []
    for (const bilde of sorterteBilder) {
      const filnavn = Date.now() + '-' + Math.random().toString(36).slice(2) + '-' + bilde.name
      const { error: opplastingsfeil } = await supabase.storage
        .from('bilder')
        .upload(filnavn, bilde)

      if (opplastingsfeil) {
        alert('Kunne ikke laste opp bilde: ' + opplastingsfeil.message)
        setPubliserer(false)
        return
      }

      const { data: urlData } = supabase.storage.from('bilder').getPublicUrl(filnavn)
      bildeUrler.push(urlData.publicUrl)
    }

    const { data: annonse, error: annonseError } = await supabase
      .from('annonser')
      .insert({
        tittel: resultat.tittel,
        beskrivelse: resultat.beskrivelse,
        pris: parseInt(resultat.pris),
        kategori: resultat.kategori,
        stand: resultat.stand,
        merke: resultat.merke,
        postnummer: resultat.postnummer ? parseInt(resultat.postnummer) : null,
        bilder: bildeUrler,
        status: 'aktiv',
        salgstype: 'budrunde',
        bruker_id: session.user.id
      })
      .select()
      .single()

    if (annonseError) {
      alert('Annonse feil: ' + annonseError.message)
      setPubliserer(false)
      return
    }

    const { error: budrundeError } = await supabase
      .from('budrunder')
      .insert({
        annonse_id: annonse.id,
        startpris: parseInt(resultat.pris),
        minimumshopp: parseInt(resultat.minimumshopp) || 50,
        navarende_bud: parseInt(resultat.pris),
        status: 'venter'
      })

    if (budrundeError) {
      alert('Budrunde feil: ' + budrundeError.message)
      setPubliserer(false)
      return
    }

    alert('Annonsen er publisert!')
    setResultat(null)
    setBilder([])
    setForhåndsvisninger([])
    setForsideBildeIndex(0)
    setPubliserer(false)
    hentMineAnnonser(session.user.id)
  }

  if (session === undefined) {
    return <main style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}><p style={{ color: '#9ca3af' }}>Laster...</p></main>
  }

  const skjema = (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Ny annonse</h2>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>Last opp bilder av utstyret — KI gjør resten</p>

      <div style={{
        border: '2px dashed #e5e7eb',
        borderRadius: 12,
        padding: 24,
        textAlign: 'center',
        marginBottom: 8
      }}>
        {forhåndsvisninger.length > 0 ? (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8, justifyContent: 'center' }}>
              {forhåndsvisninger.map((src, i) => (
                <div
                  key={i}
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                    flexShrink: 0,
                    borderRadius: 8,
                    width: 120,
                    height: 120,
                    border: i === forsideBildeIndex ? '3px solid #059669' : '3px solid transparent'
                  }}
                  onClick={() => setForsideBildeIndex(i)}
                  title="Klikk for å velge som forsidebilde"
                >
                  <img
                    src={src}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 6,
                      opacity: i === forsideBildeIndex ? 1 : 0.8
                    }}
                    alt=""
                  />
                  {i === forsideBildeIndex && (
                    <span style={{
                      position: 'absolute',
                      bottom: 4,
                      left: 4,
                      background: '#059669',
                      color: '#fff',
                      fontSize: 10,
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontWeight: 500
                    }}>
                      Forsidebilde
                    </span>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); fjernBilde(i) }}
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      background: 'rgba(0,0,0,0.5)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      fontSize: 14,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {resultat && (
              <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>Klikk på et bilde for å velge forsidebilde</p>
            )}
          </>
        ) : (
          <p style={{ color: '#9ca3af', marginBottom: 16 }}>Ingen bilder valgt</p>
        )}
        {bilder.length < 5 && (
          <>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={håndterBilder}
              style={{ display: 'none' }}
              id="bildevalg"
            />
            <label
              htmlFor="bildevalg"
              style={{
                cursor: 'pointer',
                background: '#f3f4f6',
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 14,
                display: 'inline-block'
              }}
            >
              {bilder.length === 0 ? 'Velg bilder' : `Legg til flere (${bilder.length}/5)`}
            </label>
          </>
        )}
      </div>

      <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginBottom: 16 }}>
        Last opp 3–5 bilder for best mulig prisestimat
      </p>

      {bilder.length > 0 && (
        <button
          onClick={analyserBilder}
          disabled={laster}
          style={{
            width: '100%',
            background: laster ? '#6ee7b7' : '#059669',
            color: '#fff',
            border: 'none',
            padding: '12px 0',
            borderRadius: 12,
            fontWeight: 500,
            fontSize: 15,
            cursor: laster ? 'default' : 'pointer',
            marginBottom: 24
          }}
        >
          {laster ? 'Analyserer...' : 'Analyser med KI'}
        </button>
      )}

      {resultat && (
        <div style={{ background: '#f9fafb', borderRadius: 12, padding: 20 }}>
          <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>Sjekk og korriger om nødvendig</p>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 4 }}>Tittel</label>
            <input
              style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 14, background: '#fff', boxSizing: 'border-box' }}
              value={resultat.tittel}
              onChange={e => oppdater('tittel', e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 4 }}>Merke</label>
              <input
                style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 14, background: '#fff', boxSizing: 'border-box' }}
                value={resultat.merke}
                onChange={e => oppdater('merke', e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 4 }}>Stand</label>
              <select
                style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 14, background: '#fff', boxSizing: 'border-box' }}
                value={resultat.stand}
                onChange={e => oppdater('stand', e.target.value)}
              >
                <option>Ny</option>
                <option>Lite brukt</option>
                <option>Brukt</option>
                <option>Slitt</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 4 }}>Kategori</label>
              <select
                style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 14, background: '#fff', boxSizing: 'border-box' }}
                value={resultat.kategori}
                onChange={e => oppdater('kategori', e.target.value)}
              >
                <option>Telt og sov</option>
                <option>Sekker og pakking</option>
                <option>Klær</option>
                <option>Bukser og shorts</option>
                <option>Sko og støvler</option>
                <option>Ski og vinter</option>
                <option>Sykkel</option>
                <option>Klatring</option>
                <option>Vannaktiviteter</option>
                <option>Annet utstyr</option>
                <option>Annet klær</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 4 }}>Startpris (kr)</label>
              <input
                type="number"
                style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 14, background: '#fff', boxSizing: 'border-box' }}
                value={resultat.pris}
                onChange={e => oppdater('pris', e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 4 }}>Minimumshopp (kr)</label>
              <input
                type="number"
                style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 14, background: '#fff', boxSizing: 'border-box' }}
                value={resultat.minimumshopp}
                onChange={e => oppdater('minimumshopp', e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 4 }}>Postnummer</label>
              <input
                type="number"
                style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 14, background: '#fff', boxSizing: 'border-box' }}
                value={resultat.postnummer}
                onChange={e => oppdater('postnummer', e.target.value.slice(0, 4))}
                placeholder="1234"
                max="9999"
              />
            </div>
            <div style={{ gridColumn: '1 / -1', background: '#ecfdf5', borderRadius: 8, padding: 12 }}>
              <p style={{ fontSize: 12, color: '#047857' }}>Budrunden starter ved første bud og avsluttes etter 24 timer. Bud de siste 15 minuttene forlenger fristen automatisk med 15 minutter.</p>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginBottom: 4 }}>Beskrivelse</label>
            <textarea
              style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 14, background: '#fff', boxSizing: 'border-box', resize: 'vertical' }}
              rows={4}
              value={resultat.beskrivelse}
              onChange={e => oppdater('beskrivelse', e.target.value)}
            />
          </div>

          <button
            onClick={publiserAnnonse}
            disabled={publiserer}
            style={{
              width: '100%',
              background: publiserer ? '#6ee7b7' : '#059669',
              color: '#fff',
              border: 'none',
              padding: '12px 0',
              borderRadius: 12,
              fontWeight: 500,
              fontSize: 15,
              cursor: publiserer ? 'default' : 'pointer'
            }}
          >
            {publiserer ? 'Publiserer...' : 'Publiser annonse'}
          </button>
        </div>
      )}
    </div>
  )

  const mineAnnonserPanel = (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Mine annonser</h2>
      {mineAnnonser.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: 14 }}>Du har ingen annonser ennå.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {mineAnnonser.map(annonse => (
            <div
              key={annonse.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: '#fff',
                border: '1px solid #f3f4f6',
                borderRadius: 12,
                padding: 10
              }}
            >
              <div style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#f9fafb' }}>
                {annonse.bilder && annonse.bilder[0] ? (
                  <img
                    src={annonse.bilder[0]}
                    alt={annonse.tittel}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🏕️</div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 500, fontSize: 14, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{annonse.tittel}</p>
                <p style={{ fontSize: 13, color: '#059669', fontWeight: 500, marginBottom: 4 }}>{annonse.pris} kr</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 99,
                    background: annonse.status === 'aktiv' ? '#d1fae5' : '#f3f4f6',
                    color: annonse.status === 'aktiv' ? '#065f46' : '#6b7280'
                  }}>
                    {annonse.status}
                  </span>
                  <a
                    href={'/annonser/' + annonse.id}
                    style={{ fontSize: 12, color: '#059669', textDecoration: 'none' }}
                  >
                    Se annonse →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  if (erMobil) {
    return (
      <main style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 24}}>
          <img src="/logo.svg" alt="OmTur logo" style={{height: '32px', width: 'auto'}} />
          <span style={{fontWeight: '500', fontSize: '18px'}}>OmTur</span>
        </div>
        {skjema}
        <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid #f3f4f6' }}>
          {mineAnnonserPanel}
        </div>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px' }}>
      <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 32}}>
        <img src="/logo.svg" alt="OmTur logo" style={{height: '32px', width: 'auto'}} />
        <span style={{fontWeight: '500', fontSize: '18px'}}>OmTur</span>
      </div>
      <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
        <div style={{ width: '40%', flexShrink: 0 }}>
          {mineAnnonserPanel}
        </div>
        <div style={{ flex: 1 }}>
          {skjema}
        </div>
      </div>
    </main>
  )
}
