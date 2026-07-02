# SEARCH CONSOLE — vlasnički koraci

Datum: 2026-07-02
Scope: KIT-F5 Growth/SEO dokumentacija.

OpenClaw ne može završiti vlasničku Google verifikaciju umjesto tebe bez pristupa domeni/Search Console računu, ali tehnički redoslijed je ovaj.

## 1. Dodaj property

Preporuka: Domain property

- Domain: `petpark.hr`
- Alternativa ako domain property nije praktičan: URL-prefix property `https://petpark.hr/`

## 2. Verifikacija

Najčišće: DNS TXT record kod DNS providera.

Google će dati TXT vrijednost oblika:

```txt
google-site-verification=...
```

Dodati TXT na root domenu `petpark.hr` i čekati propagaciju.

## 3. Submit sitemap

Nakon verifikacije submitati:

```txt
https://petpark.hr/sitemap.xml
```

Trenutni build generira sitemap i iz zadnjeg build loga ima 48 URL-ova. Forum/lost/adoption rescue feedovi su 0 gdje nema stvarne schema/data podloge.

## 4. Provjere nakon submitanja

U Search Console:

- Pages / Indexing: nema neočekivanog `noindex`
- Sitemaps: `Success`
- Experience/Core Web Vitals: pratiti mobile
- Removals: ne koristiti osim ako treba hitno maknuti pogrešan URL

## 5. Launch napomene

- Ne submitati staging/preview domene.
- Ako se aktivira `www.petpark.hr`, potvrditi canonical prema glavnoj domeni.
- Ako se doda više jezika kasnije, ponovno provjeriti hreflang coverage.
- Forum/shop/breeder disabled rute ne smiju se gurati kao stvarni sadržaj dok schema nije aktivna.
