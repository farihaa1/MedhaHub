import RegisterForm from "@/app/customComponents/Register/register-form"
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

const Register = () => {
  return (
    <div className="relative flex items-center justify-center pt-20">
      <div className="absolute">
        <AuthBackgroundShape />
      </div>

      <Card className="z-1 w-full gap-6 py-6 text-center sm:max-w-lg">
        <CardHeader className="gap-6 px-6">
          <CardTitle className="mb-2 text-2xl font-semibold">
            Create Your Account
          </CardTitle>

          <CardDescription className="text-base">
            Join MedhaHub to practice quizzes, take mock exams, track your
            progress, and compete on the leaderboard.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6">
          {/* Register Form */}
          <div className="space-y-4">
            <RegisterForm />

            <p className="text-center text-base text-muted-foreground">
              Already have an account?
            </p>
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/register/google">
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

export default Register
