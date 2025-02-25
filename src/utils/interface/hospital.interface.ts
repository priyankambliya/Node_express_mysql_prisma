interface LocationPayload {
    latitude: number
    longitude: number
    detail: any
}

interface ContactPayload {
    email?: number
    mobile?: any
}

export interface CreateHospitalBodyPayload {
    name: string
    location: LocationPayload | any
    contact: ContactPayload | any
}
