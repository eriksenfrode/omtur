'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import Navbar from '../components/Navbar'

export default function Profil() {
  const router = useRouter()
  const [session, setSession] = useState(undefined)
  const [navn, setNavn] = useState('')
  const [telefon, setTelefon] = useState('')
  const [postnummer, setPostnummer] = useState('')
  const [lagrer, setLagrer] = useState(false)
  const [lagretMelding, setLagretMelding] = useState('')
  const [mineAnnonser, setMineAnnonser] = useState([])
  const [budrunderStatus, setBudrunderStatus] = useState({})

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/logginn')
      } else {
        setSession(data.session)
        hentProfil(data.session.user.id)
        hentMineAnnonser(data.session.user.id)
      }
    })
  }, [])

  async function hentProfil(userId) {
    const { data } = await supabase
      .from('brukere')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) {
      setNavn(data.navn || '')
      setTelefon(data.telefon || '')
      setPostnummer(data.postnummer ? String(data.postnummer) : '')
    }
  }

  async function hentMineAnnonser(userId) {
    const { data: annonser } = await supabase
      .from('annonser')
      .select('id, tittel, bilder, pris, status')
      .eq('bruker_id', userId)
      .order('opprettet', { ascending: false })
    if (!annonser) return
    setMineAnnonser(annonser)

    const { data: budrunder } = await supabase
      .from('budrunder')
      .select('annonse_id, status')
      .in('annonse_id', annonser.map(a => a.id))
      .eq('status', 'aktiv')
    const statusMap = {}
    if (budrunder) {
      for (const b of budrunder) statusMap[b.annonse_id] = 'aktiv'
    }
    setBudrunderStatus(statusMap)
  }

  async function lagreProfil() {
    setLagrer(true)
    setLagretMelding('')
    const { error } = await supabase
      .from('brukere')
      .update({
        navn,
        telefon,
        postnummer: postnummer ? parseInt(postnummer) : null
      })
      .eq('id', session.user.id)
    setLagrer(false)
    if (error) {
      setLagretMelding('Feil ved lagring: ' + error.message)
    } else {
      setLagretMelding('ok')
      setTimeout(() => setLagretMelding(''), 4000)
    }
  }

  async function loggUt() {
    await supabase.auth.signOut()
    router.replace('/')
  }

  async function slettKonto() {
    if (!confirm('Er du sikker på at du vil slette kontoen din? Dette kan ikke angres.')) return
    await supabase.from('brukere').delete().eq('id', session.user.id)
    await supabase.auth.signOut()
    router.replace('/')
  }

  async function slettAnnonse(annonseId) {
    if (!confirm('Er du sikker på at du vil slette denne annonsen?')) return
    console.log('[slettAnnonse] Starter sletting av annonse:', annonseId)
    const { error: budrundeFeil } = await supabase.from('budrunder').delete().eq('annonse_id', annonseId)
    if (budrundeFeil) console.error('[slettAnnonse] Feil ved sletting av budrunder:', budrundeFeil)
    const { error: annonseFeil } = await supabase.from('annonser').delete().eq('id', annonseId)
    if (annonseFeil) {
      console.error('[slettAnnonse] Feil ved sletting av annonse:', annonseFeil)
    } else {
      console.log('[slettAnnonse] Annonse slettet OK:', annonseId)
    }
    hentMineAnnonser(session.user.id)
  }

  if (session === undefined) {
    return <main><Navbar /><div className="max-w-xl mx-auto p-6"><p className="text-gray-400">Laster...</p></div></main>
  }

  return (
    <main>
      <Navbar />
      <div className="max-w-xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-medium">Min profil</h1>
          <button
            onClick={loggUt}
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-lg"
          >
            Logg ut
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 mb-8">
          <h2 className="text-base font-semibold mb-4 text-gray-700">Kontaktinformasjon</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400">E-post</label>
              <p className="text-sm text-gray-600 mt-1">{session.user.email}</p>
            </div>
            <div>
              <label className="text-xs text-gray-400">Navn</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 bg-white"
                value={navn}
                onChange={e => setNavn(e.target.value)}
                placeholder="Ola Nordmann"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Telefon</label>
              <input
                type="tel"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 bg-white"
                value={telefon}
                onChange={e => setTelefon(e.target.value)}
                placeholder="987 65 432"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Postnummer</label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 bg-white"
                value={postnummer}
                onChange={e => setPostnummer(e.target.value.slice(0, 4))}
                placeholder="1234"
                max="9999"
              />
            </div>
            <button
              onClick={lagreProfil}
              disabled={lagrer}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-medium text-sm disabled:opacity-50"
            >
              {lagrer ? 'Lagrer...' : 'Lagre endringer'}
            </button>
            {lagretMelding === 'ok' && (
              <p className="text-sm text-emerald-600 text-center mt-2">Profil lagret!</p>
            )}
            {lagretMelding && lagretMelding !== 'ok' && (
              <p className="text-sm text-red-500 text-center mt-2">{lagretMelding}</p>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-base font-semibold mb-4 text-gray-700">Mine annonser</h2>
          {mineAnnonser.length === 0 ? (
            <p className="text-sm text-gray-400">Du har ingen annonser ennå.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {mineAnnonser.map(annonse => {
                const harAktivBudrunde = budrunderStatus[annonse.id] === 'aktiv'
                return (
                  <div key={annonse.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                      {annonse.bilder?.[0] ? (
                        <img src={annonse.bilder[0]} alt={annonse.tittel} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🏕️</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{annonse.tittel}</p>
                      <p className="text-sm text-emerald-600 font-medium">{annonse.pris} kr</p>
                      {harAktivBudrunde && (
                        <p className="text-xs text-amber-600 mt-0.5">Aktiv budrunde — kan ikke slettes</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <a href={'/annonser/' + annonse.id} className="text-xs text-emerald-600 hover:text-emerald-800">Se →</a>
                      {!harAktivBudrunde && (
                        <button
                          onClick={() => slettAnnonse(annonse.id)}
                          className="text-xs text-red-400 hover:text-red-600"
                        >
                          Slett
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-base font-semibold mb-2 text-gray-700">Konto</h2>
          <p className="text-sm text-gray-400 mb-4">Sletting av konto er permanent og kan ikke angres.</p>
          <button
            onClick={slettKonto}
            className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-lg"
          >
            Slett konto
          </button>
        </div>
      </div>
    </main>
  )
}
