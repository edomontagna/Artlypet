# ArtlyPet - Report MVP & Piano di Sviluppo Completo

> Ultimo aggiornamento: 12 Marzo 2026

---

## Stack Tecnologico Confermato

| Layer | Tecnologia | Ruolo |
|---|---|---|
| Frontend | **Next.js 15** (App Router) | SSR/SSG, routing, API routes |
| Hosting | **Vercel** | Deploy, edge functions, CDN |
| Database | **Supabase** (PostgreSQL) | DB, Auth, Storage, Realtime |
| Pagamenti | **Stripe** | Checkout, webhook, coupon, ricorrenti |
| AI Model | **Nano Banana 2** | Generazione ritratti artistici |
| Email Business | **Zoho Mail** | Email aziendale (es. info@artlypet.com) |
| Email Transazionale/Marketing | **Brevo** (ex Sendinblue) | Welcome, conferme, newsletter, automazioni |
| Legal/GDPR | **Iubenda** | Privacy Policy, Cookie Policy, Terms |
| Analytics | GA4 + Meta Pixel + TikTok Pixel | Tracking + retargeting ads |

---

## Stato Attuale del Progetto

### Cosa c'e' e funziona
| Funzionalita' | Stato | Note |
|---|---|---|
| Landing Page completa | FATTO | Hero, Modes, Styles, How it Works, Pricing, Footer |
| 6 Stili Artistici | FATTO | Watercolor, Oil, Renaissance, Pop Art, Art Nouveau, Impressionist |
| 3 Modalita' | FATTO | Animali, Umani, Mix |
| Dark/Light mode | FATTO | next-themes configurato |
| Design system | FATTO | Tailwind + shadcn/ui, palette sage green |
| Navbar responsive | FATTO | Logo, nav, auth, credits |
| Wizard Creazione 4 step | FATTO (solo UI) | Modo > Upload > Stile > Generazione |
| Pagina Auth | FIXATO | Bug sintassi corretto |
| Stripe Checkout base | FATTO | API route presente |
| Animazioni Framer Motion | FATTO | Su tutti i componenti |
| Favicon | AGGIUNTO | SVG brand |
| robots.txt | AGGIUNTO | Base SEO |

### Cosa MANCA (allineato alle tue specifiche)
| Funzionalita' | Priorita' | Note |
|---|---|---|
| Supabase (DB + Auth + Storage) | CRITICA | Sostituisce tutto il localStorage |
| Integrazione Nano Banana 2 | CRITICA | AI generation backend |
| Upload immagini reale | CRITICA | Drag & drop + Supabase Storage |
| Sistema crediti server-side | CRITICA | 3 free/mese + pacchetti a pagamento |
| Risoluzione export (1080p free / 4K paid) | CRITICA | Chiave di monetizzazione |
| Preview con watermark (come Fable) | ALTA | Conversione free > paid |
| Pagina risultato + download | ALTA | Reveal animato + download HD/4K |
| Pricing completo (3 tier) | ALTA | Ispirato a AISuitUp adattato |
| Sistema Codici Sconto | ALTA | Stripe Coupons API |
| Sistema Referral Link | ALTA | Invita amico > crediti bonus |
| Stampe fisiche (upsell) | ALTA | Revenue stream premium |
| Brevo integrazione | ALTA | Email transazionali + marketing |
| Zoho Mail setup | MEDIA | Email aziendale |
| Iubenda integrazione | MEDIA | Widget legali embedded |
| Dashboard utente (galleria) | MEDIA | Storico portraits + download |
| Mobile hamburger menu | MEDIA | Manca nel navbar |
| Stili aggiuntivi | MEDIA | Da ricerca di mercato |
| SEO completo | MEDIA | Sitemap, OG, structured data |
| Error handling + loading states | MEDIA | UX polish |
| Multi-lingua (EN + IT) | BASSA | Per espansione worldwide |

---

## Analisi Competitor

### Fable (fable.surrealium.world) - Punti Chiave
- **Trustpilot 4.7/5** su 232 recensioni
- **Preview gratis con watermark** poi paghi per HD senza watermark
- **Stampe fisiche** da $89 a $400+ (framing incluso) = revenue stream enorme
- **Generazione istantanea** (secondi, non minuti)
- **Leva emotiva**: memoriali per animali scomparsi = connessione profonda
- **Multi-canale ads**: Facebook, TikTok, Pinterest, Google Ads
- **Insight strategico**: non vendono "AI" — vendono "trasforma il tuo animale in arte da appendere"

### AISuitUp (aisuitup.com) - Pricing Model
- **3 tier**: Basic ($27/50 foto), Professional ($37/100 foto), Executive ($57/150 foto)
- **Differenziatore**: risoluzione (768px > 1024px HD > 2048px Ultra HD)
- **No abbonamento**: pagamento one-time per batch
- **Anchoring**: prezzo "barrato" sempre visibile (es. ~~$59~~ $27)
- **Affiliati**: 25% commissione per referral
- **Free tools**: come lead generation (funnel top)

---

## Modello di Business Proposto per ArtlyPet

### Pricing Structure (3 Tier)

| | FREE | CREATOR | PRO |
|---|---|---|---|
| **Prezzo** | $0 | $19 one-time | $39 one-time |
| **Crediti** | 3/mese | 15 crediti | 40 crediti |
| **Risoluzione max** | 1080 x 1527 | 1080 x 1527 | **4K (3840 x 5427)** |
| **Watermark** | Si (preview) | No | No |
| **Modalita' Mix** | No | Si | Si |
| **Stampa disponibile** | No | Si (a pagamento extra) | Si (1 stampa inclusa) |
| **Priorita' generazione** | Bassa | Media | Alta |
| **Stili disponibili** | 3 base | Tutti | Tutti + Esclusivi |
| **Supporto** | Community | Email | Email prioritario |

### Stampe Fisiche (Upsell)
| Formato | Prezzo suggerito |
|---|---|
| 20x30 cm (stampa base) | EUR 29 |
| 30x40 cm (poster premium) | EUR 49 |
| 40x60 cm (canvas gallery) | EUR 89 |
| 50x70 cm (canvas XL + cornice) | EUR 149 |

Nota: per le stampe, servira' un partner di print-on-demand (es. Printful, Gelato, Prodigi) che stampa e spedisce worldwide. Integrazione API diretta.

### Sistema Codici Sconto
- Stripe Coupons API per codici % o importo fisso
- Codici per lancio (es. LAUNCH20 = -20%)
- Codici per influencer (tracciabili per ROI)
- Codici per festitivita' (Natale, San Valentino = regalo perfetto)

### Sistema Referral
- Ogni utente riceve un link univoco: artlypet.com/?ref=CODICE
- Chi si iscrive tramite ref: +1 credito bonus
- Chi ha invitato: +1 credito per ogni iscrizione che genera almeno 1 portrait
- Dashboard referral nella pagina profilo
- Scalabile: se il referral compra un pacchetto, bonus extra

---

## Piano di Sviluppo Step-by-Step

### FASE 1: Setup Infrastruttura (TU)

#### 1.1 Supabase
- [ ] Crea account su https://supabase.com
- [ ] Crea progetto (regione: **EU West - Frankfurt** per GDPR)
- [ ] Copia nel .env: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
- [ ] Lo schema DB lo creo io con migration SQL

#### 1.2 Stripe
- [ ] Crea account su https://stripe.com
- [ ] Attiva modalita' test
- [ ] Copia nel .env: STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY
- [ ] Crea 2 prodotti in Stripe Dashboard:
  - "Creator Pack - 15 Crediti" a EUR 19 (one-time)
  - "Pro Pack - 40 Crediti + 4K" a EUR 39 (one-time)
- [ ] Configura webhook: https://tuodominio.com/api/webhooks/stripe
- [ ] Eventi: checkout.session.completed, customer.subscription.deleted
- [ ] Copia STRIPE_WEBHOOK_SECRET nel .env

#### 1.3 AI - Nano Banana 2
- [ ] Procurati accesso API per Nano Banana 2
- [ ] Copia API key/endpoint nel .env
- [ ] Conferma il formato input/output supportato (io adatto l'integrazione)

#### 1.4 Vercel
- [ ] Account su https://vercel.com
- [ ] Collega repo GitHub
- [ ] Aggiungi TUTTE le env variables
- [ ] Deploy automatico su push

#### 1.5 Dominio
- [ ] Acquista dominio (artlypet.com o simile)
- [ ] Configura DNS su Vercel
- [ ] HTTPS automatico

#### 1.6 Zoho Mail
- [ ] Account su https://zoho.com/mail
- [ ] Configura dominio personalizzato (info@artlypet.com, support@artlypet.com)
- [ ] Configura record DNS: MX, SPF, DKIM, DMARC

#### 1.7 Brevo
- [ ] Account su https://brevo.com (gratis fino a 300 email/giorno)
- [ ] Verifica dominio mittente
- [ ] Copia API key nel .env
- [ ] Template email: io li creo, tu li approvi

#### 1.8 Iubenda
- [ ] Account su https://iubenda.com
- [ ] Genera: Privacy Policy, Cookie Policy, Terms and Conditions
- [ ] Importante: includi clausole per AI-generated content e data processing
- [ ] Copia gli embed code / URL dei documenti (io li integro nel footer)

#### 1.9 Print-on-Demand Partner
- [ ] Crea account su uno di questi (consiglio **Gelato** per copertura worldwide):
  - Gelato (gelato.com) - 130+ paesi, API robusta
  - Printful (printful.com) - popolare, buona qualita'
  - Prodigi (prodigi.com) - flessibile
- [ ] Copia API key nel .env

---

### FASE 2: Database, Auth & Core Backend (IO)

**Step 2.1 - Schema Database Supabase**
```
users
  - id (uuid, PK)
  - email (unique)
  - name
  - avatar_url
  - credits (int, default 3)
  - subscription (enum: free/creator/pro)
  - resolution_max (enum: hd/4k)
  - referral_code (unique, auto-generated)
  - referred_by (FK -> users.id)
  - referral_credits_earned (int)
  - credits_reset_at (timestamp) -- per il reset mensile dei free
  - created_at

portraits
  - id (uuid, PK)
  - user_id (FK -> users.id)
  - mode (enum: pets/humans/mix)
  - style (text)
  - input_image_urls (text[]) -- 1 o 2 URL
  - output_image_url (text)
  - output_image_4k_url (text, nullable)
  - resolution (enum: hd/4k)
  - status (enum: pending/generating/completed/failed)
  - is_watermarked (bool)
  - created_at

transactions
  - id (uuid, PK)
  - user_id (FK -> users.id)
  - stripe_session_id (text)
  - type (enum: credits/print/subscription)
  - amount_eur (decimal)
  - credits_added (int)
  - coupon_code (text, nullable)
  - created_at

print_orders
  - id (uuid, PK)
  - user_id (FK -> users.id)
  - portrait_id (FK -> portraits.id)
  - provider_order_id (text) -- Gelato/Printful order ID
  - size (text)
  - price_eur (decimal)
  - shipping_address (jsonb)
  - status (enum: pending/processing/shipped/delivered)
  - tracking_url (text, nullable)
  - created_at

referrals
  - id (uuid, PK)
  - referrer_id (FK -> users.id)
  - referred_id (FK -> users.id)
  - status (enum: signed_up/converted) -- converted = ha generato almeno 1 portrait
  - credits_awarded (bool)
  - created_at

discount_codes
  - id (uuid, PK)
  - code (unique, text)
  - type (enum: percentage/fixed)
  - value (decimal)
  - max_uses (int, nullable)
  - used_count (int, default 0)
  - valid_from (timestamp)
  - valid_until (timestamp)
  - created_at
```

**Step 2.2 - Auth con Supabase**
- Supabase Auth (email/password + magic link)
- Google OAuth (opzionale, aumenta conversioni ~30%)
- Middleware protezione route /create, /dashboard
- Gestione sessione server-side (no piu' localStorage)

**Step 2.3 - Sistema Crediti**
- 3 crediti gratis/mese per FREE (reset automatico con cron)
- Crediti acquistati non scadono
- Decremento atomico con Supabase RPC (no race conditions)
- Check risoluzione: se user = free/creator, output max 1080x1527
- Se user = pro, output 4K disponibile

---

### FASE 3: Generazione AI (IO)

**Step 3.1 - Upload Immagini**
- Drag & drop + click con anteprima
- Validazione: max 10MB, JPG/PNG/WebP
- Compressione client-side (browser-image-compression)
- Upload su Supabase Storage bucket "uploads"
- Per modo Mix: upload 2 foto separate (umano + animale)

**Step 3.2 - API Generazione con Nano Banana 2**
- POST /api/generate
- Input: image_url(s), style, mode, resolution
- Prompt engineering per ogni stile (6 stili base + eventuali extra)
- Generazione in 2 risoluzioni: HD (sempre) + 4K (se user Pro)
- Applicazione watermark su preview per utenti Free
- Salvataggio output su Supabase Storage bucket "portraits"

**Step 3.3 - Pagina Risultato**
- Animazione reveal "unveiling" del ritratto
- Preview con watermark (Free) o pulita (Creator/Pro)
- Bottoni: Download HD, Download 4K (se Pro), Ordina Stampa, Genera un altro
- Share su social con OG image dinamica
- Salvataggio automatico in galleria utente

**Step 3.4 - Stili Extra (da ricerca di mercato)**
Stili aggiuntivi consigliati per differenziarsi:
- **Baroque** (come Fable, molto richiesto)
- **Japanese Ukiyo-e** (unico, virale su social)
- **Pixel Art** (trend gaming/nerd)
- **Cartoon/Disney-style** (mass market appeal)
- **Cyberpunk/Neon** (trend 2026)
- **Minimalist Line Art** (elegante, per stampe moderne)

---

### FASE 4: Pagamenti & Monetizzazione (IO)

**Step 4.1 - Stripe Completo**
- 2 prodotti: Creator Pack (EUR 19) e Pro Pack (EUR 39)
- Stripe Checkout con redirect
- Webhook -> aggiorna crediti + subscription nel DB
- Gestione edge cases (doppio pagamento, timeout, refund)
- Multi-valuta automatica (Stripe gestisce conversione)

**Step 4.2 - Codici Sconto**
- CRUD admin per codici (tabella discount_codes)
- Validazione codice in checkout
- Stripe Coupons API per applicare sconto alla sessione
- Tracking utilizzo per ROI

**Step 4.3 - Sistema Referral**
- Generazione codice univoco per ogni utente
- URL: artlypet.com/?ref=ABC123
- Tracking referral con cookie 30 giorni
- Credito bonus al referrer quando il referred genera il primo portrait
- Dashboard referral: quanti invitati, quanti convertiti, crediti guadagnati

**Step 4.4 - Stampe Fisiche**
- Integrazione API Gelato/Printful
- Dopo generazione: bottone "Ordina Stampa"
- Scelta formato e dimensione
- Checkout Stripe per la stampa
- Tracking ordine + email aggiornamenti via Brevo
- Spedizione worldwide

---

### FASE 5: Email & Comunicazione (IO + TU)

**Step 5.1 - Zoho Mail (TU)**
- [ ] info@artlypet.com (contatto generale)
- [ ] support@artlypet.com (assistenza)
- [ ] noreply@artlypet.com (per email transazionali via Brevo)

**Step 5.2 - Brevo Transazionali (IO)**
- Email benvenuto con 3 crediti free
- Conferma acquisto pacchetto
- Portrait pronto (con preview thumbnail)
- Conferma ordine stampa + tracking
- Referral: "il tuo amico si e' iscritto!"
- Crediti in esaurimento (retention)

**Step 5.3 - Brevo Marketing (TU + IO)**
- Newsletter settimanale (nuovi stili, ispirazioni)
- Automazione: utente inattivo da 7gg -> email "torna a creare"
- Automazione: crediti finiti -> email con offerta pacchetto
- Campagne stagionali (Natale, San Valentino, Festa della Mamma)

---

### FASE 6: Legal & Compliance (TU + IO)

**Step 6.1 - Iubenda (TU)**
- [ ] Privacy Policy (GDPR + CCPA per worldwide)
- [ ] Cookie Policy
- [ ] Terms and Conditions
- [ ] Condizioni di Vendita (obbligatorio se vendi in EU)
- [ ] Nota: menziona uso di AI per generazione, data retention, diritti sulle immagini

**Step 6.2 - Integrazione (IO)**
- Embed Iubenda widget nel footer
- Cookie banner con consenso granulare
- Link legali in footer e checkout
- Checkbox consenso in registrazione

---

### FASE 7: SEO, Analytics & Polish (IO)

- Open Graph images dinamiche per ogni ritratto
- Sitemap.xml automatico
- Structured data JSON-LD (Product, Organization)
- Meta ottimizzate per ogni pagina
- GA4 + Meta Pixel + TikTok Pixel (per retargeting ads)
- Lighthouse score > 90
- Error boundaries + loading skeletons
- Rate limiting API
- Input validation con Zod
- Mobile hamburger menu

---

## Architettura MVP Finale

```
Browser (Next.js 15)
    |
    v
Vercel (Hosting + Edge + API Routes)
    |
    +---> Supabase Auth (login, signup, OAuth)
    +---> Supabase PostgreSQL (users, portraits, transactions, referrals)
    +---> Supabase Storage (uploads + generated images)
    +---> Nano Banana 2 API (generazione AI ritratti)
    +---> Stripe (pagamenti pacchetti + stampe + coupon)
    +---> Brevo API (email transazionali + marketing)
    +---> Gelato/Printful API (stampe fisiche worldwide)
    +---> Iubenda (widget legali)
    +---> Zoho Mail (email aziendale)
```

---

## Stima Costi Mensili

| Servizio | Piano | Costo/mese |
|---|---|---|
| Vercel | Hobby (free) o Pro ($20) | $0-20 |
| Supabase | Free tier (500MB DB, 1GB storage) | $0 |
| Stripe | 1.4% + EUR 0.25/transazione (EU) | Variabile |
| Nano Banana 2 | Pay-per-use | Da verificare |
| Brevo | Free (300 email/giorno) | $0 |
| Zoho Mail | Free (1 utente) o Lite (EUR 1/mese) | EUR 0-1 |
| Iubenda | Starter ~EUR 8/mese | ~EUR 8 |
| Gelato/Printful | Solo margine sulle stampe | $0 fisso |
| Dominio | Annuale | ~EUR 12/anno |
| **TOTALE fisso stimato** | | **EUR 10-50/mese** |

Le stampe fisiche hanno margine integrato: tu paghi il costo di produzione + spedizione al partner, e il markup e' tuo profitto.

---

## Differenze rispetto al piano precedente

| Cosa | Piano Vecchio | Piano Aggiornato |
|---|---|---|
| Email | Resend | **Zoho Mail + Brevo** |
| AI | Google Gemini | **Nano Banana 2** |
| Codici sconto | Non previsto | **Stripe Coupons + DB** |
| Referral | Non previsto | **Sistema completo con tracking** |
| Risoluzione | Unica | **1080p (free) / 4K (paid)** |
| Watermark | Non previsto | **Preview watermark per free** |
| Stampe fisiche | Non previsto | **Gelato/Printful integration** |
| Pricing | 2 tier (Free + Premium 15 EUR) | **3 tier (Free + Creator 19 EUR + Pro 39 EUR)** |
| Legal | Generico | **Iubenda specifico** |
| Target | Generico | **Pet owners che spendono, worldwide** |

---

## Prossimi Passi Immediati

### TU (in ordine):
1. Crea account Supabase (EU West) e manda le chiavi
2. Crea account Stripe (test mode) e manda le chiavi
3. Conferma accesso API Nano Banana 2 e mandami endpoint + key
4. Crea account Brevo e manda API key
5. Acquista dominio
6. Setup Zoho Mail sul dominio
7. Genera documenti legali su Iubenda
8. Scegli partner stampe (consiglio Gelato)

### IO (appena ho le chiavi):
1. Supabase: schema DB + Auth + Storage
2. Nano Banana 2: integrazione generazione AI
3. Upload immagini reale
4. Sistema crediti + risoluzione tier
5. Watermark su preview free
6. Stripe completo + codici sconto
7. Sistema referral
8. Brevo email transazionali
9. Stampe fisiche integration
10. Polish (SEO, error handling, animations WOW)
11. Deploy su Vercel
