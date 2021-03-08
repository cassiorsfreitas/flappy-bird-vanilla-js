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

function Bird(heightGame) {
    let flying = false
    
    this.element = newElement('img', 'bird')
    this.element.src = 'img/bird.png'
    
    this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
    this.setY = y => this.element.style.bottom = `${y}px`
    
    window.onkeydown = e => flying = true
    window.onkeyup = e => flying = false
    
    this.start = () => {
        const newY = this.getY() + (flying ? 8 : -5)
        const maxHeight = heightGame - this.element.clientHeight
        
        if (newY <= 0) {
            this.setY(0)
        } else if (newY >= maxHeight) {
            this.setY(maxHeight)
        } else {
            this.setY(newY)
        }
    }
    
    this.setY(heightGame / 2)
    
}

function Progress() {
    this.element = newElement('span', 'progress')
    this.refreshPoints = points => {
        this.element.innerHTML = points
    }
    
    this.refreshPoints(0)
}

function checkPosition(elementA, elementB) {
    const a = elementA.getBoundingClientRect()
    const b = elementB.getBoundingClientRect()
    
    const horizontal = a.left + a.width >= b.left
    && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top
    && b.top + b.height >= a.top
    
    return horizontal && vertical
}

function collisionDetector(bird, barriers) {
    let collision = false
    
    barriers.pairs.forEach(pairOfBarriers => {
        if(!collision) {
            const upper = pairOfBarriers.upper.element
            const lower = pairOfBarriers.lower.element
            collision = checkPosition(bird.element, upper)
            || checkPosition(bird.element, lower) 
        }
    })
    
    return collision
}

function Refresh() {
    this.element = newElement('div', 'restart')
    this.element.innerHTML = "Press any key to restart"
    
    this.restart = () => {
        this.element.style.display = "inline"
        
    }
} 

function FlappyBird() {
    let points = 0
    
    const area = document.querySelector('[wm-flappy]')
    const height = area.clientHeight
    const width = area.clientWidth
    
    const progress = new Progress()
    const barriers = new BarriersPack(height, width, 200, 400, 
        () => progress.refreshPoints(++points))
        const bird = new Bird(height)
        const message = new Refresh()
        
        area.appendChild(progress.element)
        area.appendChild(bird.element)
        area.appendChild(message.element)
        barriers.pairs.forEach(pair => area.appendChild(pair.element))
        
        this.start = () => {
            const timer = setInterval(() => {
                barriers.start()
                bird.start()
                
                if (collisionDetector(bird, barriers)) {
                    clearInterval(timer)
                    message.restart()
                    window.onkeydown = () => location.reload()
                }
                
            }, 20)
        }
    }
    
    new FlappyBird().start()