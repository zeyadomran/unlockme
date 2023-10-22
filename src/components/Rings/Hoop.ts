import p5Types from 'p5';

class Hoop {
	x: number;
	y: number;
	color: string;

	static colors = ['red', 'green', 'blue', 'yellow', 'magenta', 'white'];
	static width = 50;
	static height = 50;
	static rows = 4;
	static svgName = 'hoop.svg';

	constructor(x: number, y: number, color: string) {
		this.x = x;
		this.y = y;
		this.color = color;
	}

	draw(p5: p5Types, image: p5Types.Image) {
		p5.color(this.color);
		p5.fill(this.color);
		p5.strokeWeight(0);
		p5.image(image, this.x, this.y, Hoop.width, Hoop.height);
	}
}

export default Hoop;
