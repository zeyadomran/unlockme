import p5Types from 'p5';

class Line {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	p5: p5Types;

	strokeWeight = 5;
	color = 255;

	constructor(x?: number, y?: number, p5?: p5Types) {
		this.x1 = x ?? 0;
		this.y1 = y ?? 0;
		this.x2 = x ?? 0;
		this.y2 = y ?? 0;
		this.p5 = p5 ?? ({} as p5Types);
	}

	draw() {
		this.p5.stroke(this.color);
		this.p5.strokeWeight(this.strokeWeight);
		this.p5.line(this.x1, this.y1, this.x2, this.y2);
	}

	getGradient(line: Line) {
		return (line.y2 - line.y1) / (line.x2 - line.x1);
	}

	getYGivenX(line: Line, x: number) {
		const m = this.getGradient(line);
		const b = line.y1 - m * line.x1;
		return m * x + b;
	}
}

export default Line;
