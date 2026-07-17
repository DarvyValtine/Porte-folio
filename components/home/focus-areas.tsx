import { HeartHandshake, Scale, Users, PhoneCall } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const iconMap: Record<string, typeof HeartHandshake> = {
  HeartHandshake,
  Scale,
  Users,
  PhoneCall,
};

type FocusAreaItem = {
  icon: string
  title: string
  description: string
}

type FocusAreasData = {
  eyebrow: string
  title: string
  items: FocusAreaItem[]
}

export function FocusAreas({ data }: { data: FocusAreasData }) {
  return (
    <section className="border-y border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.16em] text-primary">
            {data.eyebrow}
          </p>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
            {data.title}
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((area) => {
            const Icon = iconMap[area.icon] || HeartHandshake;
            return (
              <Card
                key={area.title}
                className="border-border/60 bg-card transition-shadow hover:shadow-md hover:shadow-primary/5"
              >
                <CardContent className="space-y-4 p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    {area.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {area.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
