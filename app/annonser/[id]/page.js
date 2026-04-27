import AnnonseKlient from './AnnonseKlient'
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

  const bilde = annonse?.bilder?.[0] ?? null

  return {
    title: (annonse?.tittel ?? 'Annonse') + ' — OmTur',
    description: annonse?.beskrivelse ?? 'Brukt sports- og fritidsutstyr på Helgeland',
    openGraph: {
      title: (annonse?.tittel ?? 'Annonse') + ' — OmTur',
      description: annonse?.beskrivelse ?? 'Brukt sports- og fritidsutstyr på Helgeland',
      url: 'https://omtur.no/annonser/' + id,
      siteName: 'OmTur',
      images: bilde ? [{ url: bilde, width: 1200, height: 630 }] : [],
      type: 'website',
    }
  }
}

export default function AnnonseSide({ params }) {
  return <AnnonseKlient params={params} />
}
