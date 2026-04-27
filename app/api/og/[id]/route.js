import { createClient } from '@supabase/supabase-js'

export async function GET(_request, { params }) {
  const { id } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data: annonse } = await supabase
    .from('annonser')
    .select('tittel, beskrivelse, bilder, pris')
    .eq('id', id)
    .single()

  const tittel = (annonse?.tittel ?? 'OmTur') + ' — OmTur'
  const beskrivelse = annonse?.beskrivelse ?? 'Brukt sports- og fritidsutstyr på Helgeland'
  const bilde = annonse?.bilder?.[0] ?? 'https://omtur.no/og-default.jpg'
  const url = 'https://omtur.no/annonser/' + id

  const html = `<!DOCTYPE html>
<html lang="no">
<head>
  <meta charset="UTF-8">
  <title>${tittel}</title>
  <meta name="description" content="${beskrivelse}">
  <meta property="og:title" content="${tittel}">
  <meta property="og:description" content="${beskrivelse}">
  <meta property="og:image" content="${bilde}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="OmTur">
  <meta http-equiv="refresh" content="0; url=${url}">
</head>
<body>
  <p>Laster annonse...</p>
</body>
</html>`

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'X-Frame-Options': 'ALLOWALL',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    }
  })
}
