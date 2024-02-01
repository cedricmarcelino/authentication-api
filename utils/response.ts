import { ValidationErrorItem } from "joi"

export const responseConflict = (property: string, message: string) => {
    return {
        description: 'Already exist.',
        error: {
            property: property,
            message: message
        }
    }
}

export const responseValidation = (error: ValidationErrorItem) => {
    return {
        description: 'Request body validation failed.',
        error: {
            property: error.context?.key,
            message: error.message
        }
    }
}

export const responseServerError = () => {
    return {
        description: 'Internal Server Error'
    }
}

export const responseError = (message: string) => {
    return {
        error: {
            message: message
        }
    }
}