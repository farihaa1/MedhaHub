import LoginForm from "@/app/customComponents/Login/login-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import AuthBackgroundShape from "@/public/svg/auth-backgrounf-shape"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"

const Login = () => {
 
  return (
    <div className="relative flex items-center justify-center pt-20">
      <div className="absolute">
        <AuthBackgroundShape />
      </div>

      <Card className="z-1 w-full gap-6 py-6 text-center sm:max-w-lg">
        <CardHeader className="gap-6 px-6">
          <CardTitle className="mb-2 text-2xl font-semibold">
            Welcome to MedhaHub
          </CardTitle>

          <CardDescription className="text-base">
            Sign in to access mock tests, practice sets, previous year
            questions, personalized analytics, and leaderboard rankings.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6">
          {/* Login Form */}
          <div className="space-y-4">
            <LoginForm />

            <p className="text-center text-base text-muted-foreground">
              New on our platform?
              <Link
                href="/register"
                className="px-2 text-card-foreground hover:underline"
              >
                Create an account
              </Link>
            </p>

            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <p className="text-base">or</p>
              <Separator className="flex-1" />
            </div>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/login/google">
                <FcGoogle className="mr-2 h-5 w-5" />
                Continue with Google
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
