import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Find the first store to seed content into
    const store = await prisma.store.findFirst();

    if (!store) {
        console.log("No store found. Create a store first, then run seed.");
        return;
    }

    console.log(`Seeding content for store: ${store.name} (${store.id})`);

    // ─── Billboards ────────────────────────────────────────────
    const billboard1 = await prisma.billboard.upsert({
        where: { id: "seed-billboard-main" },
        update: {},
        create: {
            id: "seed-billboard-main",
            storeId: store.id,
            label: "Mascări Calorifere din Lemn Masiv",
            imageUrl: "/billboards/mascare-hero.jpg",
        },
    });
    console.log(`  Billboard: ${billboard1.label}`);

    const billboard2 = await prisma.billboard.upsert({
        where: { id: "seed-billboard-accesorii" },
        update: {},
        create: {
            id: "seed-billboard-accesorii",
            storeId: store.id,
            label: "Accesorii și Piese",
            imageUrl: "/billboards/accesorii.jpg",
        },
    });
    console.log(`  Billboard: ${billboard2.label}`);

    // ─── Categories ────────────────────────────────────────────
    const categories = [
        { id: "seed-cat-clasic", name: "Clasic", billboardId: billboard1.id },
        { id: "seed-cat-modern", name: "Modern", billboardId: billboard1.id },
        { id: "seed-cat-decorativ", name: "Decorativ", billboardId: billboard1.id },
        { id: "seed-cat-accesorii", name: "Accesorii", billboardId: billboard2.id },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { id: cat.id },
            update: { name: cat.name, billboardId: cat.billboardId },
            create: { ...cat, storeId: store.id },
        });
        console.log(`  Category: ${cat.name}`);
    }

    // ─── Sizes ─────────────────────────────────────────────────
    const sizes = [
        { id: "seed-size-s", name: "Mic (60–80 cm)", value: "S" },
        { id: "seed-size-m", name: "Mediu (80–120 cm)", value: "M" },
        { id: "seed-size-l", name: "Mare (120–160 cm)", value: "L" },
        { id: "seed-size-xl", name: "Extra Mare (160–200 cm)", value: "XL" },
        { id: "seed-size-custom", name: "La Comandă", value: "Custom" },
    ];

    for (const size of sizes) {
        await prisma.size.upsert({
            where: { id: size.id },
            update: { name: size.name, value: size.value },
            create: { ...size, storeId: store.id },
        });
        console.log(`  Size: ${size.name}`);
    }

    // ─── Colors ────────────────────────────────────────────────
    const colors = [
        { id: "seed-color-stejar", name: "Stejar Natural", value: "#C4A882" },
        { id: "seed-color-nuc", name: "Nuc", value: "#5C4033" },
        { id: "seed-color-alb", name: "Alb", value: "#FFFFFF" },
        { id: "seed-color-negru", name: "Negru", value: "#1A1A1A" },
        { id: "seed-color-gri", name: "Gri Antracit", value: "#3D3D3D" },
        { id: "seed-color-cires", name: "Cireș", value: "#8B4513" },
        { id: "seed-color-wenge", name: "Wenge", value: "#3C2415" },
        { id: "seed-color-fag", name: "Fag", value: "#D4B896" },
    ];

    for (const color of colors) {
        await prisma.color.upsert({
            where: { id: color.id },
            update: { name: color.name, value: color.value },
            create: { ...color, storeId: store.id },
        });
        console.log(`  Color: ${color.name}`);
    }

    // ─── Blog Posts ─────────────────────────────────────────────
    const blogPosts = [
        {
            title: "De ce mascările calorifere din lemn masiv sunt investiția perfectă pentru casa ta",
            slug: "de-ce-mascare-calorifere-din-lemn-masiv",
            excerpt:
                "Descoperă avantajele mascărilor din lemn masiv față de alternativele din MDF sau plastic — durabilitate, estetică naturală, eficiență termică și valoare pe termen lung pentru locuința ta.",
            content: `<p>Caloriferele sunt esențiale pentru confortul termic al casei, dar rareori sunt un element decorativ. Conductele expuse, formele industriale și vopseaua îngălbenită de timp pot strica estetica oricărei camere. Aici intervine <strong>mascarea caloriferului din lemn masiv</strong> — soluția care transformă un element funcțional într-o piesă de design interior.</p><p>La LemnArt, credem că fiecare detaliu al casei tale merită atenție. De aceea, fiecare mascare pe care o producem este realizată manual, din lemn natural, cu respect pentru material și pentru spațiul în care va trăi.</p><h2>Lemnul masiv vs. MDF vs. Plastic: Ce trebuie să știi</h2><p>Piața oferă mai multe opțiuni pentru mascarea caloriferelor, dar diferențele dintre materiale sunt semnificative pe termen lung.</p><p><strong>MDF-ul</strong> (Medium Density Fiberboard) este cel mai comun material pentru mascări ieftine. Este ușor de prelucrat și are un cost redus, dar prezintă dezavantaje majore: se umflă la contact cu umiditatea, se deformează în timp din cauza căldurii constante și emite formaldehidă — un compus chimic nociv — mai ales la temperaturi ridicate.</p><p><strong>Plasticul</strong> este și mai problematic. Deși rezistent la umiditate, se decolorează rapid de la căldură, devine casant în timp și are un aspect artificial care nu se integrează într-un interior premium.</p><p><strong>Lemnul masiv</strong> este singurul material care se comportă natural în condiții de căldură și umiditate variabilă. Se dilată și se contractă organic, fără să se deformeze structural. Mai mult, nu emite substanțe toxice și devine mai frumos cu trecerea anilor, dezvoltând o patină naturală unică.</p><h2>Durabilitate care traversează generații</h2><p>O mascare din lemn masiv nu este un produs de înlocuit la câțiva ani. Cu îngrijire minimă — o ștergere cu cârpă uscată și, opțional, un tratament cu ulei de lemn o dată pe an — o mascare LemnArt poate dura <strong>decenii fără să-și piardă aspectul sau funcționalitatea</strong>.</p><h2>Estetică unică — fiecare piesă este un unicat</h2><p>Spre deosebire de materialele industriale, lemnul masiv are un <strong>desen natural al fibrei care este unic pentru fiecare piesă</strong>. Nu există două mascări identice.</p><h2>Eficiență termică — căldura circulă, nu se blochează</h2><p>Mascările LemnArt sunt concepute cu <strong>grile de ventilație calculate precis</strong> pentru a permite circulația optimă a aerului cald.</p><h2>Concluzie</h2><p>Alegerea lemnului masiv pentru mascările calorifere nu este doar o decizie estetică — este o investiție în <strong>durabilitate, sănătate, confort și valoare</strong>.</p>`,
            coverImage: "/blog/mascare-lemn.jpg",
            category: "Ghid",
            readTime: "6 min",
            authorName: "Echipa LemnArt",
            authorRole: "Artizani",
            isPublished: true,
            sortOrder: 0,
            publishedAt: new Date("2026-03-10"),
        },
        {
            title: "Ghid complet: Cum alegi dimensiunea perfectă pentru mascarea caloriferului",
            slug: "ghid-complet-alegerea-dimensiunii-mascare-calorifer",
            excerpt:
                "Pas cu pas — de la măsurarea caloriferului până la alegerea tipului de montaj. Tot ce trebuie să știi pentru a comanda mascarea cu dimensiunile corecte.",
            content: `<p>Unul dintre cele mai importante aspecte atunci când comanzi o mascare calorifer este <strong>alegerea dimensiunii corecte</strong>. O mascare prea mică nu va acoperi caloriferul complet, iar una prea mare va arăta disproporționat în cameră.</p><h2>Pasul 1: Măsoară caloriferul cu precizie</h2><p>Ai nevoie de trei măsurători esențiale:</p><ul><li><strong>Lățimea</strong> — de la capătul stâng la capătul drept</li><li><strong>Înălțimea</strong> — de la bază până la partea superioară</li><li><strong>Adâncimea</strong> — de la perete până la punctul cel mai avansat</li></ul><h2>Pasul 2: Adaugă spațiul de ventilație</h2><p>Caloriferul are nevoie de spațiu pentru ca aerul cald să circule eficient.</p><h2>Pasul 3: Verifică spațiul disponibil</h2><p>Verifică distanța până la pervaz, mobilier adiacent, prize și conducte aparente.</p><h2>Pasul 4: Alege tipul de montaj</h2><h3>Montaj pe perete (suspendat)</h3><p>Mascarea se fixează direct pe perete cu sisteme de prindere invizibile.</p><h3>Montaj liber (pe podea)</h3><p>Mascarea stă pe podea, rezemată de perete.</p><h3>Montaj integrat (nișă)</h3><p>Pentru calorifere situate în nișe arhitecturale.</p><h2>Dimensiuni standard vs. la comandă</h2><p>Oferim o gamă de <strong>dimensiuni standard</strong> și realizăm <strong>mascări la comandă</strong> la dimensiunile exacte de care ai nevoie.</p>`,
            coverImage: "/blog/dimensiuni.jpg",
            category: "Ghid",
            readTime: "7 min",
            authorName: "Echipa LemnArt",
            authorRole: "Artizani",
            isPublished: true,
            sortOrder: 1,
            publishedAt: new Date("2026-03-05"),
        },
        {
            title: "Tendințe design interior 2026: Materialele naturale revin în centrul atenției",
            slug: "tendinte-design-interior-2026-materiale-naturale",
            excerpt:
                "Lemnul, pietrele naturale și tonurile calde domină tendințele anului 2026. Descoperă cum mascările calorifere artizanale se integrează perfect în aceste tendințe.",
            content: `<p>Anul 2026 marchează o schimbare fundamentală în designul interior: după ani dominați de minimalismul rece și de materialele industriale, <strong>naturalul revine în forță</strong>.</p><h2>1. Warm Minimalism — Minimalismul cald</h2><p>Dacă minimalismul tradițional era definit de linii drepte, suprafețe albe și oțel, <strong>warm minimalism</strong> păstrează simplitatea, dar adaugă căldură.</p><h2>2. Japandi — Fuziunea japoneză-scandinavă continuă</h2><p>Stilul Japandi — combinația dintre estetica japoneză wabi-sabi și funcționalitatea scandinavă — rămâne extrem de popular în 2026.</p><h2>3. Artizanatul ca statement de design</h2><p>În 2026, consumatorii caută din ce în ce mai mult <strong>piese cu poveste</strong> — obiecte create de mâini umane.</p><blockquote>„În era producției de masă, artizanatul a devenit cel mai rar și mai prețios lux."</blockquote><h2>4. Biophilic Design — Natura în interior</h2><p>Designul biofil — integrarea elementelor naturale în spațiile interioare — trece de la tendință la standard în 2026.</p><h2>5. Tonuri de pământ și paleta cromatică 2026</h2><p>Culorile anului 2026 sunt inspirate din natură: <strong>bej nisip, gri antracit, verde olive, terracotta, maro ciocolatiu</strong>.</p><h2>6. Sustenabilitatea nu mai este opțională</h2><p>La LemnArt, folosim lemn din surse certificate, finisaje ecologice pe bază de apă și ambalaje reciclabile.</p>`,
            coverImage: "/blog/tendinte-2026.jpg",
            category: "Inspirație",
            readTime: "8 min",
            authorName: "Echipa LemnArt",
            authorRole: "Design",
            isPublished: true,
            sortOrder: 2,
            publishedAt: new Date("2026-02-20"),
        },
    ];

    for (const post of blogPosts) {
        await prisma.blogPost.upsert({
            where: {
                storeId_slug: { storeId: store.id, slug: post.slug },
            },
            update: post,
            create: {
                ...post,
                storeId: store.id,
            },
        });
        console.log(`  Blog post: ${post.title.substring(0, 50)}...`);
    }

    console.log(`\nSeeded ${blogPosts.length} blog posts.`);
    console.log("Seed complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
