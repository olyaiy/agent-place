import { authClient } from "@/lib/auth-client"; //import the auth client

export async function signUp(email: string, password: string, name: string, image?: string) {
    const { data, error } = await authClient.signUp.email({
        email: email,
        password: password,
        name: name,
        image: image,
        callbackURL: "/dashboard" // a url to redirect to after the user verifies their email (optional)
    }, {
        onRequest: (ctx) => {
            //show loading
            console.log("Loading...", ctx);
        },
        onSuccess: (ctx) => {
            //redirect to the dashboard or sign in page
            console.log("Success", ctx);
        },
        onError: (ctx) => {
            // display the error message
            alert(ctx.error.message);
        },
    });

    return { data, error };
}