import type { Kda } from './Game.dto'

interface Objective {
    type: string
    first: boolean
    kills: number
}

interface Ban {
    championId: string
    pickTurn: number
}

interface Team {
    teamId: number
    win: boolean
    bans: Array<Ban>
    objectives: Array<Objective>
}

interface ChampData {
    champLevel: number
    championName: string
    largestMultiKill: number
    damageDealt: number
    damageTaken: number
}

interface MultiKill {
    doubles: number
    triples: number
    quadras: number
    pentas: number
}

interface Participant {
    summonerName: string
    visionScore: number
    champ: ChampData
    kda: Kda
    multiKill: MultiKill
    gold: number
    cs: number
    ward: string
    items: Array<string>
    spells: Array<string>
    perks: Array<string>
}

export interface GameDetail {
    matchId: string
    participantNumber: number
    gameCreation: number
    gameDuration: number
    gameMode: string
    teams: Team[]
    participants: Participant[]
}
