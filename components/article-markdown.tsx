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
    <div className="space-y-5 wrap-break-word leading-relaxed text-foreground/90">
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
              <figure className="my-6">
                <FullWidthImage
                  src={srcString}
                  alt={alt || ""}
                  width={Number(width) || undefined}
                  height={Number(height) || undefined}
                  fit="cover"
                  maxHeight="300px"
                  bordered
                />
                {alt && (
                  <figcaption className="mt-2 text-center text-xs text-muted-foreground italic">
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
