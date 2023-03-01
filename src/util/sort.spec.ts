
import { describe, it } from 'vitest'
import { multiSort } from './sort'

describe('Multi-sort function', () => {
    it('Sorts properly without errors', () => {
        
        type Person = {
            name   : string
            weight : number
            age    : number
        }
        
        let p: Person[] = [
            { name: 'a', weight: 117, age: 21 },
            { name: 'b', weight: 223, age: 19 },
            { name: 'c', weight: 117, age: 19 },
            { name: 'd', weight: 524, age: 27 },
            { name: 'e', weight: 117, age: 6  },
            { name: 'f', weight: 223, age: 1  }
        ]
        
        console.log("BEFORE: ", p)
        console.log("AFTER:  ", multiSort<Person>(p, (a)=>a.weight, (a)=>a.age))
        
    })
})