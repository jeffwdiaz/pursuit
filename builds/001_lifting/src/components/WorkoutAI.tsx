import React, { useState } from 'react';
import { GeminiService, WorkoutQuery } from '../services/geminiService';

const geminiService = new GeminiService();

export const WorkoutAI: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [workoutPlan, setWorkoutPlan] = useState<string | null>(null);
    const [form, setForm] = useState<WorkoutQuery>({
        type: '',
        difficulty: '',
        equipment: [],
        goals: []
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setWorkoutPlan(null);

        try {
            const recommendation = await geminiService.getWorkoutRecommendation(form);
            setWorkoutPlan(recommendation);
        } catch (err) {
            setError('Failed to generate workout plan. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="workout-ai-container">
            <h2>AI Workout Planner</h2>
            
            <form onSubmit={handleSubmit} className="workout-form">
                <div className="form-group">
                    <label htmlFor="type">Workout Type:</label>
                    <select
                        id="type"
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        required
                    >
                        <option value="">Select a type</option>
                        <option value="strength">Strength Training</option>
                        <option value="cardio">Cardio</option>
                        <option value="flexibility">Flexibility</option>
                        <option value="hiit">HIIT</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="difficulty">Difficulty Level:</label>
                    <select
                        id="difficulty"
                        value={form.difficulty}
                        onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                        required
                    >
                        <option value="">Select difficulty</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Equipment Available:</label>
                    <div className="checkbox-group">
                        {['Dumbbells', 'Barbell', 'Kettlebell', 'Resistance Bands', 'Body Weight'].map((item) => (
                            <label key={item} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={form.equipment.includes(item)}
                                    onChange={(e) => {
                                        const newEquipment = e.target.checked
                                            ? [...form.equipment, item]
                                            : form.equipment.filter((eq) => eq !== item);
                                        setForm({ ...form, equipment: newEquipment });
                                    }}
                                />
                                {item}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Goals:</label>
                    <div className="checkbox-group">
                        {['Build Muscle', 'Lose Fat', 'Improve Strength', 'Increase Endurance', 'Better Flexibility'].map((item) => (
                            <label key={item} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={form.goals.includes(item)}
                                    onChange={(e) => {
                                        const newGoals = e.target.checked
                                            ? [...form.goals, item]
                                            : form.goals.filter((goal) => goal !== item);
                                        setForm({ ...form, goals: newGoals });
                                    }}
                                />
                                {item}
                            </label>
                        ))}
                    </div>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Generating Plan...' : 'Generate Workout Plan'}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}
            
            {workoutPlan && (
                <div className="workout-plan">
                    <h3>Your Personalized Workout Plan</h3>
                    <div className="plan-content">
                        {workoutPlan.split('\n').map((line, index) => (
                            <p key={index}>{line}</p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}; 