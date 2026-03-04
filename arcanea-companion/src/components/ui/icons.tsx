"use client";

import {
    Sparkles,
    MessageCircle,
    Palette,
    Search,
    MoreHorizontal,
    Heart,
    Play,
    Share2,
    Download,
    AlertTriangle,
    X,
    Send,
    Mic,
    Image as ImageIcon,
    Music,
    Video,
    BookOpen,
    Map,
    User,
    Zap,
    History,
    Cpu,
    ArrowUpRight,
    Radio,
    ArrowRight,
    ArrowDown,
} from "lucide-react";

export const Icons = {
    Sparkles,
    Chat: MessageCircle,
    Studio: Palette,
    Search,
    More: MoreHorizontal,
    Heart,
    Play,
    Share: Share2,
    Download,
    Report: AlertTriangle,
    Close: X,
    Send,
    Mic,
    Image: ImageIcon,
    Music,
    Video,
    Lore: BookOpen,
    Map,
    User,
    Zap,
    History,
    Cpu,
    ArrowUpRight,
    Radio,
    ArrowRight,
    ArrowDown,
    // Custom Butterfly Icon (Evi)
    Butterfly: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            <path d="M12 12c0-3 2.5-5.5 5.5-5.5S23 9 23 12s-2.5 5.5-5.5 5.5S12 15 12 12z" />
            <path d="M12 12c0-3-2.5-5.5-5.5-5.5S1 9 1 12s2.5 5.5 5.5 5.5S12 15 12 12z" />
            <path d="M12 12c0-4 1.5-8 4.5-8S21 7 21 12" />
            <path d="M12 12c0-4-1.5-8-4.5-8S3 7 3 12" />
            <path d="M12 12v6" />
        </svg>
    ),
};
