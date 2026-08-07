"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { EyeIcon, EyeOffIcon } from "lucide-react"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"

import { ILoginInput } from "@/app/features/auth/auth.type"
import { useLoginMutation } from "@/app/redux/api/authApi"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

interface Props {
  redirect?: string
}

export default function LoginForm({ redirect }: Props) {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState("")

  const [login, { isLoading }] = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginInput>()

  function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === "object" && error !== null && "status" in error
  }

  const onSubmit = async (values: ILoginInput) => {
    try {
      setServerError("")

      await login(values).unwrap()

      // Give the browser a moment to receive
      // the HttpOnly cookies.
      router.refresh()

      router.replace(redirect || "/dashboard")
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const err = error.data as {
          message?: string
        }

        setServerError(err?.message || "Invalid email or password.")
      } else {
        setServerError("Something went wrong.")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        {serverError && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <Field>
          <FieldLabel>Email</FieldLabel>

          <Input
            type="email"
            placeholder="Enter your email"
            disabled={isLoading}
            {...register("email", {
              required: "Email is required",
            })}
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
              placeholder="••••••••"
              disabled={isLoading}
              {...register("password", {
                required: "Password is required",
              })}
            />

            <InputGroupAddon align="inline-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </Button>
            </InputGroupAddon>
          </InputGroup>

          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </Field>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />

            <label htmlFor="remember" className="text-sm">
              Remember me
            </label>
          </div>

          <Button variant="link" type="button" className="p-0">
            Forgot Password?
          </Button>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </FieldGroup>
    </form>
  )
}
