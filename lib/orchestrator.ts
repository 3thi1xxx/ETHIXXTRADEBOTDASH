import { EXEC_ENDPOINT } from '../constants';

export interface ExecTaskPayload {
    kind: "bash" | "node";
    cmd?: string;
    args?: string[];
    stdin?: string;
    timeoutMs?: number;
}

export async function execTask(payload: ExecTaskPayload): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
        const response = await fetch(EXEC_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Orchestrator request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error("execTask failed:", error);
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
    }
}
