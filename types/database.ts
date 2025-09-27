export interface Games{
    id:string,
    img_url:string,
    title:string,
    price:number,
    id_platform:string,
    id_developer:string,
    description:string,
    create_at:Date,
    release_at:Date,
    stock:number,
    updated_at:Date
}
export interface Genres{
    id:string,
    name:string
}