
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { GoogleLogin } from "@react-oauth/google"

import {
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react"

import { FetchBaseQueryError } from "@reduxjs/toolkit/query"

import {
  registerSchema,
  RegisterInput,
} from "@/app/features/auth/schemas/register.schema"

import {
  useRegisterMutation,
  useGoogleLoginMutation,
} from "@/app/redux/api/authApi"

import { useAppDispatch } from "@/app/redux/hooks"
import { setCredentials } from "@/app/redux/slices/authSlice"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"


/* =========================================================
   TYPES
========================================================= */

type RegisterPayload = Omit<
  RegisterInput,
  "confirmPassword"
>

interface Props {
  redirect?: string
}

interface ErrorResponse {
  success?: boolean
  message?: string
}


/* =========================================================
   COMPONENT
========================================================= */

export default function RegisterForm({
  redirect,
}: Props) {
  const router = useRouter()
  const dispatch = useAppDispatch()

  /* =======================================================
     LOCAL STATE
  ======================================================= */

  const [showPassword, setShowPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [serverError, setServerError] =
    useState("")


  /* =======================================================
     REGISTER MUTATION
  ======================================================= */

  const [
    registerUser,
    {
      isLoading: isRegisterLoading,
    },
  ] = useRegisterMutation()


  /* =======================================================
     GOOGLE MUTATION
  ======================================================= */

  const [
    googleLogin,
    {
      isLoading: isGoogleLoading,
    },
  ] = useGoogleLoginMutation()


  /* =======================================================
     LOADING
  ======================================================= */

  const isLoading =
    isRegisterLoading ||
    isGoogleLoading


  /* =======================================================
     FORM
  ======================================================= */

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<RegisterInput>({
    resolver:
      zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })


  /* =========================================================
     ERROR MESSAGE
  ========================================================= */

  const getErrorMessage = (
    error: unknown
  ): string => {
    if (
      typeof error === "object" &&
      error !== null &&
      "data" in error
    ) {
      const fetchError =
        error as FetchBaseQueryError

      if (
        typeof fetchError.data === "object" &&
        fetchError.data !== null &&
        "message" in fetchError.data
      ) {
        const data =
          fetchError.data as ErrorResponse

        return (
          data.message ||
          "অ্যাকাউন্ট তৈরি করা যায়নি।"
        )
      }
    }

    return "কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।"
  }


  /* =========================================================
     NORMAL REGISTER
  ========================================================= */

  const onSubmit = async (
    values: RegisterInput
  ) => {
    try {
      setServerError("")

      const payload: RegisterPayload = {
        name: values.name,
        email: values.email,
        password: values.password,
      }

      console.log(
        "REGISTER PAYLOAD:",
        payload
      )

      const response =
        await registerUser(
          payload
        ).unwrap()

      console.log(
        "REGISTER RESPONSE:",
        response
      )


      /* =====================================================
         SAVE USER
      ===================================================== */

      if (response.data) {
        dispatch(
          setCredentials(
            response.data
          )
        )
      }


      /* =====================================================
         REDIRECT
      ===================================================== */

      const destination =
        redirect || "/dashboard"

      console.log(
        "REGISTER SUCCESS →",
        destination
      )

      router.replace(
        destination
      )

      router.refresh()

    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      )

      setServerError(
        getErrorMessage(error)
      )
    }
  }


  /* =========================================================
     GOOGLE LOGIN
  ========================================================= */

  const handleGoogleToken = async (
    idToken: string
  ) => {
    try {
      setServerError("")

      console.log(
        "GOOGLE ID TOKEN RECEIVED"
      )


      /* =====================================================
         SEND GOOGLE TOKEN TO BACKEND
      ===================================================== */

      const response =
        await googleLogin({
          idToken,
        }).unwrap()


      console.log(
        "GOOGLE REGISTER RESPONSE:",
        response
      )


      /* =====================================================
         SAVE USER TO REDUX
      ===================================================== */

      if (response.data) {
        dispatch(
          setCredentials(
            response.data
          )
        )
      }


      /* =====================================================
         REDIRECT
      ===================================================== */

      const destination =
        redirect || "/dashboard"

      console.log(
        "GOOGLE REGISTER SUCCESS →",
        destination
      )

      router.replace(
        destination
      )

      router.refresh()

    } catch (error) {
      console.error(
        "GOOGLE REGISTER ERROR:",
        error
      )

      setServerError(
        getErrorMessage(error)
      )
    }
  }


  /* =========================================================
     GOOGLE ERROR
  ========================================================= */

  const handleGoogleError = () => {
    console.error(
      "Google authentication failed"
    )

    setServerError(
      "Google দিয়ে চালিয়ে যাওয়া সম্ভব হয়নি। আবার চেষ্টা করুন।"
    )
  }


  /* =========================================================
     UI
  ========================================================= */

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
    >
      <FieldGroup className="gap-4">


        {/* =================================================
            SERVER ERROR
        ================================================= */}

        {serverError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
            <p className="text-xs text-destructive">
              {serverError}
            </p>
          </div>
        )}


        {/* =================================================
            NAME
        ================================================= */}

        <Field className="gap-1.5">

          <FieldLabel className="text-xs font-medium">
            নাম
          </FieldLabel>

          <Input
            placeholder="আপনার পূর্ণ নাম লিখুন"
            disabled={isLoading}
            autoComplete="name"
            className="h-9 text-xs sm:h-10"
            {...register("name")}
          />

          {errors.name && (
            <p className="text-[10px] text-destructive">
              {errors.name.message}
            </p>
          )}

        </Field>


        {/* =================================================
            EMAIL
        ================================================= */}

        <Field className="gap-1.5">

          <FieldLabel className="text-xs font-medium">
            ইমেইল
          </FieldLabel>

          <Input
            type="email"
            placeholder="আপনার ইমেইল লিখুন"
            disabled={isLoading}
            autoComplete="email"
            className="h-9 text-xs sm:h-10"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-[10px] text-destructive">
              {errors.email.message}
            </p>
          )}

        </Field>


        {/* =================================================
            PASSWORD
        ================================================= */}

        <Field className="gap-1.5">

          <FieldLabel className="text-xs font-medium">
            পাসওয়ার্ড
          </FieldLabel>

          <InputGroup className="h-9 sm:h-10">

            <InputGroupInput
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="পাসওয়ার্ড লিখুন"
              disabled={isLoading}
              autoComplete="new-password"
              className="text-xs"
              {...register("password")}
            />

            <InputGroupAddon align="inline-end">

              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isLoading}
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                className="mr-0.5 h-7 w-7 sm:h-8 sm:w-8"
              >
                {showPassword ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
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


        {/* =================================================
            CONFIRM PASSWORD
        ================================================= */}

        <Field className="gap-1.5">

          <FieldLabel className="text-xs font-medium">
            পাসওয়ার্ড নিশ্চিত করুন
          </FieldLabel>

          <InputGroup className="h-9 sm:h-10">

            <InputGroupInput
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="পাসওয়ার্ড আবার লিখুন"
              disabled={isLoading}
              autoComplete="new-password"
              className="text-xs"
              {...register(
                "confirmPassword"
              )}
            />

            <InputGroupAddon align="inline-end">

              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isLoading}
                onClick={() =>
                  setShowConfirmPassword(
                    (prev) => !prev
                  )
                }
                className="mr-0.5 h-7 w-7 sm:h-8 sm:w-8"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </Button>

            </InputGroupAddon>

          </InputGroup>

          {errors.confirmPassword && (
            <p className="text-[10px] text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}

        </Field>


        {/* =================================================
            TERMS
        ================================================= */}

        <div className="flex items-start gap-2">

          <Checkbox
            id="terms"
            disabled={isLoading}
            className="mt-0.5 h-3.5 w-3.5 shrink-0"
          />

          <label
            htmlFor="terms"
            className="cursor-pointer text-xs leading-relaxed text-muted-foreground"
          >
            আমি{" "}
            <span className="font-medium text-primary">
              শর্তাবলি ও নীতিমালা
            </span>{" "}
            মেনে নিচ্ছি।
          </label>

        </div>


        {/* =================================================
            REGISTER BUTTON
        ================================================= */}

        <Button
          className="h-9 w-full text-xs font-medium sm:h-10"
          disabled={isLoading}
          type="submit"
        >

          {isRegisterLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              অ্যাকাউন্ট তৈরি হচ্ছে...
            </>
          ) : (
            "অ্যাকাউন্ট তৈরি করুন"
          )}

        </Button>


        {/* =================================================
            DIVIDER
        ================================================= */}

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


        {/* =================================================
            GOOGLE LOGIN
        ================================================= */}

        <div className="flex w-full justify-center">

          {isGoogleLoading ? (
            <div className="flex h-10 w-full items-center justify-center rounded-md border text-xs text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Google দিয়ে চালু হচ্ছে...
            </div>
          ) : (
            <GoogleLogin
              onSuccess={(
                credentialResponse
              ) => {

                console.log(
                  "GOOGLE CREDENTIAL RECEIVED:",
                  !!credentialResponse.credential
                )

                if (
                  !credentialResponse.credential
                ) {
                  setServerError(
                    "Google থেকে পরিচয় তথ্য পাওয়া যায়নি।"
                  )

                  return
                }

                handleGoogleToken(
                  credentialResponse.credential
                )
              }}

              onError={
                handleGoogleError
              }

              /*
               * Do NOT use width="100%"
               *
               * Google GSI does not accept
               * percentage width here.
               */
              width="360"

              /*
               * Prevent One Tap from creating
               * another Google initialization.
               */
              useOneTap={false}

              theme="outline"

              text="continue_with"

              shape="rectangular"
            />
          )}

        </div>

      </FieldGroup>
    </form>
  )
}
