import Link from "next/link"
import { ArrowRight, Rocket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

function HeroSection() {
  return (
    <section className="">
      <Card className="overflow-hidden border-0">
        <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
          {/* Left Content */}
          <div className="flex w-5/12 flex-col gap-3">
            <h1 className="text-xl font-bold tracking-tight md:text-2xl">
              শুভ সকাল, রহমান 👋
            </h1>

            <p className="max-w-xl text-sm text-white/90">
              প্রতিদিন নতুন কিছু শিখুন, নিয়মিত অনুশীলন করুন এবং সরকারি চাকরির
              প্রস্তুতিতে এগিয়ে থাকুন।
            </p>
            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-white text-green-700 hover:bg-gray-100"
              >
                <Link href="/ajker-porikolpona">
                  <Rocket className="mr-2 h-5 w-5" />
                  আজকের পরিকল্পনা
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-black/20 text-white hover:bg-black/30"
              >
                <Link href="/quick-exam">
                  দ্রুত পরীক্ষা
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative hidden w-7/12 items-center justify-center md:flex">
            {/* Glow */}
            <div className="absolute h-72 w-72 rounded-full bg-green-400/20 blur-3xl" />

            <Image
              src="/medhahub_hero_image.png"
              alt="MedhaHub Hero"
              width={320}
              height={320}
              priority
              className="relative z-10 h-64 w-auto object-contain"
            />
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default HeroSection
