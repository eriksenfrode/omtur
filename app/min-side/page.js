'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function MinSide() {
  const [session, setSession] = useState(undefined)
  const [annonser, setAnnonser] = useState([])
  const [laster, setLaster] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) {
        hentMineAnnonser(data.session.user.id)
      } else {
        setLaster(false)
      }
    })
  }, [])

  async function hentMineAnnonser(userId) {
    const { data } = await supabase
      .from('annonser')
      .select('*')
      .eq('bruker_id', userId)
      .order('opprettet', { ascending: false })
    setAnnonser(data || [])
    setLaster(false)
  }

  async function loggUt() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (session === undefined) {
    return <main className="max-w-xl mx-auto p-6"><p className="text-gray-400">Laster...</p></main>
  }

  if (!session) {
    return (
      <main className="max-w-xl mx-auto p-6">
        <p className="text-gray-500 mb-4">Du er ikke innlogget.</p>
        <a href="/logginn" className="text-emerald-600 hover:text-emerald-700 font-medium">Logg inn</a>
      </main>
    )
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium">Min side</h1>
          <p className="text-gray-500 text-sm">{session.user.email}</p>
        </div>
        <button
          onClick={loggUt}
          className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300"
        >
          Logg ut
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Mine annonser</h2>
        <a href="/lag-annonse" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm">
          Ny annonse
        </a>
      </div>

      {laster ? (
        <p className="text-gray-400 text-center py-12">Laster annonser...</p>
      ) : annonser.length === 0 ? (
        <p className="text-gray-400 text-center py-12">Du har ingen annonser ennå</p>
      ) : (
        <div className="space-y-3">
          {annonser.map(annonse => (
            <a
              key={annonse.id}
              href={'/annonser/' + annonse.id}
              className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-3 hover:border-emerald-200 transition-colors"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                {annonse.bilder && annonse.bilder[0] ? (
                  <img src={annonse.bilder[0]} className="w-full h-full object-cover" alt={annonse.tittel} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🏕️</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{annonse.tittel}</p>
                <p className="text-xs text-gray-400">{annonse.merke} · {annonse.stand}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-emerald-600 font-medium text-sm">{annonse.pris} kr</span>
                  <span className={
                    'text-xs px-2 py-0.5 rounded-full ' +
                    (annonse.status === 'aktiv'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-500')
                  }>
                    {annonse.status}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <a href="/annonser" className="text-sm text-gray-400 hover:text-gray-600">Tilbake til annonser</a>
      </div>
    </main>
  )
}
