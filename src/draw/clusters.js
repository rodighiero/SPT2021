import { Graphics } from 'pixi.js'
import { group, polygonHull } from 'd3'


export default (data, clusters) => {

    
    const stage = new Graphics()
    stage.interactiveChildren = false
    stage.name = 'clusters'
    s.viewport.addChild(stage)
    
    const groups = clusters.reduce((object, element, index, a) => {
        if (object[element])
            object[element].push(data[index])
        else
        object[element] = [[data[index][0], data[index][1]]]
        return object
    }, {})

    // console.log(groups)

    const width = 1
    const color = 0xFFFFFF

    Object.values(groups).forEach(group => {

        // const points = cluster.map(node => [node.x, node.y])
        const polygon = polygonHull(group)

        stage.lineStyle(width, color)

        stage.beginFill(color, 0.1)

        if (polygon) {
            polygon.forEach((point, i) => {
                if (i == 0) stage.moveTo(point[0], point[1])
                stage.lineTo(point[0], point[1])
            })
            stage.closePath()
        }

    })

}