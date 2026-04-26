import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const alt = 'OmTur annonse'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }) {
  const { id } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data: annonse } = await supabase
    .from('annonser')
    .select('tittel, beskrivelse, bilder')
    .eq('id', id)
    .single()

  const tittel = annonse?.tittel ?? 'OmTur annonse'
  const beskrivelse = annonse?.beskrivelse
    ? annonse.beskrivelse.slice(0, 120) + (annonse.beskrivelse.length > 120 ? '…' : '')
    : ''
  const bilde = annonse?.bilder?.[0]

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          backgroundColor: '#f9fafb',
          fontFamily: 'sans-serif',
        }}
      >
        {bilde && (
          <div style={{ width: '50%', height: '100%', display: 'flex', overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bilde}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h1
              style={{
                fontSize: '44px',
                fontWeight: '700',
                color: '#111827',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {tittel}
            </h1>
            {beskrivelse && (
              <p style={{ fontSize: '20px', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                {beskrivelse}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px', fontWeight: '700', color: '#059669' }}>OmTur</span>
            <span style={{ fontSize: '18px', color: '#9ca3af' }}>
              — brukt sports- og fritidsutstyr
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
