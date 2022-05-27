import ActionTypes from './types';

export const setStartingPosition = pieces => ({
    type: ActionTypes.SET_STARTING_POSITION,
    payload: pieces
})

export const setPossibleMoves = moves => ({
    type: ActionTypes.SET_POSSIBLE_MOVES,
    payload: moves
})

export const resetMove = () => ({
    type: ActionTypes.RESET_MOVE
})

export const makeMove = (startSquare, endSquare) => ({
    type: ActionTypes.MAKE_MOVE,
    payload: {startSquare, endSquare}
})

export const enPassant = (startSquare, endSquare, pawnToRemoveSquare) => ({
    type: ActionTypes.EN_PASSANT,
    payload: {startSquare, endSquare, pawnToRemoveSquare}    
})

export const castling = (rookStartSquare, rookEndSquare, kingStartSquare, kingEndSquare) => ({
    type: ActionTypes.CASTLING,
    payload: {rookStartSquare, rookEndSquare, kingStartSquare, kingEndSquare}
})

export const startPromotion = () => ({
    type: ActionTypes.START_PIECE_PROMOTION
})

export const piecePromotion = (startSquare, endSquare, pieceToPromoteTo) => ({
    type: ActionTypes.END_PIECE_PROMOTION,
    payload: {startSquare, endSquare, pieceToPromoteTo}
})

export const addMoveToPreviousMoves = (piece, specialCase, startSquare, endSquare) => ({
    type: ActionTypes.ADD_MOVE_TO_PREVIOUS_MOVES,
    payload: {piece, specialCase, startSquare, endSquare}
})

export const toggleHelp = () => ({
    type: ActionTypes.TOGGLE_HELP
})

export const toggleNotation = () => ({
    type: ActionTypes.TOGGLE_NOTATION
})

export const setUniquePieces = pieceList => ({
    type: ActionTypes.SET_UNIQUE_PIECES,
    payload: pieceList
})

export const changeActivePlayer = ()  => ({
    type: ActionTypes.CHANGE_ACTIVE_PLAYER
})

export const updatePreviousMove = (specialCase) => ({
    type: ActionTypes.UPDATE_PREVIOUS_MOVE,
    payload: {specialCase}
})

export const setPosition = (pieces) => ({
    type: ActionTypes.SET_POSITION,
    payload: pieces
})

export const lockMoving = () => ({
    type: ActionTypes.LOCK_MOVING,
})

export const unlockMoving = () => ({
    type: ActionTypes.UNLOCK_MOVING,
})

export const resetGame = () => ({
    type: ActionTypes.RESET_GAME
})

export const setGameResult = (result) => ({
    type: ActionTypes.SET_GAME_RESULT,
    payload: result
})

export const setOnlineGame = () => ({
    type: ActionTypes.SET_ONLINE_GAME
})

export const setLocalGame = () => ({
    type: ActionTypes.SET_LOCAL_GAME
})

export const setOnlinePlayerNumber = (number) => ({
    type: ActionTypes.SET_ONLINE_PLAYER_NUMBER,
    payload: number
})

export const setOnlineUserData = (userData) => ({
    type: ActionTypes.SET_ONLINE_USER_DATA,
    payload: userData
})

export const activateDrawOffer = () => ({
    type: ActionTypes.ACTIVATE_DRAW_OFFER
})

export const acceptDrawOffer = () => ({
    type: ActionTypes.ACCEPT_DRAW_OFFER
})

export const declineDrawOffer = () => ({
    type: ActionTypes.DECLINE_DRAW_OFFER
})

export const resetOnlineGame = () => ({
    type: ActionTypes.RESET_ONLINE_GAME
})

export const setCurrentUser = (user) => ({
    type: ActionTypes.SET_CURRENT_USER,
    payload: user
})

export const resetApp = () => ({
    type: ActionTypes.RESET_APP
})