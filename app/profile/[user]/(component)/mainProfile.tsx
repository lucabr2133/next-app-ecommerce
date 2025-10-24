import { User } from "@/auth";

export function MainProfile({user}:{user:User}) {
    return <>
        my profile page
        hello {user.username}
    </>
}