/**
 * Settings Panel Component
 * 
 * Provides a settings panel for configuring game options
 * like piece theme, sound, and display preferences.
 */

import { PieceTheme } from '../../types';
import { PieceRenderer } from './Piece';
import { themeManager, type ThemePreference } from '../../utils/ThemeManager';
import { getLangPref, setLangPref, type LangPref } from '../../i18n';

/**
 * Game settings interface
 */
export interface GameSettings {
  pieceTheme: PieceTheme;
  soundEnabled: boolean;
  showLegalMoves: boolean;
  showCoordinates: boolean;
  autoQueen: boolean;
  theme: ThemePreference;
}

/**
 * Default game settings
 */
export const DEFAULT_SETTINGS: GameSettings = {
  pieceTheme: PieceTheme.CLASSIC,
  soundEnabled: true,
  showLegalMoves: true,
  showCoordinates: true,
  autoQueen: false,
  theme: 'system',
};

/**
 * Settings class for the settings panel
 */
export class Settings {
  private container: HTMLElement;
  private settingsElement: HTMLElement | null = null;
  private settings: GameSettings;
  private unsubscribeTheme: (() => void) | null = null;

  // Event callbacks
  public onSettingsChange: ((settings: GameSettings) => void) | null = null;
  public onClose: (() => void) | null = null;

  constructor(container: HTMLElement, initialSettings?: Partial<GameSettings>) {
    this.container = container;
    this.settings = {
      ...DEFAULT_SETTINGS,
      theme: themeManager.getPreference(),
      ...initialSettings,
    };

    if (
      this.settings.theme !== 'system' &&
      this.settings.theme !== 'light' &&
      this.settings.theme !== 'dark'
    ) {
      this.settings.theme = themeManager.getPreference();
    }

    // Keep the selector in sync when another tab or the OS changes the theme.
    this.unsubscribeTheme = themeManager.subscribe((_theme, preference) => {
      this.settings.theme = preference;
      this.updateThemeModeSelection();
    });
  }

  /**
   * Reflects the persisted preference in the theme selector.
   */
  private updateThemeModeSelection(): void {
    const selector = this.settingsElement?.querySelector('.theme-mode-selector');
    if (!selector) return;

    selector.querySelectorAll<HTMLElement>('.theme-mode-option').forEach((element) => {
      const isSelected = element.dataset.themeMode === this.settings.theme;
      element.classList.toggle('selected', isSelected);
      element.setAttribute('aria-checked', String(isSelected));
      element.tabIndex = isSelected ? 0 : -1;
    });
  }

  /**
   * Renders the settings panel
   */
  render(): void {
    this.container.innerHTML = '';

    this.settingsElement = document.createElement('div');
    this.settingsElement.className = 'settings-panel glass-card';

    // Header
    const header = document.createElement('div');
    header.className = 'settings-header';

    const backButton = document.createElement('button');
    backButton.className = 'settings-back';
    backButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    `;
    backButton.addEventListener('click', () => {
      if (this.onClose) {
        this.onClose();
      }
    });
    header.appendChild(backButton);

    const title = document.createElement('h2');
    title.className = 'settings-title';
    title.textContent = 'Paramètres';
    header.appendChild(title);

    this.settingsElement.appendChild(header);

    // Appearance Section
    const appearanceSection = this.createSection('Apparence');

    // Interface theme (system / light / dark)
    const interfaceThemeOption = document.createElement('div');
    interfaceThemeOption.className = 'settings-section';

    const interfaceThemeLabel = document.createElement('div');
    interfaceThemeLabel.className = 'settings-label';
    interfaceThemeLabel.textContent = 'Thème de l\'interface';
    interfaceThemeOption.appendChild(interfaceThemeLabel);

    const interfaceThemeDescription = document.createElement('div');
    interfaceThemeDescription.className = 'settings-description';
    interfaceThemeDescription.textContent =
      'Suit automatiquement le mode clair/sombre de Windows, ChromeOS, macOS ou Linux.';
    interfaceThemeOption.appendChild(interfaceThemeDescription);

    interfaceThemeOption.appendChild(this.createThemeModeSelector());
    appearanceSection.appendChild(interfaceThemeOption);

    // Piece Theme
    const themeOption = document.createElement('div');
    themeOption.className = 'settings-section';
    
    const themeLabel = document.createElement('div');
    themeLabel.className = 'settings-label';
    themeLabel.textContent = 'Thème des pièces';
    themeOption.appendChild(themeLabel);

    const themeSelector = this.createThemeSelector();
    themeOption.appendChild(themeSelector);
    
    appearanceSection.appendChild(themeOption);

    // Show Coordinates toggle
    appearanceSection.appendChild(
      this.createToggleOption(
        'Afficher les coordonnées',
        'Afficher les lettres et chiffres sur l\'échiquier',
        this.settings.showCoordinates,
        (value) => {
          this.settings.showCoordinates = value;
          this.notifyChange();
        }
      )
    );

    // Show Legal Moves toggle
    appearanceSection.appendChild(
      this.createToggleOption(
        'Afficher les coups légaux',
        'Mettre en surbrillance les coups possibles',
        this.settings.showLegalMoves,
        (value) => {
          this.settings.showLegalMoves = value;
          this.notifyChange();
        }
      )
    );

    this.settingsElement.appendChild(appearanceSection);

    // Language Section
    const languageSection = this.createSection('Langue');
    languageSection.appendChild(this.createLanguageSelector());
    this.settingsElement.appendChild(languageSection);

    // Gameplay Section
    const gameplaySection = this.createSection('Gameplay');

    // Auto Queen toggle
    gameplaySection.appendChild(
      this.createToggleOption(
        'Promotion automatique',
        'Promouvoir automatiquement les pions en dame',
        this.settings.autoQueen,
        (value) => {
          this.settings.autoQueen = value;
          this.notifyChange();
        }
      )
    );

    this.settingsElement.appendChild(gameplaySection);

    // Sound Section
    const soundSection = this.createSection('Son');

    // Sound Enabled toggle
    soundSection.appendChild(
      this.createToggleOption(
        'Effets sonores',
        'Jouer des sons pour les coups et événements',
        this.settings.soundEnabled,
        (value) => {
          this.settings.soundEnabled = value;
          this.notifyChange();
        }
      )
    );

    this.settingsElement.appendChild(soundSection);

    this.container.appendChild(this.settingsElement);
  }

  /**
   * Creates a settings section
   */
  private createSection(title: string): HTMLElement {
    const section = document.createElement('div');
    section.className = 'settings-section';

    const sectionTitle = document.createElement('h3');
    sectionTitle.className = 'settings-section-title';
    sectionTitle.textContent = title;
    section.appendChild(sectionTitle);

    return section;
  }

  /**
   * Creates a toggle option
   */
  private createToggleOption(
    label: string,
    description: string,
    initialValue: boolean,
    onChange: (value: boolean) => void
  ): HTMLElement {
    const option = document.createElement('div');
    option.className = 'settings-option';

    const labelContainer = document.createElement('div');
    
    const labelElement = document.createElement('div');
    labelElement.className = 'settings-label';
    labelElement.textContent = label;
    labelContainer.appendChild(labelElement);

    const descElement = document.createElement('div');
    descElement.className = 'settings-description';
    descElement.textContent = description;
    labelContainer.appendChild(descElement);

    option.appendChild(labelContainer);

    const toggle = document.createElement('div');
    toggle.className = `glass-toggle ${initialValue ? 'active' : ''}`;
    toggle.addEventListener('click', () => {
      const newValue = !toggle.classList.contains('active');
      toggle.classList.toggle('active', newValue);
      onChange(newValue);
    });
    option.appendChild(toggle);

    return option;
  }

  /**
   * Creates the interface theme selector (system / light / dark)
   */
  private createThemeModeSelector(): HTMLElement {
    const selector = document.createElement('div');
    selector.className = 'theme-mode-selector';
    selector.setAttribute('role', 'radiogroup');
    selector.setAttribute('aria-label', 'Thème de l\'interface');

    const modes: { value: ThemePreference; label: string; hint?: string }[] = [
      { value: 'system', label: 'Système', hint: 'Auto' },
      { value: 'light', label: 'Clair' },
      { value: 'dark', label: 'Sombre' },
    ];

    for (const mode of modes) {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = `theme-mode-option ${this.settings.theme === mode.value ? 'selected' : ''}`;
      option.dataset.themeMode = mode.value;
      option.setAttribute('role', 'radio');
      option.setAttribute('aria-checked', String(this.settings.theme === mode.value));
      option.tabIndex = this.settings.theme === mode.value ? 0 : -1;

      const preview = document.createElement('span');
      preview.className = `theme-mode-preview theme-mode-preview-${mode.value}`;
      preview.innerHTML =
        '<span class="theme-mode-preview-sidebar"></span>' +
        '<span class="theme-mode-preview-content">' +
        '<span class="theme-mode-preview-line"></span>' +
        '<span class="theme-mode-preview-line short"></span>' +
        '</span>';
      option.appendChild(preview);

      const label = document.createElement('span');
      label.className = 'theme-mode-label';
      label.textContent = mode.label;
      option.appendChild(label);

      if (mode.hint) {
        const hint = document.createElement('span');
        hint.className = 'theme-mode-hint';
        hint.textContent = mode.hint;
        option.appendChild(hint);
      }

      option.addEventListener('click', () => {
        if (this.settings.theme === mode.value) return;

        this.settings.theme = mode.value;
        themeManager.setPreference(mode.value);

        selector.querySelectorAll<HTMLElement>('.theme-mode-option').forEach((element) => {
          const isSelected = element.dataset.themeMode === mode.value;
          element.classList.toggle('selected', isSelected);
          element.setAttribute('aria-checked', String(isSelected));
          element.tabIndex = isSelected ? 0 : -1;
        });

        this.notifyChange();
      });

      selector.appendChild(option);
    }

    selector.addEventListener('keydown', (event) => {
      const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
      if (!keys.includes(event.key)) return;

      event.preventDefault();
      const options = Array.from(
        selector.querySelectorAll<HTMLButtonElement>('.theme-mode-option')
      );
      const currentIndex = options.findIndex((element) => element === document.activeElement);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;
      if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = options.length - 1;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        nextIndex = (currentIndex - 1 + options.length) % options.length;
      } else {
        nextIndex = (currentIndex + 1) % options.length;
      }

      options[nextIndex]?.focus();
      options[nextIndex]?.click();
    });

    return selector;
  }

  /**
   * Creates the language selector (system / français / english)
   */
  private createLanguageSelector(): HTMLElement {
    const selector = document.createElement('div');
    selector.className = 'lang-selector';
    selector.setAttribute('role', 'radiogroup');
    selector.setAttribute('aria-label', 'Langue');

    const current = getLangPref();
    const options: { value: LangPref; label: string }[] = [
      { value: 'system', label: 'Système' },
      { value: 'fr', label: 'Français' },
      { value: 'en', label: 'English' },
    ];

    for (const option of options) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `lang-option ${current === option.value ? 'selected' : ''}`;
      button.dataset.lang = option.value;
      button.setAttribute('role', 'radio');
      button.setAttribute('aria-checked', String(current === option.value));
      button.textContent = option.label;
      button.addEventListener('click', () => {
        setLangPref(option.value);
        selector.querySelectorAll<HTMLElement>('.lang-option').forEach((element) => {
          const isSelected = element.dataset.lang === option.value;
          element.classList.toggle('selected', isSelected);
          element.setAttribute('aria-checked', String(isSelected));
        });
      });
      selector.appendChild(button);
    }

    return selector;
  }

  /**
   * Creates the theme selector
   */
  private createThemeSelector(): HTMLElement {
    const selector = document.createElement('div');
    selector.className = 'piece-set-selector';

    const themes: { theme: PieceTheme; name: string }[] = [
      { theme: PieceTheme.CLASSIC, name: 'Classique' },
      { theme: PieceTheme.EGYPTIAN, name: 'Égyptien' },
      { theme: PieceTheme.VIKING, name: 'Viking' },
      { theme: PieceTheme.GREEK, name: 'Grec' },
    ];

    for (const { theme, name } of themes) {
      const option = document.createElement('div');
      option.className = `piece-set-option ${this.settings.pieceTheme === theme ? 'selected' : ''}`;
      option.dataset.theme = theme;

      // Preview with king and queen
      const preview = document.createElement('div');
      preview.className = 'piece-set-preview';

      const whiteKing = PieceRenderer.createElement(
        { type: 'k' as any, color: 'w' as any },
        theme
      );
      whiteKing.style.width = '28px';
      whiteKing.style.height = '28px';
      preview.appendChild(whiteKing);

      const blackQueen = PieceRenderer.createElement(
        { type: 'q' as any, color: 'b' as any },
        theme
      );
      blackQueen.style.width = '28px';
      blackQueen.style.height = '28px';
      preview.appendChild(blackQueen);

      option.appendChild(preview);

      const nameElement = document.createElement('div');
      nameElement.className = 'piece-set-name';
      nameElement.textContent = name;
      option.appendChild(nameElement);

      option.addEventListener('click', () => {
        // Update selection
        selector.querySelectorAll('.piece-set-option').forEach((el) => {
          el.classList.remove('selected');
        });
        option.classList.add('selected');

        this.settings.pieceTheme = theme;
        this.notifyChange();
      });

      selector.appendChild(option);
    }

    return selector;
  }

  /**
   * Notifies listeners of settings change
   */
  private notifyChange(): void {
    if (this.onSettingsChange) {
      this.onSettingsChange({ ...this.settings });
    }
    
    // Save to localStorage
    this.saveSettings();
  }

  /**
   * Gets the current settings
   */
  getSettings(): GameSettings {
    return { ...this.settings };
  }

  /**
   * Updates settings
   */
  setSettings(settings: Partial<GameSettings>): void {
    this.settings = { ...this.settings, ...settings };
    if (this.settingsElement) {
      this.render();
    }
  }

  /**
   * Saves settings to localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('chess-settings', JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Failed to save settings to localStorage:', e);
    }
  }

  /**
   * Loads settings from localStorage
   */
  static loadSettings(): GameSettings {
    const settings: GameSettings = {
      ...DEFAULT_SETTINGS,
      theme: themeManager.getPreference(),
    };

    try {
      const saved = localStorage.getItem('chess-settings');
      if (!saved) return settings;

      const parsed = JSON.parse(saved) as Record<string, unknown>;

      if (
        typeof parsed.pieceTheme === 'string' &&
        (Object.values(PieceTheme) as string[]).includes(parsed.pieceTheme)
      ) {
        settings.pieceTheme = parsed.pieceTheme as PieceTheme;
      }

      if (typeof parsed.soundEnabled === 'boolean') {
        settings.soundEnabled = parsed.soundEnabled;
      }
      if (typeof parsed.showLegalMoves === 'boolean') {
        settings.showLegalMoves = parsed.showLegalMoves;
      }
      if (typeof parsed.showCoordinates === 'boolean') {
        settings.showCoordinates = parsed.showCoordinates;
      }
      if (typeof parsed.autoQueen === 'boolean') {
        settings.autoQueen = parsed.autoQueen;
      }

      if (parsed.theme === 'system' || parsed.theme === 'light' || parsed.theme === 'dark') {
        settings.theme = parsed.theme;
      }
    } catch (e) {
      console.warn('Failed to load settings from localStorage:', e);
    }

    return settings;
  }

  /**
   * Shows the settings panel
   */
  show(): void {
    if (!this.settingsElement) {
      this.render();
    }
    if (this.settingsElement) {
      this.settingsElement.style.display = 'block';
    }
  }

  /**
   * Hides the settings panel
   */
  hide(): void {
    if (this.settingsElement) {
      this.settingsElement.style.display = 'none';
    }
  }

  /**
   * Destroys the settings panel
   */
  destroy(): void {
    this.unsubscribeTheme?.();
    this.unsubscribeTheme = null;

    if (this.settingsElement) {
      this.settingsElement.remove();
      this.settingsElement = null;
    }
  }
}