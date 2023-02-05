
/**
 * dom is short for "Document Object Model". This file contains utility functions for getting HTML Elements. They are all members of the exported const 'dom'.
 */
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

    export function el<T extends keyof HTMLElementTagNameMap>(tagName: T, cssClass?:string | string[], styles?:{[key:string]:string}) {
        let el = document.createElement(tagName)
        if(styles !== undefined) {
            for(let key of Object.keys(styles)) {
                el.style[key as any] = styles[key] as any
            }
        }    
        if(cssClass !== undefined && cssClass !== "") {
            if(Array.isArray(cssClass)) {
                for(let c of cssClass) {
                    el.classList.add(c)
                }
            } else {
                el.classList.add(cssClass)
            }
        }
        return el as HTMLElementTagNameMap[T]
    }
    function textEl<T extends keyof HTMLElementTagNameMap>(el: T, text?: string, cssClass?:string | string[], styles?:{[key:string]:string})
{
    let x = Dom.el<T>(el, cssClass, styles)
    x.textContent = text ? text : ""
    return x

}
    // Gets a div element.
    export function div(text?: string, cssClass?:string | string[], styles?:{[key:string]:string}) {
        return textEl("div", text, cssClass, styles)
    }
    // Gets a button element.
    export function button(text?: string, cssClass?:string | string[], styles?:{[key:string]:string}) {
        return textEl("button", text, cssClass, styles)
    }
    // Gets a Span element.
    export function span(text?: string, cssClass?:string | string[], styles?:{[key:string]:string}) {
        return textEl("span", text, cssClass, styles)
    }
}

