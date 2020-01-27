export interface User {
    uid?: string,
    name?: string,
    lastname?: string,
    displayName?: string,
    phone?: string,
    email?: string,
    photoURL?: string,
    permit?: {
        id?: string,
        name?: string,
        reg?: number
    },
    regDate?: Date,
}