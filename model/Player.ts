import {Uuid} from "~/model/Uuid";

export class PlayerId extends Uuid {}


export class Player {
    readonly id: PlayerId;
    private _name: string;


    private constructor(id: PlayerId, name: string) {
        this.id = id;
        this.changeName(name);
    }

    get name(): string {
        return this._name;
    }

    changeName(newName: string) {
        this._name = newName;
    }


}