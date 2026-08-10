import Link from "next/link"
import { ArrowRight, Rocket } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"

function HeroSection() {
  return (
    <section className="w-full py-3 pb-8">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          {/* =====================================================
              LEFT CONTENT
          ===================================================== */}

          <div className="relative z-10 w-full md:w-7/12">
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              শুভ সকাল, রহমান 👋
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              আজকের প্রস্তুতি শুরু করুন
            </h1>

            <p className="mt-2 max-w-md text-xs leading-5 text-muted-foreground">
              প্রতিদিন নতুন কিছু শিখুন, নিয়মিত অনুশীলন করুন এবং সরকারি চাকরির
              প্রস্তুতিতে এগিয়ে থাকুন।
            </p>

            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                asChild
                size="sm"
                className="h-8 px-3 text-xs font-semibold"
              >
                <Link href="/ajker-porikolpona">
                  <Rocket className="mr-1.5 h-3.5 w-3.5" />
                  আজকের পরিকল্পনা
                </Link>
              </Button>

              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs font-semibold"
              >
                <Link href="/quick-exam">
                  দ্রুত পরীক্ষা
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* =====================================================
              HERO IMAGE
          ===================================================== */}

          <div className="relative hidden flex-1 items-center justify-center md:flex">
            <Image
              src="/medhahub_hero_image.png"
              alt="MedhaHub"
              width={280}
              height={280}
              priority
              className="h-40 w-auto object-contain lg:h-44"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
