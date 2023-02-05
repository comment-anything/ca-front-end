
/**
 * dom is short for "Document Object Model". This file contains utility functions for getting HTML Elements. They are all members of the exported const 'dom'.
 */
export namespace Dom {
    
    /*
    export function createInputField(inputType: string): HTMLInputElement {
        let field: HTMLInputElement = document.createElement('input')
        field.type = inputType
        field.classList.add('input-field')
        return field
    }
    
    export function labeledElWrapper(label, elToLabel) {
        
        let usernameDiv = Dom.div()
        let usernameLabel = Dom.el("label", label)
        usernameDiv.append(elToLabel)
        return usernameDiv
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
    */

    /* See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types */
    type HTMLInputElementType = 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week'
    
    /** Creates an input element with attribute type set to type */
    export function createInputElement(type: HTMLInputElementType, cssClass?:string|string[]) {
        let myel = el("input", cssClass)
        myel.type = type
        return myel 
    }
    
    /** Creates a parent element to hold the specified child elements. The container is returned. */
    export function createContainer<T extends keyof HTMLElementTagNameMap>(tagName:T, cssClass:string|string[]|undefined,...els:HTMLElement[]) {
        let container = el(tagName, cssClass)
        
        // Add children to the container
        for (let el of els) {
            container.append(el)
        }
        
        return container
    }
    
    /** Creates a new element of type containerElementType and an HTMLLabelElement. The label is attached to container, then containedElement is attached to the container. The container is returned.  */
    export function createContainerWithLabel<T extends keyof HTMLElementTagNameMap>(text: string, labelClasses: string|string[]|undefined, containerElementType: T, containedElement
        : HTMLElement, containerClasses?:string|string[]|undefined) {
        let elLabel = textEl("label", text, labelClasses)
        let container = Dom.createContainer(containerElementType, containerClasses, elLabel, containedElement)
        return container
    }
    
    /** Returns an element. Specify the HTML tag, an optional CSS class or array of CSS classes, and CSS style overrides. */
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
    
    /** Gets a new HTML Element with its textContent set to text. */
    function textEl<T extends keyof HTMLElementTagNameMap>(tagName: T, text?: string, cssClass?:string | string[], styles?:{[key:string]:string}) {
        let x = Dom.el<T>(tagName, cssClass, styles)
        x.textContent = text ? text : ""
        return x

    }
    
    /** Gets a div element with optional text, classes, and style overrides. */
    export function div(text?: string, cssClass?:string | string[], styles?:{[key:string]:string}) {
        return textEl("div", text, cssClass, styles)
    }
    
    /** Gets a button element with optional text, classes, and style overrides. */
    export function button(text?: string, cssClass?:string | string[], styles?:{[key:string]:string}) {
        return textEl("button", text, cssClass, styles)
    }
    
    /** Gets a span element with optional text, classes, and style overrides. */
    export function span(text?: string, cssClass?:string | string[], styles?:{[key:string]:string}) {
        return textEl("span", text, cssClass, styles)
    }
}

