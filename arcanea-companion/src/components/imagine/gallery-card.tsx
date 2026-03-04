"use client";

import { motion } from "framer-motion";
import { GalleryItem } from "@/lib/data/gallery";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    MenuItem,
    ContextMenuSeparator,
} from "@/components/ui/context-menu";

interface GalleryCardProps {
    item: GalleryItem;
    index: number;
}

export function GalleryCard({ item, index }: GalleryCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(item.liked);

    // Staggered entrance animation
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { delay: index * 0.05, duration: 0.4, ease: "easeOut" as const }
        }
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <motion.div
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                    className={cn(
                        "relative rounded-xl overflow-hidden group cursor-pointer break-inside-avoid mb-4 bg-surface/20",
                        // Aspect Ratio Handling via Padding Hack or just sizing
                        item.aspectRatio === "3/4" ? "aspect-[3/4]" :
                            item.aspectRatio === "4/5" ? "aspect-[4/5]" : "aspect-video"
                    )}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Background Image */}
                    <img
                        src={item.src}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />

                    {/* Video Badge */}
                    {item.type === "video" && (
                        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1">
                            <Icons.Play className="w-3 h-3 text-white fill-current" />
                        </div>
                    )}

                    {/* Heart Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsLiked(!isLiked);
                        }}
                        className={cn(
                            "absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10",
                            isLiked ? "bg-red-500/20 text-red-500" : "bg-black/30 text-white hover:bg-black/50"
                        )}
                    >
                        <Icons.Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                    </button>

                    {/* Overlay Content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">

                        {/* Title Group */}
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-xs text-arcane-glow font-medium uppercase tracking-wider mb-1">{item.category}</p>
                            <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>
                            <p className="text-gray-300 text-sm opacity-80 line-clamp-1">{item.prompt}</p>
                        </div>

                        {/* Action Row - "Animate" Button Placement */}
                        <div className="flex items-center justify-between mt-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                            <p className="text-[10px] text-gray-500 font-mono">ARCANEA::{item.id.padStart(3, '0')}</p>

                            <button className="flex items-center gap-1.5 bg-arcane hover:bg-arcane-glow text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg shadow-purple-900/40 transition-all hover:scale-105 active:scale-95">
                                <Icons.Sparkles className="w-3 h-3" />
                                <span>Animate</span>
                            </button>
                        </div>
                    </div>

                    {/* Persistent "Watermark" style overlay if requested, or just keep cleaner look */}
                    {!isHovered && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                            <h3 className="text-white font-semibold text-sm drop-shadow-md truncate">{item.title}</h3>
                        </div>
                    )}
                </motion.div>
            </ContextMenuTrigger>

            {/* Context Menu Content */}
            <ContextMenuContent className="w-64">
                <MenuItem icon={Icons.Sparkles} label="Animate" onClick={() => console.log("Animate")} />
                <MenuItem
                    icon={Icons.Heart}
                    label={isLiked ? "Remove from Favorites" : "Add to Favorites"}
                    onClick={() => setIsLiked(!isLiked)}
                />
                <MenuItem icon={Icons.Download} label="Download" />
                <MenuItem icon={Icons.Share} label="Share" />
                <ContextMenuSeparator />
                <MenuItem
                    icon={Icons.Butterfly}
                    label="Ask Evi about this"
                    onClick={() => console.log("Ask Evi")}
                />
                <ContextMenuSeparator />
                <MenuItem icon={Icons.Report} label="Report issue" danger />
            </ContextMenuContent>
        </ContextMenu>
    );
}
