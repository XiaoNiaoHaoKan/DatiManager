# Database & Account Management App

Un'applicazione gestionale per la modifica del database, la creazione e gestione degli account utenti, l'amministrazione dei crediti e la gestione degli enti museali.

---

## Funzionalità Principali

### Gestione Account Marketplace
- **Creazione Account:** Aggiunta di nuovi utenti per il marketplace con l'assegnazione di ruoli specifici (es. Admin, Venditore, Acquirente).
- **Rimozione Account:** Eliminazione definitiva o disattivazione degli utenti dal database.
- **Gestione Crediti:** Possibilità di aggiungere o sottrarre crediti dal saldo dei singoli account in modo diretto.

### Gestione Musei
- **Un solo museo, condiviso da marketplace, staff editor (Jack) e navigator (Luigi):** non esistono più "musei marketplace" e "musei staff" separati. Ogni museo ha un **nome univoco** e un `id` (uguale al suo `_id` Mongo) che viene usato ovunque come `museumId`: è lo stesso valore che lo staff editor mette nel QR generato per la visita in loco, letto dal navigator per mostrare i contenuti, e usato dal marketplace per associare contenuti/visite in vendita a quel museo.
- **Associazione Utenti:** creazione e collegamento di account (marketplace o staff) al museo di competenza.

### Gestione Account Staff (Jack / editor)
- **Account staff:** creazione di account email/password associati a un museo, per accedere direttamente a `JackTecnoWebRefactory` (login su `Login.html`). La password viene hashata con lo stesso schema scrypt (`salt:hash`) usato da `Server/auth.js`, quindi l'account creato qui funziona da subito per il login.

---

## Come si inserisce nel sistema ArtAround

Questa app **non è un quarto prodotto isolato**: è un pannello di amministrazione che scrive e legge direttamente sulla stessa MongoDB condivisa (database `artaround`) usata da:

- **Jack** (`JackTecnoWebRefactory/Server`) – editor/staff,
- **Luigi** (`Luigi ArtAround-project/Server`) – navigator,
- **ProgettoMuseo** (`Progetto_Museo/server_marketplace`) – marketplace.

Gli account e i crediti marketplace gestiti da questa app corrispondono esattamente alla collezione `users` letta/scritta dal marketplace (`username`, `password`, `role`, `credit`, `purchases`, `museumId`). Gli **account staff** corrispondono invece al modello Mongoose `User` di Jack (`email`/`passwordHash`/`museumId`): usano di proposito la stessa collezione `users` con cui si connette `Jack/Server`, così un account creato qui appare subito nel login di Jack.

I **musei** sono un unico modello (collezione `museums`) con i campi richiesti da entrambi i mondi: `id`/`name` (usati dal marketplace), `city`/`rooms`/`visits` (usati da Jack), `description`/`entry` (usati da entrambi). Il campo `id` è impostato uguale a `_id.toString()` al momento della creazione: è così che lo stesso museo creato qui risulta identico per il marketplace (che lo referenzia con `museum.id`), per Jack (che referenzia i musei con `_id` e lo mette nel QR) e per il navigator (che riceve quel valore dal QR scansionato e filtra su di esso i contenuti/le visite).

## Setup

```bash
cd CreazioneDatiPerIlMuseo
npm install
cp .env.example .env   # imposta MONGO_URI se diverso dal default locale
npm start
```

Il pannello web è servito su `http://localhost:8010` (porta configurabile via `PORT`).

## API

| Metodo | Endpoint | Descrizione |
|---|---|---|
| GET | `/api/accounts` | Elenca gli account marketplace (senza password) |
| POST | `/api/accounts` | Crea un account (`username`, `password`, `role`, `credit`, `museumId`) |
| DELETE | `/api/accounts/:username` | Elimina un account |
| PATCH | `/api/accounts/:username/credit` | Somma/sottrae credito (`{ "delta": number }`) |
| PATCH | `/api/accounts/:username/museum` | Associa/rimuove il museo di un account (`{ "museumId": string|null }`) |
| GET | `/api/museums` | Elenca i musei |
| POST | `/api/museums` | Crea un museo con nome univoco (`name`, `city`, `description`, `entry`) |
| DELETE | `/api/museums/:id` | Elimina un museo |
| GET | `/api/staff/accounts` | Elenca gli account staff (senza `passwordHash`) |
| POST | `/api/staff/accounts` | Crea un account staff (`email`, `password`, `museumId`) — password hashata compatibile col login di Jack |
| DELETE | `/api/staff/accounts/:id` | Elimina un account staff |

## Limiti noti / lavoro futuro

- Le password degli account marketplace sono salvate **in chiaro**, per restare compatibili con il login attuale del marketplace (anch'esso in chiaro). Andrebbe introdotto l'hashing (es. bcrypt) in modo coordinato su marketplace + questa app. Gli account **staff** invece sono già hashati (scrypt), coerentemente con Jack.
- Non c'è ancora autenticazione/autorizzazione su questo pannello: va usato solo in rete locale/fidata o dietro un reverse proxy protetto prima di un eventuale deploy pubblico.
- **Account marketplace e account staff condividono di proposito la stessa collezione `users`** (idem per i musei, ora unificati in un solo modello): è così che un account creato qui per un museo appare subito sia nel login di Jack sia nel marketplace. Nella collezione `users` convivono quindi documenti di forma diversa (`{username, password, role, credit}` per il marketplace, `{email, passwordHash, museumId}` per lo staff); ognuno dei due backend legge/filtra solo i propri campi, ma è comunque utile saperlo se si ispeziona il database a mano.

