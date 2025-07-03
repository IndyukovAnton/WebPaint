import {Figure} from './figures.js'

class DrawPanel {
	constructor() {
		this.panel = document.querySelector('.draw-panel')
		this.figures = document.querySelector('.figures')
		this.currentActiveFigure = null
		this.opacity = null;
		this.thickness = null;
		this.color = null;
		this.radius = null;
		this.isDrawing = false;
		this.drawnFigures = []
		this.currentFigure = null;
		this.currentId = 0
		this.currentPosition = 'x1';
		this.hasSelectedElement = false;

		this.actions = {
			'clear': ()=> this.clear(),
			'save': ()=> this.save(),
			'load': ()=> this.load(),
			'undo': ()=> this.undo(),
			'redo': ()=> this.redo(),
			'change-color': (event)=> this.changeColor(event.target.value),
			'change-thickness': (event)=> this.changeThickness(+event.target.value),
			'change-opacity': (event)=> this.changeOpacity(+event.target.value),
			'change-radius': (event)=> this.changeRadius(+event.target.value),
		}
	}


	addFigure(figure) {

		const _figure = figure.create()
		console.log('[INFO] Finished Figure:', figure)
		console.log('[INFO] Drawn Figure:', _figure)

		this.panel.append(_figure)
		this.drawnFigures.push(figure)
		this.currentFigure = null
		this.isDrawing = false
	}

	selectFigure(figureId) {
		
		this.drawnFigures.forEach((figure) => {
			if (figure.id == figureId) {
				figure.element.classList.add('selected')
				return
			}
		})

		this.hasSelectedElement = true;
	}

	unSelectFigure() {
		this.drawnFigures.forEach((figure) => {
			figure.element.classList.remove('selected')
		})

		this.hasSelectedElement = false;
	}

	createFigure() {
		if (this.currentActiveFigure) {
			const _figure = new Figure(this.panel, this.currentId, this.color, this.opacity, this.thickness, this.currentActiveFigure, this.radius)
			console.log("[INFO] Created Figure: ", _figure)
			this.currentId++;
			return _figure
		}
	}


	deleteFigure() {
		this.drawnFigures.forEach((figure) => {
			if (figure.element.classList.contains('selected')) {
				console.log('[INFO] Deleted Figure:', figure, figure.element)
				figure.delete()
				this.drawnFigures.splice(this.drawnFigures.indexOf(figure), 1)
				console.log(this.drawnFigures)
			}
		})
	}


	undo() {
		if (this.currentActiveFigure) {
			console.log(this.currentActiveFigure)
		}
	}


	redo() {
		if (this.currentActiveFigure) {
			console.log(this.currentActiveFigure)
		}
	}


	save() {
		console.log(this)
	}


	load() {
		console.log(this.currentActiveFigure)
	}


	clear() {
		this.panel.innerHTML = ''
	}

	changeColor(color) {
		this.color = color
	}

	changeOpacity(opacity) {
		this.opacity = opacity
	}

	changeThickness(thickness) {
		this.thickness = thickness
	}

	changeRadius(radius) {
		this.radius = radius
	}

	calculateAngle(x1, y1, x2, y2) {
		let deltaX;
		let deltaY;

		if (x1 > x2) {
			deltaX = x1 - x2
		} else {
			deltaX = x2 - x1
		}

		if (y1 > y2) {
			deltaY = y1 - y2
		} else {
			deltaY = y2 - y1
		}

		return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI
	}

	createLine(posX, posY) {
		console.log(posX, posY)
		switch(this.currentPosition) {
			case 'x1':
				this.currentFigure.x1 = posX
				this.currentFigure.y1 = posY
				this.currentPosition = 'x2'
				break
			case 'x2':
				this.currentFigure.x2 = posX
				this.currentFigure.y2 = this.currentFigure.y1 + this.thickness
				this.currentFigure.angle = this.calculateAngle(this.currentFigure.x1, this.currentFigure.y1, posX, posY)
				this.currentPosition = 'x1'

				this.addFigure(this.currentFigure)
				this.finishDrawing()
				break
		}
	}

	createSquare(posX, posY) {
		switch(this.currentPosition) {
			case 'x1':
				this.currentFigure.x1 = posX
				this.currentFigure.y1 = posY
				this.currentPosition = 'y2'
				break
			case 'y2':
				this.currentFigure.x2 = posX
				this.currentFigure.y2 = posY
				this.currentPosition = 'x1'

				this.addFigure(this.currentFigure)
				this.finishDrawing()
				break
		}
	}

	createCircle(posX, posY) {
		switch(this.currentPosition) {
			case 'x1':
				this.currentFigure.x1 = posX
				this.currentFigure.y1 = posY
				this.currentPosition = 'y2'
				break
			case 'y2':
				this.currentFigure.x2 = posX
				this.currentFigure.y2 = posY
				this.currentPosition = 'x1'

				this.currentFigure.radius = 50

				this.addFigure(this.currentFigure)
				this.finishDrawing()
				break
		}
	}

	setSettingsValues() {
		const inputs = document.querySelectorAll('.settings .settings_input')
		inputs.forEach((input) => {
			if (['number', 'range'].indexOf(input.type) != -1) {
				this[input.dataset.title.toLowerCase()] = +input.value
			} else {
				this[input.dataset.title.toLowerCase()] = input.value
			}
		})
	}

	setSettingsControllers() {
		const buttons = document.querySelectorAll('.settings .button')
		buttons.forEach((button) => {
			button.addEventListener('click', this.actions[button.dataset.action])
		})
	
		const inputs = document.querySelectorAll('.settings .settings_input')
			inputs.forEach((input) => {
				input.addEventListener('input', (event) => {
					this.actions[event.target.dataset.action](event)
					event.target.parentNode.querySelector('.settings_input_value').innerHTML = event.target.value
			})
		})
	}

	initCheckCurrentFigure() {
		this.figures.addEventListener('click', (event) => {
			if (event.target.classList.contains('figures')) {
				return
			}
	
			if (!this.currentActiveFigure) {
				event.target.classList.add('active')
				this.currentActiveFigure = event.target.dataset.type
			}
			else if (event.target.dataset.type == this.currentActiveFigure) {
				event.target.classList.remove('active')
				this.currentActiveFigure = null
			} else {
				for (let i = 0; i < this.figures.children.length; i++) {
						if (this.figures.children[i].dataset.type == this.currentActiveFigure) {
							this.figures.children[i].classList.remove('active')
							event.target.classList.add('active')
							this.currentActiveFigure = event.target.dataset.type
						}
				}
				}
		})
	}

	initEventsTracking() {
		this.panel.addEventListener('click', (event) => {

			if (this.hasSelectedElement) {
				this.unSelectFigure()
				return
			}

			this.startDrawing(event)
		})

		this.panel.addEventListener('dblclick', (event) => {
			this.selectFigure(event.target.dataset.id)
		})
	}

	initKeysTracking() {
		document.addEventListener('keydown', (event) => {
			if (this.hasSelectedElement) {
				if (event.key == 'Delete') {
					this.deleteFigure()
				}
			}

		})
	}

	finishDrawing() {
		this.isDrawing = false
		this.currentFigure = null
		this.currentPosition = 'x1'
	}

	startDrawing(event) {
		if (!this.currentActiveFigure) {
			this.finishDrawing()
			return
		}

		if (this.hasSelectedElement) {
			return
		}

		if (!this.currentFigure) {
			this.isDrawing = true
			this.currentFigure = this.createFigure()
		}


		console.log('[INFO] Current Figure:', this.currentActiveFigure)
		switch(this.currentFigure.type) {
			case 'line':
				this.createLine(event.offsetX, event.offsetY)
				break
			case 'square':
				this.createSquare(event.offsetX, event.offsetY)
				break
			case 'circle':
				this.createCircle(event.offsetX, event.offsetY)
				break
		}
			
	}

	init() {
		this.setSettingsControllers()
		this.setSettingsValues(this)
		this.initCheckCurrentFigure()
		this.initEventsTracking()
		this.initKeysTracking()
	}
}

const drawPanel = new DrawPanel();

document.addEventListener('DOMContentLoaded', ()=> {
	drawPanel.init()
})