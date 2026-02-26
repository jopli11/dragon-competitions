import { Container } from "@/components/Container";
import { BrandButton, BrandSectionHeading, GradientText } from "@/lib/styles";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center bg-white py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-[120px] font-black leading-none text-brand-primary/10 mb-4 select-none">
            404
          </div>
          
          <BrandSectionHeading className="text-brand-midnight!">
            Page Not <GradientText>Found</GradientText>
          </BrandSectionHeading>
          
          <p className="mt-6 text-lg font-medium text-brand-midnight/60 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back to the competitions!
          </p>
          
          <div className="mt-10">
            <Link href="/raffles">
              <BrandButton size="lg" className="min-w-[240px]">
                Browse Competitions
              </BrandButton>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
