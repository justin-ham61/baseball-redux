/* eslint-disable @typescript-eslint/no-explicit-any */
const color = {
  0: 'red',
  1: 'blue',
  2: 'orange',
  3: 'green',
  4: 'pink',
  5: 'gray',
  6: 'lime',
  7: 'yellow',
  8: 'cyan',
  9: 'purple',
  10: 'lavender'
}

interface Color {
  0: string,
  1: string,
  2: string,
  3: string,
  4: string,
  5: string,
  6: string,
  7: string,
  8: string,
  9: string,
  10: string
}

export const buildSinglePlayerDataset = (data:any) => {
  const dataSet = {
    labels: data.map((item: any)=> item.date),
    datasets: [{
      label: 'AVG',
      data: data.map((item: any)=> item.stat.avg),
      backgroundColor: 'white',
      borderColor: 'lightblue',
      borderWidth: 2,
      pointRadius: 0
    },{
      label: 'OBP',
      data: data.map((item: any) => item.stat.obp),
      backgroundColor: 'white',
      borderColor: 'red',
      borderWidth: 2,
      pointRadius: 0
    },{
      label: 'OPS',
      data: data.map((item: any) => item.stat.ops),
      backgroundColor: 'white',
      borderColor: 'orange',
      borderWidth: 2,
      pointRadius: 0
    }]
  }
  console.log(dataSet)
  return dataSet
}

export const buildSinglePlayerAggregateData = (data: any, selectedStats:string[]) => {
  console.log(selectedStats)
  console.log(data)
  const dataset:any = {
    labels: data.map((item: any) => item.date),
    datasets: []
  }

  const tempDataset:any = {}
  //initialize dataset for each stat type to []
  selectedStats.map(category => {
    tempDataset[category] = []
  })

  data.map((game: any, index:number) => {
    selectedStats.map(category => {
      if(index === 0){
        tempDataset[category].push(game.stat[category])
      } else {
        tempDataset[category].push(tempDataset[category][index - 1] + game.stat[category])
      }
    })
  })


  selectedStats.map((category,i) => {
    const newDataset:any = {
      label: category,
      data: tempDataset[category],
      backgroundColor: 'white',
      borderColor: color[i as keyof Color],
      borderWidth: 2,
      pointRadius: 0,
    }
    dataset.datasets.push(newDataset)
  })

  return dataset


  console.log(dataset)
}

export const buildComparePlayerDataset = (dataset:any, type:any) => {
  console.log(type)
  const tally = ['homeRuns', 'hits', 'atBats', 'doubles', 'rbi', 'stolenBases', 'triples','runs','plateAppearances','intentionalWalks','baseOnBalls','strikeOuts']
  
  const returnData = []
  //Creates a the data array that Chartjs requires for each dataset
  //Each data is an array of objects containing x and y value
  for(let i = 0; i < dataset.length; i++){
    const data:any = []

    if(tally.indexOf(type) !== -1){
      dataset[i].map((game:any, i:number) => {
        const dataPoint:any = {}
        if(i === 0){
          dataPoint.x = '2023-03-28'
          dataPoint.y = 0 + game.stat[type]
          data.push(dataPoint)
        } else if (game.stat[type] > 0){
          dataPoint.x = game.date
          dataPoint.y = data[data.length - 1].y + game.stat[type]
          data.push(dataPoint)
        }
      })
    } else {
      dataset[i].map((game:any) => {
        const dataPoint = {
          x: game.date,
          y: game.stat[type]
        }
        data.push(dataPoint)
      })
    }

    const newDataSet = {
      label: dataset[i][0].player.fullName,
      data: data,
      backgroundColor: 'white',
      borderColor: color[i as keyof Color],
      borderWidth: 2,
      pointRadius: 0,
    }
    returnData.push(newDataSet)
  }

  //joins all data points 
  let set:any = []
  for(let i = 0; i < returnData.length; i++){
    set = [...set, ...returnData[i].data]
  }

  //using the newly created set array, creates a new set and sorts it according to the x value (Date) in this case
  const allXValues = [...new Set(set.map((data: any) => data.x))].sort()

  //Ensure Uniform X-Values
  //Looks through all the x values and returns a new {x: x value, y: null} data point if the corresponding x point does not exist.
  //returns original point if it does exist
  function ensureUniformXValues(dataset:any, allXValues:any) {
    return allXValues.map((xValue:any) => {
      const match = dataset.find((data:any) => data.x === xValue)
      return match ? match : { x: xValue, y: null }
    })
  }

  //runs the x value function on all datasets
  for(let i = 0; i < returnData.length; i++){
    returnData[i].data = ensureUniformXValues(returnData[i].data, allXValues)
  }


  const returnChart = {
    datasets: returnData
  }
  
  console.log(returnChart)
  return returnChart
}