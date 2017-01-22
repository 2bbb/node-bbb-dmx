class RGB {
	constructor(address, buffer) {
		this.private = { address, buffer };
		this.length = 3;
	}
    get address() { return this.private.address; }
	get offset() { return this.address - 1; }
    get buffer() { return this.priavte.buffer; }

	get(n) { return this.buffer[this.offset + n]; }
	set(n, v) { return this.buffer[this.offset + n] = v; }
	get r() { return this.get(0); }
	set r(v) { return this.set(0, v); }
	get g() { return this.get(1); }
	set g(v) { return this.set(1, v); }
	get b() { return this.get(2); }
	set b(v) { return this.set(2, v); }
	get rgb() { return this.buffer.slice(this.offset, this.address + 3); }
	set rgb(rgb) {
		this.r(rgb[0]);
		this.g(rgb[1]);
		this.b(rgb[2]);
	}
};

module.exports = RGB;