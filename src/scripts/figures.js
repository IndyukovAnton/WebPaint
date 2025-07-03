class Figure {
	constructor(panel, id, color, opacity, thickness, type, radius = 0) {
		this.id = id
		this.radius = radius
		this.color = color,
		this.opacity = opacity,
		this.thickness = thickness
		this.panel = panel
		this.type = type
		this.angle = 0


		this.x1 = 0
		this.y1 = 0
		this.x2 = 0
		this.y2 = 0

		this.element = null;
	}

	addPoints(points) {
		for (let i = 0; i < points.length; i++) {
			this[`x${i + 1}`] = points[i]
		}
	}

	create() {
		const figureElement = document.createElement('div')
		figureElement.classList.add('figure')
		figureElement.classList.add(`figure-${this.type}-${this.id}`)
		figureElement.dataset.id = this.id

		figureElement.style.backgroundColor = this.color
		figureElement.style.opacity = this.opacity / 100
		figureElement.style.borderRadius = this.radius + 'px';


		figureElement.style.left = this.x1 + 'px'
		figureElement.style.top = this.y1 + 'px'
		
		if (this.x1 > this.x2) {
			figureElement.style.width = this.x1 - this.x2 + 'px'
		} else {
			figureElement.style.width = this.x2 - this.x1 + 'px'
		}

		if (this.y1 > this.y2) {
			figureElement.style.height = this.y1 - this.y2 + 'px'
		} else {
			figureElement.style.height = this.y2 - this.y1 + 'px'
		}

		
		figureElement.style.transform = `rotateZ(${this.angle}deg)`
		figureElement.style.transformOrigin = `0 0`;

		this.element = figureElement;

		return this.element
	}

	delete() {
		this.element.remove()
	}
}


class Line {
	constructor(x1, y1, x2, y2, thickness, angle = 0) {
		this.x1 = x1
		this.y1 = y1
		this.x2 = x2
		this.y2 = this.y1 + thickness
		this.angle = angle
	}
}

class Square {
	constructor(x1, y1, x2, y2, thickness, angle = 0) {
		this.x1 = x1
		this.y1 = y1
		this.x2 = x2
		this.y2 = this.y1 + thickness
		this.angle = angle
	}
}

class Circle {
	constructor(x1, y1, x2, y2, thickness, angle = 0) {
		this.x1 = x1
		this.y1 = y1
		this.x2 = x2
		this.y2 = this.y1 + thickness
		this.angle = angle
	}
}

export { Figure }