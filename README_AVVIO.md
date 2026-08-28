# Avvio di CreazioneDatiPerIlMuseo

Questa guida descrive il primo avvio e gli avvii successivi del pannello amministrativo.

## Prerequisiti

- Node.js versione LTS e npm
- MongoDB Community Server, oppure Docker

Verificare l'installazione:

```bash
node -v
npm -v
mongod --version
```

## Primo avvio

Aprire un terminale nella cartella del progetto:

```bash
cd CreazioneDatiPerIlMuseo
npm install
cp .env.example .env
```

Il file `.env` usa il database condiviso `artaround` e la porta `8010`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/artaround
PORT=8010
```

### Avviare MongoDB

Se MongoDB e installato come servizio Linux:

```bash
sudo systemctl start mongod
```

Per avviarlo automaticamente all'accensione:

```bash
sudo systemctl enable mongod
```

In alternativa, con Docker:

```bash
docker run -d --name mongo-artaround -p 27017:27017 -v artaround-mongo-data:/data/db mongo:7
```

Se il container esiste gia, usare `docker start mongo-artaround` invece del comando precedente.

### Avviare il pannello

```bash
npm start
```

Aprire [http://localhost:8010](http://localhost:8010).

## Avvii successivi

Dopo il primo avvio, aprire un terminale nella cartella del progetto e avviare MongoDB se non e gia attivo:

```bash
cd CreazioneDatiPerIlMuseo
sudo systemctl start mongod
npm start
```

Se si usa Docker:

```bash
docker start mongo-artaround
npm start
```

Il pannello sara disponibile su [http://localhost:8010](http://localhost:8010). Per fermare il server Node.js, premere `Ctrl+C`.

## Sviluppo

Per riavviare automaticamente il server dopo le modifiche:

```bash
npm run dev
```
