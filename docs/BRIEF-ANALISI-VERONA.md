# Artlypet — Brief Completo & Analisi Verona (B2B Reseller)

**Data documento:** 19 aprile 2026
**Scopo:** fornire a un analista / consulente esterno tutte le informazioni necessarie per identificare, mappare e profilare le attività commerciali di Verona e provincia che possono rivendere il servizio Artlypet in modalità white-label (€200/mese).
**Destinatario:** analista incaricato della ricerca sul campo su Verona.

---

## 1. Executive Summary

**Artlypet** è una piattaforma SaaS che trasforma, in meno di 60 secondi, una foto di un animale domestico in un ritratto artistico di qualità museale grazie all'intelligenza artificiale (Google Gemini 3.1). I clienti possono scaricare l'immagine in HD o ordinare una stampa su tela spedita in tutta la UE.

Il modello è **freemium per i consumatori** (B2C) e **white-label in abbonamento per le attività** (B2B). L'obiettivo di questa analisi è **identificare le attività veronesi che possono adottare Artlypet come servizio aggiuntivo, brandizzato con il loro marchio, generando un nuovo flusso di ricavi senza magazzino, senza stampa in proprio e senza competenze tecniche**.

- Costo per il partner B2B: **€200/mese** (flat, tutto incluso, nessun costo per generazione)
- Prezzo consigliato al cliente finale: **€15–€30 a ritratto**
- Break-even partner: **10 ritratti venduti/mese** (€200 di ricavo lordo)
- Margine del partner sopra il break-even: **100%**

---

## 2. Cos'è Artlypet (prodotto)

### 2.1 Descrizione in una riga
"Ritratti artistici AI per animali domestici, pronti in 60 secondi, stampabili su tela."

### 2.2 Come funziona per l'utente finale (flusso base)
1. L'utente carica una foto del proprio animale (cane, gatto, cavallo, coniglio, ecc.).
2. Sceglie tra **12 stili artistici**: Rinascimentale / Reale, Pittura a olio, Acquarello, Pop Art, Anime, Stile Militare, Vittoriano, e altri.
3. L'AI genera il ritratto in **<60 secondi**, risoluzione fino a **2K**.
4. L'utente può:
   - Scaricare il file digitale in HD
   - Ordinare una stampa su tela spedita a casa (formato standard, qualità museale)
   - Condividere sui social (Instagram, TikTok, ecc.)

### 2.3 Modalità speciali già previste
- **Mix Mode**: pet + proprietario insieme nello stesso ritratto
- **Stili a tema emotivo** (pianificati): memorial ("arcobaleno" per animali defunti), celebrazione adozione, Natale, San Valentino

### 2.4 Lingue supportate
Interfaccia tradotta in **5 lingue**: italiano, inglese, tedesco, francese, spagnolo.
Rilevante per Verona: **italiano nativo** + **tedesco** (turisti austriaci/tedeschi del Lago di Garda) + **inglese** (turismo internazionale).

---

## 3. Modello di Business

### 3.1 Canale B2C (diretto al consumatore — già attivo)

| Prodotto | Prezzo | Note |
|---|---|---|
| Registrazione | gratis | 300 crediti in regalo (≈ 3 ritratti gratuiti con watermark) |
| Sblocco HD per singolo ritratto | €4,90 | senza watermark, alta risoluzione |
| Pacchetto Premium (one-time) | €15 | 1.500 crediti + HD automatico + sconto stampe |
| Stampa su tela (utente Free) | €79,90 | spedizione UE inclusa |
| Stampa su tela (utente Premium) | €59,90 | prezzo scontato |

Generazione singola = 100 crediti. Generazione Mix (pet + persona) = 150 crediti.

### 3.2 Canale B2B (white-label — oggetto dell'analisi)

**Prezzo:** €200/mese flat, nessun contratto a lungo termine, **14 giorni di prova gratuita**.

**Cosa riceve il partner:**
- Portale web brandizzato (logo, colori, eventualmente dominio proprio)
- Generazioni **illimitate** (nessun costo variabile)
- Tutti i 12 stili artistici
- Download HD completi
- Accesso a **API REST** per integrare il servizio nel sito/app/e-commerce esistenti del partner
- Dashboard di analytics (generazioni, ricavi, engagement)
- Fulfillment stampe scontato (spedizione diretta al cliente finale del partner — niente logistica per il partner)
- Supporto prioritario via email/chat, account manager dedicato
- Setup completo in **48 ore**
- Nuovi stili e funzionalità incluse senza costi aggiuntivi

**Il partner stabilisce il proprio prezzo di vendita.** Il margine sopra i €200/mese è interamente suo.

**Esempio di economics per il partner:**
- Vende 50 ritratti/mese a €20 = €1.000 di ricavo
- Meno abbonamento Artlypet = €200
- **Profitto netto = €800/mese** (€9.600/anno)

Break-even a 10 ritratti/mese.

---

## 4. Caratteristiche Tecniche (per contesto, non tecniche profonde)

- **AI provider:** Google Gemini 3.1 Flash Image Preview (API ufficiale, residenza dati UE compatibile)
- **Backend & dati:** Supabase (EU-hosted), PostgreSQL, Row Level Security
- **Pagamenti:** Stripe Checkout (metodi UE: carta, Apple Pay, Google Pay, SEPA)
- **Privacy & GDPR:** pienamente compliant — cookie banner, privacy policy, diritto all'oblio (cancellazione account), log di audit, foto clienti cancellate dopo 30 giorni di default
- **Compatibilità:** web-based, funziona su qualsiasi smartphone/tablet/PC con browser moderno. Niente app da installare per il cliente finale.

---

## 5. Mercato di Riferimento (cornice utile all'analisi)

### 5.1 Il mercato pet in Italia (dati pubblici)
- Spesa pet care Italia: ~€2,7 miliardi/anno, in crescita 4–6% annuo
- Circa **65 milioni di animali domestici** in Italia (cani, gatti, piccoli mammiferi, uccelli, pesci)
- Segmento "personalizzazione e gift per pet" tra i più in crescita
- Il cliente tipo (pet parent) spende mediamente €1.200–1.500/anno per il proprio animale

### 5.2 Concorrenza diretta di Artlypet (per contesto)
- **Crown & Paw** (USA): $10M+ fatturato, artisti manuali, 50–150 $/ritratto, consegna 3–5 giorni
- **Pawtist**: AI, pochi stili, no freemium
- **Vantaggio Artlypet**: istantaneo, 12 stili, white-label B2B aperto, base prezzo più bassa, UE-based

### 5.3 Perché il modello B2B funziona
Per le attività pet, i ritratti AI sono un **upsell perfetto**:
- Digitale = **zero magazzino**
- Stampe spedite da Artlypet = **zero logistica**
- Nessuna competenza tecnica richiesta
- **Alta marginalità** (fino al 90%+ sul venduto sopra l'abbonamento)
- **Effetto emotivo forte** → il cliente finale condivide sui social → marketing gratuito per il negozio

---

## 6. Target per l'Analisi su Verona

### 6.1 Categorie di attività prioritarie (da mappare)

**Priorità ALTA — conversione più probabile**
1. **Negozi di articoli per animali** indipendenti (non catene tipo Arcaplanet/Maxi Zoo, che hanno procurement centralizzato)
   - Negozi di quartiere
   - Toelettature con vendita accessori
2. **Cliniche e studi veterinari** con clientela affezionata (soprattutto quelli con componente "fidelizzazione" e newsletter attiva)
3. **Toelettature** di fascia medio-alta (il ritratto come "regalo finale" a ogni toelettatura o come gadget Natale/compleanno)
4. **Pet photographer / studi fotografici** specializzati in animali (complementare al loro lavoro, non competitor diretto perché è AI stilizzata)

**Priorità MEDIA**
5. **E-commerce pet italiani** di piccola/media dimensione (upsell al checkout)
6. **Dog sitter / pet sitter / pensioni per animali** con clientela fidelizzata
7. **Educatori cinofili** con community attiva sui social
8. **Allevatori** selezionati (ritratto come gift al nuovo proprietario del cucciolo)

**Priorità BONUS — opportunità non ovvie**
9. **Agriturismi e B&B pet-friendly** del veronese (Lago di Garda, Valpolicella) — ritratto come souvenir del soggiorno
10. **Wedding planner** specializzati in matrimoni pet-friendly (Verona = città del turismo matrimoniale)
11. **Cimiteri e crematori per animali** (memorial portraits — settore molto emotivo)
12. **Assicurazioni pet** locali (welcome gift al nuovo cliente)
13. **Pet influencer veronesi** con community locale attiva

### 6.2 Criteri di qualificazione di un buon partner potenziale

Per ciascuna attività mappata, raccogliere:

1. **Nome attività, indirizzo, zona di Verona** (centro, periferia, provincia)
2. **Titolare / decision maker** (nome e contatto diretto se possibile)
3. **Presenza online:** sito web, Instagram, Facebook, TripAdvisor, Google Business
4. **Numero di follower / recensioni** (proxy del volume clienti)
5. **Segnali di apertura all'innovazione:** usa già gadget personalizzati? Ha un e-commerce? Vende oltre il prodotto core?
6. **Fascia di prezzo percepita** (low / medium / premium) — i partner premium monetizzano meglio l'upsell
7. **Stima clienti/settimana** (se visibile o stimabile)
8. **Lingua di comunicazione preferita** (italiano/tedesco per area Garda)
9. **Segnali negativi:** catena nazionale, franchising rigido, chiusura imminente, scarsa attività social negli ultimi 6 mesi

### 6.3 Zone geografiche di Verona da coprire
- **Verona città** — centro storico, Borgo Trento, Borgo Venezia, Porta Nuova, Golosine, San Michele
- **Hinterland nord** — San Martino Buon Albergo, Bussolengo, Sommacampagna
- **Lago di Garda veronese** — Peschiera, Lazise, Bardolino, Garda, Malcesine (target turistico alto, multilingua)
- **Valpolicella** — Negrar, San Pietro in Cariano, Sant'Ambrogio (fascia premium)
- **Est veronese** — Soave, San Bonifacio (mercato locale più tradizionale)

### 6.4 Dimensione attesa del mercato a Verona
Stime preliminari da verificare sul campo:
- ~80–120 negozi pet indipendenti in provincia
- ~60–100 cliniche veterinarie
- ~40–70 toelettature
- ~15–25 pensioni/dog sitter professionali
- **Totale attività potenzialmente qualificabili: 200–300**
- Conversion realistica a partner pagante: **2–5%** → 4–15 partner attivi nella provincia
- Ricavo ricorrente teorico: **€800–3.000/mese solo da Verona**

---

## 7. Proposta di Valore da Presentare al Partner (elevator pitch)

> "Offriamo ai tuoi clienti un ritratto artistico del loro animale, generato in 60 secondi con intelligenza artificiale, con il tuo logo e il tuo brand. Tu vendi a €20–€30 a ritratto, noi ci occupiamo di tutto — tecnologia, stampe, spedizioni. Paghi €200/mese fissi. Al decimo ritratto venduto sei già in pari, tutto il resto è margine pulito. Nessun magazzino, nessun contratto, 14 giorni di prova gratis, setup in 48 ore."

### Obiezioni attese e risposte rapide
- *"I miei clienti non comprerebbero mai un'immagine AI"* → mostriamo i 12 stili, la qualità della stampa su tela, e i case study UE esistenti. È un gift, non un prodotto tech.
- *"€200 sono troppi"* → break-even a 10 ritratti/mese = circa 2–3 vendite a settimana. A Natale e San Valentino se ne vendono il triplo.
- *"Non so come integrarlo"* → serve solo un link dal sito o un QR code in negozio. Zero tecnologia dalla parte del partner.
- *"La privacy delle foto?"* → server UE, GDPR, foto cancellate automaticamente a 30 giorni, nessun uso per training AI.
- *"E se l'AI sbaglia il ritratto?"* → ogni generazione può essere rifatta, il cliente vede il risultato prima di pagare la stampa.

---

## 8. Cosa Chiediamo all'Analista (Deliverable)

1. **Lista Excel/CSV** delle attività veronesi mappate con colonne: nome, categoria, zona, contatti, presenza online, dimensione stimata, lingua, priorità (A/B/C), note qualitative.
2. **Top 20 "hot leads"** con il ragionamento per cui sono i più promettenti.
3. **Mappa visiva** (Google My Maps o equivalente) dei cluster geografici.
4. **Analisi della concorrenza locale**: esistono già servizi simili venduti a Verona? Da chi? A che prezzo?
5. **Segnali di stagionalità** rilevanti per Verona (turismo Garda, fiere tipo Fieracavalli, Natale, San Valentino, eventi locali).
6. **Raccomandazioni di approccio commerciale**: quali categorie attaccare per prime, quali canali usare (visita fisica, email, LinkedIn, Instagram DM, passaparola tramite veterinari).
7. **Stima conservativa dei ricavi** raggiungibili su Verona nei primi 6 e 12 mesi.
8. **Rischi specifici del territorio** veronese (es. concorrenza locale, normative regionali, attitudine del mercato).

---

## 9. Informazioni Logistiche

- **Sito in produzione:** artlypet.com (in fase di lancio pubblico)
- **Pagina B2B:** artlypet.com/business (contiene calcolatore ricavi, FAQ, form di contatto)
- **Email commerciale B2B:** business@artlypet.com
- **Responsabile progetto:** Edoardo Montagna — admin@edomontagna.com

### Materiale a disposizione dell'analista
- Pagine pubbliche del sito (landing, pricing, business plan)
- Gallery con esempi di ritratti generati nei 12 stili
- Documenti interni: `docs/VISION.md`, `docs/GROWTH-STRATEGY.md`, `docs/REQUIREMENTS.md` (dentro il repository del progetto, disponibili su richiesta)

---

## 10. Note Finali

- **Artlypet è pronto tecnicamente** al 95%: infrastruttura, pagamenti, multilingua, GDPR, stampe — tutto operativo. Ultimi tasselli: configurazione chiavi Stripe in produzione, wiring analytics, watermark server-side.
- **L'analisi su Verona è la prima pietra della strategia go-to-market B2B**, da replicare poi su Milano, Roma, Torino e mercati DACH (area tedesca) data la copertura linguistica.
- Verona è stata scelta come **mercato pilota** per tre ragioni: (a) territorio gestibile con relazione diretta, (b) mix città + turismo Garda (multilingua naturale), (c) presenza di fiere pet/equestri di rilievo nazionale.

---

*Documento di brief pensato per essere letto in ~15 minuti e per contenere tutto il necessario a un analista esterno per avviare il lavoro sul campo senza ulteriori brief. Versione 1.0 — aggiornare se il prezzo B2B, gli stili o il modello cambiano.*
