import React, { useEffect, useState } from "react";
import OpenAI from "openai";

interface OpenAiComponentProps {
	genres: string[];
	types: string[];
	platforms: string[];
	additionalInfo: string;
	onLinkGenerated: (link: string) => void; // Funkcja callback do przekazania linku
	triggerFetch: boolean; // Nowy prop, który kontroluje, czy fetch ma być uruchomiony
}

export default function OpenAiComponent({
	genres,
	types,
	platforms,
	additionalInfo,
	onLinkGenerated, // Otrzymujemy funkcję jako props
	triggerFetch, // Kontroluje, kiedy wywołać API
}: OpenAiComponentProps) {
	const [response, setResponse] = useState<string | null>(null);

	// Funkcja do wywołania OpenAI API
	const fetchMovieSuggestion = async () => {
		const openai = new OpenAI({
			apiKey: "your-openai-api-key", // Twój klucz API OpenAI
		});

		const completion = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content:
						"You are a movie suggestion assistant. You return only links to YouTube trailers of movies.",
				},
				{
					role: "user",
					content: `Find a YouTube trailer for a movie that matches these preferences. 
						Genres: ${genres.join(", ")}, 
						Types: ${types.join(", ")}, 
						Platforms: ${platforms.join(", ")}, 
						Additional Info: ${additionalInfo}. 
						Return only the YouTube link.`,
				},
			],
		});

		// Ustaw odpowiedź modelu
		const youtubeLink = completion.choices[0].message.content.trim();
		setResponse(youtubeLink);

		// Przekaż link do callbacka
		onLinkGenerated(youtubeLink);
	};

	// Użyj useEffect, aby wywołać API tylko, gdy triggerFetch = true
	useEffect(() => {
		if (triggerFetch && genres.length > 0 && types.length > 0) {
			fetchMovieSuggestion();
		}
	}, [triggerFetch]);

	return null; // Komponent nie renderuje nic
}
