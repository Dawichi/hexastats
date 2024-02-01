import type { Augment } from './Augment.dto'
import type { Perks } from './Perks.dto'

interface Objective {
    type: string
    first: boolean
    kills: number
}

interface Ban {
    championId: string | null
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
    riotIdGameName: string
    riotIdTagLine: string
    teamPosition: string
    isEarlySurrender: boolean
    win: boolean
    visionScore: number
    champ: ChampData
    kills: number
    deaths: number
    assists: number
    multiKill: MultiKill
    gold: number
    cs: number
    ward: number
    placement: number
    items: Array<number>
    spells: Array<number>
    perks: Perks
    augments: Array<Augment>
}

export interface GameDetail {
    matchId: string
    gameCreation: number
    gameDuration: number
    participantNumber: number
    gameMode: string
    teams: Team[]
    participants: Participant[]
}

