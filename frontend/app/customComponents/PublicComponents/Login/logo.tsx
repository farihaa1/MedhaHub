
import { cn } from "@/lib/utils"
import { LogoSvg } from "@/public/svg/logo"

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoSvg className="size-8.5" />
      <span className="text-xl font-bold">MedhaHub</span>
    </div>
  )
}

export default Logo
