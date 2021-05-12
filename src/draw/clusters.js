import { Graphics } from 'pixi.js'
import { polygonHull } from 'd3'


export default (data, clusters) => {


    const stage = new Graphics()
    stage.interactiveChildren = false
    stage.name = 'clusters'
    s.viewport.addChild(stage)

    const groups = clusters.reduce((object, element, index, a) => {
        const coordinates = [data[index][0], data[index][1]]
        if (object[element])
            object[element].push(coordinates)
        else
            object[element] = [coordinates]
        return object
    }, {})

    const width = 1
    const color = 0xFFFFFF

    Object.values(groups).forEach(group => {

        const polygon = polygonHull(group)

        stage.lineStyle(width, color)
        stage.beginFill(color, 0.1)

        if (polygon) {
            polygon.forEach((point, i) => {
                if (i == 0)
                    stage.moveTo(point[0], point[1])
                else
                    stage.lineTo(point[0], point[1])
            })
            stage.closePath()
        }

    })

}