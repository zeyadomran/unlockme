import p5Types from 'p5';

class Hoop {
	x: number;
	y: number;
	color: string;

	colors = ['red', 'green', 'blue', 'yellow', 'magenta', 'white'];
	width = 50;
	height = 50;
	rows = 4;
	svgName = 'hoop.svg';

	constructor(x?: number, y?: number, color?: string) {
		this.x = x ?? 0;
		this.y = y ?? 0;
		this.color = color ?? this.colors[0];
	}

	draw(p5: p5Types, image: p5Types.Image) {
		p5.color(this.color);
		p5.fill(this.color);
		p5.strokeWeight(0);
		p5.image(image, this.x, this.y, this.width, this.height);
	}
}

export default Hoop;
