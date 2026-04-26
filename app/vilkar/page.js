export default function Vilkar() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <a href="/annonser" className="text-sm text-gray-400 hover:text-gray-600 mb-6 block">
        Tilbake til annonser
      </a>

      <h1 className="text-3xl font-medium mb-2">Vilkår og personvern</h1>
      <p className="text-gray-400 text-sm mb-10">Sist oppdatert: april 2026</p>

      <section className="mb-10">
        <h2 className="text-xl font-medium mb-4">Brukervilkår</h2>

        <h3 className="font-medium mb-2">Om OmTur</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          OmTur er en markedsplass for kjøp og salg av brukt friluftsutstyr. Tjenesten er drevet av en privatperson og er for tiden i en testfase rettet mot brukere på Helgeland.
        </p>

        <h3 className="font-medium mb-2">Selgers ansvar</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Selger er ansvarlig for at informasjonen i annonsen er korrekt, inkludert beskrivelse av stand og eventuelle feil eller mangler ved utstyret. Produktbeskrivelsen genereres med kunstig intelligens og må godkjennes av selger før publisering. OmTur er ikke ansvarlig for feil i KI-generert innhold som selger har godkjent. Prisforslaget genereres av KI basert på analyse av lignende utstyr fra nettbutikker og bruktmarkeder. Dette er et estimat — selger godkjenner alltid prisen før publisering.
        </p>

        <h3 className="font-medium mb-2">Budrunder</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Alle bud er bindende. Høyeste budgiver ved budrundens slutt er forpliktet til å gjennomføre kjøpet. Budrunden starter ved første bud og avsluttes 24 timer senere. Bud registrert de siste 15 minuttene forlenger fristen automatisk med 15 minutter.
        </p>

        <h3 className="font-medium mb-2">Betaling og gebyrer</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          OmTur tar et gebyr per annonse. Gebyret betales av selger og dekker publisering, KI-analyse og administrasjon av budrunden. Gjeldende priser fremgår av nettsiden. Betaling mellom kjøper og selger avtales direkte mellom partene. OmTur er ikke ansvarlig for gjennomføring av betalingen.
        </p>

        <h3 className="font-medium mb-2">Angrerett</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Ved salg mellom privatpersoner gjelder ikke angrerettloven. Kjøper kan ikke angre et bud eller et kjøp uten selgers samtykke.
        </p>

        <h3 className="font-medium mb-2">Ansvarsbegrensning</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          OmTur er en formidlingstjeneste og er ikke part i avtalen mellom kjøper og selger. OmTur er ikke ansvarlig for tap som følge av mangler ved varen, manglende levering, betaling eller andre forhold mellom kjøper og selger. Kjøper og selger oppfordres til å møtes på et trygt sted ved overlevering av varen.
        </p>
      </section>

      <div className="border-t border-gray-100 mb-10"></div>

      <section className="mb-10">
        <h2 className="text-xl font-medium mb-4">Personvernerklæring</h2>

        <h3 className="font-medium mb-2">Behandlingsansvarlig</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          OmTur ved innehaver er behandlingsansvarlig for personopplysninger som samles inn via omtur.no. Kontakt: hei@omtur.no
        </p>

        <h3 className="font-medium mb-2">Hvilke opplysninger samler vi inn?</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Vi samler inn navn og e-postadresse når du legger inn bud på en annonse. Vi samler også inn bilder som lastes opp av selger i forbindelse med annonsering.
        </p>

        <h3 className="font-medium mb-2">Hvorfor samler vi inn disse opplysningene?</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Navn og e-postadresse brukes til å sende deg varsler om budrunden du deltar i, inkludert bekreftelse på bud og varsel dersom du blir overbydd. Opplysningene brukes ikke til markedsføring eller deles med tredjeparter utover det som er nødvendig for å gjennomføre transaksjonen.
        </p>

        <h3 className="font-medium mb-2">Lagring og sletting</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Personopplysninger lagres så lenge det er nødvendig for å gjennomføre transaksjonen. Du kan når som helst be om innsyn i eller sletting av dine opplysninger ved å kontakte oss på hei@omtur.no.
        </p>

        <h3 className="font-medium mb-2">Dine rettigheter</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          I henhold til GDPR har du rett til innsyn, retting og sletting av dine personopplysninger. Du har også rett til å klage til Datatilsynet dersom du mener vi behandler dine opplysninger i strid med personvernregelverket.
        </p>

        <h3 className="font-medium mb-2">Informasjonskapsler</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          OmTur bruker kun teknisk nødvendige informasjonskapsler for at tjenesten skal fungere. Vi bruker ikke informasjonskapsler til sporing eller markedsføring.
        </p>
      </section>

      <div className="bg-emerald-50 rounded-xl p-5">
        <p className="text-sm text-emerald-700">
          Spørsmål om vilkår eller personvern? Ta kontakt på{' '}
          <a href="mailto:hei@omtur.no" className="underline">hei@omtur.no</a>
        </p>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-100 text-center">
        <a href="/annonser" className="text-xs text-gray-400 hover:text-gray-600">Tilbake til annonser</a>
      </div>
    </main>
  )
}