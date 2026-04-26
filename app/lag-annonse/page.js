'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Home() {
  const [bilder, setBilder] = useState([])
  const [forhåndsvisninger, setForhåndsvisninger] = useState([])
  const [forsideBildeIndex, setForsideBildeIndex] = useState(0)
  const [laster, setLaster] = useState(false)
  const [publiserer, setPubliserer] = useState(false)
  const [resultat, setResultat] = useState(null)

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
    setResultat({ ...data, minimumshopp: 50 })
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
        bilder: bildeUrler,
        status: 'aktiv',
        salgstype: 'budrunde'
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
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-medium mb-2">OmTur</h1>
      <p className="text-gray-500 mb-8">Last opp bilder av utstyret — KI gjør resten</p>

      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center mb-2">
        {forhåndsvisninger.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2 mb-2 justify-center">
              {forhåndsvisninger.map((src, i) => (
                <div
                  key={i}
                  className="relative cursor-pointer flex-shrink-0 rounded-lg"
                  style={{
                    width: 120,
                    height: 120,
                    border: i === forsideBildeIndex ? '3px solid #059669' : '3px solid transparent'
                  }}
                  onClick={() => setForsideBildeIndex(i)}
                  title="Klikk for å velge som forsidebilde"
                >
                  <img
                    src={src}
                    className={`w-full h-full object-cover rounded-lg transition-all ${
                      i === forsideBildeIndex ? '' : 'opacity-80 hover:opacity-100'
                    }`}
                  />
                  {i === forsideBildeIndex && (
                    <span className="absolute bottom-1 left-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                      Forsidebilde
                    </span>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); fjernBilde(i) }}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 text-xs leading-none flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {resultat && (
              <p className="text-xs text-gray-400 mb-2">Klikk på et bilde for å velge forsidebilde</p>
            )}
          </>
        ) : (
          <p className="text-gray-400 mb-4">Ingen bilder valgt</p>
        )}
        {bilder.length < 5 && (
          <>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={håndterBilder}
              className="hidden"
              id="bildevalg"
            />
            <label
              htmlFor="bildevalg"
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm"
            >
              {bilder.length === 0 ? 'Velg bilder' : `Legg til flere (${bilder.length}/5)`}
            </label>
          </>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center mb-4">
        Last opp 3–5 bilder for best mulig prisestimat
      </p>

      {bilder.length > 0 && (
        <button
          onClick={analyserBilder}
          disabled={laster}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium mb-6 disabled:opacity-50"
        >
          {laster ? 'Analyserer...' : 'Analyser med KI'}
        </button>
      )}

      {resultat && (
        <div className="bg-gray-50 rounded-xl p-5 space-y-3">
          <p className="text-xs text-gray-400 mb-1">Sjekk og korriger om nødvendig</p>

          <div>
            <label className="text-xs text-gray-400">Tittel</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 bg-white"
              value={resultat.tittel}
              onChange={e => oppdater('tittel', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400">Merke</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 bg-white"
                value={resultat.merke}
                onChange={e => oppdater('merke', e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Stand</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 bg-white"
                value={resultat.stand}
                onChange={e => oppdater('stand', e.target.value)}
              >
                <option>Ny</option>
                <option>Lite brukt</option>
                <option>Brukt</option>
                <option>Slitt</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-400">Kategori</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 bg-white"
                value={resultat.kategori}
                onChange={e => oppdater('kategori', e.target.value)}
              >
                <option>Telt og sov</option>
                <option>Sekker og pakking</option>
                <option>Jakker og vinterklær</option>
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
              <label className="text-xs text-gray-400">Startpris (kr)</label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 bg-white"
                value={resultat.pris}
                onChange={e => oppdater('pris', e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Minimumshopp (kr)</label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 bg-white"
                value={resultat.minimumshopp}
                onChange={e => oppdater('minimumshopp', e.target.value)}
              />
            </div>
            <div className="col-span-2 bg-emerald-50 rounded-lg p-3">
              <p className="text-xs text-emerald-700">Budrunden starter ved første bud og avsluttes etter 24 timer. Bud de siste 15 minuttene forlenger fristen automatisk med 15 minutter.</p>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400">Beskrivelse</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 bg-white"
              rows={4}
              value={resultat.beskrivelse}
              onChange={e => oppdater('beskrivelse', e.target.value)}
            />
          </div>

          <button
            onClick={publiserAnnonse}
            disabled={publiserer}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium mt-2 disabled:opacity-50"
          >
            {publiserer ? 'Publiserer...' : 'Publiser annonse'}
          </button>
        </div>
      )}
    </main>
  )
}
