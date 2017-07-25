class Cons {
	constructor(headThunk, tailThunk) {
		this.head = headThunk
		this.tail = tailThunk

		this.ops = []
	}

	toList() {
		var self = this
		function go(cons, acc) {
			if (!cons.head) return acc
			cons = self.ops.reduce((c, f) => f(c.head(), c.tail()), cons)
			return go(cons.tail(), [cons.head(), ...acc])
		}
		return go(this, []).reverse()
	}

	map(f) {
		this.ops.push((h, t) => new Cons(() => f(h), () => t))
		// return this.foldRight(() => new Cons(null, null))((h, t) => new Cons(() => f(h), () => t))
		return this
	}

	filter(f) {
		this.ops.push((h, t) => f(h) ? new Cons(() => h, () => t) : t)
		// return this.foldRight(() => new Cons(null, null))((h, t) => f(h) ? new Cons(() => h, () => t) : t)
		return this
	}

	foldRight(z) {
		return f => {
			if (!this.head) return z()
			return f(this.head(), this.tail().foldRight(z)(f))
		}
	}
}

class LazyList {
	constructor(...args) {
		return LazyList.from(args) 
	}
}

LazyList.from = arr => {
	if (!arr.length) return new Cons(null, null)
	return new Cons(
		() => head(arr),
		() => LazyList.from(tail(arr))
	)
}

function head(arr) {
	return arr[0]
}

function tail(arr) {
	return arr.slice(1)
}

const list = LazyList.from([1, 2, 3, 4, 5, 6])
	.map(x => console.log('1') || 1)
	.map(x => console.log('2') || 2)
	.map(x => console.log('3') || 3)
	.toList()

console.log(list)