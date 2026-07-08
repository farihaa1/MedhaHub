import type { ReactNode } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  UserIcon,
  SettingsIcon,
  CreditCardIcon,
  UsersIcon,
  SquarePenIcon,
  CirclePlusIcon,
  LogOutIcon,
} from "lucide-react"
import LogoutButton from "../../LogoutButton/LogoutButton"

type Props = {
  trigger: ReactNode
  defaultOpen?: boolean
  align?: "start" | "center" | "end"
}

const ProfileDropdown = ({ trigger, defaultOpen, align = "end" }: Props) => {
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align={align || "end"}>
        <DropdownMenuLabel className="flex items-center gap-4 px-4 py-2.5 font-normal">
          <div className="relative">
            <Avatar size="lg">
              <AvatarImage
                src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png"
                alt="John Doe"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span className="absolute right-0 bottom-0 block size-2 rounded-full bg-green-600 ring-2 ring-card" />
          </div>
          <div className="flex flex-1 flex-col items-start">
            <span className="text-lg font-semibold text-foreground">
              John Doe
            </span>
            <span className="text-base text-muted-foreground">
              john.doe@example.com
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-2 px-4 py-2.5 text-base">
            <UserIcon className="size-5 text-foreground" />
            <span>My account</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 px-4 py-2.5 text-base">
            <SettingsIcon className="size-5 text-foreground" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 px-4 py-2.5 text-base">
            <CreditCardIcon className="size-5 text-foreground" />
            <span>Billing</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-2 px-4 py-2.5 text-base">
            <UsersIcon className="size-5 text-foreground" />
            <span>Manage team</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 px-4 py-2.5 text-base">
            <SquarePenIcon className="size-5 text-foreground" />
            <span>Customization</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 px-4 py-2.5 text-base">
            <CirclePlusIcon className="size-5 text-foreground" />
            <span>Add team account</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          className="gap-2 px-4 py-2.5 text-base"
        >
          <LogOutIcon className="size-5" />
          <LogoutButton></LogoutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropdown
