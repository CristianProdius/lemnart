export interface BlogPost {
    slug: string
    title: string
    excerpt: string
    content: string
    coverImage: string
    date: string
    readTime: string
    category: string
    author: {
        name: string
        role: string
    }
}

/**
 * Blog posts data.
 *
 * To add a new post: copy an entry, change the slug (must be unique),
 * and fill in the fields. The `content` field supports simple HTML
 * tags: <p>, <h2>, <h3>, <ul>, <li>, <strong>, <em>, <blockquote>.
 */
export const blogPosts: BlogPost[] = [
    {
        slug: "de-ce-mascare-calorifere-din-lemn-masiv",
        title: "De ce mascările calorifere din lemn masiv sunt investiția perfectă pentru casa ta",
        excerpt:
            "Descoperă avantajele mascărilor din lemn masiv față de alternativele din MDF sau plastic — durabilitate, estetică naturală, eficiență termică și valoare pe termen lung pentru locuința ta.",
        content: `
            <p>Caloriferele sunt esențiale pentru confortul termic al casei, dar rareori sunt un element decorativ. Conductele expuse, formele industriale și vopseaua îngălbenită de timp pot strica estetica oricărei camere. Aici intervine <strong>mascarea caloriferului din lemn masiv</strong> — soluția care transformă un element funcțional într-o piesă de design interior.</p>

            <p>La LemnArt, credem că fiecare detaliu al casei tale merită atenție. De aceea, fiecare mascare pe care o producem este realizată manual, din lemn natural, cu respect pentru material și pentru spațiul în care va trăi.</p>

            <h2>Lemnul masiv vs. MDF vs. Plastic: Ce trebuie să știi</h2>

            <p>Piața oferă mai multe opțiuni pentru mascarea caloriferelor, dar diferențele dintre materiale sunt semnificative pe termen lung.</p>

            <p><strong>MDF-ul</strong> (Medium Density Fiberboard) este cel mai comun material pentru mascări ieftine. Este ușor de prelucrat și are un cost redus, dar prezintă dezavantaje majore: se umflă la contact cu umiditatea, se deformează în timp din cauza căldurii constante și emite formaldehidă — un compus chimic nociv — mai ales la temperaturi ridicate. Într-un context în care mascarea stă permanent lângă o sursă de căldură, acesta nu este un detaliu neglijabil.</p>

            <p><strong>Plasticul</strong> este și mai problematic. Deși rezistent la umiditate, se decolorează rapid de la căldură, devine casant în timp și are un aspect artificial care nu se integrează într-un interior premium.</p>

            <p><strong>Lemnul masiv</strong> este singurul material care se comportă natural în condiții de căldură și umiditate variabilă. Se dilată și se contractă organic, fără să se deformeze structural. Mai mult, nu emite substanțe toxice și devine mai frumos cu trecerea anilor, dezvoltând o patină naturală unică.</p>

            <h2>Durabilitate care traversează generații</h2>

            <p>O mascare din lemn masiv nu este un produs de înlocuit la câțiva ani. Cu îngrijire minimă — o ștergere cu cârpă uscată și, opțional, un tratament cu ulei de lemn o dată pe an — o mascare LemnArt poate dura <strong>decenii fără să-și piardă aspectul sau funcționalitatea</strong>.</p>

            <p>Am avut clienți care ne-au contactat pentru o a doua comandă după 15 ani — nu pentru că prima mascare s-a deteriorat, ci pentru că au reamenajat o altă cameră și au vrut să mențină același standard de calitate.</p>

            <h2>Estetică unică — fiecare piesă este un unicat</h2>

            <p>Spre deosebire de materialele industriale, lemnul masiv are un <strong>desen natural al fibrei care este unic pentru fiecare piesă</strong>. Nu există două mascări identice. Aceasta conferă autenticitate și caracter spațiului — o calitate imposibil de replicat cu materiale sintetice sau presate.</p>

            <p>Oferim o gamă variată de finisaje care evidențiază frumusețea naturală a lemnului: de la alb mat elegant la nuanțe calde de stejar, de la gri antracit sofisticat la auriu metalic cu reflexe subtile.</p>

            <h2>Eficiență termică — căldura circulă, nu se blochează</h2>

            <p>O întrebare frecventă este: „Nu blochează mascarea căldura caloriferului?" Răspunsul este nu — dacă este proiectată corect. Mascările LemnArt sunt concepute cu <strong>grile de ventilație calculate precis</strong> pentru a permite circulația optimă a aerului cald. Studiile arată că o mascare bine proiectată poate chiar îmbunătăți distribuția căldurii în cameră, direcționând fluxul de aer cald spre centrul încăperii în loc să urce direct pe perete.</p>

            <h2>Valoare adăugată pentru locuință</h2>

            <p>Din perspectiva valorii imobiliare, mascările din lemn masiv sunt un detaliu care face diferența. Agenții imobiliari confirmă că finisajele premium — inclusiv mascările calorifere din lemn — contribuie la percepția de calitate a locuinței și pot influența pozitiv prețul de vânzare.</p>

            <blockquote>„Detaliile definesc calitatea unui interior. O mascare din lemn masiv spune vizitatorului, fără cuvinte, că proprietarul a ales cu grijă fiecare element al casei sale."</blockquote>

            <h2>Concluzie</h2>

            <p>Alegerea lemnului masiv pentru mascările calorifere nu este doar o decizie estetică — este o investiție în <strong>durabilitate, sănătate, confort și valoare</strong>. Este alegerea care se vede și se simte în fiecare zi, în fiecare cameră. Și este alegerea pe care, peste ani, nu o vei regreta niciodată.</p>

            <p>Explorează colecția noastră sau contactează-ne pentru o consultație gratuită — te ajutăm să găsești mascarea perfectă pentru casa ta.</p>
        `,
        coverImage: "/blog/mascare-lemn.jpg",
        date: "2026-03-10",
        readTime: "6 min",
        category: "Ghid",
        author: {
            name: "Echipa LemnArt",
            role: "Artizani",
        },
    },
    {
        slug: "ghid-complet-alegerea-dimensiunii-mascare-calorifer",
        title: "Ghid complet: Cum alegi dimensiunea perfectă pentru mascarea caloriferului",
        excerpt:
            "Pas cu pas — de la măsurarea caloriferului până la alegerea tipului de montaj. Tot ce trebuie să știi pentru a comanda mascarea cu dimensiunile corecte.",
        content: `
            <p>Unul dintre cele mai importante aspecte atunci când comanzi o mascare calorifer este <strong>alegerea dimensiunii corecte</strong>. O mascare prea mică nu va acoperi caloriferul complet, iar una prea mare va arăta disproporționat în cameră. În acest ghid, îți explicăm pas cu pas cum să faci măsurătorile corect și ce factori trebuie să iei în considerare.</p>

            <h2>Pasul 1: Măsoară caloriferul cu precizie</h2>

            <p>Ai nevoie de trei măsurători esențiale:</p>

            <ul>
                <li><strong>Lățimea</strong> — Măsoară de la capătul stâng la capătul drept al caloriferului, incluzând robinetele laterale dacă există</li>
                <li><strong>Înălțimea</strong> — De la baza caloriferului până la partea superioară, inclusiv ventilul de aerisire de sus</li>
                <li><strong>Adâncimea</strong> — De la perete până la punctul cel mai avansat al caloriferului (de obicei fața frontală)</li>
            </ul>

            <p><strong>Sfat important:</strong> Măsoară de cel puțin două ori fiecare dimensiune. O eroare de câțiva milimetri poate face diferența între o mascare care se potrivește perfect și una care necesită ajustări.</p>

            <h2>Pasul 2: Adaugă spațiul de ventilație</h2>

            <p>Caloriferul are nevoie de spațiu pentru ca aerul cald să circule eficient. Regulile de bază sunt:</p>

            <ul>
                <li><strong>Lățime:</strong> Adaugă minimum 5 cm pe fiecare parte laterală (total +10 cm)</li>
                <li><strong>Înălțime:</strong> Adaugă minimum 5 cm deasupra caloriferului pentru evacuarea aerului cald</li>
                <li><strong>Adâncime:</strong> Adaugă minimum 3 cm față de caloriferul în sine pentru circulația aerului între calorifer și grila frontală</li>
            </ul>

            <p>Aceste spații nu sunt opționale — sunt esențiale pentru eficiența termică. O mascare prea strânsă pe calorifer poate reduce eficiența de încălzire cu până la 15-20%.</p>

            <h2>Pasul 3: Verifică spațiul disponibil</h2>

            <p>Înainte de a finaliza dimensiunile, verifică:</p>

            <ul>
                <li><strong>Distanța până la pervaz</strong> — Mascarea trebuie să se integreze sub pervaz? Sau va sta independent? Măsoară spațiul disponibil</li>
                <li><strong>Mobilier adiacent</strong> — Există dulapuri, canapele sau alte piese de mobilier care limitează spațiul? Asigură-te că mascarea nu va interfera cu deschiderea ușilor sau sertarelor</li>
                <li><strong>Prize și întrerupătoare</strong> — Verifică dacă există prize electrice care ar fi acoperite de mascare. Putem crea decupaje speciale pentru acestea</li>
                <li><strong>Conducte aparente</strong> — Dacă conductele de alimentare vin din podea sau din perete lateral, mascarea trebuie să aibă spațiu sau decupaje pentru acestea</li>
            </ul>

            <h2>Pasul 4: Alege tipul de montaj</h2>

            <p>Tipul de montaj influențează direct dimensiunile necesare:</p>

            <h3>Montaj pe perete (suspendat)</h3>
            <p>Mascarea se fixează direct pe perete cu sisteme de prindere invizibile. Este cea mai elegantă opțiune — mascarea pare că „plutește" pe perete. Necesită un perete solid (cărămidă, beton) și este ideală pentru calorifere care nu ajung până la podea.</p>

            <h3>Montaj liber (pe podea)</h3>
            <p>Mascarea stă pe podea, rezemată de perete. Nu necesită găurirea peretelui, este ușor de mutat pentru curățenie și se potrivește oricărui tip de perete, inclusiv rigips.</p>

            <h3>Montaj integrat (nișă)</h3>
            <p>Pentru calorifere situate în nișe arhitecturale, mascarea se realizează la dimensiunile exacte ale nișei, creând un aspect flush, integrat în perete. Aceasta este opțiunea cea mai premium din punct de vedere estetic.</p>

            <h2>Dimensiuni standard vs. la comandă</h2>

            <p>Oferim o gamă de <strong>dimensiuni standard</strong> care acoperă majoritatea caloriferelor din locuințele românești:</p>

            <ul>
                <li><strong>60×40 cm</strong> — Pentru calorifere mici de baie</li>
                <li><strong>80×60 cm</strong> — Pentru calorifere medii</li>
                <li><strong>100×60 cm</strong> — Cel mai popular format, potrivit pentru livinguri</li>
                <li><strong>120×60 cm</strong> — Pentru calorifere extinse</li>
                <li><strong>140×60 cm</strong> — Pentru calorifere mari</li>
                <li><strong>160×60 cm</strong> — Pentru calorifere duble sau foarte late</li>
            </ul>

            <p>Dacă niciuna dintre dimensiunile standard nu se potrivește, realizăm <strong>mascări la comandă</strong>, la dimensiunile exacte de care ai nevoie. Procesul este simplu: ne trimiți măsurătorile, noi confirmăm fezabilitatea și livrăm piesa finită în 10-15 zile lucrătoare.</p>

            <blockquote>„Fiecare casă este unică, iar mascarea caloriferului trebuie să se integreze perfect în spațiu. De aceea, peste 40% din comenzile noastre sunt piese la dimensiuni personalizate."</blockquote>

            <h2>Greșeli frecvente de evitat</h2>

            <ul>
                <li><strong>Măsurarea fără robinete</strong> — Nu uita să incluzi robinetele termostatice în măsurători</li>
                <li><strong>Ignorarea adâncimii</strong> — O mascare prea puțin adâncă va atinge caloriferul și va bloca aerul</li>
                <li><strong>Uitarea conductelor</strong> — Verifică întotdeauna traseul conductelor de alimentare</li>
                <li><strong>Neglijarea accesului</strong> — Asigură-te că poți accesa ventilul de aerisire și robinetele pentru întreținere</li>
            </ul>

            <h2>Ai nevoie de ajutor?</h2>

            <p>Dacă nu ești sigur de dimensiuni sau ai o situație specială, nu ezita să ne contactezi. <strong>Oferim consultanță gratuită</strong> — ne poți trimite fotografii ale caloriferului și ale spațiului, iar echipa noastră îți va recomanda dimensiunile optime și stilul cel mai potrivit.</p>
        `,
        coverImage: "/blog/dimensiuni.jpg",
        date: "2026-03-05",
        readTime: "7 min",
        category: "Ghid",
        author: {
            name: "Echipa LemnArt",
            role: "Artizani",
        },
    },
    {
        slug: "tendinte-design-interior-2026-materiale-naturale",
        title: "Tendințe design interior 2026: Materialele naturale revin în centrul atenției",
        excerpt:
            "Lemnul, pietrele naturale și tonurile calde domină tendințele anului 2026. Descoperă cum mascările calorifere artizanale se integrează perfect în aceste tendințe.",
        content: `
            <p>Anul 2026 marchează o schimbare fundamentală în designul interior: după ani dominați de minimalismul rece și de materialele industriale, <strong>naturalul revine în forță</strong>. Lemnul masiv, pietrele naturale, textilele organice și nuanțele calde de pământ sunt în centrul celor mai importante tendințe ale anului.</p>

            <p>La LemnArt, această evoluție confirmă filosofia pe care o promovăm de la început: materialele naturale, prelucrate cu măiestrie artizanală, creează spații cu adevărat speciale.</p>

            <h2>1. Warm Minimalism — Minimalismul cald</h2>

            <p>Dacă minimalismul tradițional era definit de linii drepte, suprafețe albe și oțel, <strong>warm minimalism</strong> păstrează simplitatea, dar adaugă căldură. Lemnul cu textură vizibilă, nuanțele de bej și caramel, și materialele cu caracter natural înlocuiesc suprafețele impersonale.</p>

            <p>Mascările calorifere din lemn masiv se încadrează perfect în această tendință: sunt piese simple ca formă, dar bogate în textură și caracter natural. Un calorifer industrial dispare în spatele unei mascări din stejar, iar camera câștigă un element cald și organic.</p>

            <h2>2. Japandi — Fuziunea japoneză-scandinavă continuă</h2>

            <p>Stilul Japandi — combinația dintre estetica japoneză wabi-sabi și funcționalitatea scandinavă — rămâne extrem de popular în 2026. Principiile sale definitorii sunt:</p>

            <ul>
                <li><strong>Imperfecțiunea frumoasă</strong> — Nodurile naturale ale lemnului, variațiile de nuanță și texturile organice sunt celebrate, nu ascunse</li>
                <li><strong>Funcționalitate discretă</strong> — Fiecare obiect trebuie să aibă un scop, dar să fie și frumos</li>
                <li><strong>Materiale naturale</strong> — Lemnul, bambusul, pietrele, textilele din fibre naturale</li>
                <li><strong>Paleta cromatică terestră</strong> — Tonuri de nisip, gri cald, verde mușchi, maro pământiu</li>
            </ul>

            <p>O mascare calorifer din lemn cu finisaj natural, cu grila realizată în pattern-uri geometrice simple, este <strong>esența stilului Japandi</strong> — funcțională, frumoasă și naturală.</p>

            <h2>3. Artizanatul ca statement de design</h2>

            <p>În 2026, consumatorii caută din ce în ce mai mult <strong>piese cu poveste</strong> — obiecte create de mâini umane, nu de mașini industriale. Imperfecțiunile controlate ale meșteșugului artizanal au devenit un semn de lux autentic, în contrast cu uniformitatea produselor de masă.</p>

            <p>Această tendință se reflectă în toate categoriile de design interior: de la ceramica făcută manual la mobilierul sculptat, de la textilele țesute artizanal la — da — mascările calorifere realizate de meșteri cu experiență.</p>

            <blockquote>„În era producției de masă, artizanatul a devenit cel mai rar și mai prețios lux. O piesă lucrate manual nu este doar un obiect — este o poveste, un meșteșug, o tradiție vie."</blockquote>

            <h2>4. Biophilic Design — Natura în interior</h2>

            <p>Designul biofil — integrarea elementelor naturale în spațiile interioare — trece de la tendință la standard în 2026. Nu este vorba doar despre plante de interior, ci despre <strong>o abordare holistică</strong> care include:</p>

            <ul>
                <li>Materiale naturale pe suprafețe mari (podele, pereți, mobilier)</li>
                <li>Lumină naturală maximizată</li>
                <li>Forme organice, curbe și texturi naturale</li>
                <li>Paleta de culori inspirată din natură</li>
            </ul>

            <p>Lemnul masiv al mascărilor calorifere contribuie direct la această estetică: aduce textura și căldura naturii în interiorul casei, transformând un element tehnic (caloriferul) într-un punct de legătură cu lumea naturală.</p>

            <h2>5. Tonuri de pământ și paleta cromatică 2026</h2>

            <p>Culorile anului 2026 sunt inspirate din natură: <strong>bej nisip, gri antracit, verde olive, terracotta, maro ciocolatiu</strong> și nuanțe metalice calde precum aurul vechi și bronzul.</p>

            <p>Mascările noastre sunt disponibile în finisaje care se integrează perfect în aceste palete:</p>

            <ul>
                <li><strong>Alb mat</strong> — Pentru interioare luminoase, scandinave</li>
                <li><strong>Stejar natural</strong> — Tonul cald, perfect pentru Japandi și warm minimalism</li>
                <li><strong>Gri antracit</strong> — Modern și sofisticat</li>
                <li><strong>Negru mat</strong> — Statement bold, pentru interioare contemporane</li>
                <li><strong>Auriu metalic</strong> — Accent de lux, pentru spații premium</li>
            </ul>

            <h2>6. Sustenabilitatea nu mai este opțională</h2>

            <p>În 2026, consumatorii nu mai acceptă compromisuri când vine vorba de sustenabilitate. <strong>Materialele durabile, din surse responsabile, cu amprentă de carbon redusă</strong> nu sunt un bonus — sunt o cerință.</p>

            <p>La LemnArt, folosim lemn din surse certificate, finisaje ecologice pe bază de apă și ambalaje reciclabile. Iar longevitatea produselor noastre este, în sine, cel mai sustenabil aspect: o mascare care durează 30 de ani înseamnă zero deșeuri generate de înlocuiri periodice.</p>

            <h2>Cum să integrezi aceste tendințe în casa ta</h2>

            <p>Nu trebuie să renovezi complet casa pentru a fi în pas cu tendințele 2026. Câteva schimbări strategice pot transforma atmosfera unei camere:</p>

            <ul>
                <li>Înlocuiește mascările de plastic sau MDF cu unele din lemn masiv</li>
                <li>Adaugă texturi naturale: o pledă din lână, perne din in, un covor de iută</li>
                <li>Alege una sau două piese artizanale ca puncte focale ale camerei</li>
                <li>Simplifică — elimină obiectele care nu adaugă valoare estetică sau funcțională</li>
            </ul>

            <p>Mascarea caloriferului este, de fapt, una dintre cele mai impactante schimbări pe care le poți face: <strong>transformă cel mai inestetc element al camerei într-un punct de interes</strong>, cu investiție minimă raportat la efectul vizual.</p>

            <blockquote>„Designul interior în 2026 este despre autenticitate — materiale reale, meșteșug real, povești reale. Și lemnul masiv este cel mai autentic material pe care îl poți aduce în casa ta."</blockquote>

            <p>Explorează colecția noastră și descoperă cum mascările LemnArt se integrează în stilul tău. Sau contactează-ne pentru o consultanță personalizată — te ajutăm să alegi finisajul și dimensiunea perfecte pentru spațiul tău.</p>
        `,
        coverImage: "/blog/tendinte-2026.jpg",
        date: "2026-02-20",
        readTime: "8 min",
        category: "Inspirație",
        author: {
            name: "Echipa LemnArt",
            role: "Design",
        },
    },
]

export function getBlogPost(slug: string): BlogPost | undefined {
    return blogPosts.find((post) => post.slug === slug)
}

export function getAllBlogPosts(): BlogPost[] {
    return blogPosts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
}
