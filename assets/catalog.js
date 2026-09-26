(function(root){const pages=[
  {
    "slug": "valore-casa",
    "group": "Valore e mercato",
    "title": "Quanto vale la tua casa oggi?",
    "intro": "Zona, spazi e condizioni: bastano pochi dettagli per capire da dove partire con una valutazione.",
    "intent": "Possibile vendita",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "area",
        "label": "Quanti metri quadri circa?",
        "type": "number",
        "required": true,
        "min": 1,
        "max": 10000,
        "step": "0.01"
      },
      {
        "id": "floor",
        "label": "A che piano si trova?",
        "type": "number",
        "required": true,
        "min": -2,
        "max": 100,
        "step": 1
      },
      {
        "id": "lift",
        "label": "C’è l’ascensore?",
        "type": "select",
        "required": true,
        "options": [
          "Sì",
          "No"
        ]
      },
      {
        "id": "state",
        "label": "In che condizioni è?",
        "type": "select",
        "required": true,
        "options": [
          "Da ristrutturare",
          "Abitabile",
          "Ristrutturato"
        ]
      },
      {
        "id": "outdoor",
        "label": "Ha uno spazio esterno?",
        "type": "select",
        "required": true,
        "options": [
          "Nessuno",
          "Balcone",
          "Terrazzo",
          "Giardino",
          "Più spazi esterni"
        ]
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Scopri cosa conta per il suo valore",
    "cta": "Scopri cosa conta",
    "takeaway": "Il valore parte dal confronto giusto",
    "notes": [
      "Zona, metratura e condizioni aiutano a scegliere immobili davvero comparabili. Piano, accessibilità e spazi esterni completano il quadro.",
      "Una fascia di prezzo attendibile richiede dati locali e una verifica dell’immobile. Queste risposte, da sole, non producono una stima di mercato."
    ],
    "steps": [
      "La posizione e gli spazi",
      "Le caratteristiche che contano"
    ]
  },
  {
    "slug": "canone-affitto",
    "group": "Valore e mercato",
    "title": "Quanto puoi chiedere di affitto?",
    "intro": "Arredamento, metratura e condizioni aiutano a inquadrare la tua casa prima di scegliere un canone.",
    "intent": "Possibile locazione",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "area",
        "label": "Quanti metri quadri circa?",
        "type": "number",
        "required": true,
        "min": 1,
        "max": 10000,
        "step": "0.01"
      },
      {
        "id": "furnished",
        "label": "La casa è arredata?",
        "type": "select",
        "required": true,
        "options": [
          "Arredata",
          "Non arredata",
          "Parzialmente arredata"
        ]
      },
      {
        "id": "state",
        "label": "In che condizioni è?",
        "type": "select",
        "required": true,
        "options": [
          "Da ristrutturare",
          "Abitabile",
          "Ristrutturato"
        ]
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Fai il primo passo verso il canone giusto",
    "cta": "Inquadra il tuo affitto",
    "takeaway": "Confronta case simili, non solo vicine",
    "notes": [
      "Un confronto utile considera zona, superficie, condizioni e dotazione della casa.",
      "Controlla se nei canoni di confronto sono comprese spese accessorie. Qui non viene calcolato un canone di mercato."
    ],
    "steps": [
      "La tua casa",
      "Come si presenta"
    ]
  },
  {
    "slug": "vendere-o-aspettare",
    "group": "Valore e mercato",
    "title": "Vendere ora o aspettare 12 mesi?",
    "intro": "La fretta, i costi dell’attesa e il tuo prossimo progetto: un primo orientamento per decidere cosa approfondire.",
    "intent": "Intenzione di vendita",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "type",
        "label": "Che tipo di immobile è?",
        "type": "select",
        "required": true,
        "options": [
          "Appartamento",
          "Casa indipendente",
          "Villa",
          "Altro"
        ]
      },
      {
        "id": "reason",
        "label": "Perché stai pensando di vendere?",
        "type": "select",
        "required": true,
        "options": [
          "Cambio casa",
          "Trasferimento",
          "Liquidità",
          "Immobile non utilizzato",
          "Altro"
        ]
      },
      {
        "id": "timing",
        "label": "Quando vorresti decidere?",
        "type": "select",
        "required": true,
        "options": [
          "Appena possibile",
          "Nei prossimi mesi",
          "Sto solo valutando"
        ]
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Metti a fuoco la scelta dei prossimi mesi",
    "cta": "Valuta il prossimo passo",
    "takeaway": "L’attesa ha senso solo dentro il tuo progetto",
    "notes": [
      "Confronta le spese che continueresti a sostenere con l’obiettivo che vuoi raggiungere.",
      "Aspettare non garantisce un prezzo più alto. Il mercato dei prossimi 12 mesi non è previsto da questo modulo."
    ],
    "steps": [
      "L’immobile",
      "Il tuo progetto"
    ]
  },
  {
    "slug": "tempi-vendita",
    "group": "Valore e mercato",
    "title": "Quanto tempo serve per vendere nella tua zona?",
    "intro": "Racconta in breve la casa e la sua disponibilità. Scopri quali aspetti chiarire prima di metterla sul mercato.",
    "intent": "Possibile venditore",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "type",
        "label": "Che tipo di immobile è?",
        "type": "select",
        "required": true,
        "options": [
          "Appartamento",
          "Casa indipendente",
          "Villa",
          "Altro"
        ]
      },
      {
        "id": "area",
        "label": "Quanti metri quadri circa?",
        "type": "number",
        "required": true,
        "min": 1,
        "max": 10000,
        "step": "0.01"
      },
      {
        "id": "availability",
        "label": "La casa è disponibile?",
        "type": "select",
        "required": true,
        "options": [
          "Libera",
          "Abitata da me",
          "Affittata"
        ]
      },
      {
        "id": "state",
        "label": "In che condizioni è?",
        "type": "select",
        "required": true,
        "options": [
          "Da ristrutturare",
          "Abitabile",
          "Ristrutturato"
        ]
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Capisci cosa può influire sui tempi",
    "cta": "Esplora i fattori chiave",
    "takeaway": "I tempi non dipendono soltanto dal quartiere",
    "notes": [
      "Prezzo richiesto, caratteristiche, disponibilità per le visite e preparazione dei documenti sono aspetti da valutare insieme.",
      "Per indicare tempi locali servono vendite comparabili documentate. Non attribuiamo un numero di giorni alla sola zona."
    ],
    "steps": [
      "Dove e quanto è grande",
      "Stato e disponibilità"
    ]
  },
  {
    "slug": "prezzo-sbagliato",
    "group": "Valore e mercato",
    "title": "Quanto perderesti vendendo al prezzo sbagliato?",
    "intro": "Hai già una cifra in mente? Mettila in relazione con le caratteristiche della casa e con il tuo obiettivo.",
    "intent": "Proprietario orientato alla vendita",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "area",
        "label": "Quanti metri quadri circa?",
        "type": "number",
        "required": true,
        "min": 1,
        "max": 10000,
        "step": "0.01"
      },
      {
        "id": "type",
        "label": "Che tipo di immobile è?",
        "type": "select",
        "required": true,
        "options": [
          "Appartamento",
          "Casa indipendente",
          "Villa",
          "Altro"
        ]
      },
      {
        "id": "price",
        "label": "Che prezzo hai in mente? (€)",
        "type": "number",
        "required": false,
        "min": 0,
        "max": 100000000,
        "step": "0.01",
        "hint": "Facoltativo: lascia vuoto se non conosci ancora l’importo."
      },
      {
        "id": "timing",
        "label": "Quando vorresti decidere?",
        "type": "select",
        "required": true,
        "options": [
          "Appena possibile",
          "Nei prossimi mesi",
          "Sto solo valutando"
        ]
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Dai una base più solida al tuo prezzo",
    "cta": "Ragiona sul tuo prezzo",
    "takeaway": "Una cifra in mente è un punto di partenza",
    "notes": [
      "Prima di fissare il prezzo, confronta immobili simili e distingui richieste di annuncio da vendite concluse.",
      "Non possiamo quantificare una perdita senza un riferimento attendibile e un esito reale della vendita."
    ],
    "steps": [
      "La casa",
      "Prezzo e obiettivo"
    ]
  },
  {
    "slug": "facilita-vendita",
    "group": "Valore e mercato",
    "title": "La tua casa è facile o difficile da vendere?",
    "intro": "Un piccolo quiz per individuare i punti già pronti e quelli da sistemare prima di partire.",
    "intent": "Intenzione e caratteristiche di vendita",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "type",
        "label": "Che tipo di immobile è?",
        "type": "select",
        "required": true,
        "options": [
          "Appartamento",
          "Casa indipendente",
          "Villa",
          "Altro"
        ]
      },
      {
        "id": "documents",
        "label": "Hai già raccolto i documenti?",
        "type": "select",
        "required": true,
        "options": [
          "Sì",
          "In parte",
          "Non ancora"
        ]
      },
      {
        "id": "photos",
        "label": "Hai foto e planimetria leggibili?",
        "type": "select",
        "required": true,
        "options": [
          "Sì",
          "In parte",
          "Non ancora"
        ]
      },
      {
        "id": "visits",
        "label": "Puoi organizzare le visite?",
        "type": "select",
        "required": true,
        "options": [
          "Sì",
          "In parte",
          "Non ancora"
        ]
      },
      {
        "id": "timing",
        "label": "Quando vorresti decidere?",
        "type": "select",
        "required": true,
        "options": [
          "Appena possibile",
          "Nei prossimi mesi",
          "Sto solo valutando"
        ]
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Scopri cosa puoi preparare meglio",
    "cta": "Fai il piccolo quiz",
    "takeaway": "La preparazione si costruisce un passo alla volta",
    "notes": [
      "Foto, documenti e disponibilità per le visite sono tre aree concrete su cui lavorare.",
      "Il quiz misura quanto hai preparato, non la probabilità di trovare un acquirente."
    ],
    "steps": [
      "La tua casa",
      "Quanto sei già pronto?"
    ]
  },
  {
    "slug": "domanda-acquirenti",
    "group": "Valore e mercato",
    "title": "Quante persone stanno cercando una casa come la tua?",
    "intro": "Zona, metratura e tipologia: i primi elementi per capire quali richieste confrontare con il tuo immobile.",
    "intent": "Venditore con interesse alla domanda",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "area",
        "label": "Quanti metri quadri circa?",
        "type": "number",
        "required": true,
        "min": 1,
        "max": 10000,
        "step": "0.01"
      },
      {
        "id": "type",
        "label": "Che tipo di immobile è?",
        "type": "select",
        "required": true,
        "options": [
          "Appartamento",
          "Casa indipendente",
          "Villa",
          "Altro"
        ]
      },
      {
        "id": "price",
        "label": "Hai un prezzo indicativo? (€)",
        "type": "number",
        "required": false,
        "min": 0,
        "max": 100000000,
        "step": "0.01",
        "hint": "Facoltativo: lascia vuoto se non conosci ancora l’importo."
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Definisci il profilo della tua casa",
    "cta": "Crea il profilo della casa",
    "takeaway": "Le richieste vanno confrontate con un profilo preciso",
    "notes": [
      "Chi cerca deve avere esigenze compatibili per posizione, spazi, tipologia e budget.",
      "Scoutly non ha un database di acquirenti collegato: non mostriamo conteggi di persone o richieste non verificati."
    ],
    "steps": [
      "Zona e spazi",
      "Tipologia e prezzo"
    ]
  },
  {
    "slug": "checklist-vendita",
    "group": "Preparare la vendita",
    "title": "Checklist: 10 cose da fare prima di mettere casa in vendita.",
    "intro": "Dieci punti da tenere a portata di mano, per affrontare la vendita con più ordine.",
    "intent": "Preparazione alla vendita",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "type",
        "label": "Che tipo di immobile è?",
        "type": "select",
        "required": true,
        "options": [
          "Appartamento",
          "Casa indipendente",
          "Villa",
          "Altro"
        ]
      },
      {
        "id": "stage",
        "label": "A che punto sei?",
        "type": "select",
        "required": true,
        "options": [
          "Sto iniziando a pensarci",
          "Sto preparando la casa",
          "Ho già pubblicato un annuncio"
        ]
      },
      {
        "id": "timing",
        "label": "Quando vorresti decidere?",
        "type": "select",
        "required": true,
        "options": [
          "Appena possibile",
          "Nei prossimi mesi",
          "Sto solo valutando"
        ]
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Prepara la vendita con una checklist semplice",
    "cta": "Ottieni la checklist",
    "takeaway": "La tua checklist in 10 punti",
    "notes": [
      "Una guida organizzativa iniziale. Le verifiche necessarie dipendono dalla situazione specifica della casa."
    ],
    "steps": [
      "La casa",
      "A che punto sei?"
    ]
  },
  {
    "slug": "costi-vendita",
    "group": "Costi e ricavo",
    "title": "Calcola i costi reali della vendita del tuo immobile.",
    "intro": "Scopri le principali voci da raccogliere prima di valutare quanto può costare vendere.",
    "intent": "Budget di vendita",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "type",
        "label": "Che tipo di immobile è?",
        "type": "select",
        "required": true,
        "options": [
          "Appartamento",
          "Casa indipendente",
          "Villa",
          "Altro"
        ]
      },
      {
        "id": "channel",
        "label": "Come pensi di vendere?",
        "type": "select",
        "required": true,
        "options": [
          "Da privato",
          "Con agenzia",
          "Non ho ancora deciso"
        ]
      },
      {
        "id": "price",
        "label": "Prezzo che immagini (€)",
        "type": "number",
        "required": false,
        "min": 0,
        "max": 100000000,
        "step": "0.01",
        "hint": "Facoltativo: lascia vuoto se non conosci ancora l’importo."
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Metti a fuoco le spese da considerare",
    "cta": "Scopri le voci di costo",
    "takeaway": "Un preventivo chiaro parte dalle voci giuste",
    "notes": [
      "Raccogli gli importi pertinenti per assistenza alla vendita, documenti e verifiche, preparazione della casa e altre spese del tuo caso.",
      "Non applichiamo percentuali standard o imposte automatiche: servono preventivi e importi effettivi."
    ],
    "steps": [
      "L’immobile",
      "Come vorresti venderlo"
    ]
  },
  {
    "slug": "netto-vendita",
    "group": "Costi e ricavo",
    "title": "Quanto rimane realmente in tasca dopo la vendita?",
    "intro": "Il prezzo di vendita è solo il punto di partenza. Un primo schema per capire quali importi sottrarre.",
    "intent": "Ricavo netto",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "price",
        "label": "Prezzo di vendita ipotizzato (€)",
        "type": "number",
        "required": false,
        "min": 0,
        "max": 100000000,
        "step": "0.01",
        "hint": "Facoltativo: lascia vuoto se non conosci ancora l’importo."
      },
      {
        "id": "debt",
        "label": "Debito residuo da rimborsare (€)",
        "type": "number",
        "required": false,
        "min": 0,
        "max": 100000000,
        "step": "0.01",
        "hint": "Facoltativo: lascia vuoto se non conosci ancora l’importo."
      },
      {
        "id": "selling",
        "label": "Costi di vendita già stimati (€)",
        "type": "number",
        "required": false,
        "min": 0,
        "max": 100000000,
        "step": "0.01",
        "hint": "Facoltativo: lascia vuoto se non conosci ancora l’importo."
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Scopri da cosa dipende il ricavo finale",
    "cta": "Guarda il tuo possibile ricavo",
    "takeaway": "Dal prezzo al ricavo disponibile",
    "notes": [
      "Per passare dal prezzo al ricavo, considera costi effettivi di vendita, debiti da rimborsare ed eventuali altre somme da regolare.",
      "Gli importi facoltativi permettono solo una differenza parziale: le voci non inserite restano da verificare."
    ],
    "steps": [
      "La casa e il prezzo",
      "Le somme da considerare"
    ]
  },
  {
    "slug": "ristrutturare-prima",
    "group": "Preparare la vendita",
    "title": "Ristrutturare prima di vendere: conviene?",
    "intro": "Prima di investire, metti a fuoco lo stato della casa e il tipo di intervento che immagini.",
    "intent": "Preparazione alla vendita",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "state",
        "label": "In che condizioni è?",
        "type": "select",
        "required": true,
        "options": [
          "Da ristrutturare",
          "Abitabile",
          "Ristrutturato"
        ]
      },
      {
        "id": "works",
        "label": "Che intervento stai valutando?",
        "type": "select",
        "required": true,
        "options": [
          "Piccole riparazioni",
          "Cucina o bagno",
          "Ristrutturazione completa",
          "Non so ancora"
        ]
      },
      {
        "id": "budget",
        "label": "Budget indicativo dei lavori (€)",
        "type": "number",
        "required": false,
        "min": 0,
        "max": 100000000,
        "step": "0.01",
        "hint": "Facoltativo: lascia vuoto se non conosci ancora l’importo."
      },
      {
        "id": "timing",
        "label": "Quando vorresti decidere?",
        "type": "select",
        "required": true,
        "options": [
          "Appena possibile",
          "Nei prossimi mesi",
          "Sto solo valutando"
        ]
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Capisci se i lavori meritano un approfondimento",
    "cta": "Valuta l’idea dei lavori",
    "takeaway": "Il costo dei lavori non coincide con l’aumento di valore",
    "notes": [
      "Confronta preventivo, tempo necessario e differenza di prezzo realmente plausibile dopo l’intervento.",
      "Una casa più curata non garantisce il recupero dell’intera spesa. Per il confronto economico servono due valutazioni motivate."
    ],
    "steps": [
      "Come si presenta la casa",
      "L’intervento che immagini"
    ]
  },
  {
    "slug": "lavori-valore",
    "group": "Preparare la vendita",
    "title": "Quali lavori aumentano davvero il valore della tua casa?",
    "intro": "Parti dalla casa com’è oggi per scegliere quali interventi approfondire, senza lavori fatti alla cieca.",
    "intent": "Scelta dei lavori",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "state",
        "label": "In che condizioni è?",
        "type": "select",
        "required": true,
        "options": [
          "Da ristrutturare",
          "Abitabile",
          "Ristrutturato"
        ]
      },
      {
        "id": "priority",
        "label": "Quale aspetto vorresti migliorare?",
        "type": "select",
        "required": true,
        "options": [
          "Presentazione generale",
          "Cucina o bagno",
          "Impianti o comfort",
          "Spazi esterni",
          "Non so ancora"
        ]
      },
      {
        "id": "budget",
        "label": "Budget indicativo (€)",
        "type": "number",
        "required": false,
        "min": 0,
        "max": 100000000,
        "step": "0.01",
        "hint": "Facoltativo: lascia vuoto se non conosci ancora l’importo."
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Individua cosa vale la pena valutare",
    "cta": "Esplora le priorità",
    "takeaway": "Prima le esigenze della casa, poi i lavori",
    "notes": [
      "Distingui manutenzioni necessarie, interventi di presentazione e trasformazioni più importanti.",
      "Chiedi preventivi comparabili e una valutazione dell’effetto atteso. Non esiste qui una percentuale di rivalutazione garantita."
    ],
    "steps": [
      "La situazione attuale",
      "Le tue priorità"
    ]
  },
  {
    "slug": "privato-o-agenzia",
    "group": "Costi e ricavo",
    "title": "Vendere da privato o con agenzia? Calcola costi e differenze.",
    "intro": "Tempo disponibile, esperienza e supporto desiderato: pochi elementi per chiarire cosa conta per te.",
    "intent": "Scelta del canale di vendita",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "experience",
        "label": "Hai già venduto un immobile?",
        "type": "select",
        "required": true,
        "options": [
          "Sì",
          "No"
        ]
      },
      {
        "id": "time",
        "label": "Quanto tempo puoi dedicare?",
        "type": "select",
        "required": true,
        "options": [
          "Molto",
          "Qualche ora alla settimana",
          "Poco"
        ]
      },
      {
        "id": "support",
        "label": "Dove vorresti più supporto?",
        "type": "select",
        "required": true,
        "options": [
          "Annuncio e richieste",
          "Visite e organizzazione",
          "Trattativa e coordinamento",
          "In tutto il percorso"
        ]
      },
      {
        "id": "timing",
        "label": "Quando vorresti decidere?",
        "type": "select",
        "required": true,
        "options": [
          "Appena possibile",
          "Nei prossimi mesi",
          "Sto solo valutando"
        ]
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Confronta due modi di affrontare la vendita",
    "cta": "Confronta i due percorsi",
    "takeaway": "Confronta attività, impegni e costi",
    "notes": [
      "Da privato organizzi direttamente le attività che non affidi a professionisti. Con un’agenzia, verifica quali servizi sono compresi nell’incarico.",
      "Per un confronto economico servono costi effettivi e tempo da dedicare. Nessun canale garantisce un prezzo o una durata."
    ],
    "steps": [
      "La tua esperienza",
      "Il supporto che cerchi"
    ]
  },
  {
    "slug": "affittato-o-libero",
    "group": "Scelte sull’immobile",
    "title": "Meglio vendere affittato o libero?",
    "intro": "Disponibilità della casa e obiettivo di vendita: un primo quadro dei punti da chiarire.",
    "intent": "Vendita immobile locato",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "status",
        "label": "La casa oggi è affittata?",
        "type": "select",
        "required": true,
        "options": [
          "Sì",
          "No"
        ]
      },
      {
        "id": "availability",
        "label": "La futura disponibilità è definita?",
        "type": "select",
        "required": true,
        "options": [
          "Sì",
          "Da chiarire",
          "Non pertinente"
        ]
      },
      {
        "id": "timing",
        "label": "Quando vorresti decidere?",
        "type": "select",
        "required": true,
        "options": [
          "Appena possibile",
          "Nei prossimi mesi",
          "Sto solo valutando"
        ]
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Metti a fuoco le due situazioni",
    "cta": "Esplora le differenze",
    "takeaway": "Prezzo e disponibilità vanno letti insieme",
    "notes": [
      "Le due situazioni possono rivolgersi a esigenze diverse: chi cerca una casa da abitare e chi valuta un immobile locato.",
      "Contratto, disponibilità e fattibilità dei tempi richiedono verifiche specifiche. Il modulo non presume che la casa possa essere liberata."
    ],
    "steps": [
      "La situazione della casa",
      "Disponibilità e tempi"
    ]
  },
  {
    "slug": "arredare-casa",
    "group": "Preparare la vendita",
    "title": "Conviene arredare casa prima di metterla sul mercato?",
    "intro": "Arredo completo o piccoli accorgimenti? Parti dall’obiettivo e da quello che c’è già.",
    "intent": "Presentazione dell’immobile",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "goal",
        "label": "Vuoi vendere o affittare?",
        "type": "select",
        "required": true,
        "options": [
          "Vendere",
          "Affittare"
        ]
      },
      {
        "id": "furnished",
        "label": "Com’è arredata oggi?",
        "type": "select",
        "required": true,
        "options": [
          "Vuota",
          "Parzialmente arredata",
          "Già arredata"
        ]
      },
      {
        "id": "budget",
        "label": "Budget che vorresti dedicare (€)",
        "type": "number",
        "required": false,
        "min": 0,
        "max": 100000000,
        "step": "0.01",
        "hint": "Facoltativo: lascia vuoto se non conosci ancora l’importo."
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Capisci come presentare meglio gli spazi",
    "cta": "Valuta la presentazione",
    "takeaway": "Prima di aggiungere, guarda cosa serve",
    "notes": [
      "Pulizia, ordine e una disposizione leggibile aiutano a mostrare gli spazi. Valuta poi gli arredi rispetto al pubblico e all’obiettivo.",
      "Nuovi mobili non garantiscono un aumento di prezzo. Confronta spesa, utilizzo e possibilità di recuperare o riutilizzare l’arredo."
    ],
    "steps": [
      "Il tuo obiettivo",
      "La situazione attuale"
    ]
  },
  {
    "slug": "vendere-reinvestire",
    "group": "Scelte sull’immobile",
    "title": "Vendere e reinvestire: potresti ottenere un rendimento migliore?",
    "intro": "Chiarisci il tuo obiettivo prima di confrontare una proprietà con altre possibilità.",
    "intent": "Confronto patrimoniale",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "use",
        "label": "Come usi oggi l’immobile?",
        "type": "select",
        "required": true,
        "options": [
          "Ci abito",
          "Lo affitto",
          "È vuoto",
          "Uso occasionale"
        ]
      },
      {
        "id": "goal",
        "label": "Cosa cerchi principalmente?",
        "type": "select",
        "required": true,
        "options": [
          "Più liquidità",
          "Meno gestione",
          "Un reddito",
          "Sto esplorando"
        ]
      },
      {
        "id": "timing",
        "label": "Quando vorresti decidere?",
        "type": "select",
        "required": true,
        "options": [
          "Appena possibile",
          "Nei prossimi mesi",
          "Sto solo valutando"
        ]
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Metti a confronto le domande giuste",
    "cta": "Inquadra il confronto",
    "takeaway": "Prima il capitale disponibile, poi il confronto",
    "notes": [
      "Per confrontare le possibilità servono ricavo netto della vendita, flussi dell’immobile e caratteristiche dell’alternativa.",
      "Rendimento, rischio, liquidità e tempi non sono intercambiabili. Qui non vengono suggeriti investimenti o rendimenti attesi."
    ],
    "steps": [
      "L’immobile oggi",
      "Il tuo obiettivo"
    ]
  },
  {
    "slug": "immobile-ereditato",
    "group": "Situazioni di vita",
    "title": "Hai ereditato un immobile? Scopri le opzioni: vendere, affittare o mantenerlo.",
    "intro": "Vendere, affittare o mantenere: un primo orientamento per affrontare la scelta con calma.",
    "intent": "Gestione di immobile ereditato",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "owners",
        "label": "La decisione coinvolge altre persone?",
        "type": "select",
        "required": true,
        "options": [
          "Sì",
          "No",
          "Da chiarire"
        ]
      },
      {
        "id": "use",
        "label": "L’immobile è utilizzato?",
        "type": "select",
        "required": true,
        "options": [
          "È vuoto",
          "È abitato",
          "È affittato"
        ]
      },
      {
        "id": "goal",
        "label": "Cosa vorresti fare?",
        "type": "select",
        "required": true,
        "options": [
          "Vendere",
          "Affittare",
          "Valutare le possibilità"
        ]
      },
      {
        "id": "timing",
        "label": "Quando vorresti decidere?",
        "type": "select",
        "required": true,
        "options": [
          "Appena possibile",
          "Nei prossimi mesi",
          "Sto solo valutando"
        ]
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Fai ordine tra le possibilità",
    "cta": "Esplora le opzioni",
    "takeaway": "Tre possibilità, esigenze diverse",
    "notes": [
      "Vendere trasforma il bene in liquidità; affittare comporta gestione; mantenere conserva la disponibilità e le spese.",
      "Prima di scegliere, chiarisci titolarità, accordi fra interessati e documentazione con i professionisti del caso."
    ],
    "steps": [
      "La situazione dell’immobile",
      "Le tue intenzioni"
    ]
  },
  {
    "slug": "trasferimento",
    "group": "Situazioni di vita",
    "title": "Ti trasferisci in un’altra città? Scopri cosa conviene fare con la tua casa.",
    "intro": "Un trasferimento cambia le priorità. Scopri quali domande farti sulla casa che lasci.",
    "intent": "Trasferimento",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "return",
        "label": "Pensi di tornare?",
        "type": "select",
        "required": true,
        "options": [
          "Sì",
          "No",
          "Non lo so"
        ]
      },
      {
        "id": "duration",
        "label": "Il trasferimento sarà…",
        "type": "select",
        "required": true,
        "options": [
          "Temporaneo",
          "A lungo termine",
          "Ancora da definire"
        ]
      },
      {
        "id": "goal",
        "label": "Cosa vorresti fare?",
        "type": "select",
        "required": true,
        "options": [
          "Vendere",
          "Affittare",
          "Valutare le possibilità"
        ]
      },
      {
        "id": "timing",
        "label": "Quando vorresti decidere?",
        "type": "select",
        "required": true,
        "options": [
          "Appena possibile",
          "Nei prossimi mesi",
          "Sto solo valutando"
        ]
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Prepara il prossimo capitolo",
    "cta": "Esplora cosa fare della casa",
    "takeaway": "La possibilità di tornare cambia il confronto",
    "notes": [
      "Mantenere, affittare e vendere rispondono a esigenze diverse di disponibilità, liquidità e gestione a distanza.",
      "Se pensi di rientrare, chiarisci prima tempi e disponibilità futura. Per un confronto economico servono costi e ricavi attendibili."
    ],
    "steps": [
      "La casa che lasci",
      "Il tuo trasferimento"
    ]
  },
  {
    "slug": "casa-piu-piccola",
    "group": "Situazioni di vita",
    "title": "I figli sono andati via? Quanto potresti ricavare passando a una casa più piccola?",
    "intro": "Spazi più adatti e nuove possibilità: comincia a mettere a fuoco il cambiamento.",
    "intent": "Cambio casa",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "area",
        "label": "Quanti metri quadri circa?",
        "type": "number",
        "required": true,
        "min": 1,
        "max": 10000,
        "step": "0.01"
      },
      {
        "id": "destination",
        "label": "Dove vorresti cercare?",
        "type": "select",
        "required": true,
        "options": [
          "Nella stessa zona",
          "In un’altra zona",
          "Non ho ancora deciso"
        ]
      },
      {
        "id": "price",
        "label": "Valore di vendita che immagini (€)",
        "type": "number",
        "required": false,
        "min": 0,
        "max": 100000000,
        "step": "0.01",
        "hint": "Facoltativo: lascia vuoto se non conosci ancora l’importo."
      },
      {
        "id": "purchase",
        "label": "Budget per la nuova casa (€)",
        "type": "number",
        "required": false,
        "min": 0,
        "max": 100000000,
        "step": "0.01",
        "hint": "Facoltativo: lascia vuoto se non conosci ancora l’importo."
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Immagina la casa del prossimo capitolo",
    "cta": "Esplora il cambio casa",
    "takeaway": "Non confrontare soltanto i due prezzi",
    "notes": [
      "La liquidità finale dipende anche da costi di vendita e acquisto, debiti residui, trasloco e lavori.",
      "Le spese di gestione della nuova casa e le tempistiche del passaggio meritano un confronto separato."
    ],
    "steps": [
      "La casa attuale",
      "La prossima casa"
    ]
  },
  {
    "slug": "seconda-casa",
    "group": "Situazioni di vita",
    "title": "La tua seconda casa ti costa più di quanto rende?",
    "intro": "Utilizzo, spese e incassi: tre aspetti semplici per iniziare a capire quanto pesa mantenerla.",
    "intent": "Gestione seconda casa",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "use",
        "label": "Come la utilizzi?",
        "type": "select",
        "required": true,
        "options": [
          "Solo personalmente",
          "La affitto",
          "Uso misto",
          "È quasi sempre vuota"
        ]
      },
      {
        "id": "income",
        "label": "Incassi annui indicativi (€)",
        "type": "number",
        "required": false,
        "min": 0,
        "max": 100000000,
        "step": "0.01",
        "hint": "Facoltativo: lascia vuoto se non conosci ancora l’importo."
      },
      {
        "id": "costs",
        "label": "Spese annue indicative (€)",
        "type": "number",
        "required": false,
        "min": 0,
        "max": 100000000,
        "step": "0.01",
        "hint": "Facoltativo: lascia vuoto se non conosci ancora l’importo."
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Guarda la seconda casa con più chiarezza",
    "cta": "Fai un primo bilancio",
    "takeaway": "Il bilancio parte da quello che usi e paghi",
    "notes": [
      "Il valore dell’uso personale non si esprime soltanto in un importo. Tienilo separato dal confronto degli incassi e delle uscite.",
      "Una differenza basata su importi indicativi non è un rendimento completo dell’investimento."
    ],
    "steps": [
      "Come usi la casa",
      "Un primo bilancio"
    ]
  },
  {
    "slug": "casa-vuota",
    "group": "Situazioni di vita",
    "title": "Quanto costa mantenere una casa vuota?",
    "intro": "Anche senza abitarla, alcune spese continuano. Parti dai costi che conosci già.",
    "intent": "Proprietario di immobile vuoto",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "type",
        "label": "Che tipo di immobile è?",
        "type": "select",
        "required": true,
        "options": [
          "Appartamento",
          "Casa indipendente",
          "Villa",
          "Altro"
        ]
      },
      {
        "id": "monthly",
        "label": "Spese ricorrenti mensili indicative (€)",
        "type": "number",
        "required": false,
        "min": 0,
        "max": 100000000,
        "step": "0.01",
        "hint": "Facoltativo: lascia vuoto se non conosci ancora l’importo."
      },
      {
        "id": "months",
        "label": "Per quanti mesi resterà vuota?",
        "type": "number",
        "required": true,
        "min": 1,
        "max": 120,
        "step": 1
      },
      {
        "id": "once",
        "label": "Altre spese nel periodo (€)",
        "type": "number",
        "required": false,
        "min": 0,
        "max": 100000000,
        "step": "0.01",
        "hint": "Facoltativo: lascia vuoto se non conosci ancora l’importo."
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Scopri quanto può pesare l’attesa",
    "cta": "Fai il primo conto",
    "takeaway": "Le spese continuano anche a casa vuota",
    "notes": [
      "Condominio, utenze, manutenzione e importi applicabili al tuo caso sono le voci da raccogliere. Evita di conteggiarle due volte.",
      "Il conto usa soltanto gli importi inseriti: non stima automaticamente tributi, mancati affitti o variazioni di valore."
    ],
    "steps": [
      "La casa",
      "Il costo dell’attesa"
    ]
  },
  {
    "slug": "vendere-o-affittare",
    "group": "Scelte sull’immobile",
    "title": "Vendere o affittare?",
    "intro": "Una casa, due possibilità. Partiamo dai tuoi obiettivi per capire quali aspetti approfondire.",
    "intent": "Vendita o locazione",
    "mode": "Primo orientamento",
    "fields": [
      {
        "id": "zone",
        "label": "Dove si trova la casa?",
        "type": "text",
        "required": true
      },
      {
        "id": "type",
        "label": "Che tipo di immobile è?",
        "type": "select",
        "required": true,
        "options": [
          "Appartamento",
          "Casa indipendente",
          "Villa",
          "Altro"
        ]
      },
      {
        "id": "priority",
        "label": "Cosa conta di più per te?",
        "type": "select",
        "required": true,
        "options": [
          "Liquidità",
          "Un’entrata periodica",
          "Meno gestione",
          "Mantenere la proprietà",
          "Non so ancora"
        ]
      },
      {
        "id": "timing",
        "label": "Quando vorresti decidere?",
        "type": "select",
        "required": true,
        "options": [
          "Appena possibile",
          "Nei prossimi mesi",
          "Sto solo valutando"
        ]
      }
    ],
    "method": "Indicazioni introduttive basate sulle risposte inserite. Non costituiscono una valutazione professionale. Gli eventuali conti sono parziali e dipendono dagli importi forniti.",
    "tips": [],
    "related": [],
    "offer": "Scopri da dove iniziare il confronto",
    "cta": "Esplora le due possibilità",
    "takeaway": "La scelta comincia dal tuo obiettivo",
    "notes": [
      "Vendita e locazione hanno tempi, responsabilità e risultati diversi: liquidità da una parte, gestione e flussi nel tempo dall’altra.",
      "Per un confronto economico servono un prezzo plausibile, un canone plausibile e i costi del caso. Il modulo non sceglie al posto tuo."
    ],
    "steps": [
      "La tua casa",
      "Le tue priorità"
    ]
  }
];root.SCOUTLY_PAGES=pages;if(typeof module!=='undefined')module.exports=pages;})(typeof window!=='undefined'?window:globalThis);
