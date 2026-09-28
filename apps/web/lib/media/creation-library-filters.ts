export type CreationFilter =
  "all" | "image" | "video" | "audio" | "text" | "code";

export const creationFilters: Array<{ id: CreationFilter; label: string }> = [
  { id: "all", label: "All work" },
  { id: "image", label: "Images" },
  { id: "video", label: "Film" },
  { id: "audio", label: "Music & audio" },
  { id: "text", label: "Writing" },
  { id: "code", label: "Code" },
];
