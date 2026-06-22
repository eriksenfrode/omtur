export const maxDuration = 60

import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const PROMPT = 'Du er en ekspert på brukt klær og utstyr til sport, fritid, friluftsliv og barn. Les nøye all tekst og logoer som er synlige. Hvis du ser barneklær, leker, barnevogn, eller klær i liten størrelse beregnet på barn, velg seksjon=barn. Bunad og festklær til barn er seksjon=barn. Analyser disse bildene og returner KUN et JSON-objekt uten noe annet tekst: {"tittel": "kort tittel for annonsen", "merke": "merkenavnet eller Ukjent", "seksjon": "en av: sport, barn", "kategori": "hvis seksjon=sport: en av: Telt og sov, Sekker og pakking, Klær, Bukser og shorts, Sko og støvler, Ski og vinter, Sykkel, Klatring, Vannaktiviteter, Annet utstyr, Annet klær. Hvis seksjon=barn: en av: Klær 0-2 år, Klær 2-6 år, Klær 6-12 år, Klær 12-16 år, Leker og spill, Barnevogn og transport, Sykkel og sparkesykkel, Ski og vinterutstyr barn, Annet barn", "stand": "en av: Ny, Lite brukt, Brukt, Slitt", "pris": tall i norske kroner uten kr-tegn, "beskrivelse": "2-3 setninger som beskriver varen og egner seg som annonsetekst"}'

export async function POST(request) {
  try {
    const { bilder, tilleggsinfo } = await request.json()

    const prompt = tilleggsinfo
      ? `${PROMPT} Selger har lagt til denne tilleggsinformasjonen: ${tilleggsinfo}. Bruk denne informasjonen i analysen.`
      : PROMPT

    const innhold = [
      ...bilder.slice(0, 3).map(b => ({
        type: 'image',
        source: {
          type: 'base64',
          media_type: b.type,
          data: b.data
        }
      })),
      { type: 'text', text: prompt }
    ]

    const melding = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: innhold
        }
      ]
    })

    const tekst = melding.content[0].text
    console.log('Claude svarte:', tekst)

    const renTekst = tekst.replace(/```json|```/g, '').trim()
const json = JSON.parse(renTekst)
    return Response.json(json)

  } catch (feil) {
    console.error('Feil:', feil.message)
    return Response.json({ feil: feil.message }, { status: 500 })
  }
}