'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUserContext } from '@/context/UserContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'

import { Purchases } from '@revenuecat/purchases-js'

// Remove or comment out the log level setting
// Purchases.setLogLevel(Purchases.LogLevel.DEBUG) // Optional: Enable debug logs

// Check if setup is still a valid method
// If not, remove or comment out the setup line
// Purchases.setup(process.env.NEXT_PUBLIC_WEB_BILLING_PUBLIC_API_KEY) // Replace with your actual key

// If the setup method is not available, you may need to initialize Purchases differently
// Check the documentation for the correct initialization method

type FormValues = {
  email: string
  password: string
}

export default function LoginPage() {
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const router = useRouter()

  const [error, setError] = React.useState<string | null>(null)

  const { handleAuthChange, user } = useUserContext()

  const handleLogin = async (values: FormValues) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error('Invalid email or password')
      }

      handleAuthChange()

      // After successful login and user context update, identify the user in RevenueCat.
      // Make sure the user variable is populated from userContext
      if (user && user.id) {
        const customerInfo = await Purchases.logIn(user.id)
        console.log('User logged in (RevenueCat):', customerInfo)
      } else {
        console.warn('User ID not available after login.')
      }

      router.push('/orders')
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }
  }

  return (
    <div className="container my-20">
      <div className="border max-w-[450px] mx-auto p-10 rounded-md bg-card">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md my-3">{error}</div>}
        <div className="space-y-2 text-center">
          <h1 className="font-bold text-3xl">Login</h1>
          <p className="text-muted-foreground text-lg">Login as a customer</p>
        </div>
        <form onSubmit={form.handleSubmit(handleLogin)} className="mt-5 space-y-3">
          <Input
            type="email"
            placeholder="Email Address"
            autoComplete="email"
            {...form.register('email')}
          />
          <Input
            type="password"
            placeholder="Password"
            autoComplete="password"
            {...form.register('password')}
          />

          <Button className="w-full" type="submit">
            Login
          </Button>
        </form>
        <div className="mt-5">
          <p className="text-center text-sm tracking-wide font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
