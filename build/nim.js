Elm.Main = Elm.Main || {};
Elm.Main.make = function (_elm) {
   "use strict";
   _elm.Main = _elm.Main || {};
   if (_elm.Main.values)
   return _elm.Main.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "Main";
   var Basics = Elm.Basics.make(_elm);
   var Bitwise = Elm.Bitwise.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Input = Elm.Graphics.Input.make(_elm);
   var List = Elm.List.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Mouse = Elm.Mouse.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Random = Elm.Random.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var Window = Elm.Window.make(_elm);
   var _op = {};
   var textColor = A3(Color.rgb,
   160,
   200,
   160);
   var txt = function (f) {
      return function ($) {
         return Text.leftAligned(f(Text.monospace(Text.color(textColor)(Text.toText($)))));
      };
   };
   var matchWidth = 17;
   var matchHeight = 130;
   var match = function (removed) {
      return function () {
         var opacity = removed ? 0.2 : 1.0;
         var headGrad = A5(Color.radial,
         {ctor: "_Tuple2",_0: 0,_1: 0},
         2,
         {ctor: "_Tuple2",_0: 0,_1: 0},
         10,
         _L.fromArray([{ctor: "_Tuple2"
                       ,_0: 0
                       ,_1: A3(Color.rgb,115,38,0)}
                      ,{ctor: "_Tuple2"
                       ,_0: 1
                       ,_1: A3(Color.rgb,91,30,0)}]));
         var box = A2(Graphics.Collage.rect,
         8,
         100);
         return A2(Graphics.Collage.collage,
         matchWidth,
         matchHeight)(_L.fromArray([Graphics.Collage.alpha(opacity)(Graphics.Collage.toForm(A2(Graphics.Collage.collage,
         matchWidth,
         matchHeight)(_L.fromArray([Graphics.Collage.move({ctor: "_Tuple2"
                                                          ,_0: 0
                                                          ,_1: 46})(Graphics.Collage.gradient(headGrad)(A2(Graphics.Collage.oval,
                                   12,
                                   25)))
                                   ,Graphics.Collage.moveY(-10)(Graphics.Collage.filled(A3(Color.rgb,
                                   252,
                                   252,
                                   189))(box))
                                   ,Graphics.Collage.moveY(-10)(Graphics.Collage.outlined(Graphics.Collage.solid(A3(Color.rgb,
                                   148,
                                   116,
                                   0)))(box))]))))]));
      }();
   };
   var clickableMatch = F3(function (inp,
   inpUpdate,
   removed) {
      return A2(Graphics.Input.clickable,
      inp.handle,
      inpUpdate(Basics.not(removed)))(match(removed));
   });
   var isEmptyBoard = function (board) {
      return function () {
         var matchesLeft = List.sum(List.map(function (_v0) {
            return function () {
               return _v0.matches;
            }();
         })(board));
         return _U.eq(0,matchesLeft);
      }();
   };
   var winningPosition = function (xs) {
      return A2(Basics.xor,
      _U.eq(0,
      A3(List.foldl,
      Bitwise.xor,
      0,
      xs)),
      _U.eq(1,
      A3(List.foldl,
      Bitwise.or,
      1,
      xs)));
   };
   var playerTurn = Graphics.Input.input(Maybe.Nothing);
   var indexed = function (xs) {
      return A2(List.zip,
      _L.range(1,List.length(xs)),
      xs);
   };
   var getSafePicksLeaves = function (board) {
      return function () {
         var heapPicksLeaves = function (_v2) {
            return function () {
               switch (_v2.ctor)
               {case "_Tuple2":
                  return A2(List.map,
                    function (c) {
                       return {ctor: "_Tuple3"
                              ,_0: _v2._0
                              ,_1: c
                              ,_2: _v2._1.matches - c};
                    },
                    _L.range(1,_v2._1.matches));}
               _E.Case($moduleName,
               "on line 80, column 40 to 81");
            }();
         };
         var indexedBoard = indexed(board);
         var allPicks = List.concat(List.map(heapPicksLeaves)(indexedBoard));
         var isSafePick = function (_v6) {
            return function () {
               switch (_v6.ctor)
               {case "_Tuple3":
                  return winningPosition(A2(List.map,
                    function (_v11) {
                       return function () {
                          switch (_v11.ctor)
                          {case "_Tuple2":
                             return _U.eq(_v6._0,
                               _v11._0) ? _v11._1.matches - _v6._1 : _v11._1.matches;}
                          _E.Case($moduleName,
                          "between lines 83 and 85");
                       }();
                    },
                    indexedBoard));}
               _E.Case($moduleName,
               "between lines 83 and 85");
            }();
         };
         return A2(List.filter,
         isSafePick,
         allPicks);
      }();
   };
   var getOneMatchPicksLeaves = function (board) {
      return function () {
         var oneMatchPickLeave = function (_v15) {
            return function () {
               switch (_v15.ctor)
               {case "_Tuple2":
                  return {ctor: "_Tuple3"
                         ,_0: _v15._0
                         ,_1: 1
                         ,_2: _v15._1.matches - 1};}
               _E.Case($moduleName,
               "on line 92, column 43 to 57");
            }();
         };
         var notEmptyHeap = function (_v19) {
            return function () {
               switch (_v19.ctor)
               {case "_Tuple2":
                  return _U.cmp(_v19._1.matches,
                    0) > 0;}
               _E.Case($moduleName,
               "on line 91, column 37 to 48");
            }();
         };
         var indexedBoard = indexed(board);
         return List.map(oneMatchPickLeave)(List.filter(notEmptyHeap)(indexedBoard));
      }();
   };
   var getPicksLeaves = function (board) {
      return function () {
         var safePicksLeaves = getSafePicksLeaves(board);
         return List.isEmpty(safePicksLeaves) ? getOneMatchPicksLeaves(board) : safePicksLeaves;
      }();
   };
   var getPicksLeavesRandomly = F2(function (rnd,
   board) {
      return function () {
         var picksLeaves = getPicksLeaves(board);
         var picksLeavesLen = List.length(picksLeaves);
         var normalize = function (i) {
            return Basics.toFloat(i) / Basics.toFloat(picksLeavesLen);
         };
         return Basics.fst(List.head(List.filter(function (t) {
            return _U.cmp(Basics.snd(t),
            rnd) > -1;
         })(List.zip(picksLeaves)(List.map(normalize)(_L.range(1,
         picksLeavesLen))))));
      }();
   });
   var selectMatches = F3(function (heapId,
   selected,
   board) {
      return function () {
         var updateRow = function (_v23) {
            return function () {
               switch (_v23.ctor)
               {case "_Tuple2":
                  return !_U.eq(_v23._0,
                    heapId) ? _U.replace([["selected"
                                          ,0]],
                    _v23._1) : _U.replace([["selected"
                                           ,selected]],
                    _v23._1);}
               _E.Case($moduleName,
               "between lines 110 and 112");
            }();
         };
         return List.map(updateRow)(indexed(board));
      }();
   });
   var leaveMatches = F3(function (heapId,
   count,
   board) {
      return function () {
         var updateRow = function (_v27) {
            return function () {
               switch (_v27.ctor)
               {case "_Tuple2":
                  return !_U.eq(_v27._0,
                    heapId) ? _v27._1 : _U.replace([["matches"
                                                    ,count]
                                                   ,["selected",0]],
                    _v27._1);}
               _E.Case($moduleName,
               "between lines 118 and 120");
            }();
         };
         return List.map(updateRow)(indexed(board));
      }();
   });
   var foldpIf = F4(function (cond,
   fld,
   def,
   sig) {
      return function () {
         var defFalse = {ctor: "_Tuple2"
                        ,_0: def
                        ,_1: false};
         var tryFold = F3(function (canFold,
         $new,
         state) {
            return {ctor: "_Tuple2"
                   ,_0: canFold ? A2(fld,
                   $new,
                   state) : state
                   ,_1: canFold};
         });
         var update = F2(function ($new,
         _v31) {
            return function () {
               switch (_v31.ctor)
               {case "_Tuple2":
                  return A3(tryFold,
                    A2(cond,$new,_v31._0),
                    $new,
                    _v31._0);}
               _E.Case($moduleName,
               "on line 54, column 33 to 67");
            }();
         });
         return A2(Signal._op["<~"],
         Basics.fst,
         A3(Signal.keepIf,
         Basics.snd,
         defFalse,
         A3(Signal.foldp,
         update,
         defFalse,
         sig)));
      }();
   });
   var BackgroundThread = function (a) {
      return {ctor: "BackgroundThread"
             ,_0: a};
   };
   var NewGame = {ctor: "NewGame"};
   var PlayerTurn = function (a) {
      return {ctor: "PlayerTurn"
             ,_0: a};
   };
   var eventSignal = Time.timestamp(Signal.merges(_L.fromArray([A2(Signal._op["<~"],
                                                               PlayerTurn,
                                                               playerTurn.signal)
                                                               ,A2(Signal._op["<~"],
                                                               function (_v35) {
                                                                  return function () {
                                                                     return NewGame;
                                                                  }();
                                                               },
                                                               Mouse.clicks)
                                                               ,A2(Signal._op["<~"],
                                                               BackgroundThread,
                                                               Random.$float(Time.fps(10)))])));
   var defaultBoard = _L.fromArray([{_: {}
                                    ,matches: 3
                                    ,selected: 0}
                                   ,{_: {},matches: 5,selected: 0}
                                   ,{_: {}
                                    ,matches: 7
                                    ,selected: 0}]);
   var defaultWinsWhoStarts = Basics.not(winningPosition(A2(List.map,
   function (_v37) {
      return function () {
         return _v37.matches;
      }();
   },
   defaultBoard)));
   var Game = F5(function (a,
   b,
   c,
   d,
   e) {
      return {_: {}
             ,board: b
             ,lastUpdated: c
             ,pcScore: d
             ,playerScore: e
             ,state: a};
   });
   var PCWon = {ctor: "PCWon"};
   var PlayerWon = {ctor: "PlayerWon"};
   var incrementScore = function (game) {
      return function () {
         var _v39 = game.state;
         switch (_v39.ctor)
         {case "PCWon":
            return _U.replace([["pcScore"
                               ,game.pcScore + 1]],
              game);
            case "PlayerWon":
            return _U.replace([["playerScore"
                               ,game.playerScore + 1]],
              game);}
         return game;
      }();
   };
   var PCMove = function (a) {
      return {ctor: "PCMove"
             ,_0: a};
   };
   var PlayerMove = {ctor: "PlayerMove"};
   var leavePcTurn = F3(function (heapId,
   cnt,
   game) {
      return function () {
         var newBoard = A3(leaveMatches,
         heapId,
         cnt,
         game.board);
         return incrementScore(_U.replace([["board"
                                           ,newBoard]
                                          ,["state"
                                           ,isEmptyBoard(newBoard) ? PlayerWon : PlayerMove]],
         game));
      }();
   });
   var ShowInstructions = {ctor: "ShowInstructions"};
   var defaultGame = {_: {}
                     ,board: defaultBoard
                     ,lastUpdated: 0
                     ,pcScore: 0
                     ,playerScore: 0
                     ,state: ShowInstructions};
   var needUpdate = F2(function (_v40,
   game) {
      return function () {
         switch (_v40.ctor)
         {case "_Tuple2":
            return function () {
                 switch (_v40._1.ctor)
                 {case "NewGame":
                    return _U.eq(game.state,
                      PlayerWon) || (_U.eq(game.state,
                      PCWon) || _U.eq(game.state,
                      ShowInstructions));
                    case "PlayerTurn":
                    return _U.eq(game.state,
                      PlayerMove);}
                 return function () {
                    var _v46 = game.state;
                    switch (_v46.ctor)
                    {case "PlayerMove":
                       return false;}
                    return _U.cmp(_v40._0 - game.lastUpdated,
                    500 * Time.millisecond) > 0;
                 }();
              }();}
         _E.Case($moduleName,
         "between lines 179 and 184");
      }();
   });
   var PCLeave = F2(function (a,
   b) {
      return {ctor: "PCLeave"
             ,_0: a
             ,_1: b};
   });
   var thinkPcTurn = F2(function (rnd,
   game) {
      return function () {
         var $ = A2(getPicksLeavesRandomly,
         rnd,
         game.board),
         heapId = $._0,
         pickCnt = $._1,
         leaveCnt = $._2;
         return _U.replace([["board"
                            ,A3(selectMatches,
                            heapId,
                            pickCnt,
                            game.board)]
                           ,["state"
                            ,PCMove(A2(PCLeave,
                            heapId,
                            leaveCnt))]],
         game);
      }();
   });
   var PCThinks = {ctor: "PCThinks"};
   var decideWhoWillStartIfPlayerWon = function (playerWon) {
      return A2(Basics.xor,
      playerWon,
      defaultWinsWhoStarts) ? PlayerMove : PCMove(PCThinks);
   };
   var Leave = F2(function (a,b) {
      return {ctor: "Leave"
             ,_0: a
             ,_1: b};
   });
   var Select = F2(function (a,b) {
      return {ctor: "Select"
             ,_0: a
             ,_1: b};
   });
   var makePlayerTurn = F2(function (turn,
   game) {
      return function () {
         switch (turn.ctor)
         {case "Leave":
            return function () {
                 var newBoard = A3(leaveMatches,
                 turn._0,
                 turn._1,
                 game.board);
                 return incrementScore(_U.replace([["board"
                                                   ,newBoard]
                                                  ,["state"
                                                   ,isEmptyBoard(newBoard) ? PCWon : PCMove(PCThinks)]],
                 game));
              }();
            case "Select":
            return _U.replace([["board"
                               ,A3(selectMatches,
                               turn._0,
                               turn._1,
                               game.board)]],
              game);}
         _E.Case($moduleName,
         "between lines 137 and 143");
      }();
   });
   var updateGameState = F2(function (_v52,
   game) {
      return function () {
         switch (_v52.ctor)
         {case "_Tuple2":
            return function () {
                 var updateTime = function (g) {
                    return _U.replace([["lastUpdated"
                                       ,_v52._0]],
                    g);
                 };
                 return updateTime(function () {
                    switch (_v52._1.ctor)
                    {case "BackgroundThread":
                       return function () {
                            var _v60 = game.state;
                            switch (_v60.ctor)
                            {case "PCMove":
                               switch (_v60._0.ctor)
                                 {case "PCLeave":
                                    return A3(leavePcTurn,
                                      _v60._0._0,
                                      _v60._0._1,
                                      game);
                                    case "PCThinks":
                                    return A2(thinkPcTurn,
                                      _v52._1._0,
                                      game);}
                                 break;}
                            return game;
                         }();
                       case "NewGame":
                       return _U.replace([["state"
                                          ,decideWhoWillStartIfPlayerWon(_U.eq(game.state,
                                          PlayerWon))]
                                         ,["board",defaultBoard]],
                         game);
                       case "PlayerTurn":
                       switch (_v52._1._0.ctor)
                         {case "Just":
                            return A2(makePlayerTurn,
                              _v52._1._0._0,
                              game);}
                         break;}
                    return game;
                 }());
              }();}
         _E.Case($moduleName,
         "between lines 164 and 175");
      }();
   });
   var gameState = A4(foldpIf,
   needUpdate,
   updateGameState,
   defaultGame,
   eventSignal);
   var displayBoard = function (game) {
      return function () {
         var matchSep = A2(Graphics.Element.spacer,
         30,
         matchHeight);
         var startRow = function (els) {
            return {ctor: "::"
                   ,_0: matchSep
                   ,_1: els};
         };
         var createMatch = F3(function (heapId,
         _v64,
         matchId) {
            return function () {
               return function () {
                  var firstSelectedId = _v64.matches - _v64.selected;
                  var $ = _U.cmp(matchId,
                  firstSelectedId) < 0 ? {ctor: "_Tuple2"
                                         ,_0: A2(Select,
                                         heapId,
                                         _v64.matches - matchId)
                                         ,_1: false} : _U.eq(firstSelectedId,
                  matchId) ? {ctor: "_Tuple2"
                             ,_0: A2(Leave,heapId,matchId)
                             ,_1: true} : {ctor: "_Tuple2"
                                          ,_0: A2(Select,
                                          heapId,
                                          _v64.matches - matchId)
                                          ,_1: true},
                  command = $._0,
                  removed = $._1;
                  return A3(clickableMatch,
                  playerTurn,
                  function (_v66) {
                     return function () {
                        return Maybe.Just(command);
                     }();
                  },
                  removed);
               }();
            }();
         });
         var createRow = function (_v68) {
            return function () {
               switch (_v68.ctor)
               {case "_Tuple2":
                  return Graphics.Element.flow(Graphics.Element.right)(startRow(List.intersperse(matchSep)(A2(List.map,
                    A2(createMatch,_v68._0,_v68._1),
                    _L.range(0,
                    _v68._1.matches - 1)))));}
               _E.Case($moduleName,
               "on line 225, column 9 to 106");
            }();
         };
         return Graphics.Element.flow(Graphics.Element.down)(List.map(createRow)(indexed(game.board)));
      }();
   };
   var Heap = F2(function (a,b) {
      return {_: {}
             ,matches: a
             ,selected: b};
   });
   var $ = {ctor: "_Tuple2"
           ,_0: 600
           ,_1: 450},
   gameWidth = $._0,
   gameHeight = $._1;
   var display = F2(function (_v72,
   game) {
      return function () {
         switch (_v72.ctor)
         {case "_Tuple2":
            return function () {
                 var gameMoveHint = function (playerMove) {
                    return Graphics.Collage.move({ctor: "_Tuple2"
                                                 ,_0: 0
                                                 ,_1: (0 - gameHeight) / 2 + 20})(Graphics.Collage.toForm(A2(txt,
                    Text.height(20),
                    playerMove ? "Your move" : "PC move")));
                 };
                 var boardContainer = A3(Graphics.Element.container,
                 gameWidth,
                 gameHeight,
                 Graphics.Element.midLeft)(displayBoard(game));
                 var gameScore = Graphics.Collage.move({ctor: "_Tuple2"
                                                       ,_0: 0
                                                       ,_1: gameHeight / 2 - 20})(Graphics.Collage.toForm(A2(txt,
                 Text.height(30),
                 _L.append("PC:",
                 _L.append(String.show(game.pcScore),
                 _L.append("  You:",
                 String.show(game.playerScore)))))));
                 var gameRect = Graphics.Collage.filled(A3(Color.rgb,
                 60,
                 100,
                 60))(A2(Graphics.Collage.rect,
                 gameWidth,
                 gameHeight));
                 var instructions = Text.markdown("<div style=\"height:0;width:0;\">&nbsp;</div><h1 id=\"play-nim-against-your-computer\">Play Nim against your computer!</h1>\n<h2 id=\"the-rules\">The rules</h2>\n<ul>\n<li>In one move you can remove any number of matches but only from one row.</li>\n<li>You win if you leave the <strong>last</strong> match for the computer.</li>\n<li>The looser has the advantage configuration in the next game round.</li>\n</ul>\n<h2 id=\"hints\">Hints</h2>\n<ul>\n<li>Click on any match in a row to mark all matches to the right for the removal.</li>\n<li>Second click on a match removes all matches to the right.</li>\n<li>Click on the screen continues the game.</li>\n</ul>\n<h1 id=\"have-a-nice-game\">Have a nice game!</h1><div style=\"height:0;width:0;\">&nbsp;</div>",
                 "230:22");
                 var gameContent = function () {
                    var _v76 = game.state;
                    switch (_v76.ctor)
                    {case "PCWon":
                       return _L.fromArray([Graphics.Collage.toForm(A2(txt,
                                           Text.height(30),
                                           "Sorry... I won!"))
                                           ,gameScore]);
                       case "PlayerWon":
                       return _L.fromArray([Graphics.Collage.toForm(A2(txt,
                                           Text.height(30),
                                           "You WON!!! Congratulations..."))
                                           ,gameScore]);
                       case "ShowInstructions":
                       return _L.fromArray([Graphics.Collage.toForm(instructions)]);}
                    return _L.fromArray([Graphics.Collage.toForm(boardContainer)
                                        ,gameScore
                                        ,gameMoveHint(_U.eq(game.state,
                                        PlayerMove))]);
                 }();
                 return A3(Graphics.Element.container,
                 _v72._0,
                 _v72._1,
                 Graphics.Element.middle)(A2(Graphics.Collage.collage,
                 gameWidth,
                 gameHeight)({ctor: "::"
                             ,_0: gameRect
                             ,_1: gameContent}));
              }();}
         _E.Case($moduleName,
         "between lines 230 and 256");
      }();
   });
   var main = A2(Signal._op["~"],
   A2(Signal._op["<~"],
   display,
   Window.dimensions),
   gameState);
   _elm.Main.values = {_op: _op
                      ,gameHeight: gameHeight
                      ,gameWidth: gameWidth
                      ,defaultBoard: defaultBoard
                      ,defaultWinsWhoStarts: defaultWinsWhoStarts
                      ,defaultGame: defaultGame
                      ,foldpIf: foldpIf
                      ,indexed: indexed
                      ,playerTurn: playerTurn
                      ,eventSignal: eventSignal
                      ,winningPosition: winningPosition
                      ,getSafePicksLeaves: getSafePicksLeaves
                      ,getOneMatchPicksLeaves: getOneMatchPicksLeaves
                      ,getPicksLeaves: getPicksLeaves
                      ,getPicksLeavesRandomly: getPicksLeavesRandomly
                      ,selectMatches: selectMatches
                      ,leaveMatches: leaveMatches
                      ,isEmptyBoard: isEmptyBoard
                      ,incrementScore: incrementScore
                      ,makePlayerTurn: makePlayerTurn
                      ,thinkPcTurn: thinkPcTurn
                      ,leavePcTurn: leavePcTurn
                      ,decideWhoWillStartIfPlayerWon: decideWhoWillStartIfPlayerWon
                      ,updateGameState: updateGameState
                      ,needUpdate: needUpdate
                      ,gameState: gameState
                      ,matchHeight: matchHeight
                      ,matchWidth: matchWidth
                      ,match: match
                      ,clickableMatch: clickableMatch
                      ,textColor: textColor
                      ,txt: txt
                      ,displayBoard: displayBoard
                      ,display: display
                      ,main: main
                      ,Select: Select
                      ,Leave: Leave
                      ,PCThinks: PCThinks
                      ,PCLeave: PCLeave
                      ,ShowInstructions: ShowInstructions
                      ,PlayerMove: PlayerMove
                      ,PCMove: PCMove
                      ,PlayerWon: PlayerWon
                      ,PCWon: PCWon
                      ,PlayerTurn: PlayerTurn
                      ,NewGame: NewGame
                      ,BackgroundThread: BackgroundThread
                      ,Heap: Heap
                      ,Game: Game};
   return _elm.Main.values;
};