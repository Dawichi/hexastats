/* eslint-disable @next/next/no-img-element */
import React from 'react'
import ChartCard from '../components/ChartCard'
import DataByPlayer from '../components/DataByPlayer'
import { Champs, Player } from '../interfaces/interfaces'

export default function Ranking({data}) {

	// Model of player data to sort
	const rank_data = []
	data.map((player: Player) => {
		rank_data.push({
			name: player.name,
			image: player.image,
			rank_n: player.rank_n,
			rank_p: player.rank_p
		})
	})

	rank_data.sort(function(a, b) {return a.rank_p - b.rank_p})

	return (
		<>
			<div className="container-fluid">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
					{
						rank_data.map((player: Player, index: number) => {
							return (
								<div key={index} className="m-3 p-3 border shadow rounded">
									<div className="flex">
										<img className="m-2 w-14 h-14 rounded" src={player.image} alt={player.name} />
										<div className="flex flex-col">
											<span className="pb-1 text-xl">{player.name}</span>
											<span className="pb-1">{player.rank_n ? player.rank_n + 'º' : 'no data ;('}</span>
										</div>
									</div>
									<div className="rounded bg-red-300 w-100 text-red-300">
										{ player.rank_n &&
											<div className="rounded text-center bg-red-600 text-white" style={{width: (100 - player.rank_p) + '%'}}>{(100 - player.rank_p).toFixed(1)} %</div>
										}
									</div>
								</div>
							)
						})
					}
				</div>
			</div>

			<div className="container mx-auto">
				<h2 className="text-4xl text-center mt-10 mb-5">Graphs by player</h2>
				<hr/>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
					{/* {charts.map((x, index) => <ChartCard key={index} id={index+1} title={x.title} data={x.data} data_int={x.data_int} />)} */}
				</div>
			</div>

			<DataByPlayer data={data} />
		</>
	)
}