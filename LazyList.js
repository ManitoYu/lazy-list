class Cons {
	constructor(headThunk, tailThunk) {
		this.head = headThunk
		this.tail = tailThunk
	}

	toList() {
		function go(cons, acc) {
			if (!cons.head) return acc
			return go(cons.tail(), [cons.head(), ...acc])
		}
		return go(this, []).reverse()
	}

	map(f) {
		return this.foldRight(() => new Cons(null, null))((h, t) => new Cons(constant(f(h)), t))
	}

	filter(f) {
		return this.foldRight(() => new Cons(null, null))((h, t) => f(h) ? new Cons(() => h, t) : t())
	}

	foldRight(z) {
		return f => !this.head ? z() : f(this.head(), () => this.tail().foldRight(z)(f))
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

function constant(value) {
	return () => value
}

const list = LazyList.from([1, 2, 3])
	.map(x => console.log(1) || x)
	.map(x => console.log(2) || x)
	.map(x => console.log(3) || x)
	.toList()