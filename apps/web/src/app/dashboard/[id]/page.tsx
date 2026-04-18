"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@Poneglyph/ui/components/button";
import { Badge } from "@Poneglyph/ui/components/badge";
import { Input } from "@Poneglyph/ui/components/input";
import {
  ChevronRight,
  Download,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check,
  Database,
} from "lucide-react";
import type { Article } from "../components/article-card";
import { apiClient } from "@/lib/api-client";
import type { DatasetListItem, PaginatedResponse } from "@/lib/types";

const ARTICLE_CATEGORIES: Record<string, string> = {
  "1": "Health",
  "2": "Education",
  "3": "Climate",
  "4": "Economics",
  "5": "Health",
  "6": "Society",
  "7": "Employment",
  "8": "Technology",
  "9": "Food & Agriculture",
};

const sampleArticles: Article[] = [
  {
    id: "1",
    heading: "Global Health Trends 2024",
    imageUrl:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=500&fit=crop",
    content:
      "Analysis of health survey data across 50 countries showing emerging health patterns and disease prevalence.",
    datasetIds: ["DS-001", "DS-002"],
  },
  {
    id: "2",
    heading: "Education Access Report",
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da1a496d?w=800&h=500&fit=crop",
    content:
      "Insights on educational opportunities in developing regions based on collected survey data.",
    datasetIds: ["DS-003"],
  },
  {
    id: "3",
    heading: "Climate Impact Survey",
    imageUrl:
      "https://images.unsplash.com/photo-1569163139599-0f4517e36b51?w=800&h=500&fit=crop",
    content:
      "Data-driven analysis of climate change effects on local communities and agriculture.",
    datasetIds: ["DS-004", "DS-005", "DS-006"],
  },
  {
    id: "4",
    heading: "Poverty Alleviation Progress",
    imageUrl:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=500&fit=crop",
    content:
      "Tracking poverty indicators over the past decade using aggregated survey datasets.",
    datasetIds: ["DS-007"],
  },
  {
    id: "5",
    heading: "Water Sanitation Study",
    imageUrl:
      "https://images.unsplash.com/photo-1541976590-713941481591?w=800&h=500&fit=crop",
    content:
      "Survey results on water and sanitation access in rural areas of developing nations.",
    datasetIds: ["DS-008", "DS-009"],
  },
  {
    id: "6",
    heading: "Gender Equality Index",
    imageUrl:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=500&fit=crop",
    content:
      "Comprehensive gender equality metrics derived from multiple survey sources worldwide.",
    datasetIds: ["DS-010"],
  },
  {
    id: "7",
    heading: "Youth Employment Survey",
    imageUrl:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=500&fit=crop",
    content:
      "Analysis of youth unemployment rates and employment trends across major economies.",
    datasetIds: ["DS-011"],
  },
  {
    id: "8",
    heading: "Digital Inclusion Report",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=500&fit=crop",
    content:
      "Measuring digital literacy and internet access in underserved communities globally.",
    datasetIds: ["DS-012", "DS-013"],
  },
  {
    id: "9",
    heading: "Food Security Analysis",
    imageUrl:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=500&fit=crop",
    content:
      "Comprehensive study on food accessibility and nutrition across different regions.",
    datasetIds: ["DS-014"],
  },
];

const ARTICLE_BODIES: Record<string, string[]> = {
  "1": [
    "The 2024 Global Health Survey reveals unprecedented patterns in disease prevalence across 50 nations. Conducted between January and September 2024, the survey gathered responses from over 2.4 million participants — representing the most comprehensive health data collection effort in recent years.",
    "Mental health emerged as the most pressing concern globally, with 34% of respondents reporting moderate to severe anxiety symptoms, a 12-point increase from the 2019 baseline. Sub-Saharan Africa showed the steepest rise, while Northern European countries demonstrated the most robust resilience infrastructure, driven by sustained investment in community mental health services.",
    "Non-communicable diseases continue their upward trajectory. Diabetes prevalence reached 11.3% globally, while cardiovascular conditions affect an estimated 520 million people. Notably, low- and middle-income countries now account for 77% of all cardiovascular deaths — underscoring the urgent need for targeted policy interventions and affordable treatment access.",
    "Access to primary healthcare remains deeply unequal. The data shows a 4.7× gap between rural and urban healthcare utilization rates in developing regions, compared to a 1.9× gap in high-income nations. Telemedicine adoption since the pandemic has partially bridged this divide, particularly in South Asia, where mobile penetration makes digital health delivery viable at scale.",
  ],
  "2": [
    "Educational access in developing regions remains one of the most persistent challenges of our era. This comprehensive report, drawing on survey data from 28 countries across Sub-Saharan Africa, South Asia, and Latin America, paints a nuanced picture of both measurable progress and entrenched inequality.",
    "Primary school enrollment rates have improved markedly, reaching 91% globally for the first time on record. However, completion rates tell a more sobering story. In the lowest-income quintile, only 56% of students who enroll in primary school complete a full secondary education, compared to 94% in the highest income quintile — a gap that has barely narrowed over the past decade.",
    "The cost of education remains the primary barrier cited by families, with 68% of respondents identifying it as a significant constraint. Distance to school (42%) and domestic labor obligations (38%) follow closely. Girls face compounding disadvantages: in regions with gender pay gaps exceeding 30%, families are 2.3× more likely to deprioritize daughters' schooling.",
    "Digital education initiatives show promise but uneven results. Schools with reliable electricity and internet access reported 22% better attendance and 18% higher test scores. Yet only 31% of rural schools in surveyed regions had consistent electricity, illustrating the infrastructure investment required before digital learning can reach its potential.",
  ],
  "3": [
    "Climate change is no longer a distant forecast — it is a lived reality reshaping agriculture, livelihoods, and community resilience across the globe. This survey, conducted in 35 countries at high climate vulnerability, documents how local communities are experiencing and adapting to rapid environmental disruption.",
    "Smallholder farmers represent the sharpest edge of climate impact. 74% of surveyed agricultural households reported at least one major crop failure in the past three years, with erratic rainfall cited as the leading cause (61%), followed by unseasonable frosts (29%) and flooding events (24%). Average household income for affected farmers fell 28% following a significant crop failure.",
    "Water stress is escalating sharply. In arid and semi-arid regions, 43% of respondents reported that water sources reliable a decade ago are now seasonal or permanently diminished. This is forcing migration: 17% of surveyed households have relocated or are actively planning relocation due to water scarcity — a figure that rises to 29% in the most severely affected zones.",
    "Community adaptation strategies are emerging organically but require support to scale. 58% of communities have adopted drought-resistant crop varieties; 34% have implemented rainwater harvesting systems. Those with access to NGO extension services showed 3.1× higher adoption rates, demonstrating the critical leverage of organizational support in accelerating climate resilience.",
  ],
  "4": [
    "Global poverty rates have declined significantly over the past decade, yet the pace of progress has slowed and remains deeply uneven across regions, demographics, and the urban-rural divide. This longitudinal survey tracks poverty indicators across 42 countries from 2014 to 2024.",
    "The extreme poverty rate — living on less than $2.15 per day — fell from 10.7% in 2014 to 8.4% in 2024. Meaningful progress, but far below the trajectory needed to meet the 2030 Sustainable Development Goals. Progress has been concentrated in East and South Asia, while Sub-Saharan Africa saw only marginal improvement of 0.8 percentage points over the entire decade.",
    "Multi-dimensional poverty reveals a more complex picture. When access to education, healthcare, and sanitation are factored in alongside income, the global poverty rate rises to 22.4%. This gap between monetary and multi-dimensional measures is largest in South Asia, where income growth has outpaced improvements in public service delivery by 17 percentage points.",
    "Cash transfer programs show the strongest and most consistent impact on reducing acute poverty. Every $1 invested in direct cash transfers generates an estimated $2.40 in local economic activity, with multiplier effects concentrated in local food and informal service markets. Conditionality attached to transfers — particularly school enrollment requirements — shows modest additional gains in human capital outcomes.",
  ],
  "5": [
    "Access to safe water and adequate sanitation remains one of the most fundamental unmet needs in rural communities across the developing world. This survey examines conditions in 1,200 villages across 18 countries, documenting water quality, sanitation coverage, and the profound human cost of inadequate infrastructure.",
    "Nearly 2.1 billion people still lack access to safe drinking water at home. In our surveyed communities, 61% of rural households rely on surface water or unprotected wells as their primary drinking water source. Of these, 78% showed fecal coliform contamination at levels exceeding WHO safety thresholds — directly linked to the high rates of waterborne illness documented in these populations.",
    "Women and girls bear a disproportionate burden of water collection. The average daily collection time is 4.3 hours in households without piped water, time that falls almost exclusively on women and girls. Reducing collection time to below 30 minutes is associated with a 27% increase in girls' school attendance and a 19% reduction in reported domestic violence incidents.",
    "Community-led total sanitation (CLTS) programs show strong results when properly supported over time. Villages with active CLTS programs for three or more years achieved 84% open-defecation-free status, compared to 31% in control villages. Sustained follow-up, community ownership, and local champion networks are the strongest predictors of lasting behavior change.",
  ],
  "6": [
    "Gender equality progress has been uneven and, in some critical dimensions, has reversed in the post-pandemic period. This comprehensive index, drawing on 847 indicators across 94 countries, measures equality across economic participation, educational attainment, health outcomes, and political empowerment.",
    "Economic participation gaps remain the most persistent dimension of gender inequality. The global gender wage gap stands at 18.4%, meaning women earn 81.6 cents for every dollar earned by men in equivalent roles. This gap widens significantly in sectors dominated by informal work, where women comprise 58% of the workforce but are largely excluded from social protection, benefits, and formal advancement pathways.",
    "Political representation has seen the most measurable progress of any dimension. The global share of women in national parliaments reached 26.5% in 2024, up from 22.5% in 2019. Countries with legislated gender quotas average 31.4% female representation, compared to 22.1% in countries without — a compelling case for structural intervention.",
    "Violence against women remains a structural barrier to equality that aggregate economic indicators cannot capture. 30% of survey respondents reported experiencing physical or sexual violence from an intimate partner — a figure that rises to 41% in conflict-affected regions. Legal frameworks addressing domestic violence exist in 79 countries, but 67% of survivors in those jurisdictions report enforcement as consistently inadequate.",
  ],
  "7": [
    "Youth unemployment has reached crisis levels in many parts of the world, with the global youth unemployment rate standing at 13.6% — more than triple the adult unemployment rate. Yet aggregate figures obscure profound disparities across geography, education level, and demographic group that demand more nuanced policy responses.",
    "The NEET rate — young people Not in Education, Employment, or Training — is the more revealing metric for understanding structural youth exclusion. Globally, 22.4% of young people aged 15–24 are NEET, with the highest rates in North Africa (35.2%), Sub-Saharan Africa (34.1%), and parts of South and Southeast Asia. Young women are 1.9× more likely to be NEET than young men.",
    "Skill mismatches between education systems and labor markets are a primary driver of persistent youth unemployment. 67% of surveyed employers report difficulty finding young workers with adequate practical skills, while 74% of unemployed youth hold qualifications that don't match available openings. Vocational training programs that partner directly with industry show the strongest and most durable employment outcomes.",
    "Informal employment is the destination for the majority of employed youth in developing economies. 77% of young workers in low-income countries are in informal employment, with limited job security, no social protection, and median wages 43% below formal sector equivalents. The gig economy has simultaneously expanded access to income-generating activity and deepened economic precarity for this cohort.",
  ],
  "8": [
    "The digital divide has narrowed in some respects and deepened in others over the past five years. Smartphone penetration has expanded rapidly across income groups, yet meaningful digital participation — the ability to create, transact, and access services digitally — remains highly stratified by income, education, age, and geography.",
    "Mobile internet access now reaches 68% of the global population, but quality and affordability vary enormously. In the lowest-income quintile, 61% of households have mobile internet access, but only 29% can afford consistent data beyond basic messaging. The cost of 1GB of data represents 4.2% of monthly income for the poorest quintile, compared to 0.1% for the wealthiest — a 42× difference.",
    "Digital literacy gaps are the hidden barrier that raw access metrics fail to capture. 43% of adults in low- and middle-income countries who own smartphones cannot perform basic tasks such as completing an online form, using a banking app, or identifying phishing messages. Age, gender, and formal education level are the strongest predictors of functional digital literacy.",
    "The stakes of digital exclusion are rising as essential services migrate online. Communities with high digital literacy are 2.8× more likely to access government services digitally, 1.9× more likely to use formal financial services, and report 31% higher income from digital commerce opportunities. Investment in device access alone, without accompanying literacy programs, shows consistently limited impact.",
  ],
  "9": [
    "Global food insecurity has worsened significantly in the wake of cascading crises: the COVID-19 pandemic, the impact of the Russia-Ukraine conflict on global grain markets, and accelerating climate disruptions that affect harvests across the Southern Hemisphere. This survey, covering 1.2 million households across 55 countries, documents the breadth and depth of food access challenges.",
    "Acute food insecurity — defined as IPC Phase 3 and above — now affects an estimated 345 million people globally, a 12% increase from 2022 and a near-doubling from pre-pandemic levels. The Sahel, the Horn of Africa, and parts of South Asia account for the highest concentrations, but food insecurity has also risen measurably in Eastern Europe and Central America.",
    "Nutritional quality is a distinct and underreported dimension of food insecurity that caloric sufficiency metrics conceal. Even among households with adequate caloric intake, 41% show micronutrient deficiencies — the 'hidden hunger' that impairs cognitive development in children and reduces adult productivity. Ultra-processed foods now account for 34% of caloric intake in urban low-income communities.",
    "Local food systems show surprising resilience when appropriately supported. Communities with active farmers' market networks and cooperative storage facilities reported 28% lower food insecurity rates than comparable communities lacking such infrastructure. Short supply chains reduce price volatility and maintain nutritional variety — findings that argue for sustained investment in local food system development alongside global trade interventions.",
  ],
};

interface Dataset {
  id: string;
  title: string;
  description: string | null;
  publisher: string | null;
  language: string;
  fileTypes: string[] | null;
  status: string;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  tags?: Array<{ id: string; name: string; slug: string }>;
}

export default function ArticlePage() {
  const params = useParams<{ id: string }>();
  const [urlCopied, setUrlCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [datasetsLoading, setDatasetsLoading] = useState(true);

  useEffect(() => {
    async function fetchDatasets() {
      try {
        const res = await apiClient.api.v1.datasets.$get({
          query: { limit: "10" },
        });
        if (res.ok) {
          const json = (await res.json()) as PaginatedResponse<DatasetListItem>;
          setDatasets(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch datasets:", error);
      } finally {
        setDatasetsLoading(false);
      }
    }
    fetchDatasets();
  }, []);

  const article = sampleArticles.find((a) => a.id === params.id);

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white font-onest">
        <div className="text-center">
          <p className="text-body text-grey-1">Article not found.</p>
          <Link
            href="/dashboard"
            className="mt-3 inline-block text-body-sm text-blue underline underline-offset-2"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const category = ARTICLE_CATEGORIES[article.id] ?? "General";
  const body = ARTICLE_BODIES[article.id] ?? [article.content];
  const articleUrl = `https://poneglyph.org/dashboard/${article.id}`;
  const embedCode = `<iframe src="https://poneglyph.org/embed/${article.id}" width="600" height="450" frameborder="0" allowfullscreen></iframe>`;

  const copyToClipboard = async (
    text: string,
    setCopied: (v: boolean) => void,
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-onest">
      {/* ── NAV ── */}
      <header className="border-b border-grey-3 bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3">
          <Link
            href="/dashboard"
            className="text-body-sm font-bold tracking-tight text-black"
          >
            Poneglyph
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {["Insights", "Datasets", "Researchers", "About"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-body-sm text-grey-1 transition-colors hover:text-black"
              >
                {item}
              </a>
            ))}
          </nav>
          <a
            href="#"
            className="rounded-sm border border-grey-3 px-3 py-1 text-body-sm text-grey-1 transition-all hover:border-grey-2 hover:text-black"
          >
            Sign In
          </a>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-body-sm text-grey-1">
          <Link
            href="/dashboard"
            className="transition-colors hover:text-black"
          >
            Topics
          </Link>
          <ChevronRight className="size-3.5 text-grey-3" />
          <span className="text-grey-2">{category}</span>
          <ChevronRight className="size-3.5 text-grey-3" />
        </nav>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">
          {/* ── LEFT: Article ── */}
          <article className="min-w-0">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-blue">
              {category}
            </p>

            <h1 className="mb-4 text-heading-4 font-bold leading-tight tracking-tight text-black">
              {article.heading}
            </h1>

            <div className="mb-8 flex items-center gap-2 text-body-sm text-grey-1">
              <span>by</span>
              <a
                href="#author"
                className="font-semibold text-blue transition-opacity hover:opacity-75"
              >
                Dr. Amara Osei
              </a>
              <span className="text-grey-3">·</span>
              <time dateTime="2026-04-15">Apr 15, 2026</time>
            </div>

            {/* Body */}
            <div className="space-y-5">
              {body.map((paragraph, i) => (
                <p
                  key={i}
                  className="max-w-[65ch] text-body leading-relaxed text-grey-1"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Chart section */}
            <div className="mt-12 overflow-hidden rounded-md border border-grey-3">
              <div className="px-6 pt-6 pb-4">
                <h2 className="mb-1 text-heading-6 font-bold text-black">
                  {article.heading}
                </h2>
                <p className="text-body-sm text-grey-1">{article.content}</p>
              </div>

              <div className="relative aspect-[16/9] bg-grey-35">
                <img
                  src={article.imageUrl}
                  alt={article.heading}
                  className="size-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between border-t border-grey-3 px-6 py-3">
                <p className="text-[11px] text-grey-2">
                  Source: Poneglyph Survey Data Compilation, 2024
                </p>
                <span className="text-[11px] font-bold uppercase tracking-wider text-black">
                  Poneglyph
                </span>
              </div>
            </div>

            {/* Dataset tags */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-body-sm text-grey-2">Linked datasets:</span>
              {article.datasetIds.map((id) => (
                <Badge key={id} variant="outline" className="text-[11px]">
                  {id}
                </Badge>
              ))}
            </div>
          </article>

          {/* ── RIGHT: Sidebar ── */}
          <aside
            id="author"
            className="flex flex-col gap-4 lg:sticky lg:top-8 lg:self-start"
          >
            {/* Author card */}
            <div className="rounded-md border border-grey-3 p-5">
              <div className="flex items-start gap-3">
                <img
                  src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face"
                  alt="Dr. Amara Osei"
                  className="size-12 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="text-body-sm font-bold text-black">
                    Dr. Amara Osei
                  </p>
                  <p className="mb-3 text-body-sm text-grey-1">
                    Lead Data Journalist
                  </p>
                  <a
                    href="mailto:a.osei@poneglyph.org"
                    className="mb-1 flex items-center gap-1.5 text-body-sm text-blue transition-opacity hover:opacity-75"
                  >
                    <Mail className="size-3.5 shrink-0" />
                    <span className="truncate">a.osei@poneglyph.org</span>
                  </a>
                  <a
                    href="tel:+15552848810"
                    className="flex items-center gap-1.5 text-body-sm text-grey-1 transition-colors hover:text-black"
                  >
                    <Phone className="size-3.5 shrink-0" />
                    +1 (555) 284-8810
                  </a>
                </div>
              </div>
            </div>

            {/* Actions card */}
            <div className="rounded-md border border-grey-3 p-5">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-grey-2">
                Description
              </p>
              <p className="mb-2 text-body-sm leading-relaxed text-grey-1">
                {article.content}
              </p>
              <a
                href="#"
                className="mb-5 inline-block text-body-sm text-blue transition-opacity hover:opacity-75"
              >
                Reports
              </a>

              {/* Download */}
              <Button variant="default" size="sm" className="mb-4 w-full">
                <Download className="size-3.5" />
                Download Chart
              </Button>

              {/* Social share */}
              <div className="mb-5 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1 px-2"
                >
                  <Facebook className="size-3.5" />
                  <span className="text-[11px]">Share</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1 px-2"
                >
                  <Twitter className="size-3.5" />
                  <span className="text-[11px]">Tweet</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1 px-2"
                >
                  <Linkedin className="size-3.5" />
                  <span className="text-[11px]">Post</span>
                </Button>
              </div>

              {/* Reference URL */}
              <div className="mb-4">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-grey-2">
                  URL to be used as reference link:
                </p>
                <div className="flex gap-1.5">
                  <Input
                    readOnly
                    value={articleUrl}
                    className="h-7 flex-1 truncate text-[11px]"
                  />
                  <button
                    onClick={() => copyToClipboard(articleUrl, setUrlCopied)}
                    className="flex size-7 shrink-0 items-center justify-center rounded-sm border border-grey-3 text-grey-2 transition-colors hover:border-grey-2 hover:text-grey-1"
                  >
                    {urlCopied ? (
                      <Check className="size-3.5 text-success" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Datasets section */}
              <div className="rounded-md border border-grey-3 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="size-4 text-blue" />
                  <p className="text-body-sm font-bold text-black">Datasets</p>
                </div>
                {datasetsLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-8 animate-pulse rounded-sm bg-grey-35"
                      />
                    ))}
                  </div>
                ) : datasets.length > 0 ? (
                  <ul className="space-y-1">
                    {datasets.slice(0, 5).map((dataset) => (
                      <li key={dataset.id}>
                        <Link
                          href={`/datasets?id=${dataset.id}`}
                          className="block truncate text-body-sm text-blue transition-opacity hover:opacity-75"
                        >
                          {dataset.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-body-sm text-grey-2">
                    No datasets available.
                  </p>
                )}
                {datasets.length > 5 && (
                  <Link
                    href="/datasets"
                    className="mt-2 block text-body-sm text-blue underline underline-offset-2"
                  >
                    View all datasets
                  </Link>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="mt-16 bg-black py-8">
        <div className="mx-auto max-w-[1200px] px-6">
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              "Home",
              "About Poneglyph",
              "Career",
              "Contact",
              "Help & FAQ",
              "Report Bug",
              "Privacy",
              "Terms",
            ].map((link) => (
              <a
                key={link}
                href="#"
                className="text-body-sm text-grey-2 transition-colors hover:text-white"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
