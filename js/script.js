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

    this.setHigh = high => body.style.height = `${high}px`
}

function PairOfBarriers (high, gap, x) {
    this.element = newElement('div', 'pair-of-barriers')

    this.upper = new Barrier(true)
    this.lower = new Barrier(false)

    this.element.appendChild(this.upper.element)
    this.element.appendChild(this.lower.element)

    this.randomGap = () => {
        const highUpper = Math.random() * (high - gap)
        const lowUpper = high - gap - highUpper
        this.upper.setHigh(highUpper)
        this.lower.setHigh(lowUpper)
    }

    this.getX = () => parseInt(this.element.style.lef.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth

    this.randomGap()
    this.setX(x)
}

const b = new PairOfBarriers(700, 300, 400)
document.querySelector('[wm-flappy]').appendChild(b.element)