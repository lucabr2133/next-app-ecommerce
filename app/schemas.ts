import z from "zod"

 const formDataSchema=z.object({
  title:z.string().min(3),
  price:z.coerce.number(),
  description:z.string().min(5),
  company_name:z.string(),
  release_at:z.coerce.date(),
  stock:z.coerce.number(),
  updated_at:z.coerce.date(),
  metacritic:z.coerce.number()
 })
 export function validateSchema(formData:FormData){
      const dataForm = Object.fromEntries(formData.entries());
 return formDataSchema.safeParse(dataForm)

 }