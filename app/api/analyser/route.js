import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const PROMPT = 'Du er en ekspert på brukt friluftsutstyr. Analyser dette bildet og returner KUN et JSON-objekt uten noe annet tekst: {"tittel": "kort tittel for annonsen", "merke": "merkenavnet eller Ukjent", "kategori": "en av: Telt, Sovepose, Sekk, Jakke, Bukse, Sko, Ski, Sykkel, Klatring, Annet", "stand": "en av: Ny, Lite brukt, Brukt, Slitt", "pris": tall i norske kroner uten kr-tegn, "beskrivelse": "2-3 setninger som beskriver utstyret og egner seg som annonsetekst"}'

export async function POST(request) {
  try {
    const { bilde, type } = await request.json()

    const melding = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: type,
                data: bilde
              }
            },
            {
              type: 'text',
              text: PROMPT
            }
          ]
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