import { Badge } from "@Poneglyph/ui/components/badge";
import { IconShare, IconBookmark } from "@tabler/icons-react";
import Link from "next/link";

export interface Article {
  id: string;
  heading: string;
  imageUrl: string;
  content: string;
  datasetIds: string[];
}

interface ArticleCardProps {
  article: Article;
  category?: string;
  isPreview?: boolean;
  variant?: "grid" | "carousel";
}

export function ArticleCard({
  article,
  category,
  isPreview,
  variant = "grid",
}: ArticleCardProps) {
  return (
    <Link
      href={`/dashboard/${article.id}`}
      className="group flex flex-col overflow-hidden rounded-md border border-grey-3 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-grey-2 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden bg-grey-35 ${
          variant === "carousel" ? "aspect-[4/3]" : "aspect-[3/2]"
        }`}
      >
        <img
          src={article.imageUrl}
          alt={article.heading}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {isPreview && (
          <span className="absolute left-3 top-3 bg-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
            Preview
          </span>
        )}
        <div className="absolute bottom-2 right-2">
          <span className="rounded-sm bg-white/95 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black shadow-sm">
            Poneglyph
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4 pb-0">
        {category && (
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-black">
            {category}
          </p>
        )}
        <h3 className="mb-2 text-body-sm font-bold leading-snug tracking-tight text-black line-clamp-2">
          {article.heading}
        </h3>
        <p className="flex-1 text-[13px] leading-relaxed text-gray-500 line-clamp-3">
          {article.content}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-gray-300 px-4 py-2.5">
        <div className="flex flex-wrap gap-1">
          {article.datasetIds.slice(0, 2).map((id) => (
            <Badge
              key={id}
              variant="secondary"
              className="h-4 px-1.5 text-[10px]"
            >
              {id}
            </Badge>
          ))}
          {article.datasetIds.length > 2 && (
            <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
              +{article.datasetIds.length - 2}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-grey-2">
          <IconShare className="size-3.5 cursor-pointer transition-colors hover:text-grey-1" />
          <IconBookmark className="size-3.5 cursor-pointer transition-colors hover:text-grey-1" />
        </div>
      </div>
    </Link>
  );
}
