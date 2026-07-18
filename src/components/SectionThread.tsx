// A small recurring mark between homepage sections: a short line
// converging on a dot, the same bindu language as the logo and hero.
// Its job is purely to signal "this keeps going" between sections that
// would otherwise read as unrelated blocks stacked on a page.

export function SectionThread({ dark = false }: { dark?: boolean }) {
  const color = dark ? "bg-ivory/30" : "bg-soil/20";
  const dot = dark ? "bg-sandstone" : "bg-clay";
  return (
    <div className="flex justify-center py-2" aria-hidden="true">
      <div className={`h-10 w-px ${color}`} />
      <div className={`-ml-[3px] mt-10 h-1.5 w-1.5 rounded-full ${dot}`} />
    </div>
  );
}
