import { Point, Sprite, Texture } from 'pixi.js'

export default (backgroundImage, width, height) => {

    let texture = Texture.from(backgroundImage)
    let sprite = new Sprite(texture)
    sprite.width = width
    sprite.height = height
    sprite.interactiveChildren = false

    s.viewport.addChild(sprite)

}