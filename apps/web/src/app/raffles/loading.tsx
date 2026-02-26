import { Container } from "@/components/Container";
import { BrandSectionHeading, GradientText } from "@/lib/styles";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white py-20">
      <Container>
        <div className="text-center mb-12">
          <div className="mx-auto h-12 w-64 rounded-xl bg-brand-midnight/5 animate-pulse mb-4" />
          <div className="mx-auto h-4 w-48 rounded-lg bg-brand-midnight/5 animate-pulse" />
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="overflow-hidden rounded-4xl border border-brand-primary/5 bg-white shadow-sm">
              <div className="aspect-4/3 w-full bg-brand-midnight/5 animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="h-6 w-3/4 rounded-lg bg-brand-midnight/5 animate-pulse" />
                <div className="flex justify-between">
                  <div className="h-3 w-1/3 rounded-lg bg-brand-midnight/5 animate-pulse" />
                  <div className="h-3 w-1/4 rounded-lg bg-brand-midnight/5 animate-pulse" />
                </div>
                <div className="h-1.5 w-full rounded-full bg-brand-accent/50 animate-pulse" />
                <div className="h-12 w-full rounded-2xl bg-brand-midnight/5 animate-pulse mt-4" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
