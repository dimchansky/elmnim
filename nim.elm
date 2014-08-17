import Window
import Graphics.Input (..)
import Bitwise
import Text
import Random
import Mouse

-- Model

(gameWidth, gameHeight) = (600, 450)
type HeapId = Int
type Heap = {matches: Int, selected: Int}
type Board = [Heap]

data Turn = Select HeapId Int 
          | Leave HeapId Int

data PCState = PCThinks
             | PCLeave HeapId Int

data State = ShowInstructions
           | PlayerMove 
           | PCMove PCState
           | PlayerWon
           | PCWon

type Game = {state: State, board: Board, lastUpdated: Time, pcScore: Int, playerScore: Int}

defaultBoard : Board
defaultBoard = [{matches=3, selected=0}
               ,{matches=5, selected=0}
               ,{matches=7, selected=0}]

defaultWinsWhoStarts = not . winningPosition <| map (\{matches} -> matches) defaultBoard

defaultGame : Game
defaultGame = {    
    state = ShowInstructions,
    board = defaultBoard,
    lastUpdated = 0,
    pcScore = 0,
    playerScore = 0
  }

data Event = PlayerTurn (Maybe Turn)
           | NewGame
           | BackgroundThread Float

-- Helpers

foldpIf : (a -> b -> Bool) -> (a -> b -> b) -> b -> Signal a -> Signal b
foldpIf cond fld def sig =
    let tryFold canFold new state = (if canFold then fld new state else state, canFold)
        update new (state, _) = tryFold (cond new state) new state
        defFalse = (def, False)
    in fst <~ keepIf snd defFalse (foldp update defFalse sig)

indexed : [a] -> [(HeapId,a)]
indexed xs = zip [1 .. length xs] xs

-- Signals and Inputs

playerTurn : Input (Maybe Turn)
playerTurn = input Nothing

eventSignal : Signal (Time, Event)
eventSignal = timestamp <| merges [PlayerTurn <~ playerTurn.signal
                                  ,(\_ -> NewGame) <~ Mouse.clicks
                                  ,BackgroundThread <~ Random.float (fps 10)]

-- Updates

winningPosition : [Int] -> Bool
winningPosition xs = 
  (0 == foldl Bitwise.xor 0 xs) `xor` (1 == foldl Bitwise.or 1 xs)
  
getSafePicksLeaves : [{a | matches : Int}] -> [(HeapId,Int,Int)]
getSafePicksLeaves board = 
  let indexedBoard = indexed board
      heapPicksLeaves (id,{matches}) = map (\c -> (id,c,matches-c)) [1..matches]
      allPicks = concat <| map heapPicksLeaves <| indexedBoard
      isSafePick (heapId,pickCnt,leaveCnt) = 
        winningPosition <| map (\(id,{matches}) -> if heapId == id 
                                                   then matches - pickCnt 
                                                   else matches) indexedBoard
  in filter isSafePick allPicks

getOneMatchPicksLeaves : [{a | matches : Int}] -> [(HeapId,Int,Int)]
getOneMatchPicksLeaves board = 
  let indexedBoard = indexed board
      notEmptyHeap (id,{matches}) = matches > 0
      oneMatchPickLeave (id,{matches}) = (id,1,matches-1)      
  in map oneMatchPickLeave <| filter notEmptyHeap <| indexedBoard

getPicksLeaves : [{a | matches : Int}] -> [(HeapId,Int,Int)]
getPicksLeaves board = 
  let safePicksLeaves = getSafePicksLeaves board
  in if isEmpty safePicksLeaves then getOneMatchPicksLeaves board else safePicksLeaves
  
getPicksLeavesRandomly : Float -> [{a | matches : Int}] -> (HeapId,Int,Int)
getPicksLeavesRandomly rnd board =
  let picksLeaves = getPicksLeaves board
      picksLeavesLen = length picksLeaves
      normalize i = (toFloat i) / (toFloat picksLeavesLen)
  in fst . head . filter (\t -> snd t >= rnd ) . zip picksLeaves . map normalize <| [1 .. picksLeavesLen]
  
selectMatches : HeapId -> Int -> Board -> Board
selectMatches heapId selected board =
  let updateRow(id,heap) = 
    if id /= heapId 
    then {heap| selected <- 0}
    else {heap| selected <- selected}
  in map updateRow . indexed <| board

leaveMatches : HeapId -> Int -> Board -> Board
leaveMatches heapId count board = 
  let updateRow(id,row) = 
    if id /= heapId 
    then row
    else {row| matches <- count, selected <- 0}
  in map updateRow . indexed <| board

isEmptyBoard : [{a | matches : Int}] -> Bool
isEmptyBoard board = 
  let matchesLeft = sum . map (\{matches} -> matches) <| board
  in 0 == matchesLeft

incrementScore : Game -> Game
incrementScore game = 
  case game.state of
    PlayerWon -> {game| playerScore <- game.playerScore + 1}
    PCWon     -> {game| pcScore <- game.pcScore + 1}
    _         -> game

makePlayerTurn : Turn -> Game -> Game
makePlayerTurn turn game = 
  case turn of
    Select heapId cnt    -> { game | board <- selectMatches heapId cnt game.board}
    Leave heapId cnt     ->
      let newBoard = leaveMatches heapId cnt game.board
      in incrementScore <|
         { game | board <- newBoard
                , state <- if isEmptyBoard newBoard then PCWon else PCMove PCThinks}

thinkPcTurn : Float -> Game -> Game
thinkPcTurn rnd game = 
  let (heapId,pickCnt,leaveCnt) = getPicksLeavesRandomly rnd game.board
  in { game | board <- selectMatches heapId pickCnt game.board
            , state <- PCMove (PCLeave heapId leaveCnt)}

leavePcTurn : HeapId -> Int -> Game -> Game
leavePcTurn heapId cnt game = 
  let newBoard = leaveMatches heapId cnt game.board
  in incrementScore <|
     { game | board <- newBoard,
              state <- if isEmptyBoard newBoard then PlayerWon else PlayerMove}

decideWhoWillStartIfPlayerWon : Bool -> State
decideWhoWillStartIfPlayerWon playerWon = 
  if playerWon `xor` defaultWinsWhoStarts then PlayerMove else PCMove PCThinks
  
updateGameState : (Time,Event) -> Game -> Game
updateGameState (time,event) game =
  let updateTime g = { g | lastUpdated <- time}
  in updateTime <| 
     case event of
       PlayerTurn (Just turn) -> makePlayerTurn turn game    
       NewGame                -> { game | state <- decideWhoWillStartIfPlayerWon (game.state == PlayerWon)
                                        , board <- defaultBoard }
       BackgroundThread rnd   ->
         case game.state of
           PCMove PCThinks             -> thinkPcTurn rnd game
           PCMove (PCLeave heapId cnt) -> leavePcTurn heapId cnt game 
           _                           -> game
       _                      -> game

needUpdate : (Time,Event) -> Game -> Bool
needUpdate (time,event) game =
  case event of
    PlayerTurn _ -> game.state == PlayerMove
    NewGame      -> game.state == PlayerWon || game.state == PCWon || game.state == ShowInstructions
    _            -> case game.state of
                      PlayerMove -> False                      
                      _          -> time - game.lastUpdated > 500 * millisecond

gameState : Signal Game
gameState = foldpIf needUpdate updateGameState defaultGame eventSignal

-- Display

matchHeight = 130
matchWidth = 17

match : Bool -> Element
match removed =
  let box = rect 8 100      
      headGrad = radial (0,0) 2 (0,0) 10 [(0, rgb 115 38 0), (1, rgb 91 30 0)]
      opacity = if removed then 0.2 else 1.0
  in collage matchWidth matchHeight <|
     [
       alpha opacity <| toForm <| collage matchWidth matchHeight <|
       [ move (0,46) . gradient headGrad <| oval 12 25
       , moveY -10 . filled (rgb 252 252 189) <| box  
       , moveY -10 . outlined (solid (rgb 148 116 0)) <| box
       ]       
     ]

clickableMatch : Input a -> (Bool -> a) -> Bool -> Element
clickableMatch inp inpUpdate removed = clickable inp.handle (inpUpdate (not removed)) <| match removed

textColor = rgb 160 200 160
txt f = leftAligned . f . monospace . Text.color textColor . toText

displayBoard : Game -> Element
displayBoard game = 
  let createMatch heapId {matches, selected} matchId =
        let firstSelectedId = matches - selected                                        
            (command, removed) = if | matchId < firstSelectedId  -> (Select heapId (matches-matchId), False)
                                    | firstSelectedId == matchId -> (Leave heapId matchId, True)
                                    | otherwise                  -> (Select heapId (matches-matchId), True)            
        in clickableMatch playerTurn (\_ -> Just command) removed
      matchSep = spacer 30 matchHeight
      startRow els = matchSep :: els
      createRow (heapId,heap) =
        flow right . startRow . intersperse matchSep <| map (createMatch heapId heap) [0..heap.matches-1]      
  in flow down . map createRow . indexed <| game.board

display : (Int, Int) -> Game -> Element
display (w,h) game =
  let instructions = [markdown|
# Play Nim against your computer!

## The rules 
- In one move you can remove any number of matches but only from one row. 
- You win if you leave the **last** match for the computer.
- The looser has the advantage configuration in the next game round.

## Hints
- Click on any match in a row to mark all matches to the right for removal.
- Second click on a match removes all matches to the right.
- Click on the screen continues the game.

# Have a nice game!
|]
      gameRect = rect gameWidth gameHeight |> filled (rgb 60 100 60)
      gameScore = move (0, gameHeight/2 - 20) <|
        toForm <| txt (Text.height 30) ("PC:" ++ show game.pcScore ++ "  You:" ++ show game.playerScore)
      boardContainer = container gameWidth gameHeight midLeft <| displayBoard game
      gameMoveHint playerMove = move (0, -gameHeight/2 + 20) <|
        toForm <| txt (Text.height 20) (if playerMove then "Your move" else "PC move")
      gameContent = case game.state of
        ShowInstructions -> [toForm <| instructions]
        PlayerWon        -> [toForm <| txt (Text.height 30) "You WON!!! Congratulations...", gameScore]
        PCWon            -> [toForm <| txt (Text.height 30) "Sorry... I won!", gameScore]
        _                -> [toForm <| boardContainer, gameScore, gameMoveHint (game.state == PlayerMove)]
  in container w h middle <| collage gameWidth gameHeight <| gameRect :: gameContent

main : Signal Element
main = display <~ Window.dimensions ~ gameState