#!/bin/bash
echo "Mise à jour taille logo dans toutes les navbars..."

find "/Users/Apple/Desktop/prym site/prym/src" -name "*.jsx" -exec \
  sed -i '' 's/height: 20, opacity: 0.9/height: 32, opacity: 0.9/g' {} \;

echo "✅ Logo mis à jour à height: 32 dans tous les fichiers JSX"
echo ""
echo "Fichiers modifiés :"
grep -rl "height: 32, opacity: 0.9" "/Users/Apple/Desktop/prym site/prym/src" 2>/dev/null
