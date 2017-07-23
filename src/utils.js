export const shuffle = (a) => {
	for (let i = a.length; i; i--) {
		let j = Math.floor(Math.random() * i);
		[a[i-1], a[j]] = [a[j], a[i-1]];
	}
}

export const testLocalStorage = () => {
	try {
		localStorage.setItem("a", "a");
		localStorage.removeItem("a");
		return true;
	} catch (error) {
		return false;
	}
}