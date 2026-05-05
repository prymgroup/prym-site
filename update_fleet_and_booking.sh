#!/bin/bash
BASE="/Users/Apple/Desktop/prym site/prym/src"

# ── 1. Mettre à jour fleet.js ─────────────────────────────────────────────────
cat > "$BASE/data/fleet.js" << 'EOF'
export const FLEET = [
  {
    id: 'select',
    tier: 1,
    name: 'PRYM Select',
    tagline: 'Le standard de référence',
    vehicles: ['Volkswagen Passat', 'Škoda Superb', 'Škoda Kodiaq'],
    models: [
      { name: 'Volkswagen Passat', modelPath: '/models/select_passat.glb' },
      { name: 'Škoda Superb',      modelPath: '/models/select.glb' },
      { name: 'Škoda Kodiaq',      modelPath: '/models/select_kodiaq.glb' },
    ],
    modelPath: '/models/select_passat.glb',
    capacity: { passengers: 3, luggage: 3 },
    amenities: ['Eau minérale', 'Wi-Fi', 'Chargeur USB', 'Climatisation'],
    description: 'Berlines et SUV premium pour vos déplacements quotidiens. Confort, discrétion et ponctualité au standard PRYM.',
  },
  {
    id: 'executive',
    tier: 2,
    name: 'PRYM Executive',
    tagline: 'L\'excellence au quotidien',
    vehicles: ['Mercedes Classe E', 'Audi A6', 'BMW Série 5'],
    models: [
      { name: 'Mercedes Classe E', modelPath: '/models/executive_mercedes.glb' },
      { name: 'Audi A6',           modelPath: '/models/executive_audi.glb' },
      { name: 'BMW Série 5',       modelPath: '/models/executive_bmw.glb' },
    ],
    modelPath: '/models/executive_mercedes.glb',
    capacity: { passengers: 3, luggage: 3 },
    amenities: ['Eau en verre', 'Wi-Fi', 'Oshibori', 'Presse quotidienne', 'Chargeur sans fil'],
    description: 'Berlines executive haut de gamme pour vos déplacements professionnels. Le choix des dirigeants.',
  },
  {
    id: 'signature',
    tier: 3,
    name: 'PRYM Signature',
    tagline: 'Le summum du raffinement',
    vehicles: ['Mercedes Classe S', 'Audi A8', 'BMW Série 7'],
    models: [
      { name: 'Mercedes Classe S', modelPath: '/models/signature_mercedes.glb' },
      { name: 'Audi A8',           modelPath: '/models/signature_audi.glb' },
      { name: 'BMW Série 7',       modelPath: '/models/signature_bmw.glb' },
    ],
    modelPath: '/models/signature_bmw.glb',
    capacity: { passengers: 3, luggage: 3 },
    amenities: ['Champagne', 'Eau en cristal', 'Oshibori chaud', 'Massage siège', 'Parfum exclusif', 'NDA renforcé'],
    description: 'Les plus grandes berlines de représentation. Pour les moments qui exigent l\'exceptionnel.',
  },
  {
    id: 'voyage',
    tier: 4,
    name: 'PRYM Voyage',
    tagline: 'L\'espace pour vos équipes',
    vehicles: ['Mercedes Vito', 'Ford Tourneo'],
    models: [],
    modelPath: null,
    capacity: { passengers: 7, luggage: 6 },
    amenities: ['Eau minérale', 'Wi-Fi', 'Chargeur USB', 'Espace bagages étendu'],
    description: 'Minivans premium pour vos groupes et transferts d\'équipe. Confort collectif sans compromis.',
  },
  {
    id: 'lounge',
    tier: 5,
    name: 'PRYM Lounge',
    tagline: 'Le salon roulant',
    vehicles: ['Mercedes Classe V'],
    models: [],
    modelPath: null,
    capacity: { passengers: 6, luggage: 5 },
    amenities: ['Configuration salon', 'Champagne', 'Écran embarqué', 'Wi-Fi haut débit', 'NDA'],
    description: 'Le Classe V transformé en salon privé. Pour vos réunions en mobilité et délégations VIP.',
  },
  {
    id: 'suite',
    tier: 6,
    name: 'PRYM Suite',
    tagline: 'L\'hôtel cinq étoiles mobile',
    vehicles: ['Mercedes Sprinter VIP'],
    models: [],
    modelPath: null,
    capacity: { passengers: 8, luggage: 8 },
    amenities: ['Suite complète', 'Bar privé', 'Écrans HD', 'Wi-Fi satellite', 'Lit pliant', 'NDA absolu'],
    description: 'Le Sprinter VIP aménagé sur mesure. L\'expérience hôtelière cinq étoiles en déplacement.',
  },
]
EOF

echo "✅ fleet.js mis à jour"
