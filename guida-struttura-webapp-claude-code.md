# Strutturare una Web App con Claude Code — Guida Operativa

> Sintesi completa basata sulla repository **[everything-claude-code](https://github.com/affaan-m/everything-claude-code)** di Affaan Mustafa (35k+ stars, vincitore hackathon Anthropic). Configurazioni battle-tested su 10+ mesi di uso quotidiano in produzione.

---

## 1. Architettura del Progetto: Lo Stack di Riferimento

L'architettura suggerita dalla repo segue un pattern moderno e modulare:

```
Frontend  →  Next.js 15 + TypeScript + TailwindCSS  (Vercel / Cloud Run)
    ↓
Backend   →  FastAPI + Python 3.11 + Pydantic       (Cloud Run)
    ↓
    ├── Supabase (Database + Auth)
    ├── Claude API (AI processing)
    └── Redis (Cache)
```

Il principio fondamentale è la **modularità**: file da centinaia di righe, non migliaia. Questo ottimizza sia i costi in token sia la capacità di Claude di navigare e modificare il codice senza errori.

---

## 2. Il Sistema di Configurazione: 6 Componenti Chiave

La repo è un **plugin per Claude Code** che organizza l'intera configurazione di sviluppo in sei livelli complementari.

### 2.1 Agents — Subagenti Specializzati

Gli agents sono file Markdown con frontmatter YAML che delegano task specifici a modelli dedicati. Ogni agent ha un perimetro ristretto di strumenti e responsabilità.

```yaml
---
name: code-reviewer
description: Reviews code for quality, security, and maintainability
tools: ["Read", "Grep", "Glob", "Bash"]
model: opus
---

You are a senior code reviewer...
```

**13 agents disponibili** tra cui:

| Agent | Funzione |
|-------|----------|
| `planner` | Pianificazione feature e implementazione |
| `architect` | Decisioni di system design |
| `tdd-guide` | Test-driven development |
| `code-reviewer` | Quality e security review |
| `security-reviewer` | Analisi vulnerabilità |
| `build-error-resolver` | Risoluzione errori di build |
| `e2e-runner` | Testing E2E con Playwright |
| `refactor-cleaner` | Pulizia dead code |
| `doc-updater` | Sincronizzazione documentazione |

**Regola chiave**: usa Sonnet per il 90% dei task di coding. Scala a Opus solo quando il primo tentativo fallisce, il task coinvolge 5+ file, riguarda decisioni architetturali o codice security-critical.

### 2.2 Skills — Workflow e Conoscenza di Dominio

Le skills sono definizioni di workflow invocate da comandi o agents. Forniscono il "come" rispetto al "cosa" delle rules. La repo include **50+ skills** organizzate per dominio:

- **coding-standards/** — Best practice per linguaggio (TS, Python, Go, Swift, Java)
- **backend-patterns/** — Pattern API, database, caching
- **frontend-patterns/** — React, Next.js patterns
- **tdd-workflow/** — Metodologia TDD completa
- **security-review/** — Checklist di sicurezza
- **continuous-learning/** — Estrazione automatica pattern dalle sessioni
- **verification-loop/** — Verifica continua della qualità

### 2.3 Commands — Slash Commands per Esecuzione Rapida

I comandi sono il punto d'ingresso dell'utente verso gli agents e le skills. Ogni comando mappa un'azione frequente:

- `/tdd` — Avvia workflow test-driven development
- `/plan` — Pianificazione implementazione
- `/e2e` — Generazione test end-to-end
- `/code-review` — Review qualità codice
- `/build-fix` — Fix errori di build
- `/refactor-clean` — Rimozione dead code
- `/learn` — Estrai pattern a metà sessione
- `/checkpoint` — Salva stato di verifica
- `/verify` — Esegui loop di verifica

### 2.4 Rules — Linee Guida Permanenti

Le rules sono standard che si applicano sempre, organizzate in livelli:

```
rules/
├── common/          # Principi universali (sempre installare)
│   ├── coding-style.md
│   ├── git-workflow.md
│   ├── testing.md
│   ├── performance.md
│   ├── patterns.md
│   ├── security.md
│   └── agents.md
├── typescript/      # Specifiche TypeScript/JS
├── python/          # Specifiche Python
├── golang/          # Specifiche Go
└── swift/           # Specifiche Swift
```

**4 principi fondamentali delle rules:**

1. **Agent-First** — Delega ad agenti specializzati per task di dominio
2. **Test-Driven** — Scrivi test prima dell'implementazione, copertura 80%+
3. **Security-First** — Mai compromessi sulla sicurezza; valida tutti gli input
4. **Immutability** — Crea sempre nuovi oggetti, non mutare quelli esistenti

**Regola d'oro sulla sicurezza**: MAI hardcodare segreti. Usa variabili d'ambiente o un secret manager. Valida i segreti richiesti allo startup. Ruota immediatamente qualsiasi segreto esposto.

### 2.5 Hooks — Automazioni Trigger-Based

Gli hooks si attivano su eventi specifici del ciclo di vita di Claude Code (PreToolUse, PostToolUse, Stop, SessionStart). Tre categorie principali:

- **memory-persistence/** — Salvataggio/caricamento contesto tra sessioni
- **strategic-compact/** — Suggerimenti di compattazione quando il contesto si riempie
- **code quality/** — Warning automatici (es. rilevamento console.log)

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "grep -n 'console\\.log' \"$file_path\" && echo '[Hook] Remove console.log'"
  }]
}
```

**Design chiave**: usa hook `Stop` (fine sessione) invece di `UserPromptSubmit` (ogni messaggio) per evitare latenza.

### 2.6 MCP Configs — Integrazioni Esterne

Configurazioni per MCP server come GitHub, Supabase, Vercel, Railway e altri. La repo include 14 configurazioni pronte.

**Attenzione critica al context window**: non abilitare tutti gli MCP contemporaneamente. La finestra di 200k token può ridursi a 70k con troppi tool attivi.

Regola pratica:
- Configura 20-30 MCP
- Tieni sotto 10 abilitati per progetto
- Sotto 80 tool attivi totali
- Usa `disabledMcpServers` nel config di progetto per disabilitare quelli non usati

---

## 3. Token Optimization — La Differenza tra Sessioni Produttive e Sprechi

### 3.1 Selezione del Modello

| Scenario | Modello Consigliato |
|----------|-------------------|
| 90% dei task di coding | Sonnet |
| Primo tentativo fallito | Opus |
| Task su 5+ file | Opus |
| Decisioni architetturali | Opus |
| Codice security-critical | Opus |

### 3.2 Codebase Modulare

File brevi (centinaia di righe, non migliaia) riducono il consumo di token e migliorano la precisione di Claude nel navigare il codice. Includi codemap nelle skills per permettere a Claude di orientarsi senza esplorare l'intera codebase.

### 3.3 Tool Ottimizzati

Usa tool di ricerca semantica come `mgrep` (di Mixedbread) al posto di grep standard. Nei benchmark interni della repo, mgrep + Claude Code ha utilizzato circa il 50% in meno di token rispetto a workflow basati su grep, con qualità uguale o migliore.

---

## 4. Memory Persistence — Continuità tra Sessioni

Il problema principale con gli LLM è la perdita di contesto tra sessioni. La soluzione implementata nella repo:

1. **Hook SessionStart**: carica il contesto della sessione precedente all'avvio
2. **Hook Stop**: salva lo stato corrente alla fine della sessione
3. **File `.tmp` nella cartella `.claude`**: ogni sessione ha il proprio file per non inquinare il contesto vecchio

Il file di sessione deve contenere: stato corrente del progetto, decisioni prese, problemi aperti, prossimi step. Il giorno dopo, Claude carica quel file e riparte da dove aveva lasciato.

---

## 5. Verification Loops — Qualità Continua

Due approcci complementari:

### 5.1 Checkpoint Verification

Salvataggio dello stato in punti specifici con il comando `/checkpoint`. Utile per task lunghi dove vuoi poter tornare indietro.

### 5.2 Continuous Verification

Il comando `/verify` esegue un loop di verifica che include: build, type-check, lint, test, sicurezza e diff review. Ogni step produce un risultato pass/fail.

---

## 6. Parallelization — Scalare il Lavoro

### 6.1 Git Worktrees

Per task paralleli con overlap di file, usa git worktrees. Ogni worktree è un checkout indipendente:

```bash
git worktree add ../feature-branch feature-branch
# Ora lancia istanze Claude separate in ogni worktree
```

### 6.2 Fork delle Conversazioni

Per task paralleli senza overlap, usa il comando `/fork` per dividere la conversazione in branch indipendenti.

### 6.3 Cascade Method

Lancia più agenti in parallelo per task indipendenti (es. analisi sicurezza + analisi performance + review codice).

---

## 7. Continuous Learning — Claude che Impara dai Tuoi Pattern

### 7.1 v1: Estrazione Pattern

Lo skill `continuous-learning` usa un hook Stop per estrarre automaticamente pattern utili dalla sessione e salvarli come skills riutilizzabili.

### 7.2 v2: Sistema a Istinti

Il sistema `continuous-learning-v2` introduce un approccio basato su "istinti" con confidence scoring:

- `/instinct-status` — Mostra istinti appresi con livello di confidenza
- `/instinct-import` — Importa istinti da altri sviluppatori
- `/instinct-export` — Esporta i tuoi istinti per condividerli
- `/evolve` — Raggruppa istinti correlati in skills strutturate

---

## 8. Setup Pratico: Come Iniziare

### 8.1 Installazione come Plugin (Consigliata)

```bash
# Aggiungi il marketplace
/plugin marketplace add affaan-m/everything-claude-code

# Installa il plugin
/plugin install everything-claude-code@everything-claude-code
```

### 8.2 Installazione delle Rules (Manuale, Obbligatoria)

Il sistema plugin di Claude Code non supporta la distribuzione automatica delle rules:

```bash
git clone https://github.com/affaan-m/everything-claude-code.git

# Rules a livello utente (tutti i progetti)
cp -r everything-claude-code/rules/* ~/.claude/rules/

# O rules a livello progetto
mkdir -p .claude/rules
cp -r everything-claude-code/rules/* .claude/rules/
```

### 8.3 Configurazione MCP

Copia i server MCP desiderati da `mcp-configs/mcp-servers.json` nel tuo `~/.claude.json`. Sostituisci i placeholder `YOUR_*_HERE` con le tue API key.

---

## 9. Workflow Consigliato per una Web App

Mettendo tutto insieme, ecco il workflow ottimale per sviluppare una web app:

```
1. PLAN        →  /plan per definire architettura e feature
2. SETUP       →  Configura rules + skills per il tuo stack
3. TDD         →  /tdd per ogni feature (RED → GREEN → REFACTOR)
4. REVIEW      →  /code-review automatico dopo ogni implementazione
5. SECURITY    →  security-reviewer agent su codice sensibile
6. VERIFY      →  /verify per loop di verifica completo
7. CHECKPOINT  →  /checkpoint prima di merge
8. LEARN       →  /learn per estrarre pattern a fine sessione
```

---

## 10. Editor e Ambiente Consigliato

L'autore della repo consiglia **Zed** come editor per la velocità (Rust-based), il basso consumo di risorse e l'integrazione con il pannello agenti di Claude. Alternative valide: VS Code e Cursor.

Per sessioni persistenti su server remoti, usare `tmux` permette di mantenere Claude Code attivo anche dopo disconnessioni.

---

## Risorse

- **Repository**: [github.com/affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)
- **Shorthand Guide** (setup base): [Link su X](https://x.com/affaanmustafa/status/2012378465664745795)
- **Longform Guide** (tecniche avanzate): [Link su X](https://x.com/affaanmustafa/status/2014040193557471352)
- **Licenza**: MIT — usa liberamente, modifica, contribuisci

---

*Documento generato dalla sintesi della repository everything-claude-code v1.1.0+ — Marzo 2026*
