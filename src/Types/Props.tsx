import React from 'react';



export interface Props{
    secret?: string,
    status?: string,
    id?: string,
    img_url?: string,
    name?: string
    address?: {
        name: string,
        address: {
            line1: string,
            line2?: string,
            city: string,
            postal_code: string
            country: string
        }
    }
}