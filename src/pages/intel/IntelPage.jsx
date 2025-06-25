import React from 'react';

const icons = [
    "Airbrake", "AirtableOAuth", "Anthropic", "Asana", "Bitbucket",
    "DataBricks", "DigitalOcean", "DockerHub", "Dropbox", "ElevenLabs", "Fastly",
    "Figma", "GitHub", "GitLab", "Groq", "HuggingFace", "LaunchDarkly",
    "Mailchimp", "Mailgun", "Monday", "Mux", "MySQL", "Netlify",
    "Ngrok", "Notion", "OpenAI", "Opsgenie", "Plaid", "PlanetScale",
    "Postgres", "Posthog", "Postman", "Sendgrid", "Shopify",
    "Slack", "Sourcegraph", "Square", "Stripe", "Twilio"
];

const IntegrationCard = ({ iconName }) => (
    <div
        className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[180px] cursor-pointer relative overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:shadow-xl hover:border-purple-300 group"
    >
        <div className="w-32 h-32 rounded-xl bg-gray flex items-center justify-center mb-4 shadow-xl relative">
            <img
                src={`/intelIcons/${iconName}.png`}
                alt={iconName}
                className="w-24 h-24 object-contain"
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                }}
            />
            <div className="hidden w-12 h-12 items-center justify-center text-lg font-semibold text-black font-sans">
                {iconName.charAt(0)}
            </div>
        </div>
        <h3 className="text-xl font-semibold text-black text-center">{iconName}</h3>

        {/* Hover line indicator */}
        <div className="absolute top-0 left-0 w-full h-[2px] rounded-t-xl bg-gradient-to-r from-[#C9B8F536] to-[#a088ea] opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
    </div>
);

const IntelPage = () => {
    return (
        <main className="min-h-screen bg-[#F4F0FD] p-4 md:p-8">
            <div className="bg-white rounded-3xl border border-[#E0E0E0] shadow-xl w-full max-w-full mx-auto overflow-hidden">
                {/* Header Section */}
                <header className="bg-[#F4F0FD] p-8 md:p-12 border-b border-[#E0E0E0]">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
                            Integrations
                        </h1>
                        <p className="text-lg md:text-xl text-[#8D82AA] leading-relaxed max-w-3xl">
                            Connect your favorite services and we provide indepth analysis of these for the tokens.
                        </p>
                    </div>
                </header>

                {/* Cards Section */}
                <section className="p-12 bg-[#F9F7FF]">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
                        {icons.map((iconName, index) => (
                            <IntegrationCard key={index} iconName={iconName} />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default IntelPage;
