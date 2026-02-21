# Configurazione Firebase

## 1. Crea il progetto Firebase

1. Vai su [https://console.firebase.google.com](https://console.firebase.google.com)
2. Clicca **"Aggiungi progetto"** → dai un nome (es. `ricettario`)
3. Disabilita Google Analytics se non ti serve → **Crea progetto**

## 2. Configura Firestore

1. Nel menu laterale → **Firestore Database** → **Crea database**
2. Scegli **"Inizia in modalità test"** (per ora va bene, potrai aggiungere regole dopo)
3. Scegli la regione più vicina (es. `europe-west1`)

## 3. Registra l'app web

1. Nella homepage del progetto → icona `</>` (App Web)
2. Dai un nickname (es. `ricettario-web`) → **Registra app**
3. Ti apparirà un oggetto `firebaseConfig` con tutte le chiavi

## 4. Inserisci le chiavi nell'app

Apri il file `src/firebase/config.js` e sostituisci i placeholder:

```js
const firebaseConfig = {
  apiKey: 'la-tua-api-key',
  authDomain: 'il-tuo-progetto.firebaseapp.com',
  projectId: 'il-tuo-progetto',
  storageBucket: 'il-tuo-progetto.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef',
}
```

## 5. Avvia l'app

```bash
npm run dev
```

---

## Regole Firestore (produzione)

Quando sei pronto, sostituisci le regole test con queste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /recipes/{recipeId} {
      allow read, write: if true; // o aggiungi autenticazione
    }
  }
}
```
