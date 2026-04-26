import { createClient } from '@supabase/supabase-js'

export async function generateMetadata({ params }) {
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

  if (!annonse) {
    return { title: 'Annonse — OmTur' }
  }

  return {
    title: `${annonse.tittel} — OmTur`,
    description: annonse.beskrivelse,
    openGraph: {
      title: annonse.tittel,
      description: annonse.beskrivelse,
      images: annonse.bilder?.[0] ? [{ url: annonse.bilder[0] }] : [],
      url: `https://omtur.no/annonser/${id}`,
      siteName: 'OmTur',
      type: 'website',
    },
  }
}

export default function Layout({ children }) {
  return children
}
