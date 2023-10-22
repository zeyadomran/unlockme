import p5Types from 'p5';

class Line {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	p5: p5Types;
	static strokeWeight = 5;
	static color = 255;

	constructor(x: number, y: number, p5: p5Types) {
		this.x1 = x;
		this.y1 = y;
		this.x2 = x;
		this.y2 = y;
		this.p5 = p5;
	}

	draw() {
		this.p5.stroke(Line.color);
		this.p5.strokeWeight(Line.strokeWeight);
		this.p5.line(this.x1, this.y1, this.x2, this.y2);
	}

	static getGradient(line: Line) {
		return (line.y2 - line.y1) / (line.x2 - line.x1);
	}

	static getYGivenX(line: Line, x: number) {
		const m = Line.getGradient(line);
		const b = line.y1 - m * line.x1;
		return m * x + b;
	}
}

export default Line;
