#!/bin/bash
SRC="/Users/Apple/Desktop/prym site/prym/src"

# Fix ExperiencePage.jsx — chemin incorrect + hauteur 20px
sed -i '' \
  's|src="/logos/../logos/logo-slogan-white.svg"|src="/logos/logo-slogan-white.svg"|g' \
  "$SRC/components/ExperiencePage.jsx"
sed -i '' \
  "s/style={{ height: '20px', opacity: 0.9 }}/style={{ height: '44px', opacity: 0.9 }}/g" \
  "$SRC/components/ExperiencePage.jsx"

# Fix AProposPage.jsx — chemin incorrect + hauteur 20px
sed -i '' \
  's|src="/logos/../logos/logo-slogan-white.svg"|src="/logos/logo-slogan-white.svg"|g' \
  "$SRC/components/AProposPage.jsx"
sed -i '' \
  's/style={{height:20,opacity:0.9}}/style={{height:44,opacity:0.9}}/g' \
  "$SRC/components/AProposPage.jsx"

# Fix EntreprisesPage.jsx — chemin incorrect
sed -i '' \
  's|src="/logos/../logos/logo-slogan-white.svg"|src="/logos/logo-slogan-white.svg"|g' \
  "$SRC/components/EntreprisesPage.jsx"

# Fix FlottePage.jsx — chemin incorrect
sed -i '' \
  's|src="/logos/../logos/logo-slogan-white.svg"|src="/logos/logo-slogan-white.svg"|g' \
  "$SRC/components/FlottePage.jsx"

echo "✅ Chemins et hauteurs logo corrigés"
echo ""
echo "Vérification :"
grep -rn "logo-slogan\|height.*44\|height.*20" "$SRC/components" | grep -v "HeroSection\|vite"
