import { faqs } from "@/data/faqs";

export function FAQ() {
  return (
    <div className="divide-y divide-border">
      {faqs.map((item) => (
        <details key={item.question} className="group py-4">
          <summary className="cursor-pointer list-none font-medium text-soil marker:content-none">
            <span className="flex items-center justify-between">
              {item.question}
              <span className="ml-4 text-foreground-secondary group-open:rotate-45 transition-transform">+</span>
            </span>
          </summary>
          <p className="mt-3 text-sm text-foreground-secondary">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
