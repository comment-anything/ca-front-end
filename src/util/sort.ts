

/** Sort an array based on a primary and secondary field */
export function multiSort<T>(array: T[], primary_field: (a: T) => number, secondary_field: (a: T) => number): T[] {
    
    // Primary-list will be sorted by the primary-field
    let primary_list : T[] = array
    array.sort((a, b) => primary_field(a) - primary_field(b))
    
    // Primary-map will map each unique primary field value to a list of those same values
    let primary_map = new Map<number, T[]>()
    let final_list: T[] = []
    
    // Iterate through the entire primary-list
    for (let v of primary_list) {
        
        // If a unique value hasn't been added yet
        if (!primary_map.has(primary_field(v))) {
            
            // Map the unique primary value key. Filter the primary-list for all elements having that exact value
            primary_map.set(primary_field(v), primary_list.filter((e) => primary_field(e) == primary_field(v)))
        }
    }
    
    // Iterate through each array map value
    for (let g of primary_map) {
        
        // Sort each mapped-array by the secondary-field. Append each one to the resulting array
        final_list = final_list.concat(g[1].sort((a, b) => secondary_field(a) - secondary_field(b)))
    }
    
    return final_list
}

