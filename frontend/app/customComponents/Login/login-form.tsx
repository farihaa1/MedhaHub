"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { EyeOffIcon, EyeIcon } from "lucide-react"
import { useLoginMutation } from "@/app/redux/api/authApi"
import { ILoginInput } from "@/app/features/auth/auth.type"
import { useRouter } from "next/navigation"

const LoginForm = () => {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [login, { isLoading }] = useLoginMutation()

  const { register, handleSubmit } = useForm<ILoginInput>()

  const onSubmit = async (values: ILoginInput) => {
    try {
      await login(values).unwrap()

      router.replace("/dashboard")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <Field className="gap-2">
          <FieldLabel htmlFor="userEmail">Email address*</FieldLabel>

          <Input
            id="userEmail"
            type="email"
            placeholder="Enter your email address"
            {...register("email")}
          />
        </Field>

        <Field className="w-full gap-2">
          <FieldLabel htmlFor="password">Password*</FieldLabel>

          <InputGroup>
            <InputGroupInput
              id="password"
              type={isVisible ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
            />

            <InputGroupAddon align="inline-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsVisible((prev) => !prev)}
              >
                {isVisible ? <EyeOffIcon /> : <EyeIcon />}
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <div className="flex items-center justify-between">
          <Field orientation="horizontal">
            <Checkbox id="rememberMe" />
            <FieldLabel htmlFor="rememberMe">Remember Me</FieldLabel>
          </Field>

          <a href="#" className="hover:underline">
            Forgot Password?
          </a>
        </div>

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </FieldGroup>
    </form>
  )
}

export default LoginForm
