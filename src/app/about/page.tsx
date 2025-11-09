import { content } from "@/content/text.content";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Саҳифа сарлавҳаси */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-uzbek-burgundy to-uzbek-champagne bg-clip-text text-transparent">
          {content.about.title}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          {content.about.mainDescription}
        </p>
      </div>

      {/* Платформа имкониятлари */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-uzbek-burgundy">
          {content.about.featuresTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon="🔍"
            title={content.about.features.search.title}
            description={content.about.features.search.description}
          />
          <FeatureCard
            icon="📅"
            title={content.about.features.availability.title}
            description={content.about.features.availability.description}
          />
          <FeatureCard
            icon="ℹ️"
            title={content.about.features.details.title}
            description={content.about.features.details.description}
          />
          <FeatureCard
            icon="📞"
            title={content.about.features.contact.title}
            description={content.about.features.contact.description}
          />
        </div>
      </section>

      {/* Ресторан эгалари учун */}
      <section className="mb-16 bg-gradient-to-br from-uzbek-burgundy/5 to-uzbek-champagne/5 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-uzbek-burgundy">
          {content.about.forOwnersTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            icon="⚙️"
            title={content.about.forOwners.manage.title}
            description={content.about.forOwners.manage.description}
          />
          <FeatureCard
            icon="👁️"
            title={content.about.forOwners.visibility.title}
            description={content.about.forOwners.visibility.description}
          />
          <FeatureCard
            icon="🕐"
            title={content.about.forOwners.schedule.title}
            description={content.about.forOwners.schedule.description}
          />
          <FeatureCard
            icon="🆓"
            title={content.about.forOwners.free.title}
            description={content.about.forOwners.free.description}
          />
        </div>
      </section>

      {/* Мижозлар учун */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-uzbek-champagne">
          {content.about.forClientsTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            icon="✨"
            title={content.about.forClients.simple.title}
            description={content.about.forClients.simple.description}
          />
          <FeatureCard
            icon="🎯"
            title={content.about.forClients.variety.title}
            description={content.about.forClients.variety.description}
          />
          <FeatureCard
            icon="✅"
            title={content.about.forClients.reliable.title}
            description={content.about.forClients.reliable.description}
          />
          <FeatureCard
            icon="💼"
            title={content.about.forClients.convenient.title}
            description={content.about.forClients.convenient.description}
          />
        </div>
      </section>

      {/* Саволлар */}
      <section className="text-center bg-gradient-to-r from-uzbek-burgundy to-uzbek-champagne rounded-2xl p-8 text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          {content.about.questions}
        </h2>
        <p className="mb-6 text-lg opacity-90">
          {content.about.joinUs}
        </p>
      </section>
    </div>
  );
}

// Компонент карточкаси
function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow p-6">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
