import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Arcanea Creative Companion",
    description: "Imagine, Chat, and Create with AI.",
};

export default function CompanionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col h-screen bg-void text-text-primary overflow-hidden">
            {/* 
        We consciously omit the main site Navbar here to give a full "App" feel.
        The layout is purely creating a full-height container for the tabs.
      */}
            <main className="flex-1 relative flex flex-col min-h-0">
                {children}
            </main>
        </div>
    );
}
