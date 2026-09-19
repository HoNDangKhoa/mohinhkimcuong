import {
  AdjustmentsHorizontalIcon,
  BuildingOffice2Icon,
  ChartBarSquareIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  FilmIcon,
  FolderIcon,
  GlobeAltIcon,
  HomeIcon,
  IdentificationIcon,
  KeyIcon,
  MagnifyingGlassIcon,
  NewspaperIcon,
  PhotoIcon,
  RectangleStackIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Square3Stack3DIcon,
  TagIcon,
  UserCircleIcon,
  VideoCameraIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export const ADMIN_ICONS = {
  dashboard: ChartBarSquareIcon,
  posts: DocumentTextIcon,
  pages: RectangleStackIcon,
  media: PhotoIcon,
  seo: MagnifyingGlassIcon,
  settings: AdjustmentsHorizontalIcon,
  contacts: EnvelopeIcon,
  projects: BuildingOffice2Icon,
  articles: NewspaperIcon,
  services: WrenchScrewdriverIcon,
  categories: TagIcon,
  mission: SparklesIcon,
  trust: ShieldCheckIcon,
  homeProjects: Square3Stack3DIcon,
  process: FolderIcon,
  stats: ChartBarSquareIcon,
  about: IdentificationIcon,
  footer: GlobeAltIcon,
  logo: HomeIcon,
  video: VideoCameraIcon,
  favicon: SparklesIcon,
  slideshow: FilmIcon,
  social: GlobeAltIcon,
  library: PhotoIcon,
  account: UserCircleIcon,
  password: KeyIcon,
} as const;

export type AdminIconName = keyof typeof ADMIN_ICONS;

export function AdminIcon({
  name,
  className = "h-4 w-4",
}: {
  name: AdminIconName;
  className?: string;
}) {
  const Icon: Icon = ADMIN_ICONS[name];
  return <Icon className={className} />;
}
