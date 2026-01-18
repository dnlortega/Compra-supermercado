"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function extractPriceFromImage(base64Image: string) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY não configurada no ambiente.");
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Remove the data area if present (e.g., "data:image/jpeg;base64,")
        const base64Data = base64Image.split(",")[1] || base64Image;

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg"
                }
            },
            {
                text: "Extract the numeric price value from this price tag. Return ONLY the number. For example, if it says 'R$ 12,99', return '12.99'. If there are multiple prices, return the main/current one. If no price is found, return '0'."
            }
        ]);

        const response = await result.response;
        const text = response.text().trim();

        // Clean the response to ensure we have a valid number
        const numericMatch = text.match(/\d+([.,]\d+)?/);
        if (numericMatch) {
            const price = parseFloat(numericMatch[0].replace(',', '.'));
            return price;
        }

        return 0;
    } catch (error) {
        console.error("Erro no processamento da IA:", error);
        throw new Error("Falha ao processar imagem.");
    }
}
