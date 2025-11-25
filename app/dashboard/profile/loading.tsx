import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#2D6A4F] pt-12 pb-20 px-6 rounded-b-[32px]">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="w-10 h-10 rounded-full bg-white/20" />
          <Skeleton className="w-32 h-6 bg-white/20" />
          <Skeleton className="w-10 h-10 rounded-full bg-white/20" />
        </div>
      </div>
      <div className="px-6 -mt-16">
        <Skeleton className="w-full h-48 rounded-3xl" />
      </div>
      <div className="px-6 mt-6 space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="w-full h-20 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
