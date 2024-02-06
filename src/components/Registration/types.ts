import { Dispatch, SetStateAction } from 'react'

export interface Form {
    email: string,
    name: string,
    password:string,
    captcha:string,
    team: string
}

export interface Props{
    onClick: Dispatch<SetStateAction<string>>
}