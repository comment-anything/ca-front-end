
export namespace Dom {
    
    export function appendToApp(section: HTMLDivElement): void {
        document.querySelector<HTMLDivElement>('#app')!.appendChild(section)
    }
    
    export function createInputField(inputType: string): HTMLInputElement {
        let field: HTMLInputElement = document.createElement('input')
        field.type = inputType
        field.classList.add('input-field')
        return field
    }
    
    export function createInputFieldRow(label: string, inputElement: HTMLInputElement): HTMLParagraphElement {
        let rowElement = document.createElement('p')
        let labelElement = document.createElement('div')
        
        labelElement.classList.add('field-label')
        labelElement.innerHTML = label
        
        rowElement.appendChild(labelElement)
        rowElement.appendChild(inputElement)
        
        return rowElement
    }

}

