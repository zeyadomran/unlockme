import p5Types from 'p5';
import Line from './Line';
import Hoop from './Hoop';

class Ball {
	x: number;
	y: number;
	p5: p5Types;
	image: p5Types.Image;
	collected: string[] = [];
	onComplete: (colors?: string[]) => void;
	static color = 255;
	static radius = 12;

	constructor(
		x: number,
		y: number,
		p5: p5Types,
		image: p5Types.Image,
		onComplete: (colors?: string[]) => void
	) {
		this.x = x;
		this.y = y;
		this.p5 = p5;
		this.image = image;
		this.onComplete = onComplete;
	}

	draw() {
		this.p5.color(Ball.color);
		this.p5.fill(Ball.color);
		this.p5.image(
			this.image,
			this.x - Ball.radius,
			this.y - Ball.radius,
			Ball.radius * 2,
			Ball.radius * 2
		);
	}

	update(
		lines: Line[],
		hoops: Hoop[],
		canvasWidth: number,
		canvasHeight: number,
		password: string[]
	) {
		let moved = false;
		for (let line of lines) {
			const rightEdge = this.x + Ball.radius;
			const leftEdge = this.x - Ball.radius;
			const bottomEdge = this.y + Ball.radius;
			const intersectDetected = this.isIntersect(line);
			if (
				((line.x1 <= leftEdge && line.x2 >= this.x) ||
					(line.x2 >= rightEdge && line.x2 <= this.x) ||
					(line.x1 >= leftEdge && line.x2 <= this.x) ||
					(line.x2 <= rightEdge && line.x2 >= this.x)) &&
				((line.y1 <= bottomEdge && line.y2 >= bottomEdge) ||
					(line.y1 >= bottomEdge && line.y2 <= bottomEdge)) &&
				intersectDetected
			) {
				const increment = Line.getGradient(line) * 10;
				this.x = this.x + increment;
				this.y =
					Line.getYGivenX(line, this.x) - Line.strokeWeight - Ball.radius;
				moved = true;
			}
		}

		for (let i = 0; i < hoops.length; i++) {
			const hoop = hoops[i];
			const bottomEdge = this.y + Ball.radius;
			if (
				hoop.y <= bottomEdge &&
				hoop.y + Hoop.height >= bottomEdge &&
				hoop.x <= this.x &&
				hoop.x + Hoop.width >= this.x &&
				!this.collected[Math.floor(i / Hoop.colors.length)] &&
				password[Math.floor(i / Hoop.colors.length)] === hoop.color
			) {
				this.collected.push(hoop.color);
			}
		}

		if (
			this.y + Ball.radius >= canvasHeight ||
			this.x + Ball.radius >= canvasWidth ||
			this.x - Ball.radius <= 0
		) {
			this.onComplete(this.collected.length > 0 ? this.collected : undefined);
			this.p5.noLoop();
			return;
		}

		if (lines.length === 0 || !moved) {
			this.y = this.y + 1;
		}
	}

	isIntersect(line: Line) {
		const y = Line.getYGivenX(line, this.x);
		const delta = Math.abs(y - this.y);
		if (delta < Ball.radius + Line.strokeWeight) {
			return true;
		}
		return false;
	}
}

export default Ball;
