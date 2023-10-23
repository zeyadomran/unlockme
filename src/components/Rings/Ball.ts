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
	color = 255;
	radius = 12;

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
		this.p5.color(this.color);
		this.p5.fill(this.color);
		this.p5.image(
			this.image,
			this.x - this.radius,
			this.y - this.radius,
			this.radius * 2,
			this.radius * 2
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
			const rightEdge = this.x + this.radius;
			const leftEdge = this.x - this.radius;
			const bottomEdge = this.y + this.radius;
			const intersectDetected = this.isIntersect(line);
			if (
				((line.x1 <= leftEdge && line.x2 >= this.x) ||
					(line.x2 >= rightEdge && line.x1 <= this.x) ||
					(line.x1 >= leftEdge && line.x2 <= this.x) ||
					(line.x2 <= rightEdge && line.x1 >= this.x)) &&
				((line.y1 <= bottomEdge && line.y2 >= bottomEdge) ||
					(line.y1 >= bottomEdge && line.y2 <= bottomEdge)) &&
				intersectDetected
			) {
				const increment = line.getGradient(line) * 10;
				this.x = this.x + increment;
				this.y =
					line.getYGivenX(line, this.x) - line.strokeWeight - this.radius;
				moved = true;
			}
		}

		for (let i = 0; i < hoops.length; i++) {
			const hoop = hoops[i];
			const bottomEdge = this.y + this.radius;
			if (
				hoop.y <= bottomEdge &&
				hoop.y + hoop.height >= bottomEdge &&
				hoop.x <= this.x &&
				hoop.x + hoop.width >= this.x &&
				!this.collected[Math.floor(i / hoop.colors.length)] &&
				password[Math.floor(i / hoop.colors.length)] === hoop.color
			) {
				this.collected.push(hoop.color);
			}
		}

		if (
			this.y + this.radius >= canvasHeight ||
			this.x + this.radius >= canvasWidth ||
			this.x - this.radius <= 0
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
		const y = line.getYGivenX(line, this.x);
		const delta = Math.abs(y - this.y);
		if (delta < this.radius + line.strokeWeight) {
			return true;
		}
		return false;
	}
}

export default Ball;
