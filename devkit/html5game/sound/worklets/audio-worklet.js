﻿AudioWorkletProcessor.prototype._g3 = function () {
	this._h3 = true;
	this.port.onmessage = (_i3) => {
		if (_i3.data === "kill") this._h3 = false;
	};
};
class _j3 extends AudioWorkletProcessor {
	static get parameterDescriptors() {
		return [
			{
				name: "bypass",
				automationRate: "a-rate",
				defaultValue: 0,
				minValue: 0,
				maxValue: 1,
			},
		];
	}
	constructor() {
		super();
		this._g3();
	}
	process(_k3, _l3, parameters) {
		const input = _k3[0];
		const bypass = parameters.bypass;
		for (let c = 0; c < input.length; ++c) {
			const _m3 = input[c];
			for (let _n3 = 0; _n3 < _m3.length; ++_n3) {
				const _o3 = bypass[_n3] !== undefined ? bypass[_n3] : bypass[0];
				_l3[_o3][c][_n3] = _m3[_n3];
			}
		}
		return this._h3;
	}
}
class _p3 extends AudioWorkletProcessor {
	static get parameterDescriptors() {
		return [
			{ name: "gain", automationRate: "a-rate", defaultValue: 1, minValue: 0 },
		];
	}
	constructor() {
		super();
		this._g3();
	}
	process(_k3, _l3, parameters) {
		const _q3 = _k3[0];
		const _r3 = _k3[1];
		const output = _l3[0];
		const gain = parameters.gain;
		for (let c = 0; c < _r3.length; ++c) {
			const _m3 = _r3[c];
			const _s3 = output[c];
			for (let _n3 = 0; _n3 < _m3.length; ++_n3) _s3[_n3] = _m3[_n3];
		}
		for (let c = 0; c < _q3.length; ++c) {
			const _m3 = _q3[c];
			const _s3 = output[c];
			for (let _n3 = 0; _n3 < _m3.length; ++_n3) {
				const _t3 = gain[_n3] !== undefined ? gain[_n3] : gain[0];
				_s3[_n3] += _m3[_n3] * _t3;
			}
		}
		return this._h3;
	}
}
registerProcessor("audio-bus-input", _j3);
registerProcessor("audio-bus-output", _p3);
class _u3 extends AudioWorkletProcessor {
	static get parameterDescriptors() {
		return [
			{
				name: "bypass",
				automationRate: "a-rate",
				defaultValue: 0,
				minValue: 0,
				maxValue: 1,
			},
			{
				name: "gain",
				automationRate: "a-rate",
				defaultValue: 1.0,
				minValue: 0.0,
			},
			{
				name: "factor",
				automationRate: "a-rate",
				defaultValue: 20,
				minValue: 1,
				maxValue: 100,
			},
			{
				name: "resolution",
				automationRate: "a-rate",
				defaultValue: 8,
				minValue: 2,
				maxValue: 16,
			},
			{
				name: "mix",
				automationRate: "a-rate",
				defaultValue: 0.8,
				minValue: 0.0,
				maxValue: 1.0,
			},
		];
	}
	static _v3 = [
		undefined,
		undefined,
		2,
		4,
		8,
		16,
		32,
		64,
		128,
		256,
		512,
		1024,
		2048,
		4096,
		8192,
		16384,
		32768,
	];
	constructor(_w3) {
		super();
		this._g3();
		const _x3 = _w3.outputChannelCount[0];
		this._y3 = new Float32Array(_x3);
		this._z3 = new Uint32Array(_x3);
	}
	process(_k3, _l3, parameters) {
		const input = _k3[0];
		const output = _l3[0];
		const bypass = parameters.bypass;
		const gain = parameters.gain;
		const factor = parameters.factor;
		const resolution = parameters.resolution;
		const mix = parameters.mix;
		for (let c = 0; c < input.length; ++c) {
			const _m3 = input[c];
			const _s3 = output[c];
			for (let _n3 = 0; _n3 < _m3.length; ++_n3) {
				_s3[_n3] = _m3[_n3];
				if (this._z3[c] === 0) this._y3[c] = _m3[_n3];
				const _A3 = factor[_n3] !== undefined ? factor[_n3] : factor[0];
				++this._z3[c];
				this._z3[c] %= _A3;
				const _o3 = bypass[_n3] !== undefined ? bypass[_n3] : bypass[0];
				if (_o3 > 0.0) {
					continue;
				}
				let _B3 = this._y3[c];
				const _t3 = gain[_n3] !== undefined ? gain[_n3] : gain[0];
				_B3 *= _t3;
				_B3 = Math.max(Math.min(_B3, 1.0), -1.0);
				const _C3 =
					resolution[_n3] !== undefined ? resolution[_n3] : resolution[0];
				const max = _B3 > 0.0 ? _u3._v3[_C3] - 1 : _u3._v3[_C3];
				_B3 = Math.round(_B3 * max) / max;
				const _D3 = mix[_n3] !== undefined ? mix[_n3] : mix[0];
				_s3[_n3] *= 1.0 - _D3;
				_s3[_n3] += _B3 * _D3;
			}
		}
		return this._h3;
	}
}
registerProcessor("bitcrusher-processor", _u3);
class _E3 {
	constructor(_F3 = 1e-3) {
		this.setTime(_F3);
	}
	setTime(_F3) {
		this._G3 = Math.exp(-1 / (_F3 * sampleRate));
	}
	process(_H3, _I3) {
		return _H3 + this._G3 * (_I3 - _H3);
	}
}
class _J3 {
	constructor(_K3, _L3) {
		this._M3 = new _E3(_K3);
		this._N3 = new _E3(_L3);
		this._O3 = _K3;
		this._P3 = _L3;
	}
	_Q3(_F3) {
		if (_F3 === this._O3) return;
		this._M3.setTime(_F3);
		this._O3 = _F3;
	}
	_R3(_F3) {
		if (_F3 === this._P3) return;
		this._N3.setTime(_F3);
		this._P3 = _F3;
	}
	process(_H3, _I3) {
		if (_H3 > _I3) return this._M3.process(_H3, _I3);
		else return this._N3.process(_H3, _I3);
	}
}
class _S3 extends AudioWorkletProcessor {
	static get parameterDescriptors() {
		return [
			{
				name: "bypass",
				automationRate: "a-rate",
				defaultValue: 0,
				minValue: 0,
				maxValue: 1,
			},
			{
				name: "ingain",
				automationRate: "a-rate",
				defaultValue: 1,
				minValue: 0,
			},
			{
				name: "threshold",
				automationRate: "a-rate",
				defaultValue: 0.125,
				minValue: 1e-3,
				maxValue: 1,
			},
			{ name: "ratio", automationRate: "a-rate", defaultValue: 4, minValue: 1 },
			{
				name: "attack",
				automationRate: "a-rate",
				defaultValue: 0.05,
				minValue: 1e-3,
				maxValue: 1e-1,
			},
			{
				name: "release",
				automationRate: "a-rate",
				defaultValue: 0.25,
				minValue: 1e-2,
				maxValue: 1,
			},
			{
				name: "outgain",
				automationRate: "a-rate",
				defaultValue: 1,
				minValue: 0,
			},
		];
	}
	constructor(_T3) {
		super();
		this._g3();
		const _M3 = _S3.parameterDescriptors.find((_U3) => _U3.name === "attack");
		const _N3 = _S3.parameterDescriptors.find((_U3) => _U3.name === "release");
		this._V3 = new _J3(_M3.defaultValue, _N3.defaultValue);
		this._W3 = 0;
	}
	process(_X3, _Y3, _Z3) {
		const input = _X3[0];
		const output = _Y3[0];
		const bypass = _Z3.bypass;
		const ingain = _Z3.ingain;
		const outgain = _Z3.outgain;
		const threshold = _Z3.threshold;
		const ratio = _Z3.ratio;
		const attack = _Z3.attack;
		const release = _Z3.release;
		if (input.length === 0) return this._h3;
		for (let _n3 = 0; _n3 < input[0].length; ++_n3) {
			let frame = input.map((__3) => __3[_n3]);
			output.forEach((__3, _04) => {
				__3[_n3] = frame[_04];
			});
			const _14 = ingain[_n3] !== undefined ? ingain[_n3] : ingain[0];
			frame = frame.map((_24) => (_24 *= _14));
			const rect = frame.map((_24) => Math.abs(_24));
			const max = Math.max(...rect);
			const _34 = _44(max);
			const _54 = threshold[_n3] !== undefined ? threshold[_n3] : threshold[0];
			const _64 = _44(_54);
			const _74 = Math.max(0, _34 - _64);
			const _M3 = attack[_n3] !== undefined ? attack[_n3] : attack[0];
			const _N3 = release[_n3] !== undefined ? release[_n3] : release[0];
			this._V3._Q3(_M3);
			this._V3._R3(_N3);
			this._W3 = this._V3.process(_74, this._W3);
			const _o3 = bypass[_n3] !== undefined ? bypass[_n3] : bypass[0];
			if (_o3 > 0) continue;
			const _C3 = ratio[_n3] !== undefined ? ratio[_n3] : ratio[0];
			const _84 = this._W3 / _C3 - this._W3;
			const _t3 = _94(_84);
			frame = frame.map((_24) => (_24 *= _t3));
			const _a4 = outgain[_n3] !== undefined ? outgain[_n3] : outgain[0];
			frame = frame.map((_24) => (_24 *= _a4));
			output.forEach((__3, _04) => {
				__3[_n3] = frame[_04];
			});
		}
		return this._h3;
	}
}
function _44(_b4) {
	return 20 * Math.log10(_b4);
}
function _94(_b4) {
	return Math.pow(10, _b4 / 20);
}
registerProcessor("compressor-processor", _S3);
class _c4 extends AudioWorkletProcessor {
	static _d4 = 5.0;
	static get parameterDescriptors() {
		return [
			{
				name: "bypass",
				automationRate: "a-rate",
				defaultValue: 0,
				minValue: 0,
				maxValue: 1,
			},
			{
				name: "time",
				automationRate: "a-rate",
				defaultValue: 0.2,
				minValue: 0.0,
				maxValue: _c4._d4,
			},
			{
				name: "feedback",
				automationRate: "a-rate",
				defaultValue: 0.5,
				minValue: 0.0,
				maxValue: 1.0,
			},
			{
				name: "mix",
				automationRate: "a-rate",
				defaultValue: 0.35,
				minValue: 0.0,
				maxValue: 1.0,
			},
		];
	}
	constructor(_w3) {
		super();
		this._g3();
		const _x3 = _w3.outputChannelCount[0];
		const _e4 = _c4._d4 * sampleRate + 1;
		this.buffer = new Array(_x3);
		this._f4 = new Uint32Array(_x3);
		for (let c = 0; c < _x3; ++c) this.buffer[c] = new Float32Array(_e4);
	}
	process(_k3, _l3, parameters) {
		const input = _k3[0];
		const output = _l3[0];
		const bypass = parameters.bypass;
		const time = parameters.time;
		const feedback = parameters.feedback;
		const mix = parameters.mix;
		for (let c = 0; c < input.length; ++c) {
			const _m3 = input[c];
			const _s3 = output[c];
			for (let _n3 = 0; _n3 < _m3.length; ++_n3) {
				_s3[_n3] = _m3[_n3];
				const _54 = time[_n3] !== undefined ? time[_n3] : time[0];
				const _g4 = this._h4(c, _54);
				const _A3 = feedback[_n3] !== undefined ? feedback[_n3] : feedback[0];
				const _i4 = _m3[_n3] + _g4 * _A3;
				this.write(c, _i4);
				const _o3 = bypass[_n3] !== undefined ? bypass[_n3] : bypass[0];
				if (_o3 > 0.0) {
					continue;
				}
				const _D3 = mix[_n3] !== undefined ? mix[_n3] : mix[0];
				_s3[_n3] *= 1 - _D3;
				_s3[_n3] += _g4 * _D3;
			}
		}
		return this._h3;
	}
	_h4(_j4, _F3) {
		const _k4 = _F3 * sampleRate;
		let _l4 = this._f4[_j4] - ~~_k4;
		let _m4 = _l4 - 1;
		while (_l4 < 0) _l4 += this.buffer[_j4].length;
		while (_m4 < 0) _m4 += this.buffer[_j4].length;
		const frac = _k4 - ~~_k4;
		const _n4 = this.buffer[_j4][_l4];
		const _o4 = this.buffer[_j4][_m4];
		return _n4 + (_o4 - _n4) * frac;
	}
	write(_j4, _p4) {
		++this._f4[_j4];
		this._f4[_j4] %= this.buffer[_j4].length;
		this.buffer[_j4][this._f4[_j4]] = _p4;
	}
}
registerProcessor("delay-processor", _c4);
class _q4 extends AudioWorkletProcessor {
	static get parameterDescriptors() {
		return [];
	}
	constructor() {
		super();
		this._g3();
	}
	process(_r4, _s4, _t4) {
		const input = _r4[0];
		const _u4 = _s4[0];
		const _v4 = _s4[1];
		for (let c = 0; c < input.length; ++c) {
			const _m3 = input[c];
			const _w4 = _u4[c];
			const _x4 = _v4[c];
			for (let _n3 = 0; _n3 < _m3.length; ++_n3) {
				_w4[_n3] = _m3[_n3];
				_x4[_n3] = _m3[_n3];
			}
		}
		return this._h3;
	}
}
class _y4 extends AudioWorkletProcessor {
	static get parameterDescriptors() {
		return [
			{
				name: "bypass",
				automationRate: "a-rate",
				defaultValue: 0,
				minValue: 0,
				maxValue: 1,
			},
		];
	}
	constructor() {
		super();
		this._g3();
	}
	process(_r4, _s4, _t4) {
		const _q3 = _r4[0];
		const _r3 = _r4[1];
		const output = _s4[0];
		const bypass = _t4.bypass;
		for (let c = 0; c < _r3.length; ++c) {
			const _z4 = _q3[c];
			const _A4 = _r3[c];
			const _s3 = output[c];
			for (let _n3 = 0; _n3 < _z4.length; ++_n3) {
				const _o3 = bypass[_n3] !== undefined ? bypass[_n3] : bypass[0];
				if (_o3 > 0) {
					_s3[_n3] = _A4[_n3];
				} else {
					_s3[_n3] = _z4[_n3];
				}
			}
		}
		return this._h3;
	}
}
registerProcessor("eq-input", _q4);
registerProcessor("eq-output", _y4);
class _B4 extends AudioWorkletProcessor {
	static get parameterDescriptors() {
		return [
			{
				name: "bypass",
				automationRate: "a-rate",
				defaultValue: 0,
				minValue: 0,
				maxValue: 1,
			},
			{
				name: "gain",
				automationRate: "a-rate",
				defaultValue: 0.5,
				minValue: 0.0,
			},
		];
	}
	constructor() {
		super();
		this._g3();
	}
	process(_k3, _l3, parameters) {
		const input = _k3[0];
		const output = _l3[0];
		const bypass = parameters.bypass;
		const gain = parameters.gain;
		for (let c = 0; c < input.length; ++c) {
			const _m3 = input[c];
			const _s3 = output[c];
			for (let _n3 = 0; _n3 < _m3.length; ++_n3) {
				_s3[_n3] = _m3[_n3];
				const _o3 = bypass[_n3] !== undefined ? bypass[_n3] : bypass[0];
				if (_o3 > 0.0) {
					continue;
				}
				const _t3 = gain[_n3] !== undefined ? gain[_n3] : gain[0];
				_s3[_n3] *= _t3;
			}
		}
		return this._h3;
	}
}
registerProcessor("gain-processor", _B4);
class _C4 extends AudioWorkletProcessor {
	static get parameterDescriptors() {
		const _D4 = Math.min(sampleRate / 2.0, 20000.0);
		return [
			{
				name: "bypass",
				automationRate: "a-rate",
				defaultValue: 0,
				minValue: 0,
				maxValue: 1,
			},
			{
				name: "freq",
				automationRate: "a-rate",
				defaultValue: Math.min(5000.0, _D4),
				minValue: 10.0,
				maxValue: _D4,
			},
			{
				name: "q",
				automationRate: "a-rate",
				defaultValue: 1.0,
				minValue: 1.0,
				maxValue: 100.0,
			},
			{
				name: "gain",
				automationRate: "a-rate",
				defaultValue: 1e-2,
				minValue: 1e-6,
			},
		];
	}
	constructor(_w3) {
		super();
		this._g3();
		const _x3 = _w3.outputChannelCount[0];
		this._E4 = 0;
		this._F4 = 0;
		this._G4 = 0;
		this._H4 = 0;
		this._I4 = 0;
		this._J4 = new Float32Array(_x3);
		this._K4 = new Float32Array(_x3);
		this._L4 = new Float32Array(_x3);
		this._M4 = new Float32Array(_x3);
		this._N4 = -1;
		this._O4 = -1;
		this._P4 = -1;
	}
	process(_k3, _l3, parameters) {
		const input = _k3[0];
		const output = _l3[0];
		const bypass = parameters.bypass;
		const freq = parameters.freq;
		const q = parameters.q;
		const gain = parameters.gain;
		const _Q4 = freq.length === 1 && q.length === 1 && gain.length === 1;
		if (_Q4) this._R4(freq[0], q[0], gain[0]);
		for (let c = 0; c < input.length; ++c) {
			const _m3 = input[c];
			const _s3 = output[c];
			for (let _n3 = 0; _n3 < _m3.length; ++_n3) {
				if (_Q4 === false) {
					const _A3 = freq[_n3] !== undefined ? freq[_n3] : freq[0];
					const _S4 = q[_n3] !== undefined ? q[_n3] : q[0];
					const _t3 = gain[_n3] !== undefined ? gain[_n3] : gain[0];
					this._R4(_A3, _S4, _t3);
				}
				const _T4 =
					this._G4 * _m3[_n3] +
					this._H4 * this._J4[c] +
					this._I4 * this._K4[c] -
					this._E4 * this._L4[c] -
					this._F4 * this._M4[c];
				this._K4[c] = this._J4[c];
				this._J4[c] = _m3[_n3];
				this._M4[c] = this._L4[c];
				this._L4[c] = _T4;
				const _o3 = bypass[_n3] !== undefined ? bypass[_n3] : bypass[0];
				_s3[_n3] = _o3 > 0 ? _m3[_n3] : _T4;
			}
		}
		return this._h3;
	}
	_R4(_U4, _V4, _W4) {
		if (_U4 === this._N4 && _V4 === this._O4 && _W4 === this._P4) return;
		const _X4 = (2 * Math.PI * _U4) / sampleRate;
		const _Y4 = Math.cos(_X4);
		const _Z4 = Math.sqrt(_W4);
		const __4 = _Z4 + 1;
		const _05 = _Z4 - 1;
		const _15 = __4 * _Y4;
		const _25 = _05 * _Y4;
		const _35 = __4 - _25;
		const _45 = __4 + _25;
		const alpha = Math.sin(_X4) / (2 * _V4);
		const _55 = 2 * Math.sqrt(_Z4) * alpha;
		const _65 = _35 + _55;
		const _E4 = 2 * (_05 - _15);
		const _F4 = _35 - _55;
		const _G4 = _Z4 * (_45 + _55);
		const _H4 = -2 * _Z4 * (_05 + _15);
		const _I4 = _Z4 * (_45 - _55);
		this._E4 = _E4 / _65;
		this._F4 = _F4 / _65;
		this._G4 = _G4 / _65;
		this._H4 = _H4 / _65;
		this._I4 = _I4 / _65;
		this._N4 = _U4;
		this._O4 = _V4;
		this._P4 = _W4;
	}
}
registerProcessor("hi-shelf-processor", _C4);
class _75 extends AudioWorkletProcessor {
	static get parameterDescriptors() {
		const _85 = Math.min(sampleRate / 2.0, 20000.0);
		return [
			{
				name: "bypass",
				automationRate: "a-rate",
				defaultValue: 0,
				minValue: 0,
				maxValue: 1,
			},
			{
				name: "cutoff",
				automationRate: "a-rate",
				defaultValue: Math.min(1500.0, _85),
				minValue: 10.0,
				maxValue: _85,
			},
			{
				name: "q",
				automationRate: "a-rate",
				defaultValue: 1.5,
				minValue: 1.0,
				maxValue: 100.0,
			},
		];
	}
	constructor(_w3) {
		super();
		this._g3();
		const _x3 = _w3.outputChannelCount[0];
		this._E4 = 0;
		this._F4 = 0;
		this._G4 = 0;
		this._H4 = 0;
		this._I4 = 0;
		this._J4 = new Float32Array(_x3);
		this._K4 = new Float32Array(_x3);
		this._L4 = new Float32Array(_x3);
		this._M4 = new Float32Array(_x3);
		this._95 = -1;
		this._O4 = -1;
	}
	process(_k3, _l3, parameters) {
		const input = _k3[0];
		const output = _l3[0];
		const bypass = parameters.bypass;
		const cutoff = parameters.cutoff;
		const q = parameters.q;
		const _Q4 = cutoff.length === 1 && q.length === 1;
		if (_Q4) this._R4(cutoff[0], q[0]);
		for (let c = 0; c < input.length; ++c) {
			const _m3 = input[c];
			const _s3 = output[c];
			for (let _n3 = 0; _n3 < _m3.length; ++_n3) {
				if (_Q4 === false) {
					const c = cutoff[_n3] !== undefined ? cutoff[_n3] : cutoff[0];
					const _S4 = q[_n3] !== undefined ? q[_n3] : q[0];
					this._R4(c, _S4);
				}
				const _T4 =
					this._G4 * _m3[_n3] +
					this._H4 * this._J4[c] +
					this._I4 * this._K4[c] -
					this._E4 * this._L4[c] -
					this._F4 * this._M4[c];
				this._K4[c] = this._J4[c];
				this._J4[c] = _m3[_n3];
				this._M4[c] = this._L4[c];
				this._L4[c] = _T4;
				const _o3 = bypass[_n3] !== undefined ? bypass[_n3] : bypass[0];
				_s3[_n3] = _o3 > 0 ? _m3[_n3] : _T4;
			}
		}
		return this._h3;
	}
	_R4(_a5, _V4) {
		if (_a5 === this._95 && _V4 === this._O4) return;
		const _X4 = (2 * Math.PI * _a5) / sampleRate;
		const alpha = Math.sin(_X4) / (2 * _V4);
		const _Y4 = Math.cos(_X4);
		const _65 = 1 + alpha;
		const _E4 = -2 * _Y4;
		const _F4 = 1 - alpha;
		const _G4 = (1 + _Y4) / 2;
		const _H4 = -1 - _Y4;
		const _I4 = (1 + _Y4) / 2;
		this._E4 = _E4 / _65;
		this._F4 = _F4 / _65;
		this._G4 = _G4 / _65;
		this._H4 = _H4 / _65;
		this._I4 = _I4 / _65;
		this._95 = _a5;
		this._O4 = _V4;
	}
}
registerProcessor("hpf2-processor", _75);
class _b5 extends AudioWorkletProcessor {
	static get parameterDescriptors() {
		const _D4 = Math.min(sampleRate / 2.0, 20000.0);
		return [
			{
				name: "bypass",
				automationRate: "a-rate",
				defaultValue: 0,
				minValue: 0,
				maxValue: 1,
			},
			{
				name: "freq",
				automationRate: "a-rate",
				defaultValue: Math.min(500.0, _D4),
				minValue: 10.0,
				maxValue: _D4,
			},
			{
				name: "q",
				automationRate: "a-rate",
				defaultValue: 1.0,
				minValue: 1.0,
				maxValue: 100.0,
			},
			{
				name: "gain",
				automationRate: "a-rate",
				defaultValue: 1e-2,
				minValue: 1e-6,
			},
		];
	}
	constructor(_w3) {
		super();
		this._g3();
		const _x3 = _w3.outputChannelCount[0];
		this._E4 = 0;
		this._F4 = 0;
		this._G4 = 0;
		this._H4 = 0;
		this._I4 = 0;
		this._J4 = new Float32Array(_x3);
		this._K4 = new Float32Array(_x3);
		this._L4 = new Float32Array(_x3);
		this._M4 = new Float32Array(_x3);
		this._N4 = -1;
		this._O4 = -1;
		this._P4 = -1;
	}
	process(_k3, _l3, parameters) {
		const input = _k3[0];
		const output = _l3[0];
		const bypass = parameters.bypass;
		const freq = parameters.freq;
		const q = parameters.q;
		const gain = parameters.gain;
		const _Q4 = freq.length === 1 && q.length === 1 && gain.length === 1;
		if (_Q4) this._R4(freq[0], q[0], gain[0]);
		for (let c = 0; c < input.length; ++c) {
			const _m3 = input[c];
			const _s3 = output[c];
			for (let _n3 = 0; _n3 < _m3.length; ++_n3) {
				if (_Q4 === false) {
					const _A3 = freq[_n3] !== undefined ? freq[_n3] : freq[0];
					const _S4 = q[_n3] !== undefined ? q[_n3] : q[0];
					const _t3 = gain[_n3] !== undefined ? gain[_n3] : gain[0];
					this._R4(_A3, _S4, _t3);
				}
				const _T4 =
					this._G4 * _m3[_n3] +
					this._H4 * this._J4[c] +
					this._I4 * this._K4[c] -
					this._E4 * this._L4[c] -
					this._F4 * this._M4[c];
				this._K4[c] = this._J4[c];
				this._J4[c] = _m3[_n3];
				this._M4[c] = this._L4[c];
				this._L4[c] = _T4;
				const _o3 = bypass[_n3] !== undefined ? bypass[_n3] : bypass[0];
				_s3[_n3] = _o3 > 0 ? _m3[_n3] : _T4;
			}
		}
		return this._h3;
	}
	_R4(_U4, _V4, _W4) {
		if (_U4 === this._N4 && _V4 === this._O4 && _W4 === this._P4) return;
		const _X4 = (2 * Math.PI * _U4) / sampleRate;
		const _Y4 = Math.cos(_X4);
		const _Z4 = Math.sqrt(_W4);
		const __4 = _Z4 + 1;
		const _05 = _Z4 - 1;
		const _15 = __4 * _Y4;
		const _25 = _05 * _Y4;
		const _35 = __4 - _25;
		const _45 = __4 + _25;
		const alpha = Math.sin(_X4) / (2 * _V4);
		const _55 = 2 * Math.sqrt(_Z4) * alpha;
		const _65 = _45 + _55;
		const _E4 = -2 * (_05 + _15);
		const _F4 = _45 - _55;
		const _G4 = _Z4 * (_35 + _55);
		const _H4 = 2 * _Z4 * (_05 - _15);
		const _I4 = _Z4 * (_35 - _55);
		this._E4 = _E4 / _65;
		this._F4 = _F4 / _65;
		this._G4 = _G4 / _65;
		this._H4 = _H4 / _65;
		this._I4 = _I4 / _65;
		this._N4 = _U4;
		this._O4 = _V4;
		this._P4 = _W4;
	}
}
registerProcessor("lo-shelf-processor", _b5);
class _c5 extends AudioWorkletProcessor {
	static get parameterDescriptors() {
		const _85 = Math.min(sampleRate / 2.0, 20000.0);
		return [
			{
				name: "bypass",
				automationRate: "a-rate",
				defaultValue: 0,
				minValue: 0,
				maxValue: 1,
			},
			{
				name: "cutoff",
				automationRate: "a-rate",
				defaultValue: Math.min(500.0, _85),
				minValue: 10.0,
				maxValue: _85,
			},
			{
				name: "q",
				automationRate: "a-rate",
				defaultValue: 1.5,
				minValue: 1.0,
				maxValue: 100.0,
			},
		];
	}
	constructor(_w3) {
		super();
		this._g3();
		const _x3 = _w3.outputChannelCount[0];
		this._E4 = 0;
		this._F4 = 0;
		this._G4 = 0;
		this._H4 = 0;
		this._I4 = 0;
		this._J4 = new Float32Array(_x3);
		this._K4 = new Float32Array(_x3);
		this._L4 = new Float32Array(_x3);
		this._M4 = new Float32Array(_x3);
		this._95 = -1;
		this._O4 = -1;
	}
	process(_k3, _l3, parameters) {
		const input = _k3[0];
		const output = _l3[0];
		const bypass = parameters.bypass;
		const cutoff = parameters.cutoff;
		const q = parameters.q;
		const _Q4 = cutoff.length === 1 && q.length === 1;
		if (_Q4) this._R4(cutoff[0], q[0]);
		for (let c = 0; c < input.length; ++c) {
			const _m3 = input[c];
			const _s3 = output[c];
			for (let _n3 = 0; _n3 < _m3.length; ++_n3) {
				if (_Q4 === false) {
					const c = cutoff[_n3] !== undefined ? cutoff[_n3] : cutoff[0];
					const _S4 = q[_n3] !== undefined ? q[_n3] : q[0];
					this._R4(c, _S4);
				}
				const _T4 =
					this._G4 * _m3[_n3] +
					this._H4 * this._J4[c] +
					this._I4 * this._K4[c] -
					this._E4 * this._L4[c] -
					this._F4 * this._M4[c];
				this._K4[c] = this._J4[c];
				this._J4[c] = _m3[_n3];
				this._M4[c] = this._L4[c];
				this._L4[c] = _T4;
				const _o3 = bypass[_n3] !== undefined ? bypass[_n3] : bypass[0];
				_s3[_n3] = _o3 > 0 ? _m3[_n3] : _T4;
			}
		}
		return this._h3;
	}
	_R4(_a5, _V4) {
		if (_a5 === this._95 && _V4 === this._O4) return;
		const _X4 = (2 * Math.PI * _a5) / sampleRate;
		const alpha = Math.sin(_X4) / (2 * _V4);
		const _Y4 = Math.cos(_X4);
		const _65 = 1 + alpha;
		const _E4 = -2 * _Y4;
		const _F4 = 1 - alpha;
		const _G4 = (1 - _Y4) / 2;
		const _H4 = 1 - _Y4;
		const _I4 = (1 - _Y4) / 2;
		this._E4 = _E4 / _65;
		this._F4 = _F4 / _65;
		this._G4 = _G4 / _65;
		this._H4 = _H4 / _65;
		this._I4 = _I4 / _65;
		this._95 = _a5;
		this._O4 = _V4;
	}
}
registerProcessor("lpf2-processor", _c5);
class _d5 extends AudioWorkletProcessor {
	static get parameterDescriptors() {
		const _D4 = Math.min(sampleRate / 2.0, 20000.0);
		return [
			{
				name: "bypass",
				automationRate: "a-rate",
				defaultValue: 0,
				minValue: 0,
				maxValue: 1,
			},
			{
				name: "freq",
				automationRate: "a-rate",
				defaultValue: Math.min(1500.0, _D4),
				minValue: 10.0,
				maxValue: _D4,
			},
			{
				name: "q",
				automationRate: "a-rate",
				defaultValue: 1.0,
				minValue: 1.0,
				maxValue: 100.0,
			},
			{
				name: "gain",
				automationRate: "a-rate",
				defaultValue: 1e-2,
				minValue: 1e-6,
			},
		];
	}
	constructor(_w3) {
		super();
		this._g3();
		const _x3 = _w3.outputChannelCount[0];
		this._E4 = 0;
		this._F4 = 0;
		this._G4 = 0;
		this._H4 = 0;
		this._I4 = 0;
		this._J4 = new Float32Array(_x3);
		this._K4 = new Float32Array(_x3);
		this._L4 = new Float32Array(_x3);
		this._M4 = new Float32Array(_x3);
		this._N4 = -1;
		this._O4 = -1;
		this._P4 = -1;
	}
	process(_k3, _l3, parameters) {
		const input = _k3[0];
		const output = _l3[0];
		const bypass = parameters.bypass;
		const freq = parameters.freq;
		const q = parameters.q;
		const gain = parameters.gain;
		const _Q4 = freq.length === 1 && q.length === 1 && gain.length === 1;
		if (_Q4) this._R4(freq[0], q[0], gain[0]);
		for (let c = 0; c < input.length; ++c) {
			const _m3 = input[c];
			const _s3 = output[c];
			for (let _n3 = 0; _n3 < _m3.length; ++_n3) {
				if (_Q4 === false) {
					const _A3 = freq[_n3] !== undefined ? freq[_n3] : freq[0];
					const _S4 = q[_n3] !== undefined ? q[_n3] : q[0];
					const _t3 = gain[_n3] !== undefined ? gain[_n3] : gain[0];
					this._R4(_A3, _S4, _t3);
				}
				const _T4 =
					this._G4 * _m3[_n3] +
					this._H4 * this._J4[c] +
					this._I4 * this._K4[c] -
					this._E4 * this._L4[c] -
					this._F4 * this._M4[c];
				this._K4[c] = this._J4[c];
				this._J4[c] = _m3[_n3];
				this._M4[c] = this._L4[c];
				this._L4[c] = _T4;
				const _o3 = bypass[_n3] !== undefined ? bypass[_n3] : bypass[0];
				_s3[_n3] = _o3 > 0 ? _m3[_n3] : _T4;
			}
		}
		return this._h3;
	}
	_R4(_U4, _V4, _W4) {
		if (_U4 === this._N4 && _V4 === this._O4 && _W4 === this._P4) return;
		const _X4 = (2 * Math.PI * _U4) / sampleRate;
		const _Y4 = Math.cos(_X4);
		const _Z4 = Math.sqrt(_W4);
		const alpha = Math.sin(_X4) / (2 * _V4);
		const _e5 = alpha / _Z4;
		const _f5 = alpha * _Z4;
		const _65 = 1 + _e5;
		const _E4 = -2 * _Y4;
		const _F4 = 1 - _e5;
		const _G4 = 1 + _f5;
		const _H4 = _E4;
		const _I4 = 1 - _f5;
		this._E4 = _E4 / _65;
		this._F4 = _F4 / _65;
		this._G4 = _G4 / _65;
		this._H4 = _H4 / _65;
		this._I4 = _I4 / _65;
		this._N4 = _U4;
		this._O4 = _V4;
		this._P4 = _W4;
	}
}
registerProcessor("peak-eq-processor", _d5);
class _g5 {
	constructor(_h5) {
		this._i5 = 0;
		this._j5 = 0;
		this.feedback = 0;
		this._k5 = 0;
		this.buffer = new Float32Array(_h5);
		this._l5 = 0;
	}
	process(_p4) {
		const out = this.buffer[this._l5];
		this._k5 = this._k5 * this._i5 + out * this._j5;
		this.buffer[this._l5] = _p4 + this._k5 * this.feedback;
		++this._l5;
		this._l5 %= this.buffer.length;
		return out;
	}
	_m5(_n5) {
		this.feedback = Math.min(Math.max(0, _n5), 1);
	}
	_o5(_p5) {
		this._i5 = Math.min(Math.max(0, _p5), 1);
		this._j5 = 1 - this._i5;
	}
}
class _q5 {
	constructor(_h5) {
		this.feedback = 0;
		this.buffer = new Float32Array(_h5);
		this._l5 = 0;
	}
	process(_p4) {
		const out = this.buffer[this._l5];
		this.buffer[this._l5] = _p4 + out * this.feedback;
		++this._l5;
		this._l5 %= this.buffer.length;
		return out - _p4;
	}
	_m5(_n5) {
		this.feedback = Math.min(Math.max(0, _n5), 1);
	}
}
class _r5 extends AudioWorkletProcessor {
	static _s5 = 8;
	static _t5 = 4;
	static _u5 = 0.015;
	static _v5 = 0.4;
	static _w5 = 0.28;
	static _x5 = 0.7;
	static _y5 = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];
	static _z5 = [1139, 1211, 1300, 1379, 1445, 1514, 1580, 1640];
	static _A5 = [556, 441, 341, 225];
	static _B5 = [579, 464, 364, 248];
	static get parameterDescriptors() {
		return [
			{
				name: "bypass",
				automationRate: "a-rate",
				defaultValue: 0,
				minValue: 0,
				maxValue: 1,
			},
			{
				name: "size",
				automationRate: "a-rate",
				defaultValue: 0.7,
				minValue: 0.0,
				maxValue: 1.0,
			},
			{
				name: "damp",
				automationRate: "a-rate",
				defaultValue: 0.1,
				minValue: 0.0,
				maxValue: 1.0,
			},
			{
				name: "mix",
				automationRate: "a-rate",
				defaultValue: 0.35,
				minValue: 0.0,
				maxValue: 1.0,
			},
		];
	}
	constructor(_w3) {
		super();
		this._g3();
		const _x3 = _w3.outputChannelCount[0];
		this._C5 = -1;
		this._D5 = -1;
		this._E5 = new Array(_x3);
		this._F5 = new Array(_x3);
		const _G5 = [_r5._y5, _r5._z5];
		const _H5 = [_r5._A5, _r5._B5];
		for (let c = 0; c < _x3; ++c) {
			this._E5[c] = new Array(_r5._s5);
			this._F5[c] = new Array(_r5._t5);
			for (let i = 0; i < _r5._s5; ++i)
				this._E5[c][i] = new _g5(_G5[c % _G5.length][i]);
			for (let i = 0; i < _r5._t5; ++i)
				this._F5[c][i] = new _q5(_H5[c % _H5.length][i]);
		}
		this._I5(0.5);
		this._o5(0.5);
		for (let c = 0; c < _x3; ++c)
			for (let i = 0; i < _r5._t5; ++i) this._F5[c][i]._m5(0.5);
	}
	process(_k3, _l3, parameters) {
		const input = _k3[0];
		const output = _l3[0];
		const bypass = parameters.bypass;
		const size = parameters.size;
		const damp = parameters.damp;
		const mix = parameters.mix;
		for (let c = 0; c < input.length; ++c) {
			const _m3 = input[c];
			const _s3 = output[c];
			for (let _J5 = 0; _J5 < _m3.length; ++_J5) {
				const _n3 = size[_J5] !== undefined ? size[_J5] : size[0];
				const _K5 = damp[_J5] !== undefined ? damp[_J5] : damp[0];
				this._I5(_n3);
				this._o5(_K5);
				_s3[_J5] = _m3[_J5];
				let out = 0;
				const _B3 = _m3[_J5] * _r5._u5;
				for (let i = 0; i < _r5._s5; ++i) out += this._E5[c][i].process(_B3);
				for (let i = 0; i < _r5._t5; ++i) out = this._F5[c][i].process(out);
				const _o3 = bypass[_J5] !== undefined ? bypass[_J5] : bypass[0];
				if (_o3 > 0.0) {
					continue;
				}
				const _D3 = mix[_J5] !== undefined ? mix[_J5] : mix[0];
				_s3[_J5] *= 1 - _D3;
				_s3[_J5] += out * _D3;
			}
		}
		return this._h3;
	}
	_I5(_h5) {
		if (_h5 === this._C5) return;
		const size = _h5 * _r5._w5 + _r5._x5;
		for (let c = 0; c < this._E5.length; ++c)
			for (let i = 0; i < _r5._s5; ++i) this._E5[c][i]._m5(size);
		this._C5 = _h5;
	}
	_o5(_p5) {
		if (_p5 === this._D5) return;
		const damp = _p5 * _r5._v5;
		for (let c = 0; c < this._E5.length; ++c)
			for (let i = 0; i < _r5._s5; ++i) this._E5[c][i]._o5(damp);
		this._D5 = _p5;
	}
}
registerProcessor("reverb1-processor", _r5);
class _L5 extends AudioWorkletProcessor {
	static get parameterDescriptors() {
		return [
			{
				name: "bypass",
				automationRate: "a-rate",
				defaultValue: 0,
				minValue: 0,
				maxValue: 1,
			},
			{
				name: "rate",
				automationRate: "a-rate",
				defaultValue: 5.0,
				minValue: 0.0,
				maxValue: 20.0,
			},
			{
				name: "intensity",
				automationRate: "a-rate",
				defaultValue: 1.0,
				minValue: 0.0,
				maxValue: 1.0,
			},
			{
				name: "offset",
				automationRate: "a-rate",
				defaultValue: 0.0,
				minValue: 0.0,
				maxValue: 1.0,
			},
			{
				name: "shape",
				automationRate: "a-rate",
				defaultValue: 0,
				minValue: 0,
				maxValue: 4,
			},
		];
	}
	constructor(_w3) {
		super();
		this._g3();
		const _x3 = _w3.outputChannelCount[0];
		this._M5 = new Array(_x3).fill(1.0);
		this._N5 = new Array(_x3).fill(0.0);
		this._O5 = new Array(_x3).fill(_P5._Q5._R5);
		this._S5 = new Array(_x3);
		for (let c = 0; c < _x3; ++c) {
			this._S5[c] = new _T5();
			this._S5[c]._U5(sampleRate);
			this._S5[c]._V5(this._M5[c]);
			this._S5[c]._W5(this._O5[c]);
			if (c % 2 === 1) {
				this._S5[c]._X5(this._N5[c]);
			}
		}
	}
	process(_k3, _l3, parameters) {
		const input = _k3[0];
		const output = _l3[0];
		const bypass = parameters.bypass;
		const rate = parameters.rate;
		const intensity = parameters.intensity;
		const offset = parameters.offset;
		const shape = parameters.shape;
		for (let c = 0; c < input.length; ++c) {
			const _m3 = input[c];
			const _s3 = output[c];
			for (let _n3 = 0; _n3 < _m3.length; ++_n3) {
				_s3[_n3] = _m3[_n3];
				const _C3 = rate[_n3] !== undefined ? rate[_n3] : rate[0];
				const _Y5 = offset[_n3] !== undefined ? offset[_n3] : offset[0];
				const _Z5 = shape[_n3] !== undefined ? shape[_n3] : shape[0];
				this.__5(c, _C3, _Y5, _Z5);
				const _06 = this._S5[c]._h4();
				const _o3 = bypass[_n3] !== undefined ? bypass[_n3] : bypass[0];
				if (_o3 > 0.0) {
					continue;
				}
				const i = intensity[_n3] !== undefined ? intensity[_n3] : intensity[0];
				const out = _m3[_n3] * _06 * i;
				_s3[_n3] *= 1.0 - i;
				_s3[_n3] += out;
			}
		}
		return this._h3;
	}
	__5(_j4, _16, _26, _36) {
		if (_16 !== this._M5[_j4]) {
			this._S5[_j4]._V5(_16);
			this._M5[_j4] = _16;
		}
		if (_26 !== this._N5[_j4]) {
			if (_j4 % 2 === 1) {
				this._S5[_j4]._X5(_26);
			}
			this._N5[_j4] = _26;
		}
		if (_36 !== this._O5[_j4]) {
			this._S5[_j4]._W5(_36);
			this._O5[_j4] = _36;
		}
	}
}
registerProcessor("tremolo-processor", _L5);
function _P5() {}
_P5._Q5 = { _R5: 0, _46: 1, _56: 2, _66: 3, _76: 4, _86: 5 };
_P5._96 = function (_a6) {
	return 1.0 - _a6;
};
_P5._b6 = function (_a6) {
	return _a6;
};
_P5._c6 = function (_a6) {
	return 0.5 * (Math.sin(_a6 * 2.0 * Math.PI - Math.PI / 2.0) + 1.0);
};
_P5._d6 = function (_a6) {
	if (_a6 < 0.5) {
		return 0.0;
	}
	return 1.0;
};
_P5._e6 = function (_a6) {
	if (_a6 < 0.5) {
		return 2.0 * _a6;
	}
	return 2.0 - 2.0 * _a6;
};
_P5._f6 = [_P5._96, _P5._b6, _P5._c6, _P5._d6, _P5._e6];
_g6._h6 = 512;
_g6._i6 = 1.0 / _g6._h6;
function _g6(_j6) {
	this.data = new Float32Array(_g6._h6);
	for (let i = 0; i < _g6._h6; ++i) {
		this.data[i] = _j6(i * _g6._i6);
	}
}
_g6.prototype._h4 = function (_a6) {
	_a6 = Math.max(0.0, _a6);
	_a6 = Math.min(_a6, 1.0);
	const _k6 = _a6 * _g6._h6;
	const _l6 = ~~_k6;
	const _m6 = _k6 - _l6;
	let _l4 = _l6;
	let _m4 = _l4 + 1;
	if (_l4 >= _g6._h6) {
		_l4 -= _g6._h6;
	}
	if (_m4 >= _g6._h6) {
		_m4 -= _g6._h6;
	}
	const _n4 = this.data[_l4];
	const _o4 = this.data[_m4];
	return _n4 + (_o4 - _n4) * _m6;
};
_T5._n6 = [];
_T5._o6 = false;
_T5._p6 = 0.0;
_T5._D4 = 20.0;
function _T5() {
	this._q6 = 48000;
	this.shape = _P5._Q5._56;
	this.freq = 1.0;
	this._r6 = 0.0;
	this._i6 = 0.0;
	this._s6 = 0.0;
	if (_T5._o6 == true) {
		return;
	}
	for (let i = 0; i < _P5._Q5._86; ++i) {
		_T5._n6[i] = new _g6(_P5._f6[i]);
	}
	_T5._o6 = true;
}
_T5._t6 = function () {
	return _T5._o6 == true;
};
_T5.prototype._U5 = function (_u6) {
	this._q6 = _u6;
	this._v6();
};
_T5.prototype._V5 = function (_U4) {
	_U4 = Math.max(_T5._p6, _U4);
	_U4 = Math.min(_U4, _T5._D4);
	this.freq = _U4;
	this._v6();
};
_T5.prototype._X5 = function (_26) {
	_26 = Math.max(0.0, _26);
	_26 = Math.min(_26, 1.0);
	const _w6 = _26 - this._s6;
	this._s6 = _26;
	this._r6 += _w6;
	while (this._r6 >= 1.0) {
		this._r6 -= 1.0;
	}
	while (this._r6 < 0.0) {
		this._r6 += 1.0;
	}
};
_T5.prototype._W5 = function (_36) {
	_36 = Math.max(0, _36);
	_36 = Math.min(_36, _P5._Q5._86 - 1);
	this.shape = _36;
};
_T5.prototype._h4 = function () {
	const result = _T5._n6[this.shape]._h4(this._r6);
	this._r6 += this._i6;
	while (this._r6 >= 1.0) {
		this._r6 -= 1.0;
	}
	return result;
};
_T5.prototype._v6 = function () {
	this._i6 = this.freq / this._q6;
};
