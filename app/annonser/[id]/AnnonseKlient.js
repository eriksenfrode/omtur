'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function AnnonseKlient() {
  const { id } = useParams()
  const [annonse, setAnnonse] = useState(null)
  const [budrunde, setBudrunde] = useState(null)
  const [bud, setBud] = useState([])
  const [navn, setNavn] = useState('')
  const [epost, setEpost] = useState('')
  const [telefon, setTelefon] = useState('')
  const [budbelop, setBudbelop] = useState('')
  const [sender, setSender] = useState(false)
  const [tidIgjen, setTidIgjen] = useState(null)
  const [aktivtBilde, setAktivtBilde] = useState(0)
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    hentAnnonse()
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  }, [])

  useEffect(() => {
    if (!budrunde || budrunde.status === 'venter') return
    const intervall = setInterval(() => {
      const na = new Date()
      const slutt = new Date(budrunde.sluttid)
      const diff = slutt - na
      if (diff <= 0) {
        setTidIgjen('Budrunden er avsluttet')
        clearInterval(intervall)
      } else {
        const timer = Math.floor(diff / 1000 / 60 / 60)
        const min = Math.floor((diff / 1000 / 60) % 60)
        const sek = Math.floor((diff / 1000) % 60)
        setTidIgjen(timer + 't ' + min + 'm ' + sek + 's igjen')
      }
    }, 1000)
    return () => clearInterval(intervall)
  }, [budrunde])

  async function hentAnnonse() {
    const { data: a } = await supabase
      .from('annonser')
      .select('*')
      .eq('id', id)
      .single()
    setAnnonse(a)

    const { data: b } = await supabase
      .from('budrunder')
      .select('*')
      .eq('annonse_id', id)
      .single()
    setBudrunde(b)

    if (b) {
      const { data: budliste } = await supabase
        .from('bud')
        .select('*')
        .eq('budrunde_id', b.id)
        .order('opprettet', { ascending: false })
      setBud(budliste || [])
      if (budliste && budliste.length > 0) {
        setBudbelop(b.navarende_bud + (b.minimumshopp || 50))
      } else {
        setBudbelop(b.startpris)
      }
    }
  }

  async function leggInnBud() {
    if (!navn || !epost || !telefon || !budbelop) {
      alert('Fyll inn navn, e-post, telefon og budbelop')
      return
    }
    if (parseInt(budbelop) < minBud) {
      alert('Budet er for lavt. Minimum er ' + minBud + ' kr')
      return
    }
    setSender(true)

    const na = new Date()
    let nySluttid = budrunde.sluttid

    if (budrunde.status === 'venter') {
      nySluttid = new Date(na.getTime() + 24 * 60 * 60 * 1000).toISOString()
    } else {
      const slutt = new Date(budrunde.sluttid)
      const diffMin = (slutt - na) / 1000 / 60
      if (diffMin < 15) {
        nySluttid = new Date(slutt.getTime() + 15 * 60 * 1000).toISOString()
      }
    }

    const tidligereBudgivere = bud.map(b => ({
      epost: b.budgiver_epost,
      belop: b.belop
    }))

    await supabase.from('bud').insert({
      budrunde_id: budrunde.id,
      budgiver_navn: navn,
      budgiver_epost: epost,
      telefon: telefon,
      belop: parseInt(budbelop)
    })

    await supabase
      .from('budrunder')
      .update({
        navarende_bud: parseInt(budbelop),
        sluttid: nySluttid,
        status: 'aktiv'
      })
      .eq('id', budrunde.id)

    await fetch('/api/varsle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'bud_bekreftet',
        annonse: annonse,
        bud: { budgiver_epost: epost, belop: parseInt(budbelop) }
      })
    })

    if (tidligereBudgivere.length > 0) {
      await fetch('/api/varsle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'overbydd',
          annonse: annonse,
          bud: { belop: parseInt(budbelop) },
          tidligereBudgivere: tidligereBudgivere
        })
      })
    }

    await hentAnnonse()
    setSender(false)
    alert('Budet er registrert! Du vil få bekreftelse på e-post.')
  }

  if (!annonse) return <main className="max-w-xl mx-auto p-6"><p className="text-gray-400">Laster...</p></main>

  const minBud = !budrunde ? annonse.pris : (bud.length > 0
    ? budrunde.navarende_bud + budrunde.minimumshopp
    : budrunde.startpris)

  const erEier = session?.user?.id === annonse?.bruker_id

  return (
    <main className="max-w-xl mx-auto p-6">
      <a href="/annonser" className="text-sm text-gray-400 hover:text-gray-600 mb-4 block">
        Tilbake til annonser
      </a>

      {annonse.bilder && annonse.bilder.length > 0 && (
        <div className="mb-3">
          <div className="relative">
            <img
              src={annonse.bilder[aktivtBilde]}
              className="w-full object-cover rounded-xl"
              style={{ maxHeight: '260px' }}
            />
            {annonse.bilder.length > 1 && (
              <>
                <button
                  onClick={() => setAktivtBilde(i => (i - 1 + annonse.bilder.length) % annonse.bilder.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg"
                >
                  ‹
                </button>
                <button
                  onClick={() => setAktivtBilde(i => (i + 1) % annonse.bilder.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg"
                >
                  ›
                </button>
              </>
            )}
          </div>
          {annonse.bilder.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {annonse.bilder.map((src, i) => (
                <button key={i} onClick={() => setAktivtBilde(i)} className="flex-shrink-0">
                  <img
                    src={src}
                    className={`h-[64px] w-[64px] object-cover rounded-lg transition-all ${
                      i === aktivtBilde
                        ? 'ring-2 ring-emerald-500 ring-offset-1'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <h1 className="text-2xl font-medium mb-1">{annonse.tittel}</h1>
      <p className="text-gray-400 text-sm mb-1">{annonse.merke} · {annonse.stand} · {annonse.kategori}</p>
      {annonse.postnummer && (
        <p className="text-gray-400 text-sm mb-4">Sted: {annonse.postnummer}</p>
      )}
      {!annonse.postnummer && <div className="mb-4" />}
      <p className="text-gray-600 mb-6">{annonse.beskrivelse}</p>

      {budrunde && (
        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs text-gray-400">
                {budrunde.status === 'venter' ? 'Startpris' : 'Høyeste bud'}
              </p>
              <p className="text-3xl font-medium text-emerald-600">
                {budrunde.navarende_bud} kr
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Status</p>
              {budrunde.status === 'venter' ? (
                <span className="text-sm bg-gray-200 text-gray-600 px-3 py-1 rounded-full">Ingen bud ennå</span>
              ) : (
                <span className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">{tidIgjen}</span>
              )}
            </div>
          </div>

          {bud.length > 0 && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-400 mb-3">Budhistorikk</p>
              {bud.map((b, i) => (
                <div key={b.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {i === 0 ? 'Høyeste bud' : 'Bud ' + (bud.length - i)}
                    </p>
                    <p className="text-xs text-gray-400">{new Date(b.opprettet).toLocaleString('no-NO')}</p>
                  </div>
                  <span className={'font-medium ' + (i === 0 ? 'text-emerald-600' : 'text-gray-400')}>
                    {b.belop} kr
                  </span>
                </div>
              ))}
            </div>
          )}

          {budrunde.status !== 'avsluttet' && !erEier && (
            <div className="space-y-3 mt-4">
              {session ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400">Ditt navn</label>
                      <input
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 bg-white"
                        value={navn}
                        onChange={e => setNavn(e.target.value)}
                        placeholder="Ola Nordmann"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">E-post</label>
                      <input
                        type="email"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 bg-white"
                        value={epost}
                        onChange={e => setEpost(e.target.value)}
                        placeholder="ola@epost.no"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-gray-400">Telefon</label>
                      <input
                        type="tel"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 bg-white"
                        value={telefon}
                        onChange={e => setTelefon(e.target.value)}
                        placeholder="987 65 432"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">
                      Ditt bud (minimum {minBud} kr)
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 bg-white"
                      value={budbelop}
                      onChange={e => setBudbelop(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    Navn, e-post og telefon er kun synlig for OmTur og selger etter avsluttet budrunde. Ikke synlig for andre budgivere.
                  </p>
                  <button
                    onClick={leggInnBud}
                    disabled={sender}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium disabled:opacity-50"
                  >
                    {sender ? 'Registrerer bud...' : 'Legg inn bud'}
                  </button>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-3">
                    <a href="/logginn" className="text-emerald-600 hover:text-emerald-700 font-medium">Logg inn</a>
                    {' '}for å legge inn bud
                  </p>
                </div>
              )}
              <a
                href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent('https://omtur.no/annonser/' + id)}
                target="_blank"
                rel="noopener noreferrer"
                style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', backgroundColor: '#1877F2', color: 'white', padding: '12px', borderRadius: '10px', fontWeight: '500', fontSize: '15px', textDecoration: 'none', marginTop: '12px'}}
              >
                <span style={{fontWeight: 'bold', fontSize: '18px'}}>f</span> Del på Facebook
              </a>
            </div>
          )}

          {erEier && budrunde.status !== 'avsluttet' && (
            <div className="mt-4">
              <a
                href={'/annonser/' + id + '/rediger'}
                className="inline-block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium text-center"
                style={{ textDecoration: 'none' }}
              >
                Rediger annonse
              </a>
            </div>
          )}
        </div>
      )}

      <div className="text-center mt-4">
        <a href="/vilkar" className="text-xs text-gray-400 hover:text-gray-600">Vilkår og personvern</a>
      </div>
    </main>
  )
}
