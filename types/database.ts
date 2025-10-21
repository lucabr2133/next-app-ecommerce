export interface gameDetailResponse{
    game:Games[],
    tags:tags[],
    screenshots:sreenshoots[]
}
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
    updated_at:Date,
    metacritic:Number
}
export interface tags{
    tag_id:number
    tag_name:string
}
export interface sreenshoots{
    id:string
    screenshot_url:string
}
export interface Genres{
    id:string,
    name:string
}