/**
 * Automatically generated clock signal.
 */
const clock = {
	/**
	 * The number of clock cycles to generate.
	 */
	cycles: 8,

	/**
	 * The length of each clock cycle in ticks.
	 */
	length: 4,

	/**
	 * The length of the off time between each clock cycle in ticks.
	 */
	offTime: 10,

	/**
	 * Offset of the first clock cycle in ticks.
	 */
	offset: 4,

	/**
	 * Returns the tick when the `n`th clock cycle occurs. `n` is zero-indexed.
	 * @param {number} n
	 */
	tickAtCycle(n) {
		return this.offset + (this.length + this.offTime) * n;
	},
};

/**
 * Given an array of tick times, returns a new array where each element is the difference between the current element and the previous element.
 * @param {Array<number>} arr
 */
function diff(arr) {
	return arr.map((cur, i) => i === 0 ? cur : cur - arr[i - 1]);
}

const register = {
	headlights: 0,
	D1: 0,
	D2: 0,
	D3: 0,
	D4: 0,
	'left indicator': 0,
	'right indicator': 0,
	'windshield wipers': 0,
};

/**
 * User-made signals.
 */
const signals = {
	'I/O enable': {
		startSignal: 1,
		timing: [],
	},
	B3: {
		startSignal: 1,
		timing: diff([
			clock.tickAtCycle(2),
			clock.tickAtCycle(4),
			clock.tickAtCycle(5),
			clock.tickAtCycle(6),
			clock.tickAtCycle(7),
		]),
	},
	B2: {
		startSignal: 0,
		timing: diff([
			clock.tickAtCycle(4),
			clock.tickAtCycle(5),
			clock.tickAtCycle(7),
		]),
	},
	B1: {
		startSignal: 1,
		timing: diff([
			clock.tickAtCycle(1),
			clock.tickAtCycle(2),
			clock.tickAtCycle(3),
			clock.tickAtCycle(4),
			clock.tickAtCycle(6),
			clock.tickAtCycle(7),
		]),
	},
	B0: {
		startSignal: 0,
		timing: diff([
			clock.tickAtCycle(1),
			clock.tickAtCycle(4),
			clock.tickAtCycle(6),
			clock.tickAtCycle(7),
		]),
	},
	headlights: signalValues => {
		const {B3, B2, B1, B0} = signalValues;
		const correctNumber = !B2 && !B1 && !B0;
		const left = correctNumber && B3;
		const right = !correctNumber && register.headlights;
		const out = left || right;
		register.headlights = out;
		return out;
	},
	D1: signalValues => {
		const {B3, B2, B1, B0} = signalValues;
		const correctNumber = !B2 && !B1 && B0;
		const left = correctNumber && B3;
		const right = !correctNumber && register.D1;
		const out = left || right;
		register.D1 = out;
		return out;
	},
	D2: signalValues => {
		const {B3, B2, B1, B0} = signalValues;
		const correctNumber = !B2 && B1 && !B0;
		const left = correctNumber && B3;
		const right = !correctNumber && register.D2;
		const out = left || right;
		register.D2 = out;
		return out;
	},
	D3: signalValues => {
		const {B3, B2, B1, B0} = signalValues;
		const correctNumber = !B2 && B1 && B0;
		const left = correctNumber && B3;
		const right = !correctNumber && register.D3;
		const out = left || right;
		register.D3 = out;
		return out;
	},
	D4: signalValues => {
		const {B3, B2, B1, B0} = signalValues;
		const correctNumber = B2 && !B1 && !B0;
		const left = correctNumber && B3;
		const right = !correctNumber && register.D4;
		const out = left || right;
		register.D4 = out;
		return out;
	},
	'left indicator': signalValues => {
		const {B3, B2, B1, B0} = signalValues;
		const correctNumber = B2 && !B1 && B0;
		const left = correctNumber && B3;
		const right = !correctNumber && register['left indicator'];
		const out = left || right;
		register['left indicator'] = out;
		return out;
	},
	'right indicator': signalValues => {
		const {B3, B2, B1, B0} = signalValues;
		const correctNumber = B2 && B1 && !B0;
		const left = correctNumber && B3;
		const right = !correctNumber && register['right indicator'];
		const out = left || right;
		register['right indicator'] = out;
		return out;
	},
	'windshield wipers': signalValues => {
		const {B3, B2, B1, B0} = signalValues;
		const correctNumber = B2 && B1 && B0;
		const left = correctNumber && B3;
		const right = !correctNumber && register['windshield wipers'];
		const out = left || right;
		register['windshield wipers'] = out;
		return out;
	},
};

/**
 * Generates the data for the timing diagram; does not draw it yet.
 *
 * The result is an object where each property is a signal name, and the value is an array of integers. Each successive integer represents a tick, and the value of the integer is the state of the signal at that tick.
 *
 * The state of a signal is 0 if it is low / off, and 1 if it is high / on.
 *
 * The first tick is tick 0.
 */
function doTime() {
	/**
	 * @type {Object<string, Array<number>>}
	 */
	const out = {clock: []};
	/**
	 * @type {Object<string, UserState>}
	 */
	const userStates = {};

	/**
	 * State machine for the clock signal.
	 */
	const clockState = {
		/**
		 * The current state. Is one of:
		 *
		 * - 'length'
		 * - 'offTime'
		 * - 'offset'
		 */
		state: 'offset',

		/**
		 * Progress to transitioning to the next state.
		 */
		time: clock.offset,

		/**
		 * Generate the next signal.
		 */
		next() {
			const nextState = {
				offset: 'length',
				length: 'offTime',
				offTime: 'length',
			};

			--this.time;

			switch (this.state) {
				case 'length':
					var out = 1;
					break;

				case 'offTime':
					var out = 0;
					break;

				case 'offset':
					var out = 0;
					break;
			}

			if (this.time === 0) {
				// transition to next state
				this.state = nextState[this.state];
				this.time = clock[this.state];
			}

			return out;
		},
	};

	/**
	 * State machine for a user-made signal containing timing data.
	 */
	class UserState {
		/**
		 * @param {{startSignal: number, timing: Array<number>}} data Initial data for the state machine.
		 */
		constructor(data) {
			this.startSignal = data.startSignal;
			this.timing = data.timing;

			/**
			 * The signal to output.
			 */
			this.signal = this.startSignal;

			/**
			 * The current state.
			 */
			this.timingIndex = 0;

			/**
			 * Progress to transitioning to the next state.
			 */
			this.time = this.timing[this.timingIndex];
		}

		/**
		 * Generate the next signal.
		 */
		next() {
			--this.time;

			const out = this.signal;

			if (this.time === 0) {
				// transition to next state
				++this.timingIndex;
				this.time = this.timing[this.timingIndex];
				this.signal = 1 - this.signal;
			}

			return out;
		}
	}

	/**
	 * State machine for a user-made signal that is a function of other signals.
	 */
	class UserStateFunction {
		/**
		 * @param {string} signal The signal name, used to ignore the signal when generating the signal states for the `next` function.
		 * @param {function(Object<string, boolean>): boolean} fn The function that generates the signal, based on the current states of other preceding signals.
		 */
		constructor(signal, fn) {
			this.signal = signal;
			this.fn = fn;
		}

		/**
		 * Generate the next signal. The `tick` parameter is needed to acquire the current state of the other signals.
		 *
		 * It should be noted that the signal states provided to the function are based on the states that have been generated so far. If the function needs the state of a signal placed after this signal, it will not have access to it.
		 * @param {number} tick
		 */
		next(tick) {
			const signalStates = {};
			for (const signal in signals) {
				if (signal === this.signal) continue;
				signalStates[signal] = !!out[signal][tick];
			}

			return this.fn(signalStates);
		}
	}

	const maxTick = clock.cycles * (clock.length + clock.offTime) + clock.offset;

	// generate initial user data
	for (const userSignal in signals) {
		if (typeof signals[userSignal] === 'function') {
			userStates[userSignal] = new UserStateFunction(userSignal, signals[userSignal]);
		} else {
			userStates[userSignal] = new UserState(signals[userSignal]);
		}

		out[userSignal] = [];
	}

	for (let tick = 0; tick < maxTick; ++tick) {
		// generate the clock signal
		out.clock.push(clockState.next());

		// generate user-made signals
		for (const userSignal in signals) {
			out[userSignal].push(userStates[userSignal].next(tick));
		}
	}

	return out;
}

/**
 * Generates the timing diagram for the given object, where the keys represent signal names, and the values represent the signal strengths at each tick.
 * @param {Object<string, Array<number>>} timing
 */
function generateDiagram(timing) {
	const numSignals = Object.keys(timing).length;

	// width is based on longest signal name and number of ticks
	const longestSignalLen = Object.keys(timing).reduce((acc, cur) => Math.max(acc, cur.length), 0);
	const width = longestSignalLen
		+ Object.values(timing).reduce((acc, cur) => Math.max(acc, cur.length), 0)
		+ 4; // space between signal name and tick diagram

	// 3 lines for each signal, with 1 line of padding in between each
	const height = numSignals * 4 - 1;

	const canvas = new Array(height)
		.fill('') // this one doesn't matter
		.map(_ => new Array(width).fill(' '));

	/**
	 * Returns `true` if the point (y, x) is within the bounds of the canvas.
	 * @param {number} y
	 * @param {number} x
	 */
	function isInBounds(y, x) {
		return y >= 0 && y <= height - 1 && x >= 0 && x <= width - 1;
	}

	/**
	 * Writes a character to the canvas at (y, x). An error is thrown if the point is out of bounds.
	 * @param {number} y
	 * @param {number} x
	 * @param {string} char
	 */
	function writeOne(y, x, char) {
		if (!isInBounds(y, x)) {
			throw new Error(`could not write '${char}' at (y, x) = (${y}, ${x}): point is out of bounds`);
		}

		canvas[y][x] = char;
	}

	/**
	 * Writes a string to the canvas at (y, x), beginning at (y, x), and moving to the right. An error is thrown if the point is out of bounds, or if the string would exceed the canvas width.
	 * @param {number} y
	 * @param {number} x
	 * @param {string} str
	 */
	function writeHorizontal(y, x, str) {
		if (!isInBounds(y, x)) {
			throw new Error(`could not write '${str}' at (y, x) = (${y}, ${x}): point is out of bounds`);
		}
		if (x + str.length > width) {
			throw new Error(`could not write '${str}' at (y, x) = (${y}, ${x}): would exceed canvas width`);
		}

		for (let i = x; i < x + str.length; ++i) {
			canvas[y][i] = str[i - x];
		}
	}

	/**
	 * Abstraction of a pen that draws the timing diagram.
	 */
	class Pen {
		/**
		 * @param {number} y Y-coordinate of the pen's initial position.
		 * @param {number} x X-coordinate of the pen's initial position.
		 */
		constructor(y, x) {
			this.previous = {y: null, x: null};
			this.current = {y, x};
			this.draw(y, x);
		}

		/**
		 * Move the pen to (y, x) and draw there.
		 * @param {number} y
		 * @param {number} x
		 */
		draw(y, x) {
			this.current = {y, x};

			if (this.previous.y === null || this.previous.x === null) {
				// first time drawing: draw '-'
				writeOne(this.current.y, this.current.x, '-');
			} else {
				if (this.current.y === this.previous.y) {
					// moving horizontally, draw '-'
					writeOne(this.current.y, this.current.x, '-');
				} else if (this.current.y < this.previous.y) {
					// moving up, draw '+-----+'
					writeOne(this.previous.y, this.current.x, '+');
					for (let i = this.previous.y - 1; i - this.current.y; --i) {
						writeOne(i, this.current.x, '|');
					}
					writeOne(this.current.y, this.current.x, '+');
				} else if (this.current.y > this.previous.y) {
					// moving down, draw '+-----+'
					writeOne(this.previous.y, this.current.x, '+');
					for (let i = this.previous.y + 1; i < this.current.y; ++i) {
						writeOne(i, this.current.x, '|');
					}
					writeOne(this.current.y, this.current.x, '+');
				}
			}

			this.previous = Object.assign({}, this.current);
		}
	}

	let row = 0;

	for (const signal in timing) {
		const middleRow = row * 4 + 1;
		const diagramStart = longestSignalLen + 4;

		// write signal name in signal's 2nd row
		writeHorizontal(middleRow, 0, signal);

		// write indicator for 0 and 1 signal
		writeOne(middleRow - 1, diagramStart - 2, '1');
		writeOne(middleRow + 1, diagramStart - 2, '0');

		function getOffset(strength) {
			return 2 * strength - 1;
		}

		const strengths = timing[signal];

		// init pen at first strength point
		const pen = new Pen(middleRow - getOffset(strengths[0]), diagramStart);
		for (let i = 1; i < strengths.length; ++i) {
			pen.draw(middleRow - getOffset(strengths[i]), diagramStart + i);
		}

		++row;
	}

	return canvas.map(row => row.join('').trimEnd()).join('\n');
}

console.log('```');
console.log(generateDiagram(doTime()));
console.log('```');
