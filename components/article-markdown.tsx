import { FullWidthImage } from "@/components/full-width-image";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";

const articleSchema: NonNullable<Parameters<typeof rehypeSanitize>[0]> = {
  ...defaultSchema,
  protocols: {
    ...(defaultSchema.protocols ?? {}),
    href: ["http", "https", "mailto", "tel"],
    src: ["http", "https"],
  },
  attributes: {
    ...(defaultSchema.attributes ?? {}),
    a: [...((defaultSchema.attributes ?? {}).a ?? []), "title"],
    img: [
      ...((defaultSchema.attributes ?? {}).img ?? []),
      "alt",
      "width",
      "height",
    ],
  },
};

export function ArticleMarkdown({ content }: { content: string }) {
  return (
    <div className="space-y-7 wrap-break-word text-[1.125rem] leading-[1.75] text-foreground/90 sm:text-[1.1875rem] sm:leading-[1.8] [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:mr-3 [&>p:first-of-type]:first-letter:mt-1 [&>p:first-of-type]:first-letter:font-serif [&>p:first-of-type]:first-letter:text-5xl [&>p:first-of-type]:first-letter:font-semibold [&>p:first-of-type]:first-letter:leading-[0.85] [&>p:first-of-type]:first-letter:text-primary">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, articleSchema]]}
        components={{
          h2: ({ children }) => (
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="wrap-break-word text-pretty">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-1 pl-6">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-1 pl-6">{children}</ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4"
            >
              {children}
            </a>
          ),
          img: ({ src, alt, width, height }) => {
            const srcString = typeof src === "string" ? src : "";
            if (!srcString) return null;
            return (
              <figure className="my-10">
                <FullWidthImage
                  src={srcString}
                  alt={alt || ""}
                  width={Number(width) || undefined}
                  height={Number(height) || undefined}
                  fit="contain"
                  fillFrame={false}
                  maxHeight="min(16rem, 38vh)"
                  sizes="(max-width: 680px) 100vw, 672px"
                />
                {alt && (
                  <figcaption className="mx-auto mt-3 max-w-md text-center text-[0.8rem] leading-snug text-muted-foreground">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted p-4 text-sm text-foreground">
              {children}
            </pre>
          ),
          code: ({ children }) => (
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
              {children}
            </code>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">{children}</table>
            </div>
          ),
          hr: () => <hr className="border-border/60" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
