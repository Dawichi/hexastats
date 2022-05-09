import { Controller, Get, Logger, Param, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SummonersService } from './summoners.service'
import { ChampDto, MasteryDto, PlayerDto } from './dto'
import {
    ChampsLimitQuery,
    GamesLimitQuery,
    MasteriesLimitQuery,
    OffsetQuery,
    QueueTypeQuery,
    ServerParam,
    SummonerNameParam,
} from './decorators'
import { DatabaseService } from 'src/database/database.service'
import { validateTTL } from 'src/common/utils'

@ApiTags('summoners')
@Controller('summoners')
export class SummonersController {
    private readonly logger: Logger

    constructor(private readonly summonersService: SummonersService, private readonly databaseService: DatabaseService) {
        this.logger = new Logger(this.constructor.name)
    }

    /**
     * ## Get summoner information by summoner name
     * @param {string} server Server name (e.g. 'euw1')
     * @param {string} summonerName Summoner name in the game
     * @returns {Promise<PlayerDto>} Player object with all the information
     */
    @Get('/:server/:summonerName')
    @ApiOperation({
        summary: 'Get player info',
        description: 'Returns the basic info (summoner data and rankings)',
    })
    @ApiResponse({
        status: 200,
        description: 'The summoner was found and the data is correct',
        type: PlayerDto,
    })
    @ServerParam()
    @SummonerNameParam()
    async getBasicSummoner(@Param('server') server: string, @Param('summonerName') summonerName: string): Promise<PlayerDto> {
        this.logger.verbose(`Started a basic search for: ${summonerName}`)

        const redisData = await this.databaseService.recoverSummonerData(server, summonerName)

        if (redisData) {
            const stillValid = validateTTL(redisData.ttl)

            if (stillValid) {
                return redisData.data
            }
        }

        const version = await this.summonersService.getLatestVersion()
        const summonerData = await this.summonersService.getSummonerDataByName(summonerName, server)
        const { solo, flex } = await this.summonersService.getRankData(summonerData.id, server)
        const result = {
            alias: summonerData.name,
            image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${summonerData.profileIconId}.png`,
            level: summonerData.summonerLevel,
            rank: {
                solo,
                flex,
            },
        }

        await this.databaseService.saveSummonerData(server, summonerName, result)
        this.logger.verbose('Done!')
        return result
    }

    /**
     * ## Get masteries of a summoner
     * @param {string} server Server name (e.g. 'euw1')
     * @param {string} summonerName Summoner name in the game
     * @param {number} masteriesLimit Limit of masteries to be returned (default: 24)
     * @returns {Promise<MasteryDto[]>} Player object with all the information
     */
    @Get('/:server/:summonerName/masteries')
    @ApiOperation({
        summary: 'Get masteries',
        description: 'Returns the number of masteries requested, sort by most points',
    })
    @ApiResponse({
        status: 200,
        description: 'The summoner was found and the data is correct',
        type: [MasteryDto],
    })
    @ServerParam()
    @SummonerNameParam()
    @MasteriesLimitQuery()
    async getMasteries(
        @Param('server') server: string,
        @Param('summonerName') summonerName: string,
        @Query('masteriesLimit') masteriesLimit = 24,
    ): Promise<MasteryDto[]> {
        this.logger.verbose(`Started a masteries search for: ${summonerName}`)

        const summonerData = await this.summonersService.getSummonerDataByName(summonerName, server)
        const masteries = await this.summonersService.getMasteries(summonerData.id, server, masteriesLimit)

        this.logger.verbose('Done!')

        return masteries
    }

    /**
     * ## Get summoner information by summoner name
     * @param {string} server Server name (e.g. 'euw1')
     * @param {string} summonerName Summoner name in the game
     * @param {number} champsLimit Limit of champions to be returned (default: 7)
     * @param {number} gamesLimit Limit of games to be checked (default: 50)
     * @param {string} queueType Specify to check only a specific queue ('ranked' or 'normal')
     * @returns {Promise<ChampDto[]>} Player object with all the information
     */
    @Get('/:server/:summonerName/champs')
    @ApiOperation({
        summary: 'Get champs info',
        description: 'Returns the champs information from a summoner. Loads the last X games and returns the stats calculated',
    })
    @ApiResponse({
        status: 200,
        description: 'The summoner was found and the data is correct',
        type: [ChampDto],
    })
    @ServerParam()
    @SummonerNameParam()
    @GamesLimitQuery()
    @ChampsLimitQuery()
    @OffsetQuery()
    @QueueTypeQuery()
    async getChampsData(
        @Param('server') server: string,
        @Param('summonerName') summonerName: string,
        @Query('champsLimit') champsLimit = 7,
        @Query('gamesLimit') gamesLimit = 10,
        @Query('offset') offset = 0,
        @Query('queueType') queueType: string,
    ): Promise<ChampDto[]> {
        this.logger.verbose(`Started a complete search for: ${summonerName}`)

        const summonerData = await this.summonersService.getSummonerDataByName(summonerName, server)
        const champs = await this.summonersService.getChampsData(summonerData.puuid, server, champsLimit, gamesLimit, offset, queueType)

        this.logger.verbose('Done!')

        return champs
    }
}
