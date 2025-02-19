"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

interface SignInFormData {
  email: string
  password: string
}

export function SignInForm() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const form = useForm<SignInFormData>()

  const onSubmit = (data: SignInFormData) => {
    startTransition(async () => {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password
      })

      if (!error) {
        router.refresh()
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        <a href="/reset-password" className="text-primary underline">
          Forgot password?
        </a>
      </div>
    </Form>
  )
} 