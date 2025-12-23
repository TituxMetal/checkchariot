import { InspectionQuestion, CACESCategory } from './types'

export const INSPECTION_QUESTIONS: InspectionQuestion[] = [
  {
    id: 'Q001',
    text: 'État des fourches',
    category: 'common',
    correctAnswerId: 'A001-1',
    answers: [
      { id: 'A001-1', text: 'Fourches en bon état, pas de fissures', isOk: true },
      { id: 'A001-2', text: 'Fissures visibles sur les fourches', isOk: false, severity: 'critical' },
      { id: 'A001-3', text: 'Fourches déformées ou tordues', isOk: false, severity: 'critical' },
      { id: 'A001-4', text: 'Usure excessive des talons', isOk: false, severity: 'minor' }
    ]
  },
  {
    id: 'Q002',
    text: 'Freins de service',
    category: 'common',
    correctAnswerId: 'A002-1',
    answers: [
      { id: 'A002-1', text: 'Freins efficaces, arrêt immédiat', isOk: true },
      { id: 'A002-2', text: 'Distance de freinage anormale', isOk: false, severity: 'critical' },
      { id: 'A002-3', text: 'Pédale de frein molle', isOk: false, severity: 'critical' },
      { id: 'A002-4', text: 'Bruit inhabituel au freinage', isOk: false, severity: 'minor' }
    ]
  },
  {
    id: 'Q003',
    text: 'Direction et volant',
    category: 'common',
    correctAnswerId: 'A003-1',
    answers: [
      { id: 'A003-1', text: 'Direction précise, pas de jeu', isOk: true },
      { id: 'A003-2', text: 'Jeu excessif dans la direction', isOk: false, severity: 'critical' },
      { id: 'A003-3', text: 'Direction dure, nécessite effort', isOk: false, severity: 'minor' }
    ]
  },
  {
    id: 'Q004',
    text: 'Klaxon et avertisseur sonore',
    category: 'common',
    correctAnswerId: 'A004-1',
    answers: [
      { id: 'A004-1', text: 'Klaxon fonctionnel et audible', isOk: true },
      { id: 'A004-2', text: 'Klaxon ne fonctionne pas', isOk: false, severity: 'critical' },
      { id: 'A004-3', text: 'Son faible ou intermittent', isOk: false, severity: 'minor' }
    ]
  },
  {
    id: 'Q005',
    text: 'Éclairage et feux de signalisation',
    category: 'common',
    correctAnswerId: 'A005-1',
    answers: [
      { id: 'A005-1', text: 'Tous les feux fonctionnent', isOk: true },
      { id: 'A005-2', text: 'Feux de travail défaillants', isOk: false, severity: 'critical' },
      { id: 'A005-3', text: 'Gyrophare ne fonctionne pas', isOk: false, severity: 'minor' },
      { id: 'A005-4', text: 'Ampoule grillée (feu arrière)', isOk: false, severity: 'minor' }
    ]
  },
  {
    id: 'Q006',
    text: 'Niveau de la batterie',
    category: 'common',
    correctAnswerId: 'A006-1',
    answers: [
      { id: 'A006-1', text: 'Charge > 30%, autonomie suffisante', isOk: true },
      { id: 'A006-2', text: 'Charge < 20%, batterie faible', isOk: false, severity: 'critical' },
      { id: 'A006-3', text: 'Indicateur de charge défaillant', isOk: false, severity: 'minor' }
    ]
  },
  {
    id: 'Q007',
    text: 'État des pneumatiques',
    category: 'common',
    correctAnswerId: 'A007-1',
    answers: [
      { id: 'A007-1', text: 'Pneus en bon état, gonflage correct', isOk: true },
      { id: 'A007-2', text: 'Pneu crevé ou à plat', isOk: false, severity: 'critical' },
      { id: 'A007-3', text: 'Usure importante de la bande', isOk: false, severity: 'minor' },
      { id: 'A007-4', text: 'Pression insuffisante', isOk: false, severity: 'minor' }
    ]
  },
  {
    id: 'Q008',
    text: 'Système hydraulique',
    category: 'common',
    correctAnswerId: 'A008-1',
    answers: [
      { id: 'A008-1', text: 'Pas de fuite, système étanche', isOk: true },
      { id: 'A008-2', text: 'Fuite d\'huile importante', isOk: false, severity: 'critical' },
      { id: 'A008-3', text: 'Petite fuite localisée', isOk: false, severity: 'minor' },
      { id: 'A008-4', text: 'Niveau d\'huile bas', isOk: false, severity: 'minor' }
    ]
  },
  {
    id: 'Q009',
    text: 'Ceinture de sécurité',
    category: 'CACES1',
    correctAnswerId: 'A009-1',
    answers: [
      { id: 'A009-1', text: 'Ceinture présente et fonctionnelle', isOk: true },
      { id: 'A009-2', text: 'Ceinture absente ou coupée', isOk: false, severity: 'critical' },
      { id: 'A009-3', text: 'Boucle de ceinture défectueuse', isOk: false, severity: 'critical' },
      { id: 'A009-4', text: 'Sangle usée ou effilochée', isOk: false, severity: 'minor' }
    ]
  },
  {
    id: 'Q010',
    text: 'Tablier porte-fourches (CACES 1/3)',
    category: 'CACES3',
    correctAnswerId: 'A010-1',
    answers: [
      { id: 'A010-1', text: 'Tablier intact, pas de déformation', isOk: true },
      { id: 'A010-2', text: 'Déformation visible du tablier', isOk: false, severity: 'critical' },
      { id: 'A010-3', text: 'Oxydation légère', isOk: false, severity: 'minor' }
    ]
  },
  {
    id: 'Q011',
    text: 'Mât rétractable - Mouvement',
    category: 'CACES5',
    correctAnswerId: 'A011-1',
    answers: [
      { id: 'A011-1', text: 'Extension/rétraction fluide', isOk: true },
      { id: 'A011-2', text: 'Blocage ou à-coups lors du mouvement', isOk: false, severity: 'critical' },
      { id: 'A011-3', text: 'Mouvement lent, manque de puissance', isOk: false, severity: 'minor' },
      { id: 'A011-4', text: 'Bruit anormal au mouvement', isOk: false, severity: 'minor' }
    ]
  },
  {
    id: 'Q012',
    text: 'Arceau de sécurité',
    category: 'common',
    correctAnswerId: 'A012-1',
    answers: [
      { id: 'A012-1', text: 'Arceau solide, bien fixé', isOk: true },
      { id: 'A012-2', text: 'Arceau déformé ou fissuré', isOk: false, severity: 'critical' },
      { id: 'A012-3', text: 'Fixations desserrées', isOk: false, severity: 'critical' }
    ]
  },
  {
    id: 'Q013',
    text: 'Chaînes de levage',
    category: 'CACES3',
    correctAnswerId: 'A013-1',
    answers: [
      { id: 'A013-1', text: 'Chaînes lubrifiées, pas d\'usure', isOk: true },
      { id: 'A013-2', text: 'Chaînes rouillées ou grippées', isOk: false, severity: 'critical' },
      { id: 'A013-3', text: 'Manque de lubrification', isOk: false, severity: 'minor' },
      { id: 'A013-4', text: 'Usure des maillons visible', isOk: false, severity: 'minor' }
    ]
  },
  {
    id: 'Q014',
    text: 'Rétroviseurs',
    category: 'common',
    correctAnswerId: 'A014-1',
    answers: [
      { id: 'A014-1', text: 'Rétroviseurs propres et ajustés', isOk: true },
      { id: 'A014-2', text: 'Rétroviseur manquant ou cassé', isOk: false, severity: 'critical' },
      { id: 'A014-3', text: 'Rétroviseur sale, visibilité réduite', isOk: false, severity: 'minor' }
    ]
  },
  {
    id: 'Q015',
    text: 'Commandes de levage',
    category: 'common',
    correctAnswerId: 'A015-1',
    answers: [
      { id: 'A015-1', text: 'Leviers réactifs, mouvements précis', isOk: true },
      { id: 'A015-2', text: 'Commande bloquée ou grippée', isOk: false, severity: 'critical' },
      { id: 'A015-3', text: 'Jeu excessif dans les commandes', isOk: false, severity: 'minor' },
      { id: 'A015-4', text: 'Réponse retardée', isOk: false, severity: 'minor' }
    ]
  },
  {
    id: 'Q016',
    text: 'Transpalette - Roues directrices',
    category: 'CACES1',
    correctAnswerId: 'A016-1',
    answers: [
      { id: 'A016-1', text: 'Roues en bon état, rotation libre', isOk: true },
      { id: 'A016-2', text: 'Roue bloquée ou endommagée', isOk: false, severity: 'critical' },
      { id: 'A016-3', text: 'Usure importante, remplacement nécessaire', isOk: false, severity: 'minor' }
    ]
  },
  {
    id: 'Q017',
    text: 'Stabilité latérale',
    category: 'CACES5',
    correctAnswerId: 'A017-1',
    answers: [
      { id: 'A017-1', text: 'Chariot stable en virage', isOk: true },
      { id: 'A017-2', text: 'Basculement ou instabilité ressentie', isOk: false, severity: 'critical' },
      { id: 'A017-3', text: 'Légère instabilité à vide', isOk: false, severity: 'minor' }
    ]
  },
  {
    id: 'Q018',
    text: 'Plaques signalétiques et marquage',
    category: 'common',
    correctAnswerId: 'A018-1',
    answers: [
      { id: 'A018-1', text: 'Plaques lisibles (charge, limites)', isOk: true },
      { id: 'A018-2', text: 'Plaque de charge illisible ou absente', isOk: false, severity: 'critical' },
      { id: 'A018-3', text: 'Marquage partiellement effacé', isOk: false, severity: 'minor' }
    ]
  },
  {
    id: 'Q019',
    text: 'Frein de stationnement',
    category: 'common',
    correctAnswerId: 'A019-1',
    answers: [
      { id: 'A019-1', text: 'Frein de parking bloque le chariot', isOk: true },
      { id: 'A019-2', text: 'Frein de parking inefficace', isOk: false, severity: 'critical' },
      { id: 'A019-3', text: 'Levier de frein dur ou grippé', isOk: false, severity: 'minor' }
    ]
  },
  {
    id: 'Q020',
    text: 'Cabine conducteur et plancher',
    category: 'CACES3',
    correctAnswerId: 'A020-1',
    answers: [
      { id: 'A020-1', text: 'Plancher propre, pas d\'huile', isOk: true },
      { id: 'A020-2', text: 'Plancher glissant (huile/graisse)', isOk: false, severity: 'critical' },
      { id: 'A020-3', text: 'Débris ou encombrement mineurs', isOk: false, severity: 'minor' },
      { id: 'A020-4', text: 'Tapis anti-dérapant usé', isOk: false, severity: 'minor' }
    ]
  }
]

export function getRandomQuestions(category: CACESCategory, count: number): InspectionQuestion[] {
  const commonQuestions = INSPECTION_QUESTIONS.filter(q => q.category === 'common')
  const categoryQuestions = INSPECTION_QUESTIONS.filter(q => q.category === category)
  
  const allEligible = [...commonQuestions, ...categoryQuestions]
  
  const shuffled = [...allEligible].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export function shuffleAnswers(answers: InspectionQuestion['answers']) {
  return [...answers].sort(() => Math.random() - 0.5)
}
