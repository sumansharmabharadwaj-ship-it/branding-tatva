import { ServicePage, servicePageMetadata } from "@/components/ServicePage";
import { servicePages } from "@/data/servicePages";

const page = servicePages.find((item) => item.slug === "brand-messaging")!;

export const metadata = servicePageMetadata(page);

export default function BrandMessagingPage() {
  return <ServicePage page={page} />;
}
