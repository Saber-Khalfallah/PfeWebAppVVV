import React from "react";

const WhyChoose = () => {
  const reasons = [
    {
      icon: "✨", // Placeholder icon
      title: "Verified Professionals",
      description: "Every pro undergoes thorough verification",
    },
    {
      icon: "⚡", // Placeholder icon
      title: "Fast Service",
      description: "Quick response times guaranteed",
    },
    {
      icon: "🏷️", // Placeholder icon
      title: "Clear Pricing",
      description: "No hidden fees or surprises",
    },
    {
      icon: "🏘️", // Placeholder icon
      title: "Support Local",
      description: "Empowering small businesses",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      {" "}
      {/* Added some background and padding */}
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-12">
          Why Choose FixMate
        </h2>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md"
            >
              {/* Icon Placeholder */}
              <div className="text-4xl text-purple-600 mb-4">
                {/* Replace with actual icon component (e.g., from Heroicons, Font Awesome) */}
                {reason.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                {reason.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
