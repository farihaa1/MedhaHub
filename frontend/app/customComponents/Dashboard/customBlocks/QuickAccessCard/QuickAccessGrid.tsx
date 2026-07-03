import { QuickAccessCard } from "./QuickAccessCard"
import { quickAccess } from "./quickAccessData"

export default function QuickAccessGrid() {
  return (
    <section className="mt-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {quickAccess.map((item) => (
          <QuickAccessCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  )
}
