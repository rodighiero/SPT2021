import { Graphics } from 'pixi.js'
import { polygonHull } from 'd3'


export default (data, clusters) => {


    const stage = new Graphics()
    stage.interactiveChildren = false
    stage.name = 'clusters'
    s.viewport.addChild(stage)

    const width = 1
    const color = 0xFFFFFF

    Object.values(clusters).forEach(cluster => {

        cluster = cluster.map(index => [data[index][0], data[index][1]])

        const polygon = polygonHull(cluster)

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