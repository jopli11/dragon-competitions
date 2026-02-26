import { Container } from "@/components/Container";
import { BrandSectionHeading, GradientText } from "@/lib/styles";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Skeleton */}
      <div className="h-[20vh] min-h-[240px] w-full bg-brand-midnight/5 animate-pulse" />
      
      <Container className="py-12">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-8">
            {/* Main Image Skeleton */}
            <div className="aspect-16/10 w-full rounded-[2.5rem] bg-brand-midnight/5 animate-pulse shadow-sm" />
            
            {/* Content Skeleton */}
            <div className="space-y-4">
              <div className="h-8 w-1/3 rounded-lg bg-brand-midnight/5 animate-pulse" />
              <div className="h-4 w-full rounded-lg bg-brand-midnight/5 animate-pulse" />
              <div className="h-4 w-full rounded-lg bg-brand-midnight/5 animate-pulse" />
              <div className="h-4 w-2/3 rounded-lg bg-brand-midnight/5 animate-pulse" />
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="h-32 rounded-2xl bg-brand-accent/30 animate-pulse" />
              <div className="h-32 rounded-2xl bg-brand-accent/30 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Sidebar Skeleton */}
            <div className="h-[400px] rounded-[2.5rem] bg-brand-midnight/5 animate-pulse border border-brand-primary/5" />
            <div className="h-[200px] rounded-[2.5rem] bg-brand-midnight/5 animate-pulse border border-brand-primary/5" />
          </div>
        </div>
      </Container>
    </div>
  );
}
