export interface Poi {
  id: string
  order: number
  name: string
  nameEl: string
  lat: number
  lng: number
  /** Geofence trigger radius in meters. */
  radiusM: number
  audio: string
  photo: string | null
  /** One-line hook shown in the list. */
  tagline: string
  /** Full narration text — also the ElevenLabs TTS input. */
  transcript: string
}

/** Welcome track played on "Start tour" (also unlocks iOS audio). */
export const INTRO_AUDIO = 'audio/intro.mp3'

export const INTRO_TRANSCRIPT = `Yia sou! Welcome to Zakynthos Town — or as the Venetians called this whole island, the Flower of the East.

Here's how this works. Keep me in your pocket, keep your eyes on the town. As you walk, I'll notice when you get close to one of the fifteen stops, and I'll simply start talking. No tapping, no reading, no craning at your screen — just walk. If you'd rather browse, every stop is on the map and in the list, one tap to play.

Everything is stored on your phone, so I work with no signal at all — up on the castle hill, out on the pier, anywhere.

One honest word before we start: almost nothing you're about to see is as old as it looks, and that is exactly what makes this town extraordinary. In August 1953 the earth erased it — and the people of Zakynthos rebuilt their Venetian city from memory. Today you'll meet a saint who forgave the unforgivable, a poet who wrote a national anthem to the sound of distant cannon fire, a mayor who handed the Nazis a list with two names on it, and a square where they burned the book of the nobles.

The full walk is about six kilometers, sea level to castle. Wear comfortable shoes, carry water — and let's go find stop number one, the church with the tall Venetian bell tower by the port: Saint Dionysios.`

export const POIS: readonly Poi[] = [
  {
    id: 'agios-dionysios',
    order: 1,
    name: 'Church of Agios Dionysios',
    nameEl: 'Ιερός Ναός Αγίου Διονυσίου',
    lat: 37.77805,
    lng: 20.89841,
    radiusM: 60,
    audio: 'audio/agios-dionysios.mp3',
    photo: null,
    tagline: 'The saint who sheltered his brother’s killer',
    transcript: `Look up first. That bell tower — forty meters of it — should feel familiar if you've ever seen a postcard of Venice. It was deliberately modeled on the campanile of Saint Mark's, a little declaration that this island spent three hundred years as Venetian, not Ottoman. While the rest of Greece lived under the sultans, Zakynthos was drinking wine in a piazza.

Now the man inside. Draganigos Sigouros, born 1547 into one of the noblest families on the island. At around twenty, freshly orphaned, he did something baffling for a rich young aristocrat: gave everything to his brother and sailed off to become a monk. He rose to archbishop, gave that up too, and settled into a quiet monastery life. Which is where the story turns dark.

One night a fugitive hammered on the monastery door — a murderer, with a mob behind him, begging for sanctuary. Dionysios took him in. And as the man confessed, the monk realized who the victim was. Constantine. His own brother.

Take a second with that. The man standing in front of him had just killed his brother. And Dionysios — grieving, shaking, whatever he was — hid him, fed him, and helped him escape by boat. Tradition adds that the killer later returned and spent the rest of his life as a monk in that same monastery. That's why Greeks call Dionysios the Saint of Forgiveness, and why his story still stops people mid-step four centuries later.

He died in 1622. When they exhumed the body three years on, it hadn't decayed — and it's here, inside, in a silver casket to the right of the altar. Locals will tell you, absolutely straight-faced, that he walks the island at night doing miracles: his slippers keep wearing out, and the church really does replace them, cutting up the old ones for blessings. Legend? Officially, yes. But nobody here says it like a joke.

One practical note: shoulders and knees covered inside, and the church usually rests in the early afternoon, like everyone sensible in Greece. And notice this building survived 1953 almost untouched — hold that thought; it's a story we'll finish downtown.`,
  },
  {
    id: 'faneromeni',
    order: 2,
    name: 'Faneromeni Quarter',
    nameEl: 'Παναγία Φανερωμένη / Συνοικία Φανερωμένης',
    lat: 37.77885,
    lng: 20.89635,
    radiusM: 65,
    audio: 'audio/faneromeni.mp3',
    photo: null,
    tagline: 'The grandest church of old Zante — and the storyteller next door',
    transcript: `A few quiet blocks inland from the port, you're in the Faneromeni quarter — and in front of what was, for three centuries, the most splendid church in Zakynthos. Some said in all of Greece.

Panagia Faneromeni — the Virgin Revealed. Founded in the fifteenth century; tradition says it began with a small icon of the Virgin found washed up on the beach — a legend, but a lovely one for a harbor town. By 1644, under Venice, it had grown into a jewel box: ceiling paintings by Nikolaos Doxaras and his students, masters of that Ionian school you'll hear more about at the museum, and a wood-carved icon screen made in 1659 by a Cretan craftsman named Manos Maganiaris. Grand tour travelers made detours for this building.

Then August 1953. The church collapsed and burned with the rest of the town — of the famous interior, only fragments were pulled from the ashes, and you can stand in front of them today in the Museum of Zakynthos on the main square. The church itself was rebuilt in its old form, stone by stone. Notice the bell tower: the old one was the only piece left standing, an oriental-looking oddity locals loved — the rebuilt campanile still watches over the same lanes.

And one street over lived a man you should know: Grigorios Xenopoulos. Novelist, playwright, one of the fathers of modern Greek fiction — and for fifty-two years, from 1896 to 1948, the editor and beating heart of a children's magazine called "The Molding of Children," which taught generations of Greek kids to love reading. He grew up here, put this town into novel after novel, and died in January 1951 — mercifully, two years before his beloved streets were erased. His family house on Gaita street is now a small museum, weekday mornings, full of the furniture and manuscripts of a vanished bourgeois Zakynthos.

Solomos, Kalvos, Foscolo, Xenopoulos. One small town. The literary scoreboard here is honestly getting embarrassing for everyone else. Now — back toward the water, and north along the harbor.`,
  },
  {
    id: 'harbor',
    order: 3,
    name: 'The Harbor & Strata Marina',
    nameEl: 'Λιμάνι / Οδός Λομβάρδου',
    lat: 37.783,
    lng: 20.8992,
    radiusM: 100,
    audio: 'audio/harbor.mp3',
    photo: null,
    tagline: 'The town’s front door for five centuries',
    transcript: `You're walking the spine of the town now — the waterfront that connects Saint Dionysios behind you to Solomos Square ahead. Everything and everyone arrived through here for five hundred years: Venetian galleys, British steamers, and above all, currants.

Yes, currants. Tiny black dried grapes. Don't laugh — this was oil money. By the eighteenth century Zakynthos was shipping thousands of tons a year, mostly to England, where bakers couldn't get enough of them. The English word "currant" is just "raisin of Corinth" worn smooth by time, and in English groceries the fruit is still called the Zante currant. This island is literally named on the shelf of every supermarket in Britain. The fortunes that built the mansions and churches here were made one tiny raisin at a time.

Before the earthquake, this promenade was the Strata Marina — the marine street — where the town came to see and be seen in the evening. Ladies with parasols, gentlemen arguing about poetry and politics, brass bands playing. Zakynthos is fanatical about its philharmonic bands to this day; if you hear one rehearsing tonight, that's not for tourists, that's just Tuesday.

Look across the water: on a clear day those mountains are the Peloponnese, the Greek mainland. The ferries beside you still run that crossing to Kyllini. And to the south, the big pyramid of a mountain standing guard over the bay is Skopos — "the lookout."

Every August 24th, this street fills completely: the silver casket of Saint Dionysios is carried out of the church, up the shopping street and back along this waterfront, with bands, incense, and half the island in attendance. If you sail into the harbor that evening, you'd swear the town hadn't changed in three hundred years.

It has, of course. More than almost any town in Europe. Keep walking toward the big square — that's where I'll tell you.`,
  },
  {
    id: 'solomos-square',
    order: 4,
    name: 'Solomos Square',
    nameEl: 'Πλατεία Σολωμού',
    lat: 37.78695,
    lng: 20.89999,
    radiusM: 55,
    audio: 'audio/solomos-square.mp3',
    photo: null,
    tagline: 'The poet whose song became two anthems',
    transcript: `This grand open square by the sea is the town's living room — and it's named for the man on the pedestal: Dionysios Solomos, the national poet of Greece.

His beginning was pure scandal. Born here in 1798, the son of a seventy-something count and his young housekeeper — the old man married her on his literal deathbed to legitimize the boy. Young Dionysios was shipped to Italy for school and came back writing elegant poetry… in Italian. Friends teased him: a Greek poet who can't write Greek? So he taught himself — not the stiff scholarly Greek of the universities, but the living language of fishermen and market women. That choice changed Greek literature forever.

In May 1823, with the War of Independence burning across the water, the twenty-five-year-old sat down and, in about a month, poured out the Hymn to Liberty — one hundred and fifty-eight verses. "I know you by the fearsome edge of your sword." Set to music by Nikolaos Mantzaros, it became the national anthem of Greece in 1865 — and a century later, of Cyprus as well. One poem, two countries. It's routinely called the longest national anthem on earth; mercifully, only the first two verses are sung.

Now turn slowly where you stand, because this square is a time machine with three settings. The elegant arcaded buildings around you: 1950s concrete, rebuilt from photographs after the earthquake. The statue: 1957, standing on the pedestal of its destroyed predecessor. And that small golden-stone church near the water — that one is real. 1561. We're going there next.

By the way, Solomos isn't the only poet from this little town. Ugo Foscolo — Italy's national poet — was born a few streets from here in 1778. One provincial harbor town, the national poets of two different nations. There's something in the water here. Or possibly in the wine.`,
  },
  {
    id: 'national-bank',
    order: 5,
    name: 'The National Bank Building',
    nameEl: 'Κτίριο Εθνικής Τράπεζας',
    lat: 37.78667,
    lng: 20.89925,
    radiusM: 35,
    audio: 'audio/national-bank.mp3',
    photo: null,
    tagline: 'The third survivor',
    transcript: `Remember the arithmetic of August 1953? An entire Venetian city reduced to three standing buildings. You've already met two of them — the church of Saint Dionysios by the port, and the little stone church of Saint Nicholas on the square behind you. Here, just off the square, is the third. A bank.

Yes — a saint, a sailor's chapel, and a bank. Insert your own joke about what this town valued; the locals certainly have.

Look at the facade. This is real nineteenth-century neoclassical stonework — not the 1950s concrete tribute you've been walking past all morning, but the thing itself: original window surrounds, original proportions, a building that simply refused. While everything around it pancaked and burned, the bank stood — which is why it could be restored to exactly its pre-earthquake self rather than rebuilt from photographs. Run your eye along the square: this is the only large secular building in the whole town center that Solomos or Xenopoulos would still recognize at a glance.

Why did it survive? Sober masonry, good foundations, a bit of luck — the same recipe as the two churches. For the record, some old-timers stretch the survivors' list a little further, adding a school building out in the Ammos district and a mansion beyond the town — but "the three survivors" is how the story is told here, and standing before number three, you've now completed the set.

There's something quietly moving about it, too. In the weeks after the quake, with the town in ashes and half its people sleeping in tents, this building meant records, savings, proof of who owned what — the paper skeleton of a community that had lost its body. The town rebuilt itself around exactly these survivors, like flesh around bones.

The museum with the rescued icons is a few steps north — if you haven't been in yet, now's the moment.`,
  },
  {
    id: 'byzantine-museum',
    order: 6,
    name: 'Museum of Zakynthos (Byzantine Museum)',
    nameEl: 'Μουσείο Ζακύνθου',
    lat: 37.78732,
    lng: 20.89955,
    radiusM: 35,
    audio: 'audio/byzantine-museum.mp3',
    photo: null,
    tagline: 'The rescued soul of a hundred lost churches',
    transcript: `This building on the west side of the square is, honestly, a rescue shelter. When the earthquake and fire of 1953 destroyed the town, they destroyed with it around a hundred churches — churches stuffed with three centuries of painting and carving from the days when Zakynthos was the artistic capital of Greece. What could be pulled from the rubble was gathered here. The museum opened in 1960 as the town's memory made visible.

Why was there so much to save? Because of a strange accident of history. When Crete fell to the Ottomans in the 1600s, its icon painters — the finest in the Greek world — fled to the Ionian islands, still safely Venetian. Zakynthos became their refuge. Here, Byzantine solemnity collided with Italian naturalism, and out came something new: the Ionian school. Saints with real faces, real shadows, real emotion. Inside you'll find a thousand works tracing that whole evolution — plus entire gilded iconostasis walls, carved and gold-leafed, lifted out of ruined churches and reassembled here like ships in a bottle.

But the single most important exhibit isn't an icon. It's a scale model of this town as it stood before August 1953. Find it. Study it. There's the Strata Marina you just walked, the theaters, the bell towers, the tight Venetian streets. Locate the little church of Saint Nicholas on the model — then step back outside and find the real one, standing right there. It's the only thing on that model you can still touch.

Do that once, and you'll understand this town for the rest of your walk — you'll see the ghost city underneath the real one everywhere you look.

Practical bits: it's a few euros to enter, it keeps state-museum hours — mornings, till mid-afternoon — and it's closed on Tuesdays. If it's open and you have forty-five minutes, this is the best-spent ticket in town.`,
  },
  {
    id: 'agios-nikolaos-molou',
    order: 7,
    name: 'Agios Nikolaos tou Molou',
    nameEl: 'Άγιος Νικόλαος του Μώλου',
    lat: 37.78694,
    lng: 20.90058,
    radiusM: 50,
    audio: 'audio/agios-nikolaos-molou.mp3',
    photo: null,
    tagline: 'Oldest building in town — a 1561 survivor',
    transcript: `Walk up and put your hand on the corner of this little church. Golden stone, warm in the sun, rough under your fingers. You are now touching the oldest building in Zakynthos Town — 1561 — and one of only three that survived August 1953. Everything else you can see in every direction is younger than your grandparents.

It was built by the seamen's guild — the fishermen and sailors of the harbor — for their protector, Saint Nicholas. And here's the lovely detail: it didn't originally stand on a square at all. It stood on a tiny islet out on the harbor mole — molou means "of the mole" — with a bridge connecting it to town. Sailors rowed past their own church on the way out to sea. Over the centuries the harbor was filled in around it, and the land quietly walked out to meet the church. The bell tower earned its keep too: for years it doubled as the port's lighthouse. A church that was literally a lighthouse — the metaphor writes itself, and I refuse to do it.

One more thread ties this spot to the start of your walk: a young priest served in this very church in the late 1500s — Dionysios Sigouros, before he became Saint Dionysios, the man in the silver casket by the port. His bishop's vestments are still kept here. Small town, tight weave.

Now do one thing for me. Look at this church's rough Renaissance stonework — then look across at the smooth pale arcades around the square. Same style, same arches. But one is 1561 stone and the rest is 1950s reinforced concrete, rebuilt from old photographs. That contrast — the original and the loving replica standing side by side — is the whole story of modern Zakynthos in a single glance. The full earthquake story is coming two stops from now, in the arcades where it's best told.`,
  },
  {
    id: 'kyria-angelon',
    order: 8,
    name: 'Kyria ton Angelon — Our Lady of the Angels',
    nameEl: 'Κυρία των Αγγέλων',
    lat: 37.7895,
    lng: 20.89976,
    radiusM: 45,
    audio: 'audio/kyria-angelon.mp3',
    photo: null,
    tagline: 'The notaries’ church — and the town that organizes itself',
    transcript: `This small church, Our Lady of the Angels, was built in 1687 — and here's the detail I love: it wasn't built by a bishop or a noble family. It was built by the guild of notaries. The town's contract-writers and will-stampers pooled their fees and raised a church, the way the sailors' guild had raised Saint Nicholas down on the square a century earlier. In old Zakynthos, if your profession mattered, it had its own church — holiness with a membership list.

And they built well. Look at the carved stone facade, and find the reliefs — the Virgin among angels, and on the bell tower, older carved plaques including a double-headed eagle and the Archangel Michael. Inside, when it's open, there's a gilded wood-carved icon screen with icons attributed to the Doxaras workshop — the family that dragged Greek painting out of the Byzantine ice and into warm Italian light. The 1953 earthquake flattened this church like nearly everything else; the town rebuilt it from its own stones, carvings and all.

That instinct — organize yourselves, don't wait for permission — is maybe the most Zakynthian thing there is, so let me give you the best example. In 1816, the town wanted a brass band for Saint Dionysios's procession and asked the British garrison to lend theirs. The British said no. So the Zakynthians, magnificently offended, founded their own — the Philharmonic, the first in all of Greece, more than two centuries old and still teaching local kids music for free. Every other band in the country is, musically speaking, this one's grandchild. It's why brass on a warm evening is simply part of the local weather, along with the kantades — those mandolin-and-guitar serenades men still sing in taverna corners, a habit soaked up from Italian bel canto and never given back.

And if you're ever here at Easter: at the First Resurrection, this town celebrates by hurling clay pots to smash on the squares. Faith, joy, and controlled demolition — Zakynthos in one custom.`,
  },
  {
    id: 'agios-markos',
    order: 9,
    name: 'Agios Markos Square',
    nameEl: 'Πλατεία Αγίου Μάρκου',
    lat: 37.7883,
    lng: 20.89893,
    radiusM: 45,
    audio: 'audio/agios-markos.mp3',
    photo: null,
    tagline: 'Bonfire of the nobles; tomb of two poets',
    transcript: `This small triangular square is Zakynthos doing its best Venice impression — even the name is Saint Mark's. For centuries this was the town's salon: nobles, wits, and littérateurs holding court in the cafés. The church with the pointed facade is Saint Mark's — Catholic, founded 1518, the only Catholic church on the island. Venice left its religion here as well as its arches.

But the best scene this square ever staged was pure revolution. For three hundred Venetian years, what mattered on this island was whether your family was written in the Libro d'Oro — the Golden Book of nobility. In it: you were somebody. Not in it: you bowed. Then, in 1797, Napoleon snuffed out the Venetian Republic, French republican troops landed, and the common people of Zakynthos — the popolari — knew exactly what to do. They planted a Tree of Liberty right about where you're standing, fetched the Golden Book, and burned it. Centuries of aristocratic privilege, cooked to ash in an afternoon, in front of the very church named for Venice's patron. History rarely arranges its symbolism this neatly.

Facing the square is the Museum of Solomos and Eminent Zakynthians — and this one is personal. Downstairs, in the mausoleum, lie the bones of Dionysios Solomos himself, and beside him Andreas Kalvos, the island's other great poet. Kalvos died forgotten in a village in Lincolnshire, England; in 1960, a full century on, Greece sent a warship to bring him and his English wife home — the paperwork handled by the ambassador in London, a poet named George Seferis, who'd go on to win the Nobel. Poets burying poets, with a navy in between.

At the museum entrance, look for a piece of old tree trunk. Remember it. It comes from a hill above town, and when we get up there at the end of the walk, it will break your heart a little. The museum's open mornings, four euros — and the story upstairs is told mostly in Greek, so consider me your translator.`,
  },
  {
    id: 'roma-mansion',
    order: 10,
    name: 'Alexandrou Roma Street & Roma Mansion',
    nameEl: 'Οδός Αλεξάνδρου Ρώμα / Αρχοντικό Ρώμα',
    lat: 37.78649,
    lng: 20.89747,
    radiusM: 70,
    audio: 'audio/roma-mansion.mp3',
    photo: null,
    tagline: 'Shopping street with a lordly past',
    transcript: `You're now on the town's main shopping street — and it has been exactly that for centuries. Locals still call it the Rouga, from the Venetian word for a market street. Where you now see jewelry, sandals and sunglasses, there were once silk merchants and currant brokers. Same street, same arcades, same evening ritual of walking up one side and down the other. If you want a genuinely local souvenir, look for mandolato — the island's chewy honey-and-almond nougat — sold in old-school confectioneries along here.

The street is named for Alexandros Romas, aristocrat, parliamentarian — he presided over the Greek Parliament — and the kind of man who, when a war broke out, personally organized a volunteer unit called the Red Shirts and marched off toward Ioannina. The Roma family's house still stands a couple of blocks toward the sea, on Louka Karrer street: a mansion from 1660, later the residence of the British governor when Britain ran these islands, bought by the Romas in the 1880s.

Here's why that house matters: it is the only grand mansion in town that came through 1953 standing. Just one. Every other noble house — and this town was full of them — is gone. Behind its walls: family portraits, sabers, and a library of some ten thousand volumes going back to the 1500s. It's privately owned and these days you'll likely only see the outside — but as the sole survivor of an entire vanished world, even its facade is a monument.

And the street it stands on carries a name worth pausing over: Loukas Karrer was the wartime mayor of this town. What he did in 1944 is one of the great stories of occupied Europe — and I'm saving it for the arcades, thirty seconds' walk ahead. Keep going; this one's worth it.`,
  },
  {
    id: 'rouga-1953',
    order: 11,
    name: 'The Arcades & the Great Earthquake',
    nameEl: 'Η Ρούγα & οι Σεισμοί του 1953',
    lat: 37.78548,
    lng: 20.89715,
    radiusM: 60,
    audio: 'audio/rouga-1953.mp3',
    photo: null,
    tagline: 'How a town died in August 1953 — and rose again',
    transcript: `Stop under one of these arcades and put your hand on a column. Cool, smooth concrete. Now, you remember the rough 1561 stone of Saint Nicholas by the sea. Between those two textures lies the event that locals still call, simply, "the Earthquakes."

August 1953. For five days, starting on the 8th, the ground between Kefalonia and Zakynthos would not stay still — over a hundred tremors, each one loosening a little more. Then, late morning on August 12th, the big one: magnitude 7.2. Neighboring Kefalonia was lifted two feet out of the sea — the whole island, permanently. Here in town, what the shaking didn't bring down, what followed did: fire broke out in the ruins and burned the Venetian city — the theaters, the archives, the libraries, the painted churches — down to the waterline. When it was over, at least four hundred and fifty people were dead across the islands, and in this town three buildings stood: Saint Dionysios, Saint Nicholas of the Mole, and the National Bank. Everything else — three centuries of the Flower of the East — was rubble and smoke.

The first help came from the sea, the very next day: British warships, Americans — and four Israeli navy vessels, which had been exercising nearby and became the first foreign disaster mission in Israel's history. And that closes a circle, because nine years earlier the Nazis had demanded this town's mayor, Loukas Karrer, hand over a list of its 275 Jews. Karrer and Bishop Chrysostomos gave them a list with two names: their own. The real families were hidden in mountain villages, and every single one survived — unique in all of Greece. In 1953, ships flying the star of David were among the first to come help. Kindness, it turns out, keeps excellent books.

Then Zakynthos did something remarkable: instead of throwing up cheap emergency blocks, it rebuilt itself as itself — architects working from photographs and old plans, recreating the Venetian facades and these arcades in earthquake-proof concrete. So no, this street isn't "authentic." It's better. It's a town that refused to let its face be taken. Now — uphill. The castle is calling, and the view will reorganize everything you've just seen.`,
  },
  {
    id: 'foscolo',
    order: 12,
    name: 'Casa Ugo Foscolo & the Weeping Angel',
    nameEl: 'Οικία Ούγκο Φώσκολο',
    lat: 37.78471,
    lng: 20.89751,
    radiusM: 45,
    audio: 'audio/foscolo.mp3',
    photo: null,
    tagline: 'Italy’s national poet, born on this street',
    transcript: `On this street in 1778, in a house on this very spot, Italy's national poet was born. Not Greece's — Italy's. Ugo Foscolo, son of a Venetian father and a Greek mother, baptized here as little Niccolò before the world knew him as anything at all.

He left as a boy, chased revolutions and Napoleon across Italy, wrote the poems every Italian schoolchild still memorizes — and never once managed to come home. His most famous sonnet, "A Zacinto" — "To Zante" — is this island's love letter written from exile: never again shall I touch your sacred shores, my Zakynthos, where my child's body lay. He predicted he would die far away, in an unwept grave. He was right on the geography: he died poor in London in 1827. He was wrong about unwept — Italy later carried him home in state to Santa Croce in Florence, to lie among Michelangelo and Galileo.

Zakynthos never forgot its Italian son. Look for the marble cenotaph here with its Weeping Angel — a mourning figure draped over a memorial for the poet who mourned this island his whole life. The house itself, like almost everything, is a post-1953 reconstruction, faithfully rebuilt with his memorabilia inside; there's a bust of him up on Solomos Square too, a few steps from Solomos himself. Two national poets of two nations, born a few hundred meters apart.

And his name is stitched into the town another way. The old municipal theater — designed in the 1870s by Ernst Ziller, the great architect of neoclassical Athens — was named the "Foskolos." It was wrecked by the earthquake of 1893, rebuilt to Ziller's identical plans in 1903, filled with opera and operetta for half a century in a town mad for music... and then 1953 took it for good. On the facade of the Cultural Center that replaced it, they mounted the salvaged capitals of the old theater's pilasters — go look, later: actual pieces of the opera house, worn like medals on its successor's chest.`,
  },
  {
    id: 'pikridiotissa',
    order: 13,
    name: 'Panagia Pikridiotissa & the Climb',
    nameEl: 'Παναγία Πικριδιώτισσα',
    lat: 37.78686,
    lng: 20.89472,
    radiusM: 70,
    audio: 'audio/pikridiotissa.mp3',
    photo: null,
    tagline: 'Where Dionysus may sleep under the Virgin',
    transcript: `Breathe. Yes, it's uphill — about twenty minutes from the square to the castle gate — but you're climbing through the oldest layer of the town, and every switchback buys you more of the view.

This little church you're passing is Panagia Pikridiotissa, the Virgin of Pikridis, named for a priest-and-notary who ran this parish in the 1500s. It began as a monastery in the late fifteenth century, and it sits — if the old accounts are to be believed — on far older bones. Tradition says a temple of Dionysus stood here: the god of wine, on the wine island. When foundations were dug, the story goes, workers found an underground chamber with Doric columns and a marble Bacchus. Archaeology or embroidery? Hard to say at this distance. But look by the church: that lone marble Doric column standing outside isn't a garden ornament. Something ancient really was here, and you're allowed to touch it.

This church has been knocked down and rebuilt by earthquakes more times than anyone bothered counting — 1630, the 1700s, and of course 1953, which also toppled its famously exotic, oriental-looking bell tower. Its icons were carried down to the museum on the square; the church, as ever, was rebuilt. On this island, persistence is the local religion, whatever the official one says.

A little above the town you also pass close to Agios Georgios ton Filikon — Saint George of the Friends. Tradition holds that members of the Filiki Etaireia, the secret brotherhood that plotted the Greek Revolution, swore their oaths there, and that the old warlord Kolokotronis himself prayed in it during his exile years on the island. Conspirators always did like a discreet chapel with a good escape route downhill.

Turn around at the church terrace before you go on. That's your first proper aerial view: the rebuilt grid of the town, the harbor, Skopos across the bay. From up here the 1950s street plan reads clearly — wide, ordered, earthquake-wise. Now onward and upward: Venice's fortress is waiting in the pines.`,
  },
  {
    id: 'bochali-castle',
    order: 14,
    name: 'Bochali Hill & the Venetian Castle',
    nameEl: 'Μπόχαλη / Ενετικό Κάστρο',
    lat: 37.78955,
    lng: 20.8927,
    radiusM: 120,
    audio: 'audio/bochali-castle.mp3',
    photo: null,
    tagline: 'The vanished capital above the pines',
    transcript: `A hundred and forty-five meters above the sea, in a forest of pines, you've reached the castle — and here's the twist: you're not standing above the old town. You're standing in it. For most of Venetian rule, THIS was Zakynthos. Inside these walls lived the governor — the provveditore — the noble families, the garrison, churches, prisons, the lot. The city by the harbor below is the suburb that escaped downhill and then ate its parent.

People have fortified this hill more or less forever — it was the acropolis of the ancient Greek city, then a Byzantine fort. What you're walking through now is mostly Venice's work: begun around 1480, patched after raids in 1514, and completed in 1646. Pass through the three successive gates and look up at the main one: that carved winged lion holding a book is the Lion of Saint Mark, the trademark of the Venetian Republic, still signing this hilltop five hundred years on. When the British took over in the 1800s they moved in too — some of the barrack ruins among the trees are theirs, red-coat vintage.

And yet the castle's real conqueror was never an army. It was the ground itself. Earthquake after earthquake shook the buildings inside these walls to rubble, and people simply gave up rebuilding up here. What's left is one of the most atmospheric ruins in the Ionian: walls, gates, powder magazines, foundations dissolving into pine needles and birdsong.

The view, though, is undefeated. From the eastern battlements the whole town lies at your feet like the museum's scale model come to life — trace your entire route: the campanile of Saint Dionysios, the waterfront, Solomos Square. Mind the details if you want inside: the site keeps morning hours, roughly till mid-afternoon, and is closed on Tuesdays — and there may be restoration works around. If the gate is shut, the terraces of Bochali village just below pour coffee and wine right on top of this same view, and at sunset they are, frankly, the best seats in the prefecture.

One more stop. A quiet hill just beyond, where a young man sat under a tree and listened to a war.`,
  },
  {
    id: 'strani-hill',
    order: 15,
    name: 'Strani Hill',
    nameEl: 'Λόφος Στράνη',
    lat: 37.79683,
    lng: 20.89,
    radiusM: 150,
    audio: 'audio/strani-hill.mp3',
    photo: null,
    tagline: 'Where an anthem was born to cannon fire',
    transcript: `This quiet, pine-scented hilltop is the most sacred literary ground in Greece. Find the monument — the column with the bronze bust, and Liberty striding forward with her sword — and then face northeast, out across the water. Somewhere beyond that horizon, about ninety kilometers away, lies Missolonghi.

In the 1820s, Greece was fighting its war of independence — but not here. The Ionian islands were British, officially neutral, agonizingly close. And Missolonghi, the rebel stronghold across the water, was under Ottoman siege. On still days, they say, the sound of the siege guns carried all the way to this hill — a low thudding on the wind, like a heartbeat under the sea.

Dionysios Solomos used to climb up here and sit under a great old tree. In May of 1823, twenty-five years old, with that war filling the air, he wrote the Hymn to Liberty — by tradition, right here, in one incandescent month. "I know you by the fearsome edge of your sword; I know you by the look that measures the earth." A hundred and fifty-eight verses that became the anthem of Greece, and later of Cyprus too. Every Olympic Games closes with it. It started under a tree you're standing next to.

But the guns weren't done with him. In 1825 and '26 came the final siege of Missolonghi — a year of starvation ending in the famous Exodus, when the defenders chose to break out rather than surrender, and refugees from the fallen town washed up here on Zakynthos. What Solomos heard and saw became his life's obsession: The Free Besieged, a poem about people who are utterly trapped and still, inwardly, free. He reworked it for twenty years and never finished it. Some things shouldn't be finished.

The old tree is gone now — but you've already met it. That piece of trunk at the museum entrance, down by Saint Mark's Square? This is where it grew.

And that's the walk. From a saint who forgave his brother's killer, to a town that rebuilt itself from photographs, to a song written to distant artillery that two nations now stand up for. The Flower of the East keeps getting cut down, and keeps blooming. Thanks for walking it with me — now go down to Bochali and earn your sunset. Yia mas!`,
  },
] as const
