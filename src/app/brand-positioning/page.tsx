import { ServicePage, servicePageMetadata } from "@/components/ServicePage";
import { servicePages } from "@/data/servicePages";

const page = servicePages.find((item) => item.slug === "brand-positioning")!;
export const metadata = servicePageMetadata(page);
export default function BrandPositioningPage() { return <ServicePage page={page} />; }
