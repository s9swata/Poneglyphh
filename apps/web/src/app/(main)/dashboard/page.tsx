"use client";

import "./dashboard.css";

import { ReportCard, type Report } from "./components/report-card";
import { SurveyItem, type Survey } from "./components/survey-item";
import { DatasetItem, type Dataset } from "./components/dataset-item";
import { ActivityItem, type Activity } from "./components/activity-item";
import { IconSearch, IconBell, IconPlus, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Good morning";
  if (h >= 12 && h < 17) return "Good afternoon";
  if (h >= 17 && h < 21) return "Good evening";
  return "Good night";
}

const MOCK_REPORTS: Report[] = [
  {
    id: "1",
    title: "Post-Flood Sanitation Assessment: Northern Region 2026",
    summary:
      "Comprehensive survey of water and sanitation infrastructure across 42 villages affected by the January floods, with immediate remediation priorities.",
    category: "Geography",
    tags: ["WASH", "Assessment", "Disaster Recovery"],
    author: "Sarah Chen",
    authorInitial: "S",
    readTime: "12 min read",
    date: "Apr 24",
    trending: true,
  },
  {
    id: "2",
    title: "Regional Food Security Outlook — Q1 2026 Report",
    summary:
      "Quarterly analysis of crop yields and market price fluctuations across the semi-arid belt. Trends indicate rising vulnerability in western districts.",
    category: "Economy",
    tags: ["Agriculture", "Economic", "Quarterly"],
    author: "David Miller",
    authorInitial: "D",
    readTime: "8 min read",
    date: "Apr 22",
  },
  {
    id: "3",
    title: "Mobile Health Clinic Efficacy in Remote Border Areas",
    summary:
      "Evaluation of patient outcomes and supply chain resilience for mobile health units operating in the high-altitude frontier zones.",
    category: "Demographics",
    tags: ["Public Health", "Supply Chain"],
    author: "Elena Rodriguez",
    authorInitial: "E",
    readTime: "15 min read",
    date: "Apr 19",
  },
  {
    id: "4",
    title: "Displaced Population Dynamics: Seasonal Migration Patterns",
    summary:
      "Historical analysis of cross-border movement patterns, integrated with recent biometric tracking data from refugee reception centers.",
    category: "Demographics",
    tags: ["Demographics", "Migration"],
    author: "Marcus Thorne",
    authorInitial: "M",
    readTime: "6 min read",
    date: "Apr 16",
  },
  {
    id: "5",
    title: "Childhood Immunization Gap Analysis: Urban Slum Review",
    summary:
      "Identifying missing cohorts in the 2025-2026 vaccination drive using heatmaps of healthcare access points and population density.",
    category: "Taxonomy",
    tags: ["Vaccination", "Urban Development"],
    author: "Anita Gupta",
    authorInitial: "A",
    readTime: "22 min read",
    date: "Apr 12",
  },
  {
    id: "6",
    title: "Cross-Border Trade Logistics — 5-year Volume Retrospective",
    summary:
      "Analysis of humanitarian corridor usage and logistics bottlenecks from 2021–2026, focusing on the impact of infrastructure upgrades.",
    category: "Trade",
    tags: ["Trade", "Logistics"],
    author: "James Wilson",
    authorInitial: "J",
    readTime: "9 min read",
    date: "Apr 09",
  },
];

const MOCK_SURVEYS: Survey[] = [
  {
    id: "s1",
    title: "Coastal Community Sanitation follow-up",
    responses: "2,482",
    progress: 88,
    status: "closing",
    questions: 14,
    closes: "Closes in 3 days",
  },
  {
    id: "s2",
    title: "Community Resilience Baseline — Eastern Districts",
    responses: "1,240",
    progress: 42,
    status: "active",
    questions: 28,
    closes: "Closes Jun 12",
  },
  {
    id: "s3",
    title: "Smallholder Farmer Income Assessment",
    responses: "5,102",
    progress: 15,
    status: "active",
    questions: 32,
    closes: "Closes in 2 weeks",
  },
  {
    id: "s4",
    title: "Primary Healthcare Utilization Survey",
    responses: "456",
    progress: 31,
    status: "paused",
    questions: 9,
    subText: "Paused for audit",
  },
];

const MOCK_DATASETS: Dataset[] = [
  {
    id: "d1",
    name: "regional-health-outcomes.csv",
    size: "1.2 MB",
    updatedAt: "2h ago",
    extension: "csv",
    bars: [30, 55, 45, 80, 60, 90, 70],
    cols: "12",
    rows: "2,184",
  },
  {
    id: "d2",
    name: "refugee-camp-biometrics.parquet",
    size: "48 MB",
    updatedAt: "yesterday",
    extension: "parquet",
    bars: [60, 40, 75, 30, 85, 55, 65],
    records: "12,450",
  },
  {
    id: "d3",
    name: "northern-watersheds.geojson",
    size: "22 MB",
    updatedAt: "3d ago",
    extension: "geo",
    bars: [40, 60, 50, 75, 90, 65, 80],
    layers: "14",
  },
  {
    id: "d4",
    name: "commodity-price-index.json",
    size: "0.6 MB",
    updatedAt: "5d ago",
    extension: "json",
    bars: [30, 35, 50, 60, 55, 70, 75],
    records: "4,200",
  },
];

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "a1",
    user: "Sarah Chen",
    action: "published",
    target: "Post-Flood Sanitation Assessment",
    time: "2 hours ago",
    initial: "S",
    href: "/dashboard/1",
  },
  {
    id: "a2",
    user: "David Miller",
    action: "commented on",
    target: "Regional Food Security Outlook",
    time: "5 hours ago",
    initial: "D",
    href: "/dashboard/2",
  },
  {
    id: "a3",
    user: "You",
    action: "uploaded",
    target: "refugee-camp-biometrics.parquet",
    time: "yesterday",
    initial: "Y",
    href: "/datasets/d2",
  },
];

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <main className="dashboard-main">
      {/* Top Section */}
      <header className="top">
        <div>
          <h1 className="hello">
            {getGreeting()}, <em>{firstName}</em>
          </h1>
          <p className="lede">
            3 reports published this week, 4 surveys collecting responses, 12 datasets indexed.
          </p>
        </div>

        <div className="top-actions">
          <div className="search">
            <IconSearch />
            <input type="text" placeholder="Search reports, datasets..." />
          </div>
          <button className="icon-btn" aria-label="Notifications">
            <IconBell />
            <div className="dot"></div>
          </button>
          <Link href="/survey/create" className="btn">
            <IconPlus />
            Create New
          </Link>
        </div>
      </header>

      {/* Featured Reports Grid Section */}
      <section>
        <div className="sec-head">
          <div>
            <h2>
              Trending reports <span className="sub">curated this week</span>
            </h2>
          </div>
          <div className="right">
            <Link href="/dashboard" className="btn btn-ghost">
              View all reports <IconArrowRight className="ml-1" />
            </Link>
          </div>
        </div>

        <div className="reports">
          {MOCK_REPORTS.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      </section>

      {/* Lower Grid Section: Surveys + (Datasets & Activity) */}
      <div className="grid-2 mt-12">
        {/* Ongoing Surveys */}
        <section>
          <div className="sec-head">
            <div>
              <h2>
                Ongoing surveys <span className="sub">4 collecting</span>
              </h2>
            </div>
            <div className="right">
              <Link href="/survey" className="btn btn-ghost">
                All surveys <IconArrowRight className="ml-1" />
              </Link>
            </div>
          </div>

          <div className="survey-list">
            {MOCK_SURVEYS.map((survey) => (
              <SurveyItem key={survey.id} survey={survey} />
            ))}
          </div>
        </section>

        {/* Datasets & Activity */}
        <section>
          <div className="sec-head">
            <div>
              <h2>
                Datasets <span className="sub">recently updated</span>
              </h2>
            </div>
            <div className="right">
              <Link href="/datasets" className="btn btn-ghost">
                All datasets <IconArrowRight className="ml-1" />
              </Link>
            </div>
          </div>

          <div className="dataset-list">
            {MOCK_DATASETS.map((dataset) => (
              <DatasetItem key={dataset.id} dataset={dataset} />
            ))}
          </div>

          <div className="activity mt-4">
            <h3>Recent activity</h3>
            <div className="flex flex-col">
              {MOCK_ACTIVITIES.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
