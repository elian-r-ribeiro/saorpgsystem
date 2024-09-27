export class user{
    private _userName!: string;
    private _email!: string;
    private _uid!: any;
    private _imageURL!: any;
    private _watched!: boolean;

//==============================================//
    public get userName(): string {
        return this._userName;
    }
    public set userName(value: string) {
        this._userName = value;
    }
//==============================================//
    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }
//==============================================//
    public get uid(): string {
        return this._uid;
    }
    public set uid(value: string) {
        this._uid = value;
    }
//==============================================//
    public get imageURL(): string {
        return this._imageURL;
    }
    public set imageURL(value: string) {
        this._imageURL = value;
    }
//==============================================//
    public get watched(): boolean {
        return this._watched;
    }
    public set watched(value: boolean) {
        this._watched = value;
    }
}