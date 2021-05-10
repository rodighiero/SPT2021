// CSS

import '../node_modules/css-reset-and-normalize/css/reset-and-normalize.min.css'
import './assets/main.css'

// Libraries

import { json, xml, image, extent, scaleLinear } from 'd3'
import { Application, BitmapFont, Texture, Sprite, Point } from 'pixi.js'
import { Viewport } from 'pixi-viewport'

// Assets

import background from './draw/background'
import clusters from './draw/clusters.js'
import contours from './draw/contours.js'
import keywords_close from './draw/keywords_close.js'
import keywords_distant from './draw/keywords_distant.js'
import nodes from './draw/nodes.js'

import fps from './interface/fps.js'
import search from './interface/search'
import stats from './interface/stats'

import fontXML from './assets/Lato.fnt'
import fontPNG from './assets/Lato.png'

import backgroundImage from './assets/background.png'

import embedding from './data/embedding.json'
import authors from './data/authors.json'
import lemmas from './data/lemmas.json'
import pairs from './data/pairs.json'

// Global variables

window.s = {
    // distance: 30,
    // nodes,
    // tokens: []
}

// Start

Promise.all([
    json(embedding),
    json(authors),
    json(lemmas),
    json(pairs),
    xml(fontXML),
    image(fontPNG),
    image(backgroundImage),


]).then(([embedding, authors, lemmas, pairs, fontXML, fontPNG, backgroundImage]) => {

    // Set variables

    const width = window.innerWidth
    const height = window.innerHeight

    let data = embedding.reduce((array, value, i) => {
		array[i] = [...embedding[i], lemmas[i].length, authors[i]]
        return array
    }, [])

    // Set App

    s.app = new Application({
        antialias: true,
        resolution: 2,
        autoDensity: true,
        autoResize: true,
        resizeTo: window
    })

    document.body.prepend(s.app.view)

    // Set viewport

    s.viewport = new Viewport({
        screenWidth: width,
        screenHeight: height,
        interaction: s.app.renderer.plugins.interaction
    }).drag().pinch().wheel().decelerate()

    s.app.stage.addChild(s.viewport)

    // Set embedding's dimension

    const extX = extent(data, d => d[0])
    const extY = extent(data, d => d[1])

    const scaleX = scaleLinear().domain([extX[0], extX[1]]).range([0, height])
    const scaleY = scaleLinear().domain([extY[0], extY[1]]).range([0, height])

    data.forEach(d => {
        d[0] = scaleX(d[0])
        d[1] = scaleY(d[1])
    })

    pairs.forEach(p => {
        p[0] = scaleX(p[0])
        p[1] = scaleY(p[1])
    })

    // Transparency on zoom

    // const zoomOut = scaleLinear().domain([s.zoomMin, 2]).range([1, 0]) // Visible when zooming out
    // const zoomIn = scaleLinear().domain([s.zoomMin, 2]).range([0, 1]) // Visible when zooming in

    // s.viewport.on('zoomed', e => {
    //     const scale = e.viewport.lastViewport.scaleX
    //     // e.viewport.children.find(child => child.name == 'contours').alpha = zoomOut(scale)
    //     // e.viewport.children.find(child => child.name == 'nodes').alpha = zoomIn(scale)
    //     // e.viewport.children.find(child => child.name == 'keywords_close').alpha = zoomIn(scale)
    //     // e.viewport.children.find(child => child.name == 'keywords_distant').alpha = zoomOut(scale)
    // })

    // Font loader

    BitmapFont.install(fontXML, Texture.from(fontPNG))

    /**
     * Rendering
     */

    console.table(data)

    background(backgroundImage, width, height)
    contours(data, width, height)
    nodes(data, authors)
    keywords_close(pairs)
    // keywords_distant()
    // clusters()
    fps()
    search(data)

    // Prevent pinch gesture in Chrome

    window.onresize = () => {
        s.viewport.resize()
    }

    // Prevent wheel interference
    
    window.addEventListener('wheel', e => {
        e.preventDefault()
    }, { passive: false })

})