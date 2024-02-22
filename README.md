# timing-diagram-generator

Generates ASCII timing diagrams for a circuit.

## Example

Make sure your terminal / window is wide enough:

```
                   1     +---+         +---+         +---+         +---+         +---+         +---+         +---+         +---+         
clock                    |   |         |   |         |   |         |   |         |   |         |   |         |   |         |   |         
                   0 ----+   +---------+   +---------+   +---------+   +---------+   +---------+   +---------+   +---------+   +---------
                                                                                                                                         
                   1 --------------------------------------------------------------------------------------------------------------------
I/O enable                                                                                                                               
                   0                                                                                                                     
                                                                                                                                         
                   1 --------------------------------+                           +-------------+             +-------------+             
B3                                                   |                           |             |             |             |             
                   0                                 +---------------------------+             +-------------+             +-------------
                                                                                                                                         
                   1                                                             +-------------+                           +-------------
B2                                                                               |             |                           |             
                   0 ------------------------------------------------------------+             +---------------------------+             
                                                                                                                                         
                   1 ------------------+             +-------------+             +---------------------------+             +-------------
B1                                     |             |             |             |                           |             |             
                   0                   +-------------+             +-------------+                           +-------------+             
                                                                                                                                         
                   1                   +-----------------------------------------+                           +-------------+             
B0                                     |                                         |                           |             |             
                   0 ------------------+                                         +---------------------------+             +-------------
                                                                                                                                         
                   1                                                                                                                     
headlights                                                                                                                               
                   0 --------------------------------------------------------------------------------------------------------------------
                                                                                                                                         
                   1                   +-------------+                                                       +-------------+             
D1                                     |             |                                                       |             |             
                   0 ------------------+             +-------------------------------------------------------+             +-------------
                                                                                                                                         
                   1 ------------------+                                                                                                 
D2                                     |                                                                                                 
                   0                   +-------------------------------------------------------------------------------------------------
                                                                                                                                         
                   1                                                                                                                     
D3                                                                                                                                       
                   0 --------------------------------------------------------------------------------------------------------------------
                                                                                                                                         
                   1                                                                                                                     
D4                                                                                                                                       
                   0 --------------------------------------------------------------------------------------------------------------------
                                                                                                                                         
                   1                                                                                                                     
left indicator                                                                                                                           
                   0 --------------------------------------------------------------------------------------------------------------------
                                                                                                                                         
                   1                                                             +-------------+                                         
right indicator                                                                  |             |                                         
                   0 ------------------------------------------------------------+             +-----------------------------------------
                                                                                                                                         
                   1                                                                                                                     
windshield wipers                                                                                                                        
                   0 --------------------------------------------------------------------------------------------------------------------
```

This timing diagram is generated using the following parameters inside `index.js`:

```js
const clock = {
	cycles: 8,
	length: 4,
	offTime: 10,
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

const signals = {
	'I/O enable': { startSignal: 1, timing: [] },
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
		return B3 && !B2 && !B1 && !B0;
	},
	D1: signalValues => {
		const {B3, B2, B1, B0} = signalValues;
		return B3 && !B2 && !B1 && B0;
	},
	D2: signalValues => {
		const {B3, B2, B1, B0} = signalValues;
		return B3 && !B2 && B1 && !B0;
	},
	D3: signalValues => {
		const {B3, B2, B1, B0} = signalValues;
		return B3 && !B2 && B1 && B0;
	},
	D4: signalValues => {
		const {B3, B2, B1, B0} = signalValues;
		return B3 && B2 && !B1 && !B0;
	},
	'left indicator': signalValues => {
		const {B3, B2, B1, B0} = signalValues;
		return B3 && B2 && !B1 && B0;
	},
	'right indicator': signalValues => {
		const {B3, B2, B1, B0} = signalValues;
		return B3 && B2 && B1 && !B0;
	},
	'windshield wipers': signalValues => {
		const {B3, B2, B1, B0} = signalValues;
		return B3 && B2 && B1 && B0;
	},
};
```
