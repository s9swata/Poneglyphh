import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const posts = [
  {
    slug: "poneglyph-is-open",
    tag: "Launch",
    title: "Poneglyph is now open: 156,000+ records, free to query",
    excerpt:
      "We are thrilled to launch the Poneglyph humanitarian data commons, making thousands of incident reports available to researchers globally via our agentic terminal.",
    date: "Mar 10, 2025",
    readTime: "4 min read",
    size: "large",
    image: "/images/blog/blog-seed-round.png",
    imagePrompt:
      "A vibrant, minimalist illustration of interconnected nodes and networks glowing with purpose-driven energy. Features collaborative figures working together across digital bridges, symbolizing global coordination and humanitarian impact. Clean modern aesthetic with warm accent colors representing growth and connection.",
  },
  {
    slug: "how-ngos-contribute-data",
    tag: "Guide",
    title: "How NGOs can contribute data that actually gets used",
    excerpt:
      "From formatting field reports to ensuring compliance — everything NGOs need to know before publishing their first dataset to the commons.",
    date: "Feb 24, 2025",
    readTime: "8 min read",
    size: "small",
    image: "/images/blog/blog-matching-guide.png",
    imagePrompt:
      "A structured, educational visual showing a flowchart or roadmap with diverse volunteers connecting to opportunities. Clean iconography representing skills, matching, and growth. Organized, guide-like aesthetic with clear visual hierarchy and helpful design patterns.",
  },
  {
    slug: "ai-turns-field-reports-to-intelligence",
    tag: "Product",
    title: "How AI turns field reports into published intelligence",
    excerpt:
      "Automated ingestion, cross-border correlation, and agentic research are changing what it means to analyze unstructured field data at scale.",
    date: "Feb 10, 2025",
    readTime: "5 min read",
    size: "small",
    image: "/images/blog/blog-ai-ngos.png",
    imagePrompt:
      "Futuristic but warm illustration of AI-powered systems orchestrating volunteer coordination. Features neural networks, data flows, and human figures working with intelligent systems. Modern tech aesthetic balanced with humanity and purpose. Emphasizes scale, efficiency, and smart resource allocation.",
  },
  {
    slug: "trafficking-routes-no-one-was-tracking",
    tag: "Research",
    title: "The trafficking routes no one was tracking — until now",
    excerpt:
      "Our autonomous agents analyzed 50,000+ scattered reports to uncover entirely new exploitation corridors in South-East Asia.",
    date: "Jan 28, 2025",
    readTime: "6 min read",
    size: "medium",
    image: "/images/blog/blog-impact-metrics.png",
    imagePrompt:
      "An informative visualization showing impact metrics, dashboards, and measurement tools in action. Includes graphs, analytics, and real-world outcomes being tracked. Beginner-friendly visual language with clear data representations. Emphasizes clarity, measurement, and tangible results.",
  },
  {
    slug: "5-years-humanitarian-data-forced-labor",
    tag: "Analysis",
    title: "What 5 years of humanitarian data tells us about forced labor",
    excerpt:
      "Accurate insights require accurate inputs. We synthesized half a decade of NGO submissions to identify persistent gaps in forced labor reporting.",
    date: "Jan 15, 2025",
    readTime: "4 min read",
    size: "medium",
    image: "/images/blog/blog-volunteer-retention.png",
    imagePrompt:
      "A warm, community-focused illustration showing long-term relationships and trust building between organizations and volunteers. Depicts retention, growth, and lasting commitment through visual metaphors like roots, foundations, or continuous journeys. Emphasizes community, trust, and sustainable engagement.",
  },
];

function BlogCard({ post }: { post: (typeof posts)[0] }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col gap-4 bg-white border border-grey-3 rounded-2xl overflow-hidden hover:border-grey-2 transition-colors"
      title={`Image prompt: ${post.imagePrompt}`}
    >
      <div className="w-full aspect-video bg-grey-4 relative overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-col gap-3 p-5 pb-6">
        <span className="text-[10px] font-medium uppercase tracking-widest text-grey-1 bg-grey-4 px-2 py-1 rounded-full w-fit">
          {post.tag}
        </span>
        <h3 className="text-base font-medium text-black leading-snug group-hover:text-grey-1 transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-grey-1 leading-relaxed line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center gap-2 text-xs text-grey-2 mt-1">
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <>
      <Navigation />
      {/* ── Hero ── */}
      <section className="py-16 border-b border-grey-3">
        <div className="container-max flex flex-col items-center gap-4 text-center">
          <p className="text-sub font-medium uppercase tracking-widest text-grey-1">blog</p>
          <h1 className="text-[clamp(36px,5vw,56px)] font-medium leading-tight tracking-tight text-black">
            Articles, insights &amp; trend reports
          </h1>
        </div>
      </section>

      {/* ── Featured post ── */}
      <section className="py-16 bg-white">
        <div className="container-max">
          <Link
            href={`/blog/${featured.slug}`}
            className="group flex flex-col md:flex-row gap-8 bg-white border border-grey-3 rounded-2xl overflow-hidden hover:border-grey-2 transition-colors"
            title={`Image prompt: ${featured.imagePrompt}`}
          >
            <div className="md:w-1/2 aspect-video md:aspect-auto bg-grey-4 min-h-[240px] relative overflow-hidden">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="flex flex-col justify-center gap-4 p-8">
              <span className="text-[10px] font-medium uppercase tracking-widest text-grey-1 bg-grey-4 px-2 py-1 rounded-full w-fit">
                {featured.tag}
              </span>
              <h2 className="text-[clamp(22px,3vw,32px)] font-medium leading-snug text-black group-hover:text-grey-1 transition-colors">
                {featured.title}
              </h2>
              <p className="text-body text-grey-1">{featured.excerpt}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-grey-2">
                  {featured.date} · {featured.readTime}
                </span>
                <span className="flex items-center gap-1 text-sm font-medium text-black group-hover:gap-2 transition-all">
                  Read more <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Post grid ── */}
      <section className="pb-24 bg-white">
        <div className="container-max grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rest.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
