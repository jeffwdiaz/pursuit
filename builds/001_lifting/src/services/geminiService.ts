import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');

export interface WorkoutQuery {
    type: string;
    difficulty: string;
    equipment: string[];
    goals: string[];
}

export class GeminiService {
    private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    async getWorkoutRecommendation(query: WorkoutQuery): Promise<string> {
        const prompt = `Create a detailed workout plan with the following specifications:
            Type: ${query.type}
            Difficulty: ${query.difficulty}
            Equipment available: ${query.equipment.join(', ')}
            Goals: ${query.goals.join(', ')}
            
            Please provide:
            1. A structured workout plan
            2. Sets and reps for each exercise
            3. Rest periods
            4. Tips for proper form
            5. Safety considerations`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error getting workout recommendation:', error);
            throw new Error('Failed to generate workout recommendation');
        }
    }

    async getFormTips(exercise: string): Promise<string> {
        const prompt = `Provide detailed form tips and common mistakes to avoid for the following exercise: ${exercise}`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error getting form tips:', error);
            throw new Error('Failed to generate form tips');
        }
    }

    async getNutritionAdvice(workoutType: string): Promise<string> {
        const prompt = `Provide nutrition advice and recommendations for ${workoutType} training, including:
            1. Pre-workout nutrition
            2. Post-workout nutrition
            3. Hydration guidelines
            4. Supplement recommendations (if applicable)`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error getting nutrition advice:', error);
            throw new Error('Failed to generate nutrition advice');
        }
    }
} 