
import { m } from "vitest/dist/types-aac763a5"
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
    },
    checkBox: {
        genericLabel     : 'check-box-generic-label',
        genericInput     : 'check-box-generic-input',
        genericContainer : 'check-box-generic-container',
        button           : 'button-check-box'
    },
    button: {
        submitForm    : 'form-submit-button',
        texture       : 'icon-button-texture',
        iconContainer : 'icon-button-container'
    },
    dropdown: {
        generic: 'generic-dropdown'
    }
}

export namespace CafeDom {
    
    /** Identify specific content for an element */
    export type UIContent = {
        label?: string
        asset?: string
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
        
        /*
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
        */
        return listeners;
    }
    
    export function genericCheckBoxInput(el: HTMLInputElement, content: UIContent): HTMLDivElement {
        let container = Dom.div()
        container.classList.add(CSS.checkBox.genericContainer)
        el.classList.add(CSS.checkBox.genericInput)
        
        let label = Dom.textEl('div', content.label, CSS.checkBox.genericLabel)
        
        container.append(
            label,
            el
        )
        
        return container
    }
    
    export function formSubmitButton(el: HTMLButtonElement, content: UIContent): HTMLButtonElement {
        el.classList.add(CSS.button.submitForm)
        return el
    }
    
    export function genericIconButton(el: HTMLButtonElement, content: UIContent): HTMLButtonElement {
        let icon = Dom.div('', CSS.button.texture)
        icon.style.backgroundImage = 'url("src/assets/' + content.asset + '")'
        el.classList.add(CSS.button.iconContainer)
        el.append(icon)
        return el
    }
    
    export function genericDropdown(el: HTMLSelectElement, content: UIContent): HTMLSelectElement {
        el.classList.add(CSS.dropdown.generic)
        return el
    }
    
    export function toggleButton(el: HTMLButtonElement, content: UIContent): HTMLButtonElement {
        
        if (content.label)
            el.textContent = content.label
        
        el.classList.add(CSS.checkBox.button)
        return el
    }
}

