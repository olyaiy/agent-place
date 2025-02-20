"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"

interface SignInFormData {
  email: string
  password: string
}

interface SignInFormProps {
  callbackUrl?: string;
}

export function SignInForm({ callbackUrl }: SignInFormProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const form = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const [showPassword, setShowPassword] = useState(false)

  // Log initial props and form state
  useEffect(() => {
    console.log('SignInForm mounted with props:', { callbackUrl })
    console.log('Initial form state:', form.getValues())
  }, [callbackUrl, form])

  // Watch form values changes
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log('Form field changed:', { field: name, type, value })
    })
    return () => subscription.unsubscribe()
  }, [form])

  const onSubmit = (data: SignInFormData) => {
    console.log('Form submission started:', data)
    
    startTransition(async () => {
      console.log('Starting authentication transition')
      try {
        const { error } = await authClient.signIn.email({
          email: data.email,
          password: data.password
        })

        console.log('Authentication response:', { error })

        if (!error) {
          console.log('Authentication successful, navigating to:', callbackUrl || "/")
          router.refresh()
          router.push(callbackUrl || "/")
        } else {
          console.error('Authentication failed:', error)
        }
      } catch (error) {
        console.error('Unexpected error during authentication:', error)
      }
    })
  }

  // Log state changes
  useEffect(() => {
    console.log('Form pending state changed:', isPending)
  }, [isPending])

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit((data) => {
          console.log('Form submitted with data:', data)
          onSubmit(data)
        })} 
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  {...field} 
                  required
                  onChange={(e) => {
                    console.log('Email input changed:', e.target.value)
                    field.onChange(e)
                  }}
                />
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
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...field}
                    required
                    onChange={(e) => {
                      console.log('Password input changed:', { length: e.target.value.length })
                      field.onChange(e)
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                    onClick={() => {
                      console.log('Password visibility toggled:', !showPassword)
                      setShowPassword(!showPassword)
                    }}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
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