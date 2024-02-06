export const responseError = (message: string, property?: string) => {
    return {
        error: {
            property,
            message,
        }
    }
}