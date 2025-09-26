import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Skeleton pro služby
export const ServicesSkeleton = () => (
  <div className="grid md:grid-cols-2 gap-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <Card key={index} className="bg-card border-border">
        <CardHeader>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
);

// Skeleton pro hero sekci
export const HeroSkeleton = () => (
  <div className="min-h-screen relative overflow-hidden">
    <Skeleton className="absolute inset-0 w-full h-full" />
    <div className="relative z-10 container mx-auto px-6 h-screen flex items-center">
      <div className="max-w-2xl space-y-6">
        <Skeleton className="h-16 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
        <div className="flex gap-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>
    </div>
  </div>
);

// Skeleton pro about sekci
export const AboutSkeleton = () => (
  <div className="grid lg:grid-cols-2 gap-12 items-center">
    <div className="space-y-6">
      <Skeleton className="h-12 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
    <div className="relative h-[600px]">
      <Skeleton className="absolute inset-0 w-full h-full rounded-2xl" />
    </div>
  </div>
);

// Skeleton pro kontaktní formulář
export const ContactFormSkeleton = () => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-24 w-full" />
    </div>
    <Skeleton className="h-10 w-32" />
  </div>
);




