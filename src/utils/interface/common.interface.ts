export interface RequestUserInterface {
    id: number
    role: number
    name?: string | null
    email?: string | null
    mobile?: string | null
    registeredWith?: number | null
}