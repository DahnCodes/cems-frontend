'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { loginSchema, type LoginInput } from '@/lib/schemas/auth.schema'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import Link from 'next/link'
import { useAuth, User } from '@/context/auth-context'
import { toast } from 'react-toastify'

type LoginErrors = Partial<Record<keyof LoginInput, string>>

export default function LoginForm() {
  const router = useRouter()
  const { setUser } = useAuth()

  const [form, setForm] = useState<LoginInput>({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState<LoginErrors>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const result = loginSchema.safeParse(form)

    if (!result.success) {
      const fieldErrors: LoginErrors = {}

      result.error.issues.forEach((err) => {
        const key = err.path[0] as keyof LoginInput
        fieldErrors[key] = err.message
      })

      setErrors(fieldErrors)
      return
    }

    try {
      setLoading(true)

      const response = await api.post<{
        success: boolean
        user: User
      }>('api/auth/login', form)

      toast.success('Login successful!')

      // ONLY USER IS STORED (cookie already set by backend)
      setUser(response.data.user)

      router.push('/dashboard')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="space-y-6 w-96 mx-auto mt-10 border p-8 rounded-2xl bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/20">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </Field>

        <Button type="submit" className="w-full p-6" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </Button>

        <p className="text-sm text-center">
          Don't have an account?{' '}
          <Link href="/register" className="hover:underline">
            Sign up
          </Link>
        </p>
      </FieldGroup>
    </form>
  )
}