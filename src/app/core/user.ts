export interface User {
    uid?: string,
    name?: string,
    lastName?: string,
    displayName?: string,
    email?: string,
    photoURL?: string,
    permit?: {
        id?: string,
        name?: string,
        reg?: number
    },
    regDate?: Date,
}