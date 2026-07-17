import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type CtaData = {
  title: string
  body: string
  buttonText: string
  buttonLink: string
}

export function HomeCta({ data }: { data: CtaData }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
      <div className="overflow-hidden rounded-[2rem] border border-primary/20 bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
        <h2 className="mx-auto max-w-2xl font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {data.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-primary-foreground/85 text-pretty">
          {data.body}
        </p>
        <Button
          asChild
          size="lg"
          variant="secondary"
          className="mt-8 rounded-full"
        >
          <Link href={data.buttonLink}>
            {data.buttonText}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
