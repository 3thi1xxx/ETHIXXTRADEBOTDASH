import { GoogleGenAI } from "@google/genai";
import { CouncilDecision, CouncilVote } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getAgentReasoning(decision: CouncilDecision, vote: CouncilVote): Promise<string> {
    const model = 'gemini-2.5-flash';
    const prompt = `You are the "${vote.agent}" AI agent in a trading council. The council is voting on the proposal titled "${decision.title}", described as: "${decision.description}". You voted "${vote.vote}" with ${Math.round(vote.confidence * 100)}% confidence. Please provide a concise, expert-level justification for your vote in 2-3 sentences, explaining the key factors you considered. Do not repeat the prompt.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching agent reasoning:", error);
        return "An error occurred while communicating with the AI. The agent may be temporarily unavailable.";
    }
}
