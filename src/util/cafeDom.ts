
import { Dom } from "./dom"

import "./text-input.css"

const CSS = {
    /* CSS for text input boxes */
    textInput: {
        genericLabel          : 'text-input-generic-label',
        genericTextBox        : 'text-input-generic-text-box',
        genericContainer      : 'text-input-generic-container',
        halfContainerOverride : 'text-input-half-generic-container',
        focusedContainer      : 'text-input-focus-container'
    }
}

export namespace CafeDom {
    
    /** Identify specific content for an element */
    export type UIContent = {
        label?: string
    }
    
    /** Wrap an HTMLInputElement within a styled HTMLDivElement */
    export function fullSizeGenericTextInput(el: HTMLInputElement, content: UIContent, listeners?: []): HTMLDivElement {
        // Create a full-sized container
        let container = Dom.div()
        
        // Initialize and return the container
        initializeGenericTextInput(el, container, content)
        return container
    }
    
    /** Wrap an HTMLInputElement within a styled HTMLDivElement */
    export function halfSizeGenericTextInput(el: HTMLInputElement, content: UIContent): HTMLDivElement {
        // Create a half-sized container
        let container = Dom.div()
        container.classList.add(CSS.textInput.halfContainerOverride)
        
        // Initialize and return the container
        initializeGenericTextInput(el, container, content)
        return container
    }
    
    /** Adds CSS to input element. Creates label element. Contain all elements. Add event listeners to focus input. */
    function initializeGenericTextInput(el: HTMLInputElement, container: HTMLDivElement, content: UIContent): any[] {
        el.classList.add(CSS.textInput.genericTextBox)
        container.classList.add(CSS.textInput.genericContainer)
        
        let label = Dom.textEl('div', content.label, CSS.textInput.genericLabel)
        let listeners: any[] = []
        
        // TODO: THE LISTENERS ARRAY NEEDS WORK
        // Wrap elements inside container
        container.append(
            label,
            el
        )
        
        // Focus the text input on click
        // TODO: THE LISTENERS ARRAY NEEDS WORK
        listeners.push(container.addEventListener("click", ()=>{
            container.classList.add(CSS.textInput.focusedContainer)
            el.focus()
        }))
        
        // Unfocus the container
        listeners.push(el.addEventListener("focusout", ()=>{
            container.classList.remove(CSS.textInput.focusedContainer)
        }))
        
        return listeners;
    }
}

