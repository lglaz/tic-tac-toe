import {Uuid} from "~/model/Uuid";
import {Player, PlayerId} from "~/model/Player";

export class GameId extends Uuid {};

export enum GameState {
    NonStarted,
    Running,
    Finished
};

type GameFieldIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export enum GameFieldValue {
    Empty,
    X,
    O
};

export enum GameResult {
    Unknown,
    Draw,
    Player1Won,
    Player2Won
};

export class Game {
    readonly id: GameId;
    private _player1: Player | null;
    private _player2: Player | null;
    private _state: GameState;
    private _gameResult: GameResult;
    private _fields: GameFieldValue[];
    private _currentPlayerId: PlayerId | null;

    private constructor(id: GameId) {
        this.id = id;
        this._state = GameState.NonStarted;
        this._gameResult = GameResult.Unknown;
        this._fields = new Array<GameFieldValue>(3).fill(GameFieldValue.Empty);
    }

    setPlayer1(player: Player) {
        this._player1 = player;
    }

    setPlayer2(player: Player) {
        this._player2 = player;
    }

    start() {
        if(this._state != GameState.NonStarted) {
            throw new Error("Cannot start already started game");
        }
        if(!this._player1 || !this._player2) {
            throw new Error("Cannot start game which does not have 2 players assigned");
        }
        this._state = GameState.Running;
        this._currentPlayerId = this._player1.id;
    }

    getFieldValue(i: GameFieldIndex) {
        return this._fields[i];
    }

    put(playerId: PlayerId, i: GameFieldIndex) {
        if(this._state != GameState.Running) {
            throw new Error("Only running games can be changed");
        }
        if(this._currentPlayerId === playerId) {
            throw new Error("Only current player can make move");
        }
        if(this.getFieldValue(i) !== GameFieldValue.Empty) {
            throw new Error("Cannot change already taken field");
        }

        if(this.isPlayer1Turn()) {
            this._fields[i] = GameFieldValue.X;
            this._currentPlayerId = this._player2.id;
        } else {
            this._fields[i] = GameFieldValue.O;
            this._currentPlayerId = this._player1.id;
        }

        this.verifyWinConditions();
    }

    isPlayer1Turn() {
        return this._currentPlayerId === this._player1?.id;
    }

    private verifyWinConditions() {
        if (this.check(0, 1, 2) || this.check(3, 4, 5) || this.check(6, 7, 8)
            || this.check(0, 3, 6) || this.check(1, 4, 7) || this.check(2, 5, 8)
            || this.check(0, 4, 8) || this.check(6, 4, 2)
            || this.checkDraw())
        {

        }
    }

    private check(field1: GameFieldIndex, field2: GameFieldIndex, field3: GameFieldIndex) {
        if (this._fields[field1] != GameFieldValue.Empty &&  this._fields[field1] == this._fields[field2] && this._fields[field1] == this._fields[field3]) {
            if (this._fields[field1] == GameFieldValue.X) {
                this.finishGame(GameResult.Player1Won);
                return true;
            } else {
                this.finishGame(GameResult.Player2Won);
                return true;
            }
        }
        return false;
    }

    private checkDraw()
    {
        if (this._fields.every(x => x != GameFieldValue.Empty)) {
            this.finishGame(GameResult.Draw);
            return true;
        }

        return false;
    }

    private finishGame(gameResult: GameResult) {
        this._gameResult = gameResult;
        this._state = GameState.Finished;
    }
}