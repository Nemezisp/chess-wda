import ActionTypes from './types';
import {makeMove, enPassant, castling, piecePromotion} from './utils';

const INITIAL_STATE = {
    pieces: null, 
    player: 1,
    possibleMoves: [],
    previousMoves: [],
    piecePromotionActive: false,
    boardReady: false,
    uniquePieceList: [],
    help: false, 
    gameResult: false,
    notation: true,
    previousPositions: [],
    movingLocked: false,
    gameMode: null,
    onlineUserData: null,
    onlinePlayerNumber: null,
    drawOfferActive: false
}

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ActionTypes.SET_STARTING_POSITION:
            return {
                ...state,
                boardReady: true,
                pieces: action.payload,
                previousPositions: [...state.previousPositions, [...action.payload]]
            }
        case ActionTypes.SET_POSSIBLE_MOVES:
            return {
                ...state,
                possibleMoves: action.payload
            }
        case ActionTypes.RESET_MOVE:
            return {
                ...state,
                possibleMoves: [],
                chosenPieceSquare: null
            }
        case ActionTypes.MAKE_MOVE:
            var tempPiecesMove = makeMove(state.pieces, action.payload.startSquare, action.payload.endSquare)
            return {
                ...state,
                pieces: tempPiecesMove,
                previousPositions: [...state.previousPositions, [...tempPiecesMove]]
            }
        case ActionTypes.EN_PASSANT:
            var tempPiecesPassant = enPassant(state.pieces, action.payload.startSquare, action.payload.endSquare, action.payload.pawnToRemoveSquare)
            return {
                ...state,
                pieces: tempPiecesPassant,
                previousPositions: [...state.previousPositions, [...tempPiecesPassant]]
            }
        case ActionTypes.CASTLING:
            var tempPiecesCastling = castling(state.pieces, action.payload.rookStartSquare, action.payload.rookEndSquare, action.payload.kingStartSquare, action.payload.kingEndSquare)
            return {
                ...state,
                pieces: tempPiecesCastling,
                previousPositions: [...state.previousPositions, [...tempPiecesCastling]]
            }
        case ActionTypes.START_PIECE_PROMOTION:
            return {
                ...state,
                piecePromotionActive: true
            }
        case ActionTypes.END_PIECE_PROMOTION:
            var tempPiecesPromotion = piecePromotion(state.pieces, action.payload.startSquare, action.payload.endSquare, action.payload.pieceToPromoteTo)
            return {
                ...state,
                piecePromotionActive: false,
                pieces: tempPiecesPromotion,
                previousPositions: [...state.previousPositions, [...tempPiecesPromotion]]
            }
        case ActionTypes.ADD_MOVE_TO_PREVIOUS_MOVES:
            return {
                ...state,
                previousMoves: [...state.previousMoves, [action.payload.piece, action.payload.specialCase, action.payload.startSquare, action.payload.endSquare]],
            }
        case ActionTypes.UPDATE_PREVIOUS_MOVE:
            let tempPreviousMoves = [...state.previousMoves];
            let lastMove = tempPreviousMoves[tempPreviousMoves.length-1]
            !lastMove[1] ? lastMove[1] = action.payload.specialCase 
                         : lastMove[1] = lastMove[1] + action.payload.specialCase
            return {
                ...state,
                previousMoves: tempPreviousMoves
            }
        case ActionTypes.TOGGLE_HELP:
            return {
                ...state,
                help: state.help ? false : true
            }
        case ActionTypes.TOGGLE_NOTATION:
            return {
                ...state,
                notation: state.notation ? false : true
            }
        case ActionTypes.SET_UNIQUE_PIECES:
            return {
                ...state,
                uniquePieceList: action.payload
            }
        case ActionTypes.CHANGE_PLAYER:
            return {
                ...state,
                player: state.player === 1 ? 2 : 1
            }
        case ActionTypes.SET_GAME_RESULT:
            return {
                ...state,
                gameResult: action.payload.result,
                drawOfferActive: false
            }
        case ActionTypes.SET_POSITION:
            return {
                ...state,
                pieces: action.payload
            }
        case ActionTypes.LOCK_MOVING:
            return {
                ...state,
                movingLocked: true,
                possibleMoves: []
            }
        case ActionTypes.UNLOCK_MOVING:
            return {
                ...state,
                movingLocked: false
            }
        case ActionTypes.SET_ONLINE_GAME:
            return {
                ...state,
                gameMode: 'online'
            }
        case ActionTypes.SET_LOCAL_GAME:
            return {
                ...state,
                gameMode: 'local'
            }
        case ActionTypes.SET_ONLINE_USER_DATA:
            return {
                ...state,
                onlineUserData: action.payload
            }
        case ActionTypes.SET_ONLINE_PLAYER_NUMBER:
            return {
                ...state,
                onlinePlayerNumber: action.payload
            }
        case ActionTypes.ACTIVATE_DRAW_OFFER:
            return {
                ...state,
                drawOfferActive: true
            }
        case ActionTypes.ACCEPT_DRAW_OFFER:
            return {
                ...state,
                drawOfferActive: false,
                gameResult: '1/2 : 1/2'
            }
        case ActionTypes.DECLINE_DRAW_OFFER:
            return {
                ...state,
                drawOfferActive: false
            }
        case ActionTypes.RESET_GAME:
            return {
                ...state,
                pieces: null, 
                player: 1,
                possibleMoves: [],
                previousMoves: [],
                piecePromotionActive: false,
                boardReady: false,
                uniquePieceList: [],
                help: false,
                gameEnded: false,
                notation: true,
                previousPositions: [], 
                movingLocked: false,
                gameResult: null
            }
        case ActionTypes.RESET_ONLINE_GAME:
            return {
                ...state,
                player: 1,
                possibleMoves: [],
                previousMoves: [],
                previousPositions: [],
                piecePromotionActive: false,
                boardReady: false,
                uniquePieceList: [],
                help: false,
                gameEnded: false,
                notation: true,
                pawnToRemoveSquare: [],
                movingLocked: false,
                drawOfferActive: false,
                gameResult: null
            }
        default:
            return state;
    }
}

export default reducer;