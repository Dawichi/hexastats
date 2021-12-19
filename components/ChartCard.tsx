import React from 'react'
import { DataForChart } from '../interfaces/interfaces'
import { PieChart } from '.'
import { styles } from '../styles/styles.config'

// Prints a card with a chart
// - title: the 'category' of the data in graph
// - data: the data to render in graph [{label: 'name', value: 5}]
// - data_int: array of values present in 'data[x].value'. Used to manage 1º, 2º and 3º ranks
// - id: necessary to print the charts (they must be linked to a HTML id)
const ChartCard = ({ title, data, data_int, id }) => {
    // Select the best 3 values (first 3 values of a sorted array)
	const podium = [data_int[0], data_int[1], data_int[2]]

    // If the value matches with a player's value, then use that player's name (because it's his value)
    // The probability of 2 players having same value is almost 0. (is a float median) So don't worry.
    data.map((x: DataForChart) => {
		podium.forEach((best, idx) => {
			if (x.value == best) podium[idx] = x.label
		})
    })

	const styled = (rank: number) => {
		const podium = {
			0: styles.trophies.first,
			1: styles.trophies.second,
			2: styles.trophies.third,
		}
		return podium[rank]
	}

    // Prints our 3 ranked winners of the {title} category and renders the data with <PieChart/>
    return (
        <div className={`m-3 ${styles.foreground} ${styles.card}`}>
            <h3 className='text-2xl text-center m-3'>{title}</h3>
            <hr style={{ width: '85%', margin: 'auto' }} />
            <br />
            <div className='m-auto' style={{ width: '85%' }}>
                <div className='grid grid-cols-3'>
					{ podium.map((best, idx) => (
						<p>
							<span className={styled(idx)}>
								<i className='bi bi-trophy'></i>
							</span>{' '}
							{best}
						</p>
					))}
                </div>
            </div>
            <PieChart data={data} outerRadius={120} innerRadius={50} id={id} />
        </div>
    )
}

export default ChartCard
