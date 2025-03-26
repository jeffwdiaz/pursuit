import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');

export type WorkoutType = 
    | 'strength' 
    | 'cardio' 
    | 'flexibility' 
    | 'hiit' 
    | 'powerlifting' 
    | 'bodyweight' 
    | 'crossfit' 
    | 'yoga';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface WorkoutQuery {
    type: WorkoutType;
    difficulty: Difficulty;
    equipment: string[];
    goals: string[];
    duration?: number;
    frequency?: number;
}

export interface Exercise {
    name: string;
    sets: string;
    reps: string;
    rest: string;
    notes: string[];
    formTips: string[];
}

export interface WorkoutPlan {
    exercises: Exercise[];
    duration: string;
    intensity: string;
    notes: string[];
}

export class GeminiService {
    private model = genAI.getGenerativeModel({ model: "gemini-pro" });
    private maxRetries = 3;
    private baseDelay = 1000; // 1 second

    private async retryWithBackoff<T>(
        operation: () => Promise<T>,
        retries: number = this.maxRetries
    ): Promise<T> {
        try {
            return await operation();
        } catch (error) {
            if (retries === 0) throw error;
            await new Promise(resolve => setTimeout(resolve, this.baseDelay));
            return this.retryWithBackoff(operation, retries - 1);
        }
    }

    private async generateStructuredResponse(prompt: string): Promise<any> {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        try {
            return JSON.parse(text);
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            throw new Error('Invalid AI response format');
        }
    }

    async getWorkoutRecommendation(query: WorkoutQuery): Promise<WorkoutPlan> {
        const prompt = `Generate a detailed workout plan based on the following criteria:
        - Type: ${query.type}
        - Difficulty: ${query.difficulty}
        - Available Equipment: ${query.equipment.join(', ')}
        - Goals: ${query.goals.join(', ')}
        - Duration: ${query.duration || 60} minutes
        - Frequency: ${query.frequency || 3} times per week

        Please provide a structured JSON response with the following format:
        {
            "exercises": [
                {
                    "name": "Exercise name",
                    "sets": "Number of sets",
                    "reps": "Number of reps or duration",
                    "rest": "Rest period between sets",
                    "notes": ["Important notes about the exercise"],
                    "formTips": ["Key form tips"]
                }
            ],
            "duration": "Total workout duration",
            "intensity": "Workout intensity level",
            "notes": ["General workout notes"]
        }

        Guidelines:
        1. Include 4-6 exercises appropriate for the specified difficulty level
        2. Ensure exercises can be done with the available equipment
        3. Provide specific form tips for each exercise
        4. Include rest periods between sets
        5. Add relevant notes about technique and safety
        6. Consider the user's goals when selecting exercises
        7. Ensure the total duration matches the specified time
        8. Include warm-up and cool-down recommendations in the notes`;

        return this.retryWithBackoff(() => this.generateStructuredResponse(prompt));
    }

    async getFormTips(exerciseName: string): Promise<{ tips: string[] }> {
        const prompt = `Provide detailed form tips for the ${exerciseName} exercise.
        Focus on proper technique, common mistakes to avoid, and safety considerations.
        
        Please provide a structured JSON response with the following format:
        {
            "tips": [
                "Form tip 1",
                "Form tip 2",
                ...
            ]
        }

        Guidelines:
        1. Include 4-6 specific form tips
        2. Address common mistakes
        3. Include safety considerations
        4. Provide cues for proper execution
        5. Mention breathing technique if relevant`;

        return this.retryWithBackoff(() => this.generateStructuredResponse(prompt));
    }

    async getNutritionAdvice(workoutType: WorkoutType, goals: string[]): Promise<{ advice: string[] }> {
        const prompt = `Provide nutrition advice for ${workoutType} training with the following goals: ${goals.join(', ')}.
        
        Please provide a structured JSON response with the following format:
        {
            "advice": [
                "Nutrition tip 1",
                "Nutrition tip 2",
                ...
            ]
        }

        Guidelines:
        1. Include pre-workout nutrition recommendations
        2. Include post-workout nutrition recommendations
        3. Provide hydration advice
        4. Include timing recommendations
        5. Consider the specific workout type and goals
        6. Include supplement recommendations if relevant
        7. Address common nutrition mistakes`;

        return this.retryWithBackoff(() => this.generateStructuredResponse(prompt));
    }

    async getProgressTrackingAdvice(workoutType: WorkoutType): Promise<{ advice: string[] }> {
        const prompt = `Provide advice on how to track progress for ${workoutType} training.
        
        Please provide a structured JSON response with the following format:
        {
            "advice": [
                "Progress tracking tip 1",
                "Progress tracking tip 2",
                ...
            ]
        }

        Guidelines:
        1. Include specific metrics to track
        2. Provide frequency recommendations
        3. Include form assessment tips
        4. Suggest progress documentation methods
        5. Include milestone recommendations
        6. Address common tracking mistakes
        7. Provide recovery monitoring advice`;

        return this.retryWithBackoff(() => this.generateStructuredResponse(prompt));
    }
} 