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


export const bestSquare = (number) => {
    const sqrt = Math.floor(Math.sqrt(number));

    for (var row = sqrt; row >= 0; row--) {
        const column = number / row;

        if(column % 1 === 0)
            return [column, row];
    }
}
