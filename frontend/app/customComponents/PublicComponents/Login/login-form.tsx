"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { GoogleLogin } from "@react-oauth/google"

import { EyeIcon, EyeOffIcon } from "lucide-react"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"

import { ILoginInput } from "@/app/redux/types/auth.type"

import {
  useLoginMutation,
  useGoogleLoginMutation,
} from "@/app/redux/api/authApi"

import { useAppDispatch } from "@/app/redux/hooks"
import { setCredentials } from "@/app/redux/slices/authSlice"

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

interface ErrorResponse {
  success?: boolean
  message?: string
}

export default function LoginForm({ redirect }: Props) {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState("")

  const [login, { isLoading: isLoginLoading }] = useLoginMutation()

  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation()

  const isLoading = isLoginLoading || isGoogleLoading

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginInput>()

  // =====================================================
  // ERROR HELPER
  // =====================================================

  const getErrorMessage = (error: unknown): string => {
    if (typeof error === "object" && error !== null && "data" in error) {
      const fetchError = error as FetchBaseQueryError

      if (
        typeof fetchError.data === "object" &&
        fetchError.data !== null &&
        "message" in fetchError.data
      ) {
        const data = fetchError.data as ErrorResponse

        return data.message || "লগইন করা যায়নি।"
      }
    }

    return "কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।"
  }

  // =====================================================
  // EMAIL LOGIN
  // =====================================================

  const onSubmit = async (values: ILoginInput) => {
    try {
      setServerError("")

      const response = await login(values).unwrap()

      console.log("LOGIN RESPONSE:", response)

      if (response.data) {
        dispatch(setCredentials(response.data))
      }

      router.replace(redirect || "/dashboard")

      router.refresh()
    } catch (error) {
      console.error("LOGIN ERROR:", error)

      setServerError(getErrorMessage(error))
    }
  }

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleSuccess = async (credentialResponse: {
    credential?: string
  }) => {
    try {
      setServerError("")

      const idToken = credentialResponse.credential

      if (!idToken) {
        setServerError("Google থেকে token পাওয়া যায়নি।")
        return
      }

      console.log("GOOGLE ID TOKEN RECEIVED")

      const response = await googleLogin({
        idToken,
      }).unwrap()

      console.log("GOOGLE LOGIN RESPONSE:", response)

      if (response.data) {
        dispatch(setCredentials(response.data))
      }

      router.replace(redirect || "/dashboard")

      router.refresh()
    } catch (error) {
      console.error("GOOGLE LOGIN ERROR:", error)

      setServerError(getErrorMessage(error))
    }
  }

  const handleGoogleError = () => {
    console.error("Google Login Failed")

    setServerError("Google দিয়ে লগইন করা যায়নি। আবার চেষ্টা করুন।")
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* ================================================= */}
      {/* SERVER ERROR */}
      {/* ================================================= */}

      {serverError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
          <p className="text-xs text-destructive">{serverError}</p>
        </div>
      )}

      <FieldGroup className="space-y-4">
        {/* ================================================= */}
        {/* EMAIL */}
        {/* ================================================= */}

        <Field className="gap-1.5">
          <FieldLabel className="text-xs font-medium">ইমেইল</FieldLabel>

          <Input
            type="email"
            placeholder="আপনার ইমেইল লিখুন"
            disabled={isLoading}
            autoComplete="email"
            className="h-9 text-xs sm:h-10"
            {...register("email", {
              required: "ইমেইল আবশ্যক",
            })}
          />

          {errors.email && (
            <p className="text-[10px] text-destructive">
              {errors.email.message}
            </p>
          )}
        </Field>

        {/* ================================================= */}
        {/* PASSWORD */}
        {/* ================================================= */}

        <Field className="gap-1.5">
          <FieldLabel className="text-xs font-medium">পাসওয়ার্ড</FieldLabel>

          <InputGroup className="h-9 sm:h-10">
            <InputGroupInput
              type={showPassword ? "text" : "password"}
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              disabled={isLoading}
              autoComplete="current-password"
              className="text-xs"
              {...register("password", {
                required: "পাসওয়ার্ড আবশ্যক",
              })}
            />

            <InputGroupAddon align="inline-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isLoading}
                onClick={() => setShowPassword((prev) => !prev)}
                className="mr-0.5 h-7 w-7 sm:h-8 sm:w-8"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-3.5 w-3.5" />
                ) : (
                  <EyeIcon className="h-3.5 w-3.5" />
                )}
              </Button>
            </InputGroupAddon>
          </InputGroup>

          {errors.password && (
            <p className="text-[10px] text-destructive">
              {errors.password.message}
            </p>
          )}
        </Field>

        {/* ================================================= */}
        {/* REMEMBER / FORGOT */}
        {/* ================================================= */}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              disabled={isLoading}
              className="h-3.5 w-3.5"
            />

            <label
              htmlFor="remember"
              className="cursor-pointer text-xs text-muted-foreground"
            >
              আমাকে মনে রাখুন
            </label>
          </div>

          <Button
            variant="link"
            type="button"
            disabled={isLoading}
            className="h-auto p-0 text-xs font-medium"
          >
            পাসওয়ার্ড ভুলে গেছেন?
          </Button>
        </div>

        {/* ================================================= */}
        {/* LOGIN BUTTON */}
        {/* ================================================= */}

        <Button
          type="submit"
          disabled={isLoading}
          className="h-9 w-full text-xs font-medium sm:h-10"
        >
          {isLoginLoading ? "লগইন হচ্ছে..." : "লগইন করুন"}
        </Button>

        {/* ================================================= */}
        {/* DIVIDER */}
        {/* ================================================= */}

        <div className="relative my-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>

          <div className="relative flex justify-center">
            <span className="bg-background px-2 text-[10px] text-muted-foreground">
              অথবা
            </span>
          </div>
        </div>

        {/* ================================================= */}
        {/* GOOGLE */}
        {/* ================================================= */}

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            theme="outline"
            size="large"
            width="360"
            text="signin_with"
            shape="rectangular"
          />
        </div>
      </FieldGroup>
    </form>
  )
}
