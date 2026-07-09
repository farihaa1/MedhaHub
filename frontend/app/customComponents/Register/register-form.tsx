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
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
type RegisterPayload = Omit<RegisterInput, "confirmPassword">

const RegisterForm = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const [registerUser, { isLoading }] = useRegisterMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (values: RegisterInput) => {
    console.log("FORM DATA:", values)
    try {
        const payload: RegisterPayload = {
          name: values.name,
          email: values.email,
          password: values.password,
        }
        await registerUser(payload).unwrap()

        router.replace("/dashboard")
        router.refresh()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) =>
        console.log("Validation errors:", errors)
      )}
    >
      <FieldGroup className="gap-4">
        <Field>
          <FieldLabel>Name</FieldLabel>

          <Input placeholder="Enter your full name" {...register("name")} />

          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>

          <Input
            type="email"
            placeholder="Enter your email"
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
              {...register("password")}
            />

            <InputGroupAddon align="inline-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword((v) => !v)}
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

          <Input
            type="password"
            placeholder="********"
            {...register("confirmPassword")}
          />

          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </Field>

        <Field orientation="horizontal" className="flex items-center gap-2">
          <Checkbox id="terms" />

          <FieldLabel htmlFor="terms">
            I agree to the Terms & Conditions
          </FieldLabel>
        </Field>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </FieldGroup>
    </form>
  )
}

export default RegisterForm
