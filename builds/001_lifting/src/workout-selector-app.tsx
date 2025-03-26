import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Exercise data structure
const EXERCISES = {
  Chest: [
    { name: 'Dumbbell Bench Press', lastDone: null },
    { name: 'Dumbbell Flyes', lastDone: null }
  ],
  Back: [
    { name: 'Bent-Over Dumbbell Rows', lastDone: null },
    { name: 'Dumbbell Pullovers', lastDone: null }
  ],
  Shoulders: [
    { name: 'Dumbbell Shoulder Press', lastDone: null },
    { name: 'Lateral Raises', lastDone: null }
  ],
  Biceps: [
    { name: 'Dumbbell Bicep Curls', lastDone: null },
    { name: 'Hammer Curls', lastDone: null }
  ],
  Triceps: [
    { name: 'Dumbbell Overhead Extension', lastDone: null },
    { name: 'Dumbbell Kickbacks', lastDone: null }
  ]
};

const WorkoutSelectorApp = () => {
  // State for exercise selection
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  
  // State for sets and reps
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);

  // State for AI recommendations
  const [aiRecommendations, setAiRecommendations] = useState(null);

  // Generate AI recommendations (simulated for now)
  const generateAIRecommendations = () => {
    // Find two exercises that haven't been done in the longest time
    let allExercises = Object.values(EXERCISES).flat();
    
    // Sort exercises by when they were last done (or never done)
    let sortedExercises = allExercises.sort((a, b) => {
      // If never done, prioritize those exercises
      if (!a.lastDone) return -1;
      if (!b.lastDone) return 1;
      
      // Otherwise, compare last done dates
      return new Date(a.lastDone) - new Date(b.lastDone);
    });

    // Take the first two exercises
    let recommendations = sortedExercises.slice(0, 2);
    
    setAiRecommendations(recommendations);
  };

  // Number arrays for sets and reps scrolling
  const numberArray = Array.from({length: 20}, (_, i) => i + 1);

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold text-center mb-4">Workout Selector</h1>

      {/* Muscle Group Selection */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Select Muscle Group</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedMuscleGroup}>
            <SelectTrigger>
              <SelectValue placeholder="Choose Muscle Group" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(EXERCISES).map((muscleGroup) => (
                <SelectItem key={muscleGroup} value={muscleGroup}>
                  {muscleGroup}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Exercise Selection */}
      {selectedMuscleGroup && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Select Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            {EXERCISES[selectedMuscleGroup].map((exercise) => (
              <div 
                key={exercise.name} 
                className="flex items-center space-x-2 mb-2"
              >
                <input 
                  type="checkbox" 
                  id={exercise.name}
                  checked={selectedExercises.includes(exercise.name)}
                  onChange={() => {
                    setSelectedExercises(prev => 
                      prev.includes(exercise.name)
                        ? prev.filter(ex => ex !== exercise.name)
                        : [...prev, exercise.name]
                    );
                  }}
                />
                <label htmlFor={exercise.name}>{exercise.name}</label>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Sets and Reps Selection */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Sets and Reps</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-4">
          <div className="w-1/2">
            <label className="block mb-2">Sets</label>
            <Select onValueChange={(value) => setSets(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder={sets} />
              </SelectTrigger>
              <SelectContent>
                {numberArray.map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-1/2">
            <label className="block mb-2">Reps</label>
            <Select onValueChange={(value) => setReps(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder={reps} />
              </SelectTrigger>
              <SelectContent>
                {numberArray.map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations Button */}
      <Button 
        onClick={generateAIRecommendations} 
        className="w-full"
      >
        Get AI Workout Recommendations
      </Button>

      {/* AI Recommendations Display */}
      {aiRecommendations && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>AI Recommended Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            {aiRecommendations.map((exercise) => (
              <div key={exercise.name} className="mb-2">
                <p>{exercise.name}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkoutSelectorApp;
