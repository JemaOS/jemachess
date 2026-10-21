import { describe, it, expect } from 'vitest';
import { deserializeMessage, isValidMessage, MessageType } from '../../src/network/messages';
import { clampNumber, clampText, escapeHtml, sanitizeDisplayName } from '../../src/utils/security';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

function baseMessage(type: MessageType) {
  return {
    type,
    timestamp: Date.now(),
    senderId: 'peer-123',
  };
}

describe('security helpers', () => {
  it('escapes HTML text and attribute values', () => {
    expect(escapeHtml('<img src=x onerror="alert(1)">')).toBe(
      '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'
    );
    expect(escapeHtml("'quoted' & <tag>")).toBe('&#39;quoted&#39; &amp; &lt;tag&gt;');
    expect(escapeHtml(null)).toBe('');
  });

  it('normalizes display names', () => {
    expect(sanitizeDisplayName('  Alice\n\tBob  ')).toBe('Alice Bob');
    expect(sanitizeDisplayName('')).toBe('Joueur');
    expect(sanitizeDisplayName('a'.repeat(100))).toHaveLength(20);
    expect(sanitizeDisplayName(42)).toBe('Joueur');
  });

  it('clamps numbers and text', () => {
    expect(clampNumber(12.6, 0, 10, 5)).toBe(10);
    expect(clampNumber(Number.NaN, 0, 10, 5)).toBe(5);
    expect(clampText('abcdef', 3)).toBe('abc');
    expect(clampText(123, 10, 'fallback')).toBe('fallback');
  });
});

describe('network message validation', () => {
  it('accepts valid chat and move messages', () => {
    expect(
      isValidMessage({
        ...baseMessage(MessageType.CHAT),
        content: 'Bonjour',
      })
    ).toBe(true);

    expect(
      isValidMessage({
        ...baseMessage(MessageType.MOVE),
        move: {
          from: { file: 4, rank: 1 },
          to: { file: 4, rank: 3 },
        },
        moveNumber: 1,
        fen: START_FEN,
      })
    ).toBe(true);
  });

  it('rejects missing base fields and oversized payloads', () => {
    expect(isValidMessage(null)).toBe(false);
    expect(isValidMessage({ type: MessageType.CHAT })).toBe(false);
    expect(
      isValidMessage({
        ...baseMessage(MessageType.CHAT),
        content: 'x'.repeat(2001),
      })
    ).toBe(false);
  });

  it('rejects malformed type-specific payloads', () => {
    expect(
      isValidMessage({
        ...baseMessage(MessageType.MOVE),
        move: {
          from: { file: 8, rank: 0 },
          to: { file: 0, rank: 0 },
        },
        moveNumber: 1,
        fen: START_FEN,
      })
    ).toBe(false);

    expect(
      isValidMessage({
        ...baseMessage(MessageType.STATE_RESPONSE),
        fen: START_FEN,
        moveHistory: 'not-an-array',
        currentMoveNumber: 0,
        whiteTime: 0,
        blackTime: 0,
        status: 'in_progress',
      })
    ).toBe(false);

    expect(
      isValidMessage({
        ...baseMessage(MessageType.GAME_END),
        status: 'in_progress',
        winner: 'red',
        reason: 'resign',
      })
    ).toBe(false);
  });

  it('rejects oversized serialized messages before parsing', () => {
    expect(deserializeMessage('x'.repeat(512 * 1024 + 1))).toBeNull();
  });

  it('parses valid serialized messages', () => {
    const message = {
      ...baseMessage(MessageType.CHAT),
      content: 'Salut',
    };

    expect(deserializeMessage(JSON.stringify(message))).toEqual(message);
  });
});
