import p5Types from 'p5';
import Line from './Line';
import Hoop from './Hoop';
import { timeStamp } from 'console';

class Ball {
	x: number;
	y: number;
	radius: number;
	p5: p5Types;
	static color = 255;
	collected: string[] = [];
	constructor(x: number, y: number, r: number, p5: p5Types) {
		this.x = x;
		this.y = y;
		this.radius = r;
		this.p5 = p5;
	}

	draw(image: any) {
		this.p5.color(Ball.color);
		this.p5.fill(Ball.color);
		this.p5.strokeWeight(0);
		this.p5.image(image, this.x, this.y, this.radius * 2, this.radius * 2);
	}

	update(
		lines: Line[],
		hoops: Hoop[],
		canvasWidth: number,
		canvasHeight: number
	) {
		let moved = false;
		for (let line of lines) {
			const rightEdge = this.x + this.radius;
			const leftEdge = this.x - this.radius;
			const bottomEdge = this.y + this.radius;
			const intersectDetected = this.isIntersect(line);
			if (
				((line.x1 <= leftEdge && line.x2 >= this.x) ||
					(line.x2 >= rightEdge && line.x2 <= this.x) ||
					(line.x1 >= leftEdge && line.x2 <= this.x) ||
					(line.x2 <= rightEdge && line.x2 >= this.x)) &&
				((line.y1 <= bottomEdge && line.y2 >= bottomEdge) ||
					(line.y1 >= bottomEdge && line.y2 <= bottomEdge))
			) {
				const increment = Line.getGradient(line) * 10;
				if (intersectDetected) {
					this.x = this.x + increment;
					this.y =
						Line.getYGivenX(line, this.x) - Line.strokeWeight - this.radius;
					moved = true;
					break;
				}
			}
		}

		for (let i = 0; i < hoops.length; i++) {
			const hoop = hoops[i];
			const bottomEdge = this.y + this.radius;
			if (
				hoop.y <= bottomEdge &&
				hoop.y + Hoop.height >= bottomEdge &&
				hoop.x <= this.x &&
				hoop.x + Hoop.width >= this.x &&
				!this.collected[Math.floor(i / 6)]
			) {
				this.collected.push(hoop.color);
			}
		}

		if (
			this.y + this.radius >= canvasHeight ||
			this.x + this.radius >= canvasWidth ||
			this.x - this.radius <= 0
		) {
			console.log(this.collected);
			return;
		}

		if (lines.length === 0 || !moved) {
			this.y = this.y + 1;
		}
	}

	isIntersect(line: Line) {
		const y = Line.getYGivenX(line, this.x);
		const delta = Math.abs(y - this.y);
		if (delta < this.radius + Line.strokeWeight) {
			return true;
		}
		return false;
	}
}

export default Ball;
