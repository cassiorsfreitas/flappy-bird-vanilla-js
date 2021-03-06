function newElement(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function Barrier(reverse = false) {
    this.element = newElement('div', 'barrier')

    const border = newElement('div', 'border')
    const body = newElement('div', 'body')
    this.element.appendChild(reverse ? body : border)
    this.element.appendChild(reverse ? border : body)

    this.setHeight = height => body.style.height = `${height}px`
}

function PairOfBarriers (height, gap, x) {
    this.element = newElement('div', 'pair-of-barriers')

    this.upper = new Barrier(true)
    this.lower = new Barrier(false)

    this.element.appendChild(this.upper.element)
    this.element.appendChild(this.lower.element)

    this.randomGap = () => {
        const heightUpper = Math.random() * (height - gap)
        const lowUpper = height - gap - heightUpper
        this.upper.setHeight(heightUpper)
        this.lower.setHeight(lowUpper)
    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth

    this.randomGap()
    this.setX(x)
}

// const b = new PairOfBarriers(700, 300, 400)
// document.querySelector('[wm-flappy]').appendChild(b.element)

function BarriersPack(height, width, gap, distanceBetweenBarriers, notificationPoint) {
    this.pairs = [
        new PairOfBarriers(height, gap, width),
        new PairOfBarriers(height, gap, width + distanceBetweenBarriers),
        new PairOfBarriers(height, gap, width + distanceBetweenBarriers * 2),
        new PairOfBarriers(height, gap, width + distanceBetweenBarriers * 3)
    ]

    const pixelSpeed = 3

    this.start = () => {
        this.pairs.forEach( pair => {
            pair.setX(pair.getX() - pixelSpeed)

            if(pair.getX() < -pair.getWidth()) {
                pair.setX(pair.getX() + distanceBetweenBarriers * this.pairs.length)
                pair.randomGap()
            }

            const middle = width / 2
            const passedCenter = pair.getX() + pixelSpeed >= middle
                && pair.getX() < middle
            if (passedCenter) notificationPoint()
        })        
    }
}

const barriers = new BarriersPack(700, 1100, 400, 400)
const area = document.querySelector('[wm-flappy]')
barriers.pairs.forEach(pair => area.appendChild(pair.element))
setInterval(() => {
    barriers.start()
}, 20)

