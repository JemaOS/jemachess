/**
 * Message Protocol for P2P Communication
 * 
 * Defines all message types and interfaces for WebRTC peer-to-peer
 * communication in the chess game.
 */

import { GameStatus, PieceColor, PieceType } from '../types';

// Safety limits for untrusted peer messages
const MAX_SENDER_ID_LENGTH = 200;
const MAX_PLAYER_NAME_LENGTH = 50;
const MAX_TEXT_LENGTH = 2000;
const MAX_FEN_LENGTH = 200;
const MAX_MOVE_HISTORY_LENGTH = 4096;
const MAX_MESSAGE_SIZE = 512 * 1024;

// ============================================
// Message Types Enum
// ============================================

/**
 * All possible message types for P2P communication
 */
export enum MessageType {
  // Connection messages
  HELLO = 'hello',
  READY = 'ready',
  
  // Game control messages
  GAME_START = 'game_start',
  GAME_END = 'game_end',
  RESIGN = 'resign',
  DRAW_OFFER = 'draw_offer',
  DRAW_ACCEPT = 'draw_accept',
  DRAW_DECLINE = 'draw_decline',
  
  // Move messages
  MOVE = 'move',
  MOVE_ACK = 'move_ack',
  MOVE_REJECT = 'move_reject',
  
  // State synchronization messages
  STATE_REQUEST = 'state_request',
  STATE_RESPONSE = 'state_response',
  
  // Chat messages (optional feature)
  CHAT = 'chat',
  
  // Heartbeat messages
  PING = 'ping',
  PONG = 'pong',
}

// ============================================
// Base Message Interface
// ============================================

/**
 * Base interface for all game messages
 */
export interface BaseMessage {
  type: MessageType;
  timestamp: number;
  senderId: string;
}

// ============================================
// Connection Messages
// ============================================

/**
 * Initial handshake message sent when connecting
 */
export interface HelloMessage extends BaseMessage {
  type: MessageType.HELLO;
  playerName: string;
  clientVersion: string;
}

/**
 * Message indicating player is ready to start
 */
export interface ReadyMessage extends BaseMessage {
  type: MessageType.READY;
  playerColor: PieceColor;
}

// ============================================
// Game Control Messages
// ============================================

/**
 * Message to start the game
 */
export interface GameStartMessage extends BaseMessage {
  type: MessageType.GAME_START;
  hostColor: PieceColor;
  guestColor: PieceColor;
  initialFen: string;
  timeControl: {
    initial: number;
    increment: number;
  };
}

/**
 * Message indicating game has ended
 */
export interface GameEndMessage extends BaseMessage {
  type: MessageType.GAME_END;
  status: GameStatus;
  winner: PieceColor | null;
  reason: string;
}

/**
 * Message to resign from the game
 */
export interface ResignMessage extends BaseMessage {
  type: MessageType.RESIGN;
  resigningColor: PieceColor;
}

/**
 * Message to offer a draw
 */
export interface DrawOfferMessage extends BaseMessage {
  type: MessageType.DRAW_OFFER;
  offeringColor: PieceColor;
}

/**
 * Message to accept a draw offer
 */
export interface DrawAcceptMessage extends BaseMessage {
  type: MessageType.DRAW_ACCEPT;
}

/**
 * Message to decline a draw offer
 */
export interface DrawDeclineMessage extends BaseMessage {
  type: MessageType.DRAW_DECLINE;
}

// ============================================
// Move Messages
// ============================================

/**
 * Message containing a chess move
 */
export interface MoveMessage extends BaseMessage {
  type: MessageType.MOVE;
  move: {
    from: { file: number; rank: number };
    to: { file: number; rank: number };
    promotion?: PieceType;
  };
  moveNumber: number;
  fen: string; // FEN after the move for verification
}

/**
 * Message acknowledging a received move
 */
export interface MoveAckMessage extends BaseMessage {
  type: MessageType.MOVE_ACK;
  moveNumber: number;
  fen: string; // Confirming FEN matches
}

/**
 * Message rejecting an invalid move
 */
export interface MoveRejectMessage extends BaseMessage {
  type: MessageType.MOVE_REJECT;
  moveNumber: number;
  reason: string;
  expectedFen: string;
}

// ============================================
// State Synchronization Messages
// ============================================

/**
 * Request for full game state (used for reconnection)
 */
export interface StateRequestMessage extends BaseMessage {
  type: MessageType.STATE_REQUEST;
  lastKnownMoveNumber: number;
}

/**
 * Response with full game state
 */
export interface StateResponseMessage extends BaseMessage {
  type: MessageType.STATE_RESPONSE;
  fen: string;
  moveHistory: Array<{
    from: { file: number; rank: number };
    to: { file: number; rank: number };
    promotion?: PieceType;
  }>;
  currentMoveNumber: number;
  whiteTime: number;
  blackTime: number;
  status: GameStatus;
}

// ============================================
// Chat Messages
// ============================================

/**
 * Chat message between players
 */
export interface ChatMessage extends BaseMessage {
  type: MessageType.CHAT;
  content: string;
}

// ============================================
// Heartbeat Messages
// ============================================

/**
 * Ping message for connection health check
 */
export interface PingMessage extends BaseMessage {
  type: MessageType.PING;
  sequence: number;
}

/**
 * Pong response to ping
 */
export interface PongMessage extends BaseMessage {
  type: MessageType.PONG;
  sequence: number;
  receivedTimestamp: number;
}

// ============================================
// Union Type for All Messages
// ============================================

/**
 * Union type of all possible game messages
 */
export type GameMessage =
  | HelloMessage
  | ReadyMessage
  | GameStartMessage
  | GameEndMessage
  | ResignMessage
  | DrawOfferMessage
  | DrawAcceptMessage
  | DrawDeclineMessage
  | MoveMessage
  | MoveAckMessage
  | MoveRejectMessage
  | StateRequestMessage
  | StateResponseMessage
  | ChatMessage
  | PingMessage
  | PongMessage;

// ============================================
// Message Factory Functions
// ============================================

/**
 * Create a base message with common fields
 */
function createBaseMessage(type: MessageType, senderId: string): BaseMessage {
  return {
    type,
    timestamp: Date.now(),
    senderId,
  };
}

/**
 * Create a HELLO message
 */
export function createHelloMessage(
  senderId: string,
  playerName: string,
  clientVersion: string = '1.0.0'
): HelloMessage {
  return {
    ...createBaseMessage(MessageType.HELLO, senderId),
    type: MessageType.HELLO,
    playerName,
    clientVersion,
  };
}

/**
 * Create a READY message
 */
export function createReadyMessage(
  senderId: string,
  playerColor: PieceColor
): ReadyMessage {
  return {
    ...createBaseMessage(MessageType.READY, senderId),
    type: MessageType.READY,
    playerColor,
  };
}

/**
 * Create a GAME_START message
 */
export function createGameStartMessage(
  senderId: string,
  hostColor: PieceColor,
  guestColor: PieceColor,
  initialFen: string,
  timeControl: { initial: number; increment: number }
): GameStartMessage {
  return {
    ...createBaseMessage(MessageType.GAME_START, senderId),
    type: MessageType.GAME_START,
    hostColor,
    guestColor,
    initialFen,
    timeControl,
  };
}

/**
 * Create a GAME_END message
 */
export function createGameEndMessage(
  senderId: string,
  status: GameStatus,
  winner: PieceColor | null,
  reason: string
): GameEndMessage {
  return {
    ...createBaseMessage(MessageType.GAME_END, senderId),
    type: MessageType.GAME_END,
    status,
    winner,
    reason,
  };
}

/**
 * Create a RESIGN message
 */
export function createResignMessage(
  senderId: string,
  resigningColor: PieceColor
): ResignMessage {
  return {
    ...createBaseMessage(MessageType.RESIGN, senderId),
    type: MessageType.RESIGN,
    resigningColor,
  };
}

/**
 * Create a DRAW_OFFER message
 */
export function createDrawOfferMessage(
  senderId: string,
  offeringColor: PieceColor
): DrawOfferMessage {
  return {
    ...createBaseMessage(MessageType.DRAW_OFFER, senderId),
    type: MessageType.DRAW_OFFER,
    offeringColor,
  };
}

/**
 * Create a DRAW_ACCEPT message
 */
export function createDrawAcceptMessage(senderId: string): DrawAcceptMessage {
  return {
    ...createBaseMessage(MessageType.DRAW_ACCEPT, senderId),
    type: MessageType.DRAW_ACCEPT,
  };
}

/**
 * Create a DRAW_DECLINE message
 */
export function createDrawDeclineMessage(senderId: string): DrawDeclineMessage {
  return {
    ...createBaseMessage(MessageType.DRAW_DECLINE, senderId),
    type: MessageType.DRAW_DECLINE,
  };
}

/**
 * Create a MOVE message
 */
export function createMoveMessage(
  senderId: string,
  move: { from: { file: number; rank: number }; to: { file: number; rank: number }; promotion?: PieceType },
  moveNumber: number,
  fen: string
): MoveMessage {
  return {
    ...createBaseMessage(MessageType.MOVE, senderId),
    type: MessageType.MOVE,
    move,
    moveNumber,
    fen,
  };
}

/**
 * Create a MOVE_ACK message
 */
export function createMoveAckMessage(
  senderId: string,
  moveNumber: number,
  fen: string
): MoveAckMessage {
  return {
    ...createBaseMessage(MessageType.MOVE_ACK, senderId),
    type: MessageType.MOVE_ACK,
    moveNumber,
    fen,
  };
}

/**
 * Create a MOVE_REJECT message
 */
export function createMoveRejectMessage(
  senderId: string,
  moveNumber: number,
  reason: string,
  expectedFen: string
): MoveRejectMessage {
  return {
    ...createBaseMessage(MessageType.MOVE_REJECT, senderId),
    type: MessageType.MOVE_REJECT,
    moveNumber,
    reason,
    expectedFen,
  };
}

/**
 * Create a STATE_REQUEST message
 */
export function createStateRequestMessage(
  senderId: string,
  lastKnownMoveNumber: number
): StateRequestMessage {
  return {
    ...createBaseMessage(MessageType.STATE_REQUEST, senderId),
    type: MessageType.STATE_REQUEST,
    lastKnownMoveNumber,
  };
}

/**
 * Create a STATE_RESPONSE message
 */
export function createStateResponseMessage(
  senderId: string,
  fen: string,
  moveHistory: Array<{ from: { file: number; rank: number }; to: { file: number; rank: number }; promotion?: PieceType }>,
  currentMoveNumber: number,
  whiteTime: number,
  blackTime: number,
  status: GameStatus
): StateResponseMessage {
  return {
    ...createBaseMessage(MessageType.STATE_RESPONSE, senderId),
    type: MessageType.STATE_RESPONSE,
    fen,
    moveHistory,
    currentMoveNumber,
    whiteTime,
    blackTime,
    status,
  };
}

/**
 * Create a CHAT message
 */
export function createChatMessage(
  senderId: string,
  content: string
): ChatMessage {
  return {
    ...createBaseMessage(MessageType.CHAT, senderId),
    type: MessageType.CHAT,
    content,
  };
}

/**
 * Create a PING message
 */
export function createPingMessage(
  senderId: string,
  sequence: number
): PingMessage {
  return {
    ...createBaseMessage(MessageType.PING, senderId),
    type: MessageType.PING,
    sequence,
  };
}

/**
 * Create a PONG message
 */
export function createPongMessage(
  senderId: string,
  sequence: number,
  receivedTimestamp: number
): PongMessage {
  return {
    ...createBaseMessage(MessageType.PONG, senderId),
    type: MessageType.PONG,
    sequence,
    receivedTimestamp,
  };
}

// ============================================
// Message Serialization
// ============================================

/**
 * Serialize a message to JSON string
 */
export function serializeMessage(message: GameMessage): string {
  return JSON.stringify(message);
}

/**
 * Deserialize a JSON string to a message
 */
export function deserializeMessage(data: string): GameMessage | null {
  // Reject oversized payloads before parsing them (DoS protection).
  if (data.length > MAX_MESSAGE_SIZE) return null;

  try {
    const parsed = JSON.parse(data);
    if (isValidMessage(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isBoundedString(value: unknown, maxLength: number, allowEmpty = true): boolean {
  return (
    typeof value === 'string' &&
    value.length <= maxLength &&
    (allowEmpty || value.length > 0)
  );
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isNonNegativeInteger(value: unknown, max = 1000000): value is number {
  return isFiniteNumber(value) && Number.isInteger(value) && value >= 0 && value <= max;
}

function isColor(value: unknown): value is PieceColor {
  return value === PieceColor.WHITE || value === PieceColor.BLACK;
}

function isGameStatus(value: unknown): value is GameStatus {
  return (
    typeof value === 'string' &&
    (Object.values(GameStatus) as string[]).includes(value)
  );
}

function isPieceType(value: unknown): value is PieceType {
  return (
    typeof value === 'string' &&
    (Object.values(PieceType) as string[]).includes(value)
  );
}

function isFen(value: unknown): value is string {
  if (typeof value !== 'string' || value.length === 0 || value.length > MAX_FEN_LENGTH) {
    return false;
  }

  const fields = value.split(' ');
  return fields.length === 6;
}

function isCoordinate(value: unknown): value is { file: number; rank: number } {
  return (
    isRecord(value) &&
    isFiniteNumber(value.file) &&
    isFiniteNumber(value.rank) &&
    Number.isInteger(value.file) &&
    Number.isInteger(value.rank) &&
    value.file >= 0 &&
    value.file < 8 &&
    value.rank >= 0 &&
    value.rank < 8
  );
}

function isMovePayload(value: unknown): boolean {
  if (!isRecord(value)) return false;
  if (!isCoordinate(value.from) || !isCoordinate(value.to)) return false;
  if (value.from.file === value.to.file && value.from.rank === value.to.rank) return false;
  if (value.promotion !== undefined && !isPieceType(value.promotion)) return false;
  return true;
}

/**
 * Type guard to check if an object is a valid message
 *
 * The base fields are always checked, then the payload of each message
 * type. This prevents malformed peer messages from crashing the game.
 */
export function isValidMessage(obj: unknown): obj is GameMessage {
  if (!isRecord(obj)) return false;

  const message = obj;
  const type = message.type as MessageType;

  // Required base fields
  if (typeof message.type !== 'string') return false;
  if (!(Object.values(MessageType) as string[]).includes(message.type)) return false;
  if (!isFiniteNumber(message.timestamp) || message.timestamp < 0) return false;
  if (!isBoundedString(message.senderId, MAX_SENDER_ID_LENGTH, false)) return false;

  switch (type) {
    case MessageType.HELLO:
      return (
        isBoundedString(message.playerName, MAX_PLAYER_NAME_LENGTH) &&
        isBoundedString(message.clientVersion, MAX_PLAYER_NAME_LENGTH)
      );

    case MessageType.READY:
      return isColor(message.playerColor);

    case MessageType.GAME_START:
      return (
        isColor(message.hostColor) &&
        isColor(message.guestColor) &&
        isFen(message.initialFen) &&
        isRecord(message.timeControl) &&
        isFiniteNumber(message.timeControl.initial) &&
        message.timeControl.initial >= 0 &&
        message.timeControl.initial <= 1000000000 &&
        isFiniteNumber(message.timeControl.increment) &&
        message.timeControl.increment >= 0 &&
        message.timeControl.increment <= 1000000000
      );

    case MessageType.GAME_END:
      return (
        isGameStatus(message.status) &&
        (message.winner === null || isColor(message.winner)) &&
        isBoundedString(message.reason, MAX_TEXT_LENGTH)
      );

    case MessageType.RESIGN:
      return isColor(message.resigningColor);

    case MessageType.DRAW_OFFER:
      return isColor(message.offeringColor);

    case MessageType.DRAW_ACCEPT:
    case MessageType.DRAW_DECLINE:
      return true;

    case MessageType.MOVE:
      return (
        isMovePayload(message.move) &&
        isNonNegativeInteger(message.moveNumber) &&
        isFen(message.fen)
      );

    case MessageType.MOVE_ACK:
      return isNonNegativeInteger(message.moveNumber) && isFen(message.fen);

    case MessageType.MOVE_REJECT:
      return (
        isNonNegativeInteger(message.moveNumber) &&
        isBoundedString(message.reason, MAX_TEXT_LENGTH) &&
        isFen(message.expectedFen)
      );

    case MessageType.STATE_REQUEST:
      return isNonNegativeInteger(message.lastKnownMoveNumber);

    case MessageType.STATE_RESPONSE:
      return (
        isFen(message.fen) &&
        Array.isArray(message.moveHistory) &&
        message.moveHistory.length <= MAX_MOVE_HISTORY_LENGTH &&
        message.moveHistory.every(isMovePayload) &&
        isNonNegativeInteger(message.currentMoveNumber) &&
        isFiniteNumber(message.whiteTime) &&
        message.whiteTime >= 0 &&
        message.whiteTime <= 1000000000000 &&
        isFiniteNumber(message.blackTime) &&
        message.blackTime >= 0 &&
        message.blackTime <= 1000000000000 &&
        isGameStatus(message.status)
      );

    case MessageType.CHAT:
      return isBoundedString(message.content, MAX_TEXT_LENGTH);

    case MessageType.PING:
      return isNonNegativeInteger(message.sequence);


    case MessageType.PONG:
      return (
        isNonNegativeInteger(message.sequence) &&
        isFiniteNumber(message.receivedTimestamp)
      );

    default:
      return false;
  }
}

/**
 * Get message type from a message
 */
export function getMessageType(message: GameMessage): MessageType {
  return message.type;
}