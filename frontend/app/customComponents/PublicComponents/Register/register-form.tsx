"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"

import {
  registerSchema,
  RegisterInput,
} from "@/app/features/auth/schemas/register.schema"

import { useRegisterMutation } from "@/app/redux/api/authApi"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

import { FetchBaseQueryError } from "@reduxjs/toolkit/query"

type RegisterPayload = Omit<RegisterInput, "confirmPassword">

interface Props {
  redirect?: string
}

interface ErrorResponse {
  success: boolean
  message: string
}

export default function RegisterForm({ redirect }: Props) {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [serverError, setServerError] = useState("")

  const [registerUser, { isLoading }] = useRegisterMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (values: RegisterInput) => {
    try {
      setServerError("")

      const payload: RegisterPayload = {
        name: values.name,
        email: values.email,
        password: values.password,
      }

      await registerUser(payload).unwrap()

      router.replace(
        `/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`
      )

      router.refresh()
    } catch (error: unknown) {
      const err = error as FetchBaseQueryError

      if ("data" in err) {
        const data = err.data as ErrorResponse
        setServerError(data.message)
      } else {
        setServerError("Registration failed.")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-5">
        {serverError && (
          <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <Field>
          <FieldLabel>Name</FieldLabel>

          <Input
            placeholder="Full Name"
            disabled={isLoading}
            {...register("name")}
          />

          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>

          <Input
            type="email"
            placeholder="Email"
            disabled={isLoading}
            {...register("email")}
          />

          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>

          <InputGroup>
            <InputGroupInput
              type={showPassword ? "text" : "password"}
              placeholder="********"
              disabled={isLoading}
              {...register("password")}
            />

            <InputGroupAddon align="inline-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </InputGroupAddon>
          </InputGroup>

          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Confirm Password</FieldLabel>

          <InputGroup>
            <InputGroupInput
              type={showConfirmPassword ? "text" : "password"}
              placeholder="********"
              disabled={isLoading}
              {...register("confirmPassword")}
            />

            <InputGroupAddon align="inline-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </Button>
            </InputGroupAddon>
          </InputGroup>

          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </Field>

        <Field orientation="horizontal">
          <Checkbox id="terms" disabled={isLoading} />

          <FieldLabel htmlFor="terms">
            I agree to the Terms & Conditions
          </FieldLabel>
        </Field>

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </FieldGroup>
    </form>
  )
}
