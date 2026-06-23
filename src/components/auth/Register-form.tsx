'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { registerSchema, type RegisterInput } from '@/lib/schemas/auth.schema'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import Link from 'next/link'
import { toast } from 'react-toastify'

type RegisterErrors = Partial<Record<keyof RegisterInput, string>>

export default function RegisterForm() {
  const router = useRouter()

  const [form, setForm] = useState<RegisterInput>({
    fullName: '',
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState<RegisterErrors>({})
  const [loading, setLoading] = useState<boolean>(false)

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

    const result = registerSchema.safeParse(form)

    if (!result.success) {
      const fieldErrors: RegisterErrors = {}

      result.error.issues.forEach((err) => {
        const key = err.path[0] as keyof RegisterInput
        fieldErrors[key] = err.message
      })

      setErrors(fieldErrors)
      return
    }

    try {
      setLoading(true)

      const res = await api.post<{ token: string }>('api/auth/register', form)

      localStorage.setItem('token', res.data.token)

      toast.success('Account created successfully!')

      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="space-y-6 w-96 mx-auto mt-10 border p-8 rounded-2xl bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/20">
        <h2 className='text-2xl font-bold text-center'>Register</h2>
        <Field>
          <FieldLabel>Full Name</FieldLabel>
          <Input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="David Agu"
          />
          {errors.fullName && (
            <p className="text-sm text-red-500">{errors.fullName}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </Field>

        <Button type="submit" className="w-full p-6" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </Button>

    <p className="text-sm text-center">
      Already have an account?{' '}
      <Link href="/login" className="hover:underline">
        Sign in
      </Link>
    </p>
      </FieldGroup>
    </form>
  )
}
