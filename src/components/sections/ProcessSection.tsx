export default function ProcessSection() {
  const steps = [
    "Research",
    "Strategy",
    "System Design",
    "Implementation",
    "Optimization",
  ];

  return (
    <section className="max-w-[1320px] mx-auto px-8 py-32 space-y-16">
      <h2 className="text-3xl font-semibold">How We Work</h2>

      <div className="grid grid-cols-5 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="space-y-4">
            <div className="text-3xl text-white/30">
              0{index + 1}
            </div>
            <h3 className="text-lg">{step}</h3>
            <p className="text-sm text-[#94A3B8]">
              Short description goes here.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
