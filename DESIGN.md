# Scoutly — Casa, con leggerezza

Direzione approvata: illustrazioni editoriali calde, moderne e amichevoli. Avorio, petrolio, salvia e corallo. I temi più delicati, come eredità e trasferimento, mantengono un tono rispettoso.

## Regole di pagina

- Una scena originale distinta per ciascuno dei 22 strumenti e per la homepage.
- Sfondo fisso, decorativo e non interattivo; immagine sul lato destro e spazio quieto per il titolo.
- Moduli su pannelli chiari opachi, con primo passo dedicato al contatto.
- Pulsante con beneficio specifico che porta al modulo, senza modificare la raccolta progressiva dei dati.
- Mobile: una colonna, scena in riquadro e sfondo attenuato; nessun movimento di parallasse.
- Rispetto di prefers-reduced-motion, collegamento per saltare al modulo e decorazioni escluse dai lettori di schermo.
- Asset locali WebP; miniature separate per l’indice locale di revisione. Nessuna dipendenza da immagini remote.

## Autonomia delle landing

Ogni pagina vive da sola: nessun menu, rimando ad altri strumenti o collegamento alla homepage. I titoli dei moduli esprimono il beneficio della singola pagina. Il contatto precede poche domande semplici e un orientamento breve. La homepage pubblica è una presentazione del marchio; l’indice di revisione rimane fuori dal sito pubblicato.

## Asset e generazione

Metodo: strumento image_gen integrato (non CLI). La prima illustrazione, valore-casa, è il riferimento di stile per tutte le successive. Le versioni per il sito sono in assets/scenes/<slug>.webp; le miniature in assets/scenes/<slug>-card.webp. I file PNG originali sono conservati nell’archivio di generazione locale e nella cartella di lavoro, non caricati nel sito.

## Prompt iniziale

Use case: illustration-story. Create an original polished editorial illustration for Scoutly, a warm modern Italian property decision website. Asset: landscape website fixed background, 1536x1024 composition. Subject: a charming architecturally plausible ivory Italian townhouse with terracotta roof, teal shutters, balcony with a plant, examined through a large elegant handheld magnifying glass, a small sage shrub and warm sun. Theme: discovering the value of a home. Style: sophisticated contemporary editorial cut-paper illustration, soft organic geometric shapes, subtle tactile paper grain, restrained depth and softly shaded edges, beautifully art directed, friendly without childish faces or cartoon eyes, confident clean silhouettes. Palette precisely warm ivory #F7F3EA, deep petroleum #153E50, sage #A9C4AE, coral #E78F78, muted golden ochre #D7A94B. Background uniform warm ivory with very subtle texture. Composition: cohesive illustration in the RIGHT HALF and bottom-right, small secondary plant at far left edge; keep left 45% mostly empty ivory for webpage text. Full composition with generous margins, no cropped house. No text, letters, numbers, logos, charts, watermarks, UI controls or borders. It must feel like a premium lifestyle editorial, not real estate stock photography.

## Prompt comune per le scene successive

Create a brand new landscape 1536x1024 editorial website background for Scoutly. Use the reference ONLY for cohesive visual style, palette, warmth, delicate paper grain and quality; DO NOT repeat its house or magnifying glass unless requested. Scene: SUBJECT. Premium contemporary illustrated cut-paper / painterly editorial, charming, modern, warm and lightly playful but never childish. Palette: warm ivory #F7F3EA, deep petroleum #153E50, sage #A9C4AE, coral #E78F78, muted ochre #D7A94B. Main scene entirely in RIGHT HALF, bottom-right; left 45% mostly empty warm ivory for overlaid website title. Generous breathing room. Soft organic shapes, elegant shadows and tactile paper. No text, letters, numbers, UI, logos, watermark. Keep all main subjects within frame. No photorealism.

Sostituire SUBJECT con il soggetto specifico riportato sotto. Il riferimento visivo è la prima illustrazione, non un invito a ripeterne la composizione esatta.

## Scene dedicate

### valore-casa

Didascalia: Ogni casa ha qualcosa da raccontare.

Soggetto del prompt: An ivory Italian townhouse with terracotta roof, teal shutters and a balcony plant, examined by a large elegant magnifying glass. A small sage shrub and warm sun. Theme: understanding the value of a home.

### canone-affitto

Didascalia: Una casa, nuove possibilità.

Soggetto del prompt: A stylish miniature apartment interior with a coral sofa, a big teal key resting upright beside the front door, a warm pendant lamp and one healthy houseplant. A little blank hanging key tag. Theme: a home ready to rent, welcoming and practical.

### vendere-o-aspettare

Didascalia: Anche il tempo entra nella scelta.

Soggetto del prompt: An elegant ivory house between two different seasonal trees: a leafy sage tree and an ochre autumn tree. A large sculptural hourglass with coral sand nearby. Theme: selling now versus waiting through the seasons. No calendar text.

### tempi-vendita

Didascalia: Ogni quartiere ha il suo ritmo.

Soggetto del prompt: Three charming small Italian neighborhood buildings in teal, ivory and muted coral connected by a winding path, and a sculptural round clock without numbers. One bicycle leans against the rightmost house. Theme: neighborhood rhythm and time to sell.

### prezzo-sbagliato

Didascalia: Il prezzo giusto merita attenzione.

Soggetto del prompt: A modern sculptural balancing scale: on one side a tiny warm ivory house, on the other a blank coral price tag. Both balanced calmly. A small sage plant beside the scale. Theme: balancing a thoughtful property price, no money piles.

### facilita-vendita

Didascalia: Preparare bene fa la differenza.

Soggetto del prompt: A friendly house with an open teal front door, three broad simple stepping stones leading to it, a neatly trimmed sage shrub and a single coral flower. A small folded blank floor plan beside the steps. Theme: preparing a clear path toward selling a home.

### domanda-acquirenti

Didascalia: La casa giusta, per la persona giusta.

Soggetto del prompt: A small elegant ivory home surrounded by three abstract sculptural human figures at a respectful distance, in coral, sage and ochre, looking toward its front door. Faces minimal and dignified, no cartoon eyes. Theme: people looking for a suitable home, not a crowd or a sales rush.

### checklist-vendita

Didascalia: Un passo alla volta, con ordine.

Soggetto del prompt: A large cream clipboard with exactly three simple teal checkmarks and blank horizontal line shapes, a coral pencil, a small model house and a potted sage leaf. Editorial still life of preparing a home sale. No letters or numbers.

### costi-vendita

Didascalia: Mettiamo ogni spesa al suo posto.

Soggetto del prompt: A warm ivory model house beside three neatly stacked blank paper receipts, a simple teal calculator with unmarked buttons and a coral folder. One small ochre circular token, no money piles. Theme: organizing the costs of selling.

### netto-vendita

Didascalia: Dai numeri, una prospettiva più chiara.

Soggetto del prompt: An open elegant teal wallet containing an ivory house-shaped card, a coral house key and two small ochre tokens arranged neatly beside it. No currency marks or text. Theme: what remains after selling, calm clarity and tangible choices.

### ristrutturare-prima

Didascalia: Prima di cambiare, facciamo due conti.

Soggetto del prompt: A dollhouse-like cutaway room split organically into before and after: left has bare pale walls and an unfinished stool, right has a warm sage wall, coral armchair, plant and simple lamp. A teal paint roller lies in front. Theme: evaluating renovation, stylish not messy.

### lavori-valore

Didascalia: Piccoli interventi, scelte ragionate.

Soggetto del prompt: An architect's editorial still life: a small ivory house with one sage wall panel, a coral paintbrush, elegant teal wrench and three material swatches in ivory, sage and ochre. Theme: choosing useful home improvements without guarantees or upward graphs.

### privato-o-agenzia

Didascalia: Due percorsi. La tua decisione.

Soggetto del prompt: Two soft curving pathways meet at a charming ivory house. On one path a single coral key, on the other a teal portfolio folder beside a sage key. Balanced composition, no winner, no text. Theme: choosing between selling privately and with an agent.

### affittato-o-libero

Didascalia: Ogni situazione apre strade diverse.

Soggetto del prompt: Two adjacent elegant dollhouse rooms: one has a coral sofa, plant and hanging lamp; the other is clean and empty with an open sage door and warm light. Both equally beautiful. Theme: a home occupied or available, respectful and neutral.

### arredare-casa

Didascalia: Uno spazio che si lascia immaginare.

Soggetto del prompt: A beautifully composed interior still life: a generous coral armchair, small round teal side table, ochre floor lamp, folded ivory throw and a tall sage plant in a terracotta pot. No people. Theme: warm thoughtful home staging, sophisticated interiors editorial.

### vendere-reinvestire

Didascalia: Le possibilità si confrontano, con calma.

Soggetto del prompt: A small ivory house on one low platform and a healthy sage plant growing from an elegant teal pot on a second platform, linked by a simple curved coral path. A few blank paper shapes. Theme: comparing future possibilities, no cash, graphs or promises of growth.

### immobile-ereditato

Didascalia: Una storia da custodire. Una scelta da fare.

Soggetto del prompt: A warm dignified still life: an ivory family house miniature, an old-fashioned teal key tied with soft coral ribbon, two leaning blank photo frames suggesting family memories and a gentle sage branch. Respectful, warm, not playful or sentimental excess.

### trasferimento

Didascalia: Nuova città, nuovo capitolo.

Soggetto del prompt: Two beautiful packed moving boxes in ochre and ivory, a coral suitcase, a potted sage plant and a teal key. Behind them two simplified distant city skylines connected by a subtle curving route. Theme: moving to a new city, optimistic and welcoming.

### casa-piu-piccola

Didascalia: Meno spazio, nuove possibilità.

Soggetto del prompt: A larger ivory home and a smaller welcoming sage-and-ivory cottage connected by a short coral stepping path, a cozy chair and a small potted plant near the cottage. Both houses dignified and attractive. Theme: downsizing to a comfortable next chapter.

### seconda-casa

Didascalia: Il piacere di averla. Il costo di tenerla.

Soggetto del prompt: A charming ivory holiday cottage with muted coral shutters, an ochre parasol, a sage olive tree and a simple teal deckchair. A small blank notebook rests on a side table. Theme: the pleasures and practical costs of a second home.

### casa-vuota

Didascalia: Anche una casa ferma ha la sua vita.

Soggetto del prompt: A quiet sophisticated room with one coral armchair, a healthy sage plant, a large sunlit arched window, and an unmarked ivory wall calendar with a small teal hanging ring. Gentle long shadows, no people. Theme: an empty home waiting, warm and contemplative not abandoned.

### vendere-o-affittare

Didascalia: Una casa. Due strade da esplorare.

Soggetto del prompt: An ivory house sitting at a gentle fork in a coral path, one branch leading to a sculptural teal key and the other to an open sage door. A small warm sun and leaf. Theme: selling versus renting, balanced possibilities with no text on signs.

### home

Didascalia: Le scelte di casa, con un po’ più di leggerezza.

Soggetto del prompt: A delightful cohesive little Italian neighborhood of three ivory and sage homes, coral roofs, an arched doorway, a tall potted olive tree, a friendly coral armchair on a terrace and an ochre sun. Sophisticated editorial world of home possibilities, warm, modern and subtly playful.
