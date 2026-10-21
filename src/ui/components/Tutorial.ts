/**
 * Tutorial Component - Interactive Chess Lessons
 * 
 * Provides integrated tutorials for learning chess basics,
 * openings, middlegame strategies, and endgame techniques.
 */

// ============================================
// Types
// ============================================

interface TutorialSection {
  id: string;
  title: string;
  description: string;
  lessons: TutorialLesson[];
}

interface TutorialLesson {
  id: string;
  title: string;
  content: string;
  diagram?: string; // FEN position
  tips?: string[];
}

// ============================================
// Tutorial Content
// ============================================

const TUTORIAL_SECTIONS: TutorialSection[] = [
  {
    id: 'basics',
    title: 'Les bases des échecs',
    description: 'Apprenez les règles fondamentales et le mouvement des pièces',
    lessons: [
      {
        id: 'intro',
        title: 'Introduction aux échecs',
        content: `
          <p>Les échecs sont un jeu de stratégie pour deux joueurs qui se joue sur un échiquier de 64 cases (8x8).</p>
          <p>Chaque joueur commence avec <strong>16 pièces</strong> :</p>
          <ul>
            <li>1 Roi (♔/♚)</li>
            <li>1 Dame (♕/♛)</li>
            <li>2 Tours (♖/♜)</li>
            <li>2 Fous (♗/♝)</li>
            <li>2 Cavaliers (♘/♞)</li>
            <li>8 Pions (♙/♟)</li>
          </ul>
          <p>L'objectif est de mettre le roi adverse en <strong>échec et mat</strong>, c'est-à-dire dans une position où il est attaqué et ne peut pas s'échapper.</p>
        `,
        tips: [
          'Les Blancs jouent toujours en premier',
          'La dame blanche se place sur une case blanche, la dame noire sur une case noire',
          'Chaque partie commence avec la même position initiale'
        ]
      },
      {
        id: 'pawn',
        title: 'Le Pion',
        content: `
          <p>Le <strong>pion</strong> est la pièce la plus nombreuse mais aussi la plus faible.</p>
          <h4>Mouvement :</h4>
          <ul>
            <li>Avance d'une case vers l'avant</li>
            <li>Peut avancer de 2 cases lors de son premier mouvement</li>
            <li>Capture en diagonale vers l'avant</li>
          </ul>
          <h4>Règles spéciales :</h4>
          <ul>
            <li><strong>Promotion</strong> : Un pion qui atteint la dernière rangée peut être promu en Dame, Tour, Fou ou Cavalier</li>
            <li><strong>Prise en passant</strong> : Capture spéciale possible juste après qu'un pion adverse ait avancé de 2 cases</li>
          </ul>
        `,
        diagram: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
        tips: [
          'Les pions ne peuvent jamais reculer',
          'Un pion bloqué par une pièce devant lui ne peut plus avancer',
          'La promotion en Dame est presque toujours le meilleur choix'
        ]
      },
      {
        id: 'knight',
        title: 'Le Cavalier',
        content: `
          <p>Le <strong>cavalier</strong> est la seule pièce qui peut sauter par-dessus les autres.</p>
          <h4>Mouvement :</h4>
          <ul>
            <li>Se déplace en forme de "L" : 2 cases dans une direction + 1 case perpendiculaire</li>
            <li>Peut sauter par-dessus toutes les pièces</li>
            <li>Alterne toujours entre cases blanches et noires</li>
          </ul>
          <h4>Valeur :</h4>
          <p>Le cavalier vaut environ <strong>3 points</strong> (équivalent à un fou ou 3 pions).</p>
        `,
        tips: [
          'Le cavalier est plus efficace au centre de l\'échiquier',
          'Un cavalier en bord de plateau contrôle moins de cases',
          'Les cavaliers sont forts dans les positions fermées'
        ]
      },
      {
        id: 'bishop',
        title: 'Le Fou',
        content: `
          <p>Le <strong>fou</strong> se déplace en diagonale sur n'importe quelle distance.</p>
          <h4>Mouvement :</h4>
          <ul>
            <li>Se déplace en diagonale, autant de cases que souhaité</li>
            <li>Ne peut pas sauter par-dessus les autres pièces</li>
            <li>Reste toujours sur la même couleur de case</li>
          </ul>
          <h4>Valeur :</h4>
          <p>Le fou vaut environ <strong>3 points</strong>. La paire de fous est souvent considérée comme un avantage.</p>
        `,
        tips: [
          'Chaque joueur a un fou sur cases blanches et un sur cases noires',
          'Les fous sont plus forts dans les positions ouvertes',
          'La paire de fous peut être très puissante en finale'
        ]
      },
      {
        id: 'rook',
        title: 'La Tour',
        content: `
          <p>La <strong>tour</strong> est une pièce majeure très puissante.</p>
          <h4>Mouvement :</h4>
          <ul>
            <li>Se déplace horizontalement ou verticalement</li>
            <li>Peut parcourir n'importe quelle distance</li>
            <li>Ne peut pas sauter par-dessus les autres pièces</li>
          </ul>
          <h4>Valeur :</h4>
          <p>La tour vaut environ <strong>5 points</strong>.</p>
          <h4>Règle spéciale :</h4>
          <p>Le <strong>roque</strong> est un mouvement spécial impliquant le roi et une tour.</p>
        `,
        tips: [
          'Les tours sont plus efficaces sur les colonnes ouvertes',
          'Connectez vos tours (placez-les sur la même rangée ou colonne)',
          'Les tours sont très puissantes en finale'
        ]
      },
      {
        id: 'queen',
        title: 'La Dame',
        content: `
          <p>La <strong>dame</strong> est la pièce la plus puissante du jeu.</p>
          <h4>Mouvement :</h4>
          <ul>
            <li>Combine les mouvements de la tour et du fou</li>
            <li>Se déplace horizontalement, verticalement et en diagonale</li>
            <li>Peut parcourir n'importe quelle distance</li>
          </ul>
          <h4>Valeur :</h4>
          <p>La dame vaut environ <strong>9 points</strong>.</p>
        `,
        tips: [
          'Ne sortez pas votre dame trop tôt dans la partie',
          'Protégez toujours votre dame',
          'La dame est excellente pour créer des menaces multiples'
        ]
      },
      {
        id: 'king',
        title: 'Le Roi',
        content: `
          <p>Le <strong>roi</strong> est la pièce la plus importante - si vous le perdez, vous perdez la partie !</p>
          <h4>Mouvement :</h4>
          <ul>
            <li>Se déplace d'une seule case dans n'importe quelle direction</li>
            <li>Ne peut jamais se mettre en échec</li>
          </ul>
          <h4>Règles spéciales :</h4>
          <ul>
            <li><strong>Échec</strong> : Le roi est attaqué</li>
            <li><strong>Échec et mat</strong> : Le roi est attaqué et ne peut pas s'échapper</li>
            <li><strong>Roque</strong> : Mouvement spécial avec une tour pour mettre le roi en sécurité</li>
          </ul>
        `,
        tips: [
          'Roquez tôt pour mettre votre roi en sécurité',
          'En finale, le roi devient une pièce active',
          'Ne laissez jamais votre roi exposé au centre'
        ]
      },
      {
        id: 'castling',
        title: 'Le Roque',
        content: `
          <p>Le <strong>roque</strong> est un mouvement spécial qui permet de mettre le roi en sécurité tout en activant une tour.</p>
          <h4>Comment roquer :</h4>
          <ul>
            <li><strong>Petit roque (O-O)</strong> : Le roi se déplace de 2 cases vers la tour côté roi</li>
            <li><strong>Grand roque (O-O-O)</strong> : Le roi se déplace de 2 cases vers la tour côté dame</li>
          </ul>
          <h4>Conditions :</h4>
          <ul>
            <li>Le roi et la tour n'ont jamais bougé</li>
            <li>Aucune pièce entre le roi et la tour</li>
            <li>Le roi n'est pas en échec</li>
            <li>Le roi ne traverse pas une case attaquée</li>
          </ul>
        `,
        tips: [
          'Roquez généralement côté roi (petit roque)',
          'Roquez dans les 10-15 premiers coups',
          'Ne roquez pas vers une attaque adverse'
        ]
      }
    ]
  },
  {
    id: 'openings',
    title: 'Les Ouvertures',
    description: 'Découvrez les débuts de partie les plus populaires',
    lessons: [
      {
        id: 'principles',
        title: 'Principes d\'ouverture',
        content: `
          <p>Les <strong>premiers coups</strong> d'une partie sont cruciaux pour établir une bonne position.</p>
          <h4>Les 4 principes fondamentaux :</h4>
          <ol>
            <li><strong>Contrôlez le centre</strong> - Les cases e4, d4, e5, d5 sont les plus importantes</li>
            <li><strong>Développez vos pièces</strong> - Sortez cavaliers et fous rapidement</li>
            <li><strong>Roquez tôt</strong> - Mettez votre roi en sécurité</li>
            <li><strong>Connectez vos tours</strong> - Terminez le développement</li>
          </ol>
        `,
        tips: [
          'Ne jouez pas la même pièce deux fois en ouverture',
          'Ne sortez pas la dame trop tôt',
          'Développez les cavaliers avant les fous'
        ]
      },
      {
        id: 'italian',
        title: 'La Partie Italienne',
        content: `
          <p>La <strong>Partie Italienne</strong> est l'une des ouvertures les plus anciennes et les plus instructives.</p>
          <h4>Coups :</h4>
          <ol>
            <li>e4 e5</li>
            <li>Cf3 Cc6</li>
            <li>Fc4 Fc5</li>
          </ol>
          <h4>Idées :</h4>
          <ul>
            <li>Contrôle du centre avec e4</li>
            <li>Développement rapide des pièces</li>
            <li>Pression sur f7 (point faible noir)</li>
          </ul>
        `,
        diagram: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
        tips: [
          'Idéale pour les débutants',
          'Permet un jeu ouvert et tactique',
          'Prépare le petit roque'
        ]
      },
      {
        id: 'spanish',
        title: 'La Partie Espagnole (Ruy Lopez)',
        content: `
          <p>La <strong>Partie Espagnole</strong> est l'ouverture la plus jouée au plus haut niveau.</p>
          <h4>Coups :</h4>
          <ol>
            <li>e4 e5</li>
            <li>Cf3 Cc6</li>
            <li>Fb5</li>
          </ol>
          <h4>Idées :</h4>
          <ul>
            <li>Pression sur le cavalier c6 qui défend e5</li>
            <li>Préparation de d4 pour dominer le centre</li>
            <li>Jeu positionnel à long terme</li>
          </ul>
        `,
        diagram: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
        tips: [
          'Ouverture très riche en théorie',
          'Favorise les Blancs à long terme',
          'Nécessite une bonne compréhension positionnelle'
        ]
      },
      {
        id: 'sicilian',
        title: 'La Défense Sicilienne',
        content: `
          <p>La <strong>Défense Sicilienne</strong> est la réponse la plus populaire à 1.e4.</p>
          <h4>Coups :</h4>
          <ol>
            <li>e4 c5</li>
          </ol>
          <h4>Idées :</h4>
          <ul>
            <li>Déséquilibre immédiat de la position</li>
            <li>Contre-jeu sur l'aile dame</li>
            <li>Lutte pour le contrôle de d4</li>
          </ul>
          <h4>Variantes principales :</h4>
          <ul>
            <li>Najdorf (5...a6)</li>
            <li>Dragon (5...g6)</li>
            <li>Scheveningen (5...e6)</li>
          </ul>
        `,
        diagram: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2',
        tips: [
          'Ouverture combative et déséquilibrée',
          'Excellente pour jouer pour la victoire avec les Noirs',
          'Nécessite une bonne préparation théorique'
        ]
      },
      {
        id: 'queens-gambit',
        title: 'Le Gambit Dame',
        content: `
          <p>Le <strong>Gambit Dame</strong> est l'ouverture principale commençant par 1.d4.</p>
          <h4>Coups :</h4>
          <ol>
            <li>d4 d5</li>
            <li>c4</li>
          </ol>
          <h4>Idées :</h4>
          <ul>
            <li>Attaque le pion d5 pour gagner le centre</li>
            <li>Ce n'est pas un vrai gambit (le pion peut être récupéré)</li>
            <li>Jeu positionnel et stratégique</li>
          </ul>
          <h4>Réponses noires :</h4>
          <ul>
            <li><strong>Accepté</strong> : 2...dxc4</li>
            <li><strong>Refusé</strong> : 2...e6</li>
            <li><strong>Slave</strong> : 2...c6</li>
          </ul>
        `,
        diagram: 'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2',
        tips: [
          'Ouverture solide et positionnelle',
          'Populaire à tous les niveaux',
          'Mène souvent à des positions stratégiques complexes'
        ]
      }
    ]
  },
  {
    id: 'middlegame',
    title: 'Le Milieu de partie',
    description: 'Stratégies et tactiques pour dominer le jeu',
    lessons: [
      {
        id: 'tactics-intro',
        title: 'Introduction aux tactiques',
        content: `
          <p>Les <strong>tactiques</strong> sont des séquences de coups forcés qui gagnent du matériel ou créent un avantage.</p>
          <h4>Motifs tactiques principaux :</h4>
          <ul>
            <li><strong>Fourchette</strong> : Une pièce attaque deux cibles simultanément</li>
            <li><strong>Clouage</strong> : Une pièce ne peut pas bouger car elle protège une pièce plus importante</li>
            <li><strong>Enfilade</strong> : Attaque sur une ligne avec une pièce importante devant</li>
            <li><strong>Découverte</strong> : Une pièce bouge et révèle une attaque d'une autre pièce</li>
          </ul>
        `,
        tips: [
          'Cherchez toujours les échecs, captures et menaces',
          'Calculez les variantes forcées en premier',
          'Les tactiques naissent souvent de positions actives'
        ]
      },
      {
        id: 'fork',
        title: 'La Fourchette',
        content: `
          <p>La <strong>fourchette</strong> est une attaque double où une pièce menace deux cibles ou plus.</p>
          <h4>Types de fourchettes :</h4>
          <ul>
            <li><strong>Fourchette de cavalier</strong> : La plus courante, le cavalier attaque deux pièces</li>
            <li><strong>Fourchette de pion</strong> : Un pion avance et attaque deux pièces</li>
            <li><strong>Fourchette royale</strong> : Attaque simultanée du roi et de la dame</li>
          </ul>
        `,
        tips: [
          'Les cavaliers sont excellents pour les fourchettes',
          'Cherchez les fourchettes après chaque coup adverse',
          'Une fourchette roi-dame est souvent décisive'
        ]
      },
      {
        id: 'pin',
        title: 'Le Clouage',
        content: `
          <p>Le <strong>clouage</strong> immobilise une pièce qui protège une pièce plus importante derrière elle.</p>
          <h4>Types de clouages :</h4>
          <ul>
            <li><strong>Clouage absolu</strong> : La pièce clouée protège le roi (mouvement illégal)</li>
            <li><strong>Clouage relatif</strong> : La pièce clouée protège une pièce de valeur (mouvement possible mais désavantageux)</li>
          </ul>
          <h4>Pièces qui clouent :</h4>
          <ul>
            <li>Fous (en diagonale)</li>
            <li>Tours (horizontalement/verticalement)</li>
            <li>Dame (toutes directions)</li>
          </ul>
        `,
        tips: [
          'Exploitez les clouages pour gagner du matériel',
          'Ajoutez de la pression sur les pièces clouées',
          'Évitez de vous faire clouer en développant prudemment'
        ]
      },
      {
        id: 'strategy',
        title: 'Principes stratégiques',
        content: `
          <p>La <strong>stratégie</strong> concerne les plans à long terme et l'amélioration de votre position.</p>
          <h4>Concepts stratégiques clés :</h4>
          <ul>
            <li><strong>Structure de pions</strong> : La disposition des pions détermine le caractère de la position</li>
            <li><strong>Cases faibles</strong> : Cases qui ne peuvent plus être défendues par des pions</li>
            <li><strong>Colonnes ouvertes</strong> : Colonnes sans pions, idéales pour les tours</li>
            <li><strong>Pièces actives vs passives</strong> : Activez vos pièces, limitez celles de l'adversaire</li>
          </ul>
        `,
        tips: [
          'Améliorez votre pire pièce',
          'Créez des faiblesses dans le camp adverse',
          'Coordonnez vos pièces vers un objectif commun'
        ]
      },
      {
        id: 'attack',
        title: 'L\'attaque sur le roi',
        content: `
          <p>L'<strong>attaque sur le roi</strong> est souvent l'objectif principal du milieu de partie.</p>
          <h4>Conditions pour attaquer :</h4>
          <ul>
            <li>Supériorité de pièces dans la zone d'attaque</li>
            <li>Roi adverse mal protégé ou exposé</li>
            <li>Colonnes ou diagonales ouvertes vers le roi</li>
          </ul>
          <h4>Techniques d'attaque :</h4>
          <ul>
            <li>Sacrifice pour ouvrir la position du roi</li>
            <li>Accumulation de pièces autour du roi</li>
            <li>Élimination des défenseurs</li>
          </ul>
        `,
        tips: [
          'N\'attaquez que si vous avez un avantage de développement',
          'Les roques opposés favorisent les attaques mutuelles',
          'Gardez toujours un œil sur la défense de votre propre roi'
        ]
      }
    ]
  },
  {
    id: 'endgame',
    title: 'Les Finales',
    description: 'Techniques essentielles pour conclure la partie',
    lessons: [
      {
        id: 'endgame-intro',
        title: 'Introduction aux finales',
        content: `
          <p>La <strong>finale</strong> est la phase où il reste peu de pièces sur l'échiquier.</p>
          <h4>Caractéristiques des finales :</h4>
          <ul>
            <li>Le roi devient une pièce active</li>
            <li>Les pions deviennent très importants (promotion)</li>
            <li>La précision est cruciale</li>
          </ul>
          <h4>Principes généraux :</h4>
          <ul>
            <li>Activez votre roi</li>
            <li>Créez des pions passés</li>
            <li>Centralisez vos pièces</li>
          </ul>
        `,
        tips: [
          'En finale, le roi est une pièce de combat',
          'Un pion passé peut décider de la partie',
          'La technique est plus importante que la créativité'
        ]
      },
      {
        id: 'king-pawn',
        title: 'Finales Roi et Pion',
        content: `
          <p>Les finales <strong>Roi et Pion contre Roi</strong> sont fondamentales à maîtriser.</p>
          <h4>Concepts clés :</h4>
          <ul>
            <li><strong>Opposition</strong> : Les rois face à face avec une case entre eux</li>
            <li><strong>Cases clés</strong> : Cases que le roi doit atteindre pour gagner</li>
            <li><strong>Règle du carré</strong> : Détermine si un roi peut rattraper un pion</li>
          </ul>
          <h4>L'opposition :</h4>
          <p>Le joueur qui n'a PAS le trait quand les rois sont en opposition a l'avantage.</p>
        `,
        tips: [
          'Maîtrisez l\'opposition - c\'est la clé des finales de pions',
          'Utilisez la règle du carré pour calculer rapidement',
          'Le roi doit être devant son pion pour gagner'
        ]
      },
      {
        id: 'rook-endgame',
        title: 'Finales de Tours',
        content: `
          <p>Les <strong>finales de tours</strong> sont les plus fréquentes et les plus complexes.</p>
          <h4>Principes :</h4>
          <ul>
            <li><strong>Tour active</strong> : Placez votre tour derrière les pions passés</li>
            <li><strong>7ème rangée</strong> : Une tour sur la 7ème rangée est très puissante</li>
            <li><strong>Roi actif</strong> : Le roi doit participer activement</li>
          </ul>
          <h4>Positions théoriques :</h4>
          <ul>
            <li><strong>Position de Lucena</strong> : Technique pour gagner avec Tour + Pion</li>
            <li><strong>Position de Philidor</strong> : Technique de défense</li>
          </ul>
        `,
        tips: [
          'Les finales de tours sont souvent nulles avec un bon jeu',
          'Activité des pièces > matériel en finale de tours',
          'Apprenez Lucena et Philidor par cœur'
        ]
      },
      {
        id: 'checkmate-patterns',
        title: 'Mats élémentaires',
        content: `
          <p>Savoir <strong>mater avec peu de matériel</strong> est essentiel.</p>
          <h4>Mats à connaître :</h4>
          <ul>
            <li><strong>Dame + Roi vs Roi</strong> : Technique de l'escalier</li>
            <li><strong>Tour + Roi vs Roi</strong> : Pousser le roi vers le bord</li>
            <li><strong>2 Fous + Roi vs Roi</strong> : Technique du triangle</li>
          </ul>
          <h4>Mats impossibles :</h4>
          <ul>
            <li>Fou + Roi vs Roi (nulle)</li>
            <li>Cavalier + Roi vs Roi (nulle)</li>
            <li>2 Cavaliers + Roi vs Roi (nulle, sauf erreur)</li>
          </ul>
        `,
        tips: [
          'Pratiquez ces mats jusqu\'à les faire automatiquement',
          'Utilisez votre roi pour aider à mater',
          'Ne laissez pas le roi adverse s\'échapper vers le centre'
        ]
      }
    ]
  }
];

// ============================================
// Tutorial Class
// ============================================

export class Tutorial {
  private container: HTMLElement | null = null;
  private tutorialElement: HTMLElement | null = null;
  private currentSection: TutorialSection | null = null;
  private currentLessonIndex: number = 0;
  
  // Callbacks
  public onClose: (() => void) | null = null;
  
  constructor(container?: HTMLElement) {
    this.container = container || null;
  }
  
  // ============================================
  // Public Methods
  // ============================================
  
  /**
   * Show tutorial for a specific section
   */
  showSection(sectionId: string): void {
    const section = TUTORIAL_SECTIONS.find(s => s.id === sectionId);
    if (!section) {
      console.error(`Tutorial section not found: ${sectionId}`);
      return;
    }
    
    this.currentSection = section;
    this.currentLessonIndex = 0;
    this.render();
  }
  
  /**
   * Render the tutorial
   */
  render(): void {
    if (!this.currentSection) return;
    
    // Remove existing element
    if (this.tutorialElement) {
      this.tutorialElement.remove();
    }
    
    this.tutorialElement = document.createElement('div');
    this.tutorialElement.className = 'tutorial-overlay';
    
    const lesson = this.currentSection.lessons[this.currentLessonIndex];
    
    this.tutorialElement.innerHTML = `
      <div class="tutorial-container">
        <div class="tutorial-header">
          <div class="tutorial-header-left">
            <h2>${this.currentSection.title}</h2>
            <span class="tutorial-progress">${this.currentLessonIndex + 1} / ${this.currentSection.lessons.length}</span>
          </div>
          <button class="tutorial-close-btn" aria-label="Fermer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div class="tutorial-sidebar">
          <div class="tutorial-lessons-list">
            ${this.currentSection.lessons.map((l, i) => `
              <button class="tutorial-lesson-item ${i === this.currentLessonIndex ? 'active' : ''}" data-index="${i}">
                <span class="lesson-number">${i + 1}</span>
                <span class="lesson-title">${l.title}</span>
              </button>
            `).join('')}
          </div>
        </div>
        
        <div class="tutorial-content">
          <h3 class="tutorial-lesson-title">${lesson.title}</h3>
          
          <div class="tutorial-lesson-content">
            ${lesson.content}
          </div>
          
          ${lesson.tips ? `
            <div class="tutorial-tips">
              <h4>💡 Conseils</h4>
              <ul>
                ${lesson.tips.map(tip => `<li>${tip}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          <div class="tutorial-navigation">
            <button class="tutorial-nav-btn prev" ${this.currentLessonIndex === 0 ? 'disabled' : ''}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              Précédent
            </button>
            <button class="tutorial-nav-btn next" ${this.currentLessonIndex === this.currentSection.lessons.length - 1 ? 'disabled' : ''}>
              Suivant
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Append to container or body
    if (this.container) {
      this.container.appendChild(this.tutorialElement);
    } else {
      document.body.appendChild(this.tutorialElement);
    }
    
    this.setupEventListeners();
    this.addStyles();
  }
  
  /**
   * Hide the tutorial
   */
  hide(): void {
    if (this.tutorialElement) {
      this.tutorialElement.remove();
      this.tutorialElement = null;
    }
  }
  
  /**
   * Destroy the tutorial
   */
  destroy(): void {
    this.hide();
    this.currentSection = null;
    this.currentLessonIndex = 0;
  }
  
  // ============================================
  // Private Methods
  // ============================================
  
  private setupEventListeners(): void {
    if (!this.tutorialElement) return;
    
    // Close button
    const closeBtn = this.tutorialElement.querySelector('.tutorial-close-btn');
    closeBtn?.addEventListener('click', () => {
      this.hide();
      this.onClose?.();
    });
    
    // Lesson items
    const lessonItems = this.tutorialElement.querySelectorAll('.tutorial-lesson-item');
    lessonItems.forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.getAttribute('data-index') || '0', 10);
        this.goToLesson(index);
      });
    });
    
    // Navigation buttons
    const prevBtn = this.tutorialElement.querySelector('.tutorial-nav-btn.prev');
    const nextBtn = this.tutorialElement.querySelector('.tutorial-nav-btn.next');
    
    prevBtn?.addEventListener('click', () => {
      if (this.currentLessonIndex > 0) {
        this.goToLesson(this.currentLessonIndex - 1);
      }
    });
    
    nextBtn?.addEventListener('click', () => {
      if (this.currentSection && this.currentLessonIndex < this.currentSection.lessons.length - 1) {
        this.goToLesson(this.currentLessonIndex + 1);
      }
    });
    
    // Close on background click
    this.tutorialElement.addEventListener('click', (e) => {
      if (e.target === this.tutorialElement) {
        this.hide();
        this.onClose?.();
      }
    });
  }
  
  private goToLesson(index: number): void {
    this.currentLessonIndex = index;
    this.render();
  }
  
  private addStyles(): void {
    const styleId = 'tutorial-styles';
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .tutorial-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--backdrop-strong);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.2s ease-out;
        padding: 20px;
      }
      
      .tutorial-container {
        width: 100%;
        max-width: 900px;
        height: 85vh;
        max-height: 700px;
        background: var(--panel-bg-strong);
        border: 1px solid rgba(var(--color-primary-rgb), 0.3);
        border-radius: 20px;
        display: grid;
        grid-template-columns: 220px 1fr;
        grid-template-rows: auto 1fr;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
        animation: slideUp 0.3s ease-out;
      }
      
      .tutorial-header {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 24px;
        background: rgba(var(--color-primary-rgb), 0.12);
        border-bottom: 1px solid rgba(var(--color-primary-rgb), 0.2);
      }
      
      .tutorial-header-left {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      
      .tutorial-header h2 {
        font-size: 18px;
        font-weight: 600;
        color: var(--color-text-primary);
        margin: 0;
      }
      
      .tutorial-progress {
        font-size: 12px;
        padding: 4px 10px;
        background: rgba(var(--color-primary-rgb), 0.25);
        border-radius: 12px;
        color: var(--color-text-secondary);
      }
      
      .tutorial-close-btn {
        width: 36px;
        height: 36px;
        border: none;
        background: var(--surface-3);
        border-radius: 10px;
        color: var(--color-text-secondary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }
      
      .tutorial-close-btn:hover {
        background: var(--surface-4);
        color: var(--color-text-primary);
      }
      
      .tutorial-close-btn svg {
        width: 18px;
        height: 18px;
      }
      
      .tutorial-sidebar {
        background: var(--surface-sunken);
        border-right: 1px solid rgba(var(--color-primary-rgb), 0.2);
        overflow-y: auto;
        padding: 16px;
      }
      
      .tutorial-lessons-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      
      .tutorial-lesson-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: transparent;
        border: none;
        border-radius: 10px;
        color: var(--color-text-secondary);
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
        width: 100%;
      }
      
      .tutorial-lesson-item:hover {
        background: var(--surface-2);
        color: var(--color-text-primary);
      }
      
      .tutorial-lesson-item.active {
        background: rgba(var(--color-primary-rgb), 0.25);
        color: var(--color-text-primary);
      }
      
      .lesson-number {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(var(--color-primary-rgb), 0.25);
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        flex-shrink: 0;
      }
      
      .tutorial-lesson-item.active .lesson-number {
        background: var(--color-primary);
      }
      
      .lesson-title {
        font-size: 13px;
        font-weight: 500;
        line-height: 1.3;
      }
      
      .tutorial-content {
        padding: 24px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      }
      
      .tutorial-lesson-title {
        font-size: 24px;
        font-weight: 600;
        color: var(--color-text-primary);
        margin: 0 0 20px;
      }
      
      .tutorial-lesson-content {
        flex: 1;
        color: var(--color-text-primary);
        line-height: 1.7;
        font-size: 15px;
      }
      
      .tutorial-lesson-content h4 {
        color: var(--color-primary);
        font-size: 16px;
        margin: 20px 0 10px;
      }
      
      .tutorial-lesson-content p {
        margin: 0 0 16px;
      }
      
      .tutorial-lesson-content ul,
      .tutorial-lesson-content ol {
        margin: 0 0 16px;
        padding-left: 24px;
      }
      
      .tutorial-lesson-content li {
        margin-bottom: 8px;
      }
      
      .tutorial-lesson-content strong {
        color: var(--color-text-primary);
      }
      
      .tutorial-tips {
        background: rgba(var(--color-primary-rgb), 0.1);
        border: 1px solid rgba(var(--color-primary-rgb), 0.25);
        border-radius: 12px;
        padding: 16px 20px;
        margin-top: 20px;
      }
      
      .tutorial-tips h4 {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-text-primary);
        margin: 0 0 12px;
      }
      
      .tutorial-tips ul {
        margin: 0;
        padding-left: 20px;
      }
      
      .tutorial-tips li {
        font-size: 13px;
        color: var(--color-text-secondary);
        margin-bottom: 6px;
      }
      
      .tutorial-navigation {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid var(--divider);
      }
      
      .tutorial-nav-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: rgba(var(--color-primary-rgb), 0.15);
        border: 1px solid rgba(var(--color-primary-rgb), 0.3);
        border-radius: 10px;
        color: var(--color-text-primary);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .tutorial-nav-btn:hover:not(:disabled) {
        background: rgba(var(--color-primary-rgb), 0.25);
        border-color: rgba(var(--color-primary-rgb), 0.5);
      }
      
      .tutorial-nav-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      
      .tutorial-nav-btn svg {
        width: 16px;
        height: 16px;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Responsive */
      @media (max-width: 768px) {
        .tutorial-container {
          grid-template-columns: 1fr;
          grid-template-rows: auto auto 1fr;
          max-height: 90vh;
        }
        
        .tutorial-sidebar {
          border-right: none;
          border-bottom: 1px solid rgba(var(--color-primary-rgb), 0.2);
          max-height: 150px;
        }
        
        .tutorial-lessons-list {
          flex-direction: row;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .tutorial-lesson-item {
          padding: 8px 12px;
        }
        
        .lesson-title {
          display: none;
        }
        
        .tutorial-content {
          padding: 16px;
        }
        
        .tutorial-lesson-title {
          font-size: 20px;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Export sections for external use
export { TUTORIAL_SECTIONS };