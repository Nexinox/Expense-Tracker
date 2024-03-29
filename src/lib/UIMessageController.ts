import { UIMessage } from "./models/UIMessage";
import { currentUIMessages } from "./stores/UIMessages";

export function showErrorMessage(message: string, duration: number = 5000) {
    currentUIMessages.update((messages) => [
        ...messages,
        new UIMessage({
            type: 'error',
            message: message,
            timeout: duration 
        })
    ]);
}

export function showSuccessMessage(message: string, duration: number = 5000) {
    currentUIMessages.update((messages) => [
        ...messages,
        new UIMessage({
            type: 'success',
            message: message,
            timeout: duration
        })
    ]);
}