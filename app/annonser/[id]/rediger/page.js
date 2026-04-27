'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'

export default function RedigerAnnonse() {
  const { id } = useParams()
  const router = useRouter()
  const [laster, setLaster] = useState(true)
  const [lagrer, setLagrer] = useState(false)
  const [budrunde, setBudrunde] = useState(null)

  const [tittel, setTittel] = useState('')
  const [beskrivelse, setBeskrivelse] = useState('')
  const [pris, setPris] = useState('')
  const [minimumshopp, setMinimumshopp] = useState('')
  const [postnummer, setPostnummer] = useState('')

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/logginn')
        return
      }

      const { data: annonse } = await supabase
        .from('annonser')
        .select('*')
        .eq('id', id)
        .single()

      if (!annonse || annonse.bruker_id !== session.user.id) {
        router.replace('/annonser/' + id)
        return
      }

      const { data: b } = await supabase
        .from('budrunder')
        .select('*')
        .eq('annonse_id', id)
        .single()

      setTittel(annonse.tittel || '')
      setBeskrivelse(annonse.beskrivelse || '')
      setPris(annonse.pris || '')
      setMinimumshopp(b?.minimumshopp || 50)
      setPostnummer(annonse.postnummer || '')
      setBudrunde(b)
      setLaster(false)
    }
    init()
  }, [])

  async function lagreEndringer() {
    setLagrer(true)

    const { error: annonseError } = await supabase
      .from('annonser')
      .update({
        tittel,
        beskrivelse,
        pris: parseInt(pris),
        postnummer: postnummer ? parseInt(postnummer) : null
      })
      .eq('id', id)

    if (annonseError) {
      alert('Kunne ikke lagre: ' + annonseError.message)
      setLagrer(false)
      return
    }

    if (budrunde) {
      await supabase
        .from('budrunder')
        .update({ minimumshopp: parseInt(minimumshopp) || 50 })
        .eq('id', budrunde.id)
    }

    router.push('/annonser/' + id)
  }

  if (laster) {
    return (
      <main style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
        <p style={{ color: '#9ca3af' }}>Laster...</p>
      </main>
    )
  }

  const inputStyle = {
    width: '100%',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 14,
    background: '#fff',
    boxSizing: 'border-box'
  }

  const labelStyle = {
    fontSize: 12,
    color: '#9ca3af',
    display: 'block',
    marginBottom: 4
  }

  return (
    <main style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px' }}>
      <a href={'/annonser/' + id} style={{ fontSize: 14, color: '#9ca3af', textDecoration: 'none', display: 'block', marginBottom: 20 }}>
        ← Tilbake til annonsen
      </a>

      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 24 }}>Rediger annonse</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>Tittel</label>
          <input
            style={inputStyle}
            value={tittel}
            onChange={e => setTittel(e.target.value)}
          />
        </div>

        <div>
          <label style={labelStyle}>Beskrivelse</label>
          <textarea
            style={{ ...inputStyle, resize: 'vertical' }}
            rows={4}
            value={beskrivelse}
            onChange={e => setBeskrivelse(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Startpris (kr)</label>
            <input
              type="number"
              style={inputStyle}
              value={pris}
              onChange={e => setPris(e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Minimumshopp (kr)</label>
            <input
              type="number"
              style={inputStyle}
              value={minimumshopp}
              onChange={e => setMinimumshopp(e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Postnummer</label>
            <input
              type="number"
              style={inputStyle}
              value={postnummer}
              onChange={e => setPostnummer(e.target.value.slice(0, 4))}
              placeholder="1234"
              max="9999"
            />
          </div>
        </div>

        <button
          onClick={lagreEndringer}
          disabled={lagrer}
          style={{
            width: '100%',
            background: lagrer ? '#6ee7b7' : '#059669',
            color: '#fff',
            border: 'none',
            padding: '12px 0',
            borderRadius: 12,
            fontWeight: 500,
            fontSize: 15,
            cursor: lagrer ? 'default' : 'pointer',
            marginTop: 8
          }}
        >
          {lagrer ? 'Lagrer...' : 'Lagre endringer'}
        </button>
      </div>
    </main>
  )
}
