import { createClient } from '@supabase/supabase-js'

export async function GET(request, { params }) {
  const { id } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data: annonse } = await supabase
    .from('annonser')
    .select('tittel, beskrivelse, bilder, merke, pris')
    .eq('id', id)
    .single()

  const tittel = annonse?.tittel ?? 'OmTur'
  const beskrivelse = annonse?.beskrivelse ?? 'Brukt sports- og fritidsutstyr på Helgeland'
  const bilde = annonse?.bilder?.[0] ?? ''

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta property="og:title" content="${tittel} — OmTur" />
  <meta property="og:description" content="${beskrivelse}" />
  <meta property="og:image" content="${bilde}" />
  <meta property="og:url" content="https://omtur.no/annonser/${id}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="OmTur" />
  <meta http-equiv="refresh" content="0; url=https://omtur.no/annonser/${id}" />
</head>
<body></body>
</html>`

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  })
}
