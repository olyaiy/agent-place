"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

interface SignUpFormData {
  email: string
  password: string
  name: string
}

export function SignUpForm() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const form = useForm<SignUpFormData>()

  const onSubmit = (data: SignUpFormData) => {
    startTransition(async () => {
      const { error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          {isPending ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  )
} 