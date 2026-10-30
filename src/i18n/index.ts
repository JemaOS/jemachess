/**
 * JemaChess i18n
 *
 * The UI is written in French and English in different places. This module
 * keeps a single FR <-> EN dictionary and translates the DOM at runtime, so the
 * whole interface follows the user's system language (or a manual choice).
 */

export type Lang = 'fr' | 'en';
export type LangPref = 'system' | 'fr' | 'en';

const LANG_KEY = 'jemachess-lang';

/** Every visible string, French first, English second. */
const PAIRS: ReadonlyArray<readonly [string, string]> = [
  // ── Settings ────────────────────────────────────────────────────────────
  ['Paramètres', 'Settings'],
  ['Apparence', 'Appearance'],
  ["Thème de l'interface", 'Interface theme'],
  [
    'Suit automatiquement le mode clair/sombre de Windows, ChromeOS, macOS ou Linux.',
    'Automatically follows the light/dark mode of Windows, ChromeOS, macOS or Linux.',
  ],
  ['Langue', 'Language'],
  ['Français', 'French'],
  ['Thème des pièces', 'Piece theme'],
  ['Classique', 'Classic'],
  ['Égyptien', 'Egyptian'],
  ['Grec', 'Greek'],
  ['Afficher les coordonnées', 'Show coordinates'],
  ["Afficher les lettres et chiffres sur l'échiquier", 'Show letters and numbers on the board'],
  ['Afficher les coups légaux', 'Show legal moves'],
  ['Mettre en surbrillance les coups possibles', 'Highlight possible moves'],
  ['Promotion automatique', 'Auto promotion'],
  ['Promouvoir automatiquement les pions en dame', 'Automatically promote pawns to a queen'],
  ['Son', 'Sound'],
  ['Effets sonores', 'Sound effects'],
  ['Jouer des sons pour les coups et événements', 'Play sounds for moves and events'],
  ['Système', 'System'],
  ['Clair', 'Light'],
  ['Sombre', 'Dark'],

  // ── Landing / menu ──────────────────────────────────────────────────────
  ['Jouer', 'Play'],
  ['Apprendre', 'Learn'],
  ['Jouer en ligne', 'Play online'],
  ['Jouer avec un ami', 'Play with a friend'],
  ["Jouer contre l'ordinateur", 'Play against the computer'],
  ["Jouer contre l'", 'Play against the '],
  ['ordinateur', 'computer'],
  ['Entrez votre pseudo', 'Enter your nickname'],
  ['Cliquez pour modifier votre pseudo', 'Click to edit your nickname'],
  [
    "ELO évolue en fonction de vos parties contre l'",
    'ELO changes based on your games against the ',
  ],
  ['Invité', 'Guest'],
  ['Toggle menu', 'Toggle menu'],
  ['Chess', 'Échecs'],
  ['Built with WebRTC for peer-to-peer gameplay', 'Built with WebRTC for peer-to-peer games'],
  ['Jouez aux échecs', 'Play chess'],
  ['Rejoignez des milliers d’utilisateurs de JemaChess', 'Join thousands of JemaChess players'],
  ["Rejoignez des milliers d'utilisateurs de JemaChess", 'Join thousands of JemaChess players'],
  ['Nouvelle partie', 'New game'],
  ["Contre l'IA", 'Against the AI'],
  ['4 niveaux de difficulté', '4 difficulty levels'],
  ['Avec un ami', 'With a friend'],
  ['Sur le même appareil', 'On the same device'],
  ['En ligne', 'Online'],
  ['Joueurs du monde entier', 'Players from around the world'],
  ['Mode Coach', 'Coach mode'],
  ['Avec indices et conseils', 'With hints and tips'],
  ['Parties', 'Games'],
  ['Coups', 'Moves'],
  ['Réglages', 'Settings'],
  ['Modifier le profil', 'Edit profile'],
  ['Pseudo', 'Nickname'],
  ['Votre pseudo sera sauvegardé localement', 'Your nickname will be saved locally'],
  ['Votre ELO', 'Your ELO'],
  ["L'ELO évolue en fonction de vos parties contre l'IA", 'ELO changes based on your games against the AI'],
  ['Annuler', 'Cancel'],
  ['Enregistrer', 'Save'],
  ['Développé par', 'Built by'],
  ['© 2025 • Open Source & Libre', '© 2025 • Open Source & Free'],

  // ── Lobby / online ──────────────────────────────────────────────────────
  ['Salle de jeu', 'Game room'],
  ['Créer une salle', 'Create a room'],
  ['Créer la salle', 'Create room'],
  ['Rejoindre une salle', 'Join a room'],
  ['Code de la salle', 'Room code'],
  ['Entrez le code (ex: abc123-def456...)', 'Enter the code (e.g. abc123-def456...)'],
  ['Votre nom', 'Your name'],
  ['Entrez votre nom', 'Enter your name'],
  ['Veuillez entrer votre nom', 'Please enter your name'],
  ['Veuillez entrer un code de salle', 'Please enter a room code'],
  ['Prêt', 'Ready'],
  ['Quitter', 'Leave'],
  ['Code copié !', 'Code copied!'],
  ['Code collé !', 'Code pasted!'],
  ['Échec de la copie', 'Copy failed'],
  ['Impossible de créer la salle', 'Could not create the room'],
  [
    'Impossible de rejoindre la salle. Vérifiez le code.',
    'Could not join the room. Check the code.',
  ],
  ['En attente...', 'Waiting...'],
  ['Adversaire connecté !', 'Opponent connected!'],
  ['Adversaire déconnecté', 'Opponent disconnected'],

  // ── Game screen ─────────────────────────────────────────────────────────
  ['Blancs', 'White'],
  ['Noirs', 'Black'],
  ['Les Blancs', 'White'],
  ['Les Noirs', 'Black'],
  ['Abandonner', 'Resign'],
  ['Êtes-vous sûr de vouloir abandonner ?', 'Are you sure you want to resign?'],
  ['Changer le thème des pièces', 'Change the piece theme'],
  ['Retourner le plateau (F)', 'Flip the board (F)'],
  ['Plein écran', 'Fullscreen'],
  ['Quitter le plein écran', 'Exit fullscreen'],
  [
    'Mode Coach activé - Appuyez sur H pour les indices',
    'Coach mode on - press H for hints',
  ],

  // ── Game over ───────────────────────────────────────────────────────────
  ['Partie terminée', 'Game over'],
  ['Partie terminée !', 'Game over!'],
  ['Échec et Mat !', 'Checkmate!'],
  [
    'Les Blancs gagnent - Le roi noir est capturé !',
    'White wins - the black king is captured!',
  ],
  [
    'Les Noirs gagnent - Le roi blanc est capturé !',
    'Black wins - the white king is captured!',
  ],
  ['Les Blancs ont abandonné', 'White resigned'],
  ['Les Noirs ont abandonné', 'Black resigned'],
  ['Les Blancs ont épuisé leur temps', 'White ran out of time'],
  ['Les Noirs ont épuisé leur temps', 'Black ran out of time'],
  ['Match nul', 'Draw'],
  ['Règle des 50 coups', 'Fifty-move rule'],
  ['Triple répétition de position', 'Threefold repetition'],
  ['Matériel insuffisant pour mater', 'Insufficient material'],
  ['Les joueurs ont accepté la nulle', 'Players agreed to a draw'],
  ['Temps écoulé', 'Time expired'],
  ['Aucun coup légal possible', 'No legal move available'],
  ['Aucune partie à revoir', 'No game to review'],

  // ── Toasts / status ─────────────────────────────────────────────────────
  ['Démarrage de la partie...', 'Starting the game...'],
  ['Paramètres enregistrés', 'Settings saved'],
  ['Partie restaurée !', 'Game restored!'],
  ['Nulle proposée', 'Draw offered'],
  ['Nulle refusée', 'Draw declined'],
  ['Revanche demandée', 'Rematch requested'],
  ['Connexion réussie !', 'Connected!'],
  ['Erreur de connexion', 'Connection error'],
  ['Erreur de synchronisation', 'Sync error'],
  ['Reconnexion échouée', 'Reconnection failed'],
  ['Reconnexion impossible - Nouvelle salle créée', 'Reconnection failed - new room created'],
  ['Tutoriel non disponible', 'Tutorial unavailable'],
  ['Actualités', 'News'],
  ['Création de tournoi - Bientôt disponible', 'Tournament creation - coming soon'],
  ['Inscription au tournoi - Bientôt disponible', 'Tournament registration - coming soon'],
  ['Aucun indice disponible', 'No hint available'],
  ["Coup rejeté par l'adversaire", 'Move rejected by the opponent'],
  ['Échec et mat ! Les Blancs gagnent !', 'Checkmate! White wins!'],
  ['Échec et mat ! Les Noirs gagnent !', 'Checkmate! Black wins!'],
  ['Les Blancs abandonnent. Les Noirs gagnent !', 'White resigns. Black wins!'],
  ['Les Noirs abandonnent. Les Blancs gagnent !', 'Black resigns. White wins!'],
  [
    'Temps écoulé pour les Blancs. Les Noirs gagnent !',
    'White ran out of time. Black wins!',
  ],
  [
    'Temps écoulé pour les Noirs. Les Blancs gagnent !',
    'Black ran out of time. White wins!',
  ],
  ['Pat ! La partie est nulle.', 'Stalemate! The game is a draw.'],
  ['Nulle par accord mutuel.', 'Draw by agreement.'],
  ['Nulle par matériel insuffisant.', 'Draw by insufficient material.'],
  ['Nulle par triple répétition.', 'Draw by threefold repetition.'],
  ['Nulle par la règle des 50 coups.', 'Draw by the fifty-move rule.'],
  ['Échec et mat !', 'Checkmate!'],
  ['Vous êtes hors ligne. Le jeu continue en mode local.', 'You are offline. The game continues locally.'],
  ['Vous êtes hors ligne. Le jeu fonctionne en mode local.', 'You are offline. The game works locally.'],
  ['Connexion rétablie', 'Back online'],
  ['Mise à jour disponible !', 'Update available!'],
  ['Mettre à jour', 'Update'],
  ['Mise à jour...', 'Updating...'],
  ['JemaChess est disponible hors ligne !', 'JemaChess is available offline!'],
  ['Erreur de chargement', 'Loading error'],
  ['Rafraîchir la page', 'Reload the page'],

  // ── Difficulty (component is in English) ────────────────────────────────
  ['Easy', 'Facile'],
  ['Medium', 'Moyen'],
  ['Hard', 'Difficile'],
  ['Master', 'Maître'],
  ['Perfect for beginners. Makes occasional mistakes.', 'Parfait pour débuter. Fait parfois des erreurs.'],
  ['A balanced challenge. Plays solid moves.', 'Un défi équilibré. Joue des coups solides.'],
  ['Strong play. Finds tactical combinations.', 'Jeu solide. Trouve les combinaisons tactiques.'],
  ['Expert level. Deep calculation and strategy.', 'Niveau expert. Calcul et stratégie profonds.'],

  // ── Chat ────────────────────────────────────────────────────────────────
  ['Joueur', 'Player'],
  ['Adversaire', 'Opponent'],
  ['Réduire', 'Minimize'],
  ['Fermer', 'Close'],
  ['Connexion...', 'Connecting...'],
  ['Déconnecté', 'Disconnected'],
  ['Votre pseudo...', 'Your nickname...'],

  // ── Analysis / review (components are in English) ───────────────────────
  ['Analyze position', 'Analyser la position'],
  ['Analyzing...', 'Analyse...'],
  ['Ready', 'Prêt'],
  ['Analysis complete', 'Analyse terminée'],
  ['Close', 'Fermer'],
  ['Start', 'Début'],
  ['End', 'Fin'],
  ['Blunder', 'Gaffe'],
  ['Mistake', 'Erreur'],
  ['Inaccuracy', 'Imprécision'],
  ['Good', 'Bon'],
  ['Book', 'Théorie'],

  // ── Tutorial ────────────────────────────────────────────────────────────
  ['Les bases des échecs', 'Chess basics'],
  ['Introduction aux échecs', 'Introduction to chess'],
  ['Les Ouvertures', 'Openings'],
  ['Le Milieu de partie', 'Middlegame'],
  ['Finales Roi et Pion', 'King and pawn endgames'],
  ['Mats élémentaires', 'Basic mates'],
  ['Principes stratégiques', 'Strategic principles'],
  ['Apprenez les règles fondamentales et le mouvement des pièces', 'Learn the basic rules and how the pieces move'],
  ['Découvrez les débuts de partie les plus populaires', 'Discover the most popular openings'],
  ['Techniques essentielles pour conclure la partie', 'Essential techniques to finish the game'],
  ['Le Roi', 'The King'],
  ['La Dame', 'The Queen'],
  ['La Tour', 'The Rook'],
  ['Le Fou', 'The Bishop'],
  ['Le Cavalier', 'The Knight'],
  ['Le Pion', 'The Pawn'],
  ['Le Roque', 'Castling'],
  ['Le Clouage', 'The Pin'],
  ['La Défense Sicilienne', 'The Sicilian Defense'],
  ['La Partie Espagnole (Ruy Lopez)', 'The Spanish Game (Ruy Lopez)'],
  ['La Partie Italienne', 'The Italian Game'],
  ['Le Gambit Dame', "The Queen's Gambit"],
  ['Les Blancs jouent toujours en premier', 'White always moves first'],
  ['Roquez dans les 10-15 premiers coups', 'Castle within the first 10-15 moves'],
  ['Ne sortez pas votre dame trop tôt dans la partie', "Don't bring your queen out too early"],
  ['Protégez toujours votre dame', 'Always protect your queen'],
  ['La technique est plus importante que la créativité', 'Technique matters more than creativity'],
];

const FR_TO_EN = new Map(PAIRS.filter(([fr, en]) => fr !== en).map(([fr, en]) => [fr, en]));
const EN_TO_FR = new Map(PAIRS.filter(([fr, en]) => fr !== en).map(([fr, en]) => [en, fr]));

function readStoredPref(): LangPref {
  try {
    const value = localStorage.getItem(LANG_KEY);
    if (value === 'system' || value === 'fr' || value === 'en') return value;
  } catch {
    // storage unavailable
  }
  return 'system';
}

function systemLang(): Lang {
  const languages =
    typeof navigator !== 'undefined'
      ? navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language]
      : [];
  const first = (languages[0] || 'en').toLowerCase();
  return first.startsWith('fr') ? 'fr' : 'en';
}

export function getLangPref(): LangPref {
  return readStoredPref();
}

export function getLang(): Lang {
  const pref = readStoredPref();
  return pref === 'system' ? systemLang() : pref;
}

const ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];

function translateText(value: string, map: Map<string, string>): string | null {
  if (!value || !value.trim()) return null;
  const leading = value.match(/^\s*/)?.[0] ?? '';
  const trailing = value.match(/\s*$/)?.[0] ?? '';
  const core = value.trim();
  const target = map.get(core);
  if (!target || target === core) return null;
  return `${leading}${target}${trailing}`;
}

function translateElementAttributes(element: Element, map: Map<string, string>): void {
  for (const attr of ATTRS) {
    const current = element.getAttribute(attr);
    if (!current) continue;
    const next = translateText(current, map);
    if (next !== null) element.setAttribute(attr, next);
  }
}

function translateTree(root: Node, map: Map<string, string>): void {
  if (root.nodeType === Node.TEXT_NODE) {
    const next = translateText(root.nodeValue ?? '', map);
    if (next !== null) root.nodeValue = next;
    return;
  }
  if (!(root instanceof Element)) return;

  const tag = root.tagName;
  if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CODE' || tag === 'PRE') return;

  translateElementAttributes(root, map);

  for (const child of Array.from(root.childNodes)) {
    translateTree(child, map);
  }
}

let observer: MutationObserver | null = null;

/** Re-translates the whole document for the current language. */
export function retranslate(): void {
  const lang = getLang();
  document.documentElement.lang = lang;
  const map = lang === 'en' ? FR_TO_EN : EN_TO_FR;
  translateTree(document.body, map);
}

/** Applies the language preference, persists it and re-translates the DOM. */
export function setLangPref(pref: LangPref): void {
  try {
    localStorage.setItem(LANG_KEY, pref);
  } catch {
    // storage unavailable
  }
  retranslate();
}

/** Starts the observer that translates content rendered after boot. */
export function initI18n(): void {
  if (typeof document === 'undefined') return;
  retranslate();

  if (observer) observer.disconnect();
  observer = new MutationObserver((mutations) => {
    const map = getLang() === 'en' ? FR_TO_EN : EN_TO_FR;
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') {
        if (mutation.target.nodeType === Node.TEXT_NODE) {
          const next = translateText(mutation.target.nodeValue ?? '', map);
          if (next !== null) mutation.target.nodeValue = next;
        }
        continue;
      }
      for (const node of Array.from(mutation.addedNodes)) {
        translateTree(node, map);
      }
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}
