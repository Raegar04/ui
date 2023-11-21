export interface Knight{
    Id:string,
    Rank:Rank,
    UserName:string,
    Email:string
    Rating:number,
    Password:string,
    ConfirmPassword:string,
}

export interface LoginVM{
    UserName:string,
    Password:string,
    RememberMe:boolean
}

export interface Location{
    Id:string
    Country:string,
    City:string,
    Place:string,
    ImgUri:string
}

export interface Trophy{
    Id:string
    Name:string, 
    Value:string
}

export enum Status {
    Planned,
    Process,
    Ended
}

export interface Tournament {
    Id: string,
    Name: string,
    Description: string,
    Scope: number,
    StartDate: Date,
    Status: Status
}


export interface Round {
    Id: string,
    Name: string,
    Description: string,
    StartDate: Date,
    EndDate: Date,
}

export enum CombatType {
    WithHorses,
    OnSwords,
    BetweenArchers,
    HandToHand,
    FieldBattle
}

export interface Combat {
    Id: string,
    StartDate: Date,
    EndDate: Date,
    Type: CombatType,
}

export enum Rank {
    Ritter,
    Banegraph,
    Master,
    Supreme,
    Lord
}