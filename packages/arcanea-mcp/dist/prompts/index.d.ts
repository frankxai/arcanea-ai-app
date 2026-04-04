import { Prompt } from "@modelcontextprotocol/sdk/types.js";
export declare const prompts: Prompt[];
export declare function getPrompt(name: string, args: Record<string, string>): {
    messages: Array<{
        role: string;
        content: {
            type: string;
            text: string;
        };
    }>;
};
//# sourceMappingURL=index.d.ts.map