import React from 'react';
import { ChatRequestOptions } from 'ai';
import { Button } from '../ui/button';

interface QuickSuggestionsProps {
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    handleSubmit: (
        e: React.FormEvent<HTMLFormElement>,
        chatRequestOptions?: ChatRequestOptions
    ) => void;
}

const quickSuggestions = [
    "how are you?",
    "Tell me a joke",
    "Who is Cristiano Ronaldo?",
    "What is Capital of India?",
];

export default function QuickSuggestions({ input, setInput, handleSubmit }: QuickSuggestionsProps) {
    return (
        <div className="w-full px-4">
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 mb-3 w-full">
                {quickSuggestions.map((prompt, index) => (
                    <Button
                        key={index}
                        className="px-4 py-2 text-sm rounded-lg border border-gray-300 shadow-sm  transition"
                        variant="ghost"
                        onClick={() => setInput(prompt)}
                    >
                        {prompt}
                    </Button>
                ))}
            </form>
        </div>
    );
}
