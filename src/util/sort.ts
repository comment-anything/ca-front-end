

/** Sort an array based on a primary and secondary field */
type fieldGetter<T> = (a:T)=>number

export function multiSort<T>(array: T[], ...fields: fieldGetter<T>[]): T[] {

    function inner(a: T, b:T) {
        for(let f of fields) {
            let f1v = f(a)
            let f2v = f(b)
            let result = f1v - f2v
            if (result != 0) {
                return result 
            }
        }
        return 0
    }
    return array.sort(inner)
}

