import { ServicePage, servicePageMetadata } from "@/components/ServicePage";
import { servicePages } from "@/data/servicePages";

const page = servicePages.find((item) => item.slug === "brand-audit")!;
export const metadata = servicePageMetadata(page);
export default function BrandAuditPage() { return <ServicePage page={page} />; }
