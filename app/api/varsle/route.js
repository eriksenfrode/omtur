import { Resend } from 'resend'

export async function POST(request) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { type, annonse, bud, tidligereBudgivere } = await request.json()

    if (type === 'overbydd') {
      for (const budgiver of tidligereBudgivere) {
        await resend.emails.send({
          from: 'OmTur <ingen-svar@omtur.no>',
          to: budgiver.epost,
          subject: 'Du er overbydd på ' + annonse.tittel,
          html: '<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">' +
            '<h2 style="color: #085041;">Du er overbydd!</h2>' +
            '<p>Noen har lagt inn et høyere bud på <strong>' + annonse.tittel + '</strong>.</p>' +
            '<table style="width: 100%; border-collapse: collapse; margin: 16px 0;">' +
            '<tr><td style="padding: 8px; color: #666;">Nytt høyeste bud</td>' +
            '<td style="padding: 8px; font-weight: bold; color: #1D9E75;">' + bud.belop + ' kr</td></tr>' +
            '<tr><td style="padding: 8px; color: #666;">Ditt bud</td>' +
            '<td style="padding: 8px;">' + budgiver.belop + ' kr</td></tr>' +
            '</table>' +
            '<a href="https://omtur.no/annonser/' + annonse.id + '" ' +
            'style="display: block; background: #1D9E75; color: white; text-align: center; ' +
            'padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">' +
            'Legg inn nytt bud' +
            '</a>' +
            '<p style="color: #999; font-size: 12px; margin-top: 24px;">OmTur — Brukt friluftsutstyr på Helgeland</p>' +
            '</div>'
        })
      }
    }

    if (type === 'bud_bekreftet') {
      await resend.emails.send({
        from: 'OmTur <ingen-svar@omtur.no>',
        to: bud.budgiver_epost,
        subject: 'Budet ditt er registrert — ' + annonse.tittel,
        html: '<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">' +
          '<h2 style="color: #085041;">Budet er registrert!</h2>' +
          '<p>Du er høyeste budgiver på <strong>' + annonse.tittel + '</strong>.</p>' +
          '<table style="width: 100%; border-collapse: collapse; margin: 16px 0;">' +
          '<tr><td style="padding: 8px; color: #666;">Ditt bud</td>' +
          '<td style="padding: 8px; font-weight: bold; color: #1D9E75;">' + bud.belop + ' kr</td></tr>' +
          '</table>' +
          '<p>Du vil få varsel hvis noen overbyr deg.</p>' +
          '<a href="https://omtur.no/annonser/' + annonse.id + '" ' +
          'style="display: block; background: #1D9E75; color: white; text-align: center; ' +
          'padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">' +
          'Se budrunden' +
          '</a>' +
          '<p style="color: #999; font-size: 12px; margin-top: 24px;">OmTur — Brukt friluftsutstyr på Helgeland</p>' +
          '</div>'
      })
    }

    return Response.json({ ok: true })
  } catch (feil) {
    console.error('E-postfeil:', feil.message)
    return Response.json({ feil: feil.message }, { status: 500 })
  }
}