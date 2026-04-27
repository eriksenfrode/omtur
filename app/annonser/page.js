'use client'
import { useState, useEffect } from 'react'

export default function Annonser() {
  const [annonser, setAnnonser] = useState([])
  const [laster, setLaster] = useState(true)
  const [filter, setFilter] = useState('Alle')
  const [session, setSession] = useState(null)
  const [visBoks, setVisBoks] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('testperiode-lukket')) setVisBoks(true)
  }, [])

  function lukkBoks() {
    localStorage.setItem('testperiode-lukket', '1')
    setVisBoks(false)
  }

  const kategorier = ['Alle', 'Telt og sov', 'Sekker og pakking', 'Klær', 'Bukser og shorts', 'Sko og støvler', 'Ski og vinter', 'Sykkel', 'Klatring', 'Vannaktiviteter', 'Annet utstyr', 'Annet klær']

  useEffect(() => {
    async function init() {
      setLaster(true)
      const { supabase } = await import('../../lib/supabase')

      const { data: authData } = await supabase.auth.getSession()
      setSession(authData.session)

      const { data, error } = await supabase
        .from('annonser')
        .select('*')
        .eq('status', 'aktiv')
        .order('opprettet', { ascending: false })

      if (!error) setAnnonser(data)
      setLaster(false)
    }
    init()
  }, [])

  const filtrerte = filter === 'Alle'
    ? annonser
    : annonser.filter(a => a.kategori === filter)

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <img src="/logo.svg" alt="OmTur logo" style={{height: '32px', width: 'auto'}} />
            <span style={{fontWeight: '500', fontSize: '18px'}}>OmTur</span>
          </div>
          <p className="text-gray-500 text-sm">Klær og utstyr til sport, fritid og friluftsliv på Helgeland</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/om-oss" className="text-sm text-gray-500 hover:text-gray-700">
            Om oss
          </a>
          {session ? (
            <a href="/min-side" className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300">
              Min side
            </a>
          ) : (
            <a href="/logginn" className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300">
              Logg inn
            </a>
          )}
          <a href="/" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm">
            Selg utstyr
          </a>
        </div>
      </div>

      {visBoks && (
        <div style={{ background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', position: 'relative' }}>
          <button
            onClick={lukkBoks}
            style={{ position: 'absolute', top: '10px', right: '14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#92400e', lineHeight: 1 }}
            aria-label="Lukk"
          >
            ×
          </button>
          <p style={{ fontWeight: 600, color: '#92400e', marginBottom: '6px' }}>Vi er i testperiode!</p>
          <p style={{ color: '#78350f', fontSize: '14px', lineHeight: '1.5', paddingRight: '24px' }}>
            OmTur er gratis å bruke i testperioden. Er du interessert i å prøve tjenesten som selger?{' '}
            Send e-post til{' '}
            <a href="mailto:hei@omtur.no" style={{ color: '#b45309', textDecoration: 'underline', fontWeight: 500 }}>hei@omtur.no</a>
            {' '}så gir vi deg tilgang.
          </p>
        </div>
      )}

      <div className="flex gap-2 flex-wrap mb-6">
        {kategorier.map(k => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={'px-3 py-1 rounded-full text-sm border ' + (filter === k ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400')}
          >
            {k}
          </button>
        ))}
      </div>

      {laster ? (
        <p className="text-gray-400 text-center py-12">Laster annonser...</p>
      ) : filtrerte.length === 0 ? (
        <p className="text-gray-400 text-center py-12">Ingen annonser funnet</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtrerte.map(annonse => (
            <a key={annonse.id} href={'/annonser/' + annonse.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-emerald-200 transition-colors block">
              <div className="bg-gray-50 h-40 overflow-hidden">
                {annonse.bilder && annonse.bilder[0] ? (
                  <img
                    src={annonse.bilder[0]}
                    className="w-full h-full object-cover"
                    alt={annonse.tittel}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🏕️</div>
                )}
              </div>
              <div className="p-3">
                <p className="font-medium text-sm mb-1 line-clamp-1">{annonse.tittel}</p>
                <p className="text-xs text-gray-400 mb-2">{annonse.merke} · {annonse.stand}</p>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-600 font-medium">{annonse.pris} kr</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500">{annonse.kategori}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  )
}