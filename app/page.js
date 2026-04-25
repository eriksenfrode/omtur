'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [bilde, setBilde] = useState(null)
  const [forhåndsvisning, setForhåndsvisning] = useState(null)
  const [laster, setLaster] = useState(false)
  const [publiserer, setPubliserer] = useState(false)
  const [resultat, setResultat] = useState(null)

  function håndterBilde(e) {
    const fil = e.target.files[0]
    if (!fil) return
    setBilde(fil)
    setForhåndsvisning(URL.createObjectURL(fil))
  }

  async function analyserBilde() {
    if (!bilde) return
    setLaster(true)
    setResultat(null)
    const base64 = await tilBase64(bilde)
    const svar = await fetch('/api/analyser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bilde: base64, type: bilde.type })
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

    const filnavn = Date.now() + '-' + bilde.name
    const { error: opplastingsfeil } = await supabase.storage
      .from('bilder')
      .upload(filnavn, bilde)

    if (opplastingsfeil) {
      alert('Kunne ikke laste opp bilde: ' + opplastingsfeil.message)
      setPubliserer(false)
      return
    }

    const { data: urlData } = supabase.storage.from('bilder').getPublicUrl(filnavn)
    const bildeUrl = urlData.publicUrl

    const { data: annonse, error: annonseError } = await supabase
      .from('annonser')
      .insert({
        tittel: resultat.tittel,
        beskrivelse: resultat.beskrivelse,
        pris: parseInt(resultat.pris),
        kategori: resultat.kategori,
        stand: resultat.stand,
        merke: resultat.merke,
        bilder: [bildeUrl],
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

    console.log('Annonse opprettet med id:', annonse.id)

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

    console.log('Budrunde opprettet!')
    alert('Annonsen er publisert!')
    setResultat(null)
    setBilde(null)
    setForhåndsvisning(null)
    setPubliserer(false)
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-medium mb-2">OmTur</h1>
      <p className="text-gray-500 mb-8">Last opp bilde av utstyret — KI gjør resten</p>

      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center mb-4">
        {forhåndsvisning ? (
          <img src={forhåndsvisning} className="max-h-64 mx-auto rounded-lg mb-4" />
        ) : (
          <p className="text-gray-400 mb-4">Ingen bilde valgt</p>
        )}
        <input type="file" accept="image/*" onChange={håndterBilde} className="hidden" id="bildevalg" />
        <label htmlFor="bildevalg" className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm">
          Velg bilde
        </label>
      </div>

      {bilde && (
        <button
          onClick={analyserBilde}
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
                <option>Telt</option>
                <option>Sovepose</option>
                <option>Sekk</option>
                <option>Jakke</option>
                <option>Bukse</option>
                <option>Sko</option>
                <option>Ski</option>
                <option>Sykkel</option>
                <option>Klatring</option>
                <option>Annet</option>
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