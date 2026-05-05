#!/bin/bash
BASE="/Users/Apple/Desktop/prym site/prym"

# ── index.html — meta de base + Open Graph ────────────────────────────────────
cat > "$BASE/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/logos/logo.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Primary SEO -->
    <title>PRYM Executive Transport — Chauffeur Privé Luxe Casablanca</title>
    <meta name="description" content="PRYM Executive Transport — Service de chauffeur privé ultra-premium au Maroc. Transferts aéroport, mise à disposition, événements. Discrétion absolue, ponctualité chirurgicale. Casablanca, Rabat, Marrakech." />
    <meta name="keywords" content="chauffeur privé casablanca, VTC luxe maroc, transport executive maroc, location voiture avec chauffeur casablanca, chauffeur aeroport casa, transport vip maroc" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://prym.ma" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://prym.ma" />
    <meta property="og:title" content="PRYM Executive Transport — Chauffeur Privé Luxe Maroc" />
    <meta property="og:description" content="Service de transport executive ultra-premium au Maroc. Discrétion absolue, ponctualité chirurgicale, élégance du service. Casablanca · Rabat · Marrakech." />
    <meta property="og:image" content="https://prym.ma/logos/logo-slogan-white.svg" />
    <meta property="og:locale" content="fr_MA" />
    <meta property="og:site_name" content="PRYM Executive Transport" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="PRYM Executive Transport" />
    <meta name="twitter:description" content="Chauffeur privé ultra-premium au Maroc. Discrétion, ponctualité, élégance." />

    <!-- Preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
  </head>
  <body style="background:#0a0a0a;margin:0;">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF

echo "✅ index.html mis à jour avec SEO complet"

# ── SEO dynamique par page via useEffect dans chaque composant ────────────────

# ExperiencePage
sed -i '' "s/document.title = 'L\\'Expérience — PRYM Executive Transport'/document.title = 'L\\'Expérience PRYM — Le Protocole Silencieux | Chauffeur Privé Maroc'\n    document.querySelector('meta[name=\"description\"]')?.setAttribute('content', 'Découvrez le protocole silencieux PRYM : tenue chauffeur, signature olfactive, eau en verre, Oshibori, NDA contractuel, ponctualité chirurgicale. L\\'expérience de transport executive au Maroc.')/" \
  "$BASE/src/components/ExperiencePage.jsx"

# FlottePage
sed -i '' "s/document.title = 'La Flotte — PRYM Executive Transport'/document.title = 'La Flotte PRYM — 6 Niveaux d\\'Excellence | Transport Executive Maroc'\n    document.querySelector('meta[name=\"description\"]')?.setAttribute('content', 'Découvrez la flotte PRYM : Select, Executive, Signature, Voyage, Lounge, Suite. Mercedes, Audi, BMW, Sprinter VIP. Chauffeur privé luxe au Maroc.')/" \
  "$BASE/src/components/FlottePage.jsx"

# EntreprisesPage
sed -i '' "s/document.title = 'Comptes Entreprises — PRYM Executive Transport'/document.title = 'Comptes Entreprises PRYM — Mobilité Executive Maroc'\n    document.querySelector('meta[name=\"description\"]')?.setAttribute('content', 'PRYM propose aux entreprises un service de mobilité executive sur mesure : chauffeur attitré, facturation mensuelle, NDA étendu, priorité de disponibilité. Casablanca, Rabat, Marrakech.')/" \
  "$BASE/src/components/EntreprisesPage.jsx"

# AProposPage
sed -i '' "s/document.title = 'À propos — PRYM Executive Transport'/document.title = 'À propos de PRYM — Né au Maroc, Pour le Monde'\n    document.querySelector('meta[name=\"description\"]')?.setAttribute('content', 'PRYM Executive Transport est né de l\\'hospitalité marocaine. Découvrez notre histoire, nos valeurs et notre positionnement unique entre le premium accessible et l\\'ultra-luxe.')/" \
  "$BASE/src/components/AProposPage.jsx"

echo "✅ Titres et meta descriptions mis à jour dans chaque page"

# ── robots.txt ────────────────────────────────────────────────────────────────
cat > "$BASE/public/robots.txt" << 'EOF'
User-agent: *
Allow: /

Sitemap: https://prym.ma/sitemap.xml
EOF

# ── sitemap.xml ───────────────────────────────────────────────────────────────
cat > "$BASE/public/sitemap.xml" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://prym.ma/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://prym.ma/reserver</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://prym.ma/flotte</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://prym.ma/experience</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://prym.ma/entreprises</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://prym.ma/a-propos</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
EOF

echo "✅ robots.txt et sitemap.xml créés"
echo ""
echo "========================================"
echo "✅ SEO complet installé"
echo "Déploie avec: npx vercel --prod"
echo "========================================"
