'use client'
import { useState, useEffect } from 'react'

export default function Annonser() {
  const [annonser, setAnnonser] = useState([])
  const [laster, setLaster] = useState(true)
  const [filter, setFilter] = useState('Alle')

  const kategorier = ['Alle', 'Telt og sov', 'Sekker og pakking', 'Jakker og vinterklær', 'Bukser og shorts', 'Sko og støvler', 'Ski og vinter', 'Sykkel', 'Klatring', 'Vannaktiviteter', 'Annet utstyr', 'Annet klær']

  useEffect(() => {
    async function hentAnnonser() {
      setLaster(true)
      const { supabase } = await import('../../lib/supabase')
      const { data, error } = await supabase
        .from('annonser')
        .select('*')
        .eq('status', 'aktiv')
        .order('opprettet', { ascending: false })

      if (!error) setAnnonser(data)
      setLaster(false)
    }
    hentAnnonser()
  }, [])

  const filtrerte = filter === 'Alle'
    ? annonser
    : annonser.filter(a => a.kategori === filter)

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium">OmTur</h1>
          <p className="text-gray-500 text-sm">Klær og utstyr til sport, fritid og friluftsliv på Helgeland</p>
        </div>
        <a href="/" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm">
          Selg utstyr
        </a>
      </div>

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