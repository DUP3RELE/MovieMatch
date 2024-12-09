import React, { useEffect, useState } from "react";
import { OpenAI, OpenAIError } from "openai";
import config from "../config.json";

interface OpenAiComponentProps {
	genres: string[];
	types: string[];
	platforms: string[];
	additionalInfo: string;
	onLinkGenerated: (link: string) => void;
	triggerFetch: boolean;
}

export default function OpenAiComponent({
	genres,
	types,
	platforms,
	additionalInfo,
	onLinkGenerated,
	triggerFetch,
}: OpenAiComponentProps) {
	const [response, setResponse] = useState<string | null>(null);

	const fetchMovieSuggestion = async () => {
		"use server";
		try {
			const client = new OpenAI({
				apiKey: config.OPENAI_API_KEY,
				dangerouslyAllowBrowser: true,
			});

			const response = await client.chat.completions.create({
				model: "gpt-4o",
				messages: [
					{
						role: "system",
						content:
							"You are a movie suggestion assistant. You return only links to YouTube trailers of movies.",
					},
					{
						role: "user",
						content: `Find a YouTube trailer for a movie that matches these preferences: 
							Genres: ${genres.join(", ")}, 
							Types: ${types.join(", ")}, 
							Platforms: ${platforms.join(", ")}, 
							Additional Info: ${additionalInfo}. 
							Return only the YouTube link. Be sure that this link is avaliable on Youtube`,
					},
				],
			});

			const youtubeLink: any = response.choices[0]?.message?.content?.trim();
			console.log(youtubeLink);
			setResponse(youtubeLink);

			onLinkGenerated(youtubeLink);
		} catch (error: any) {
			if (error instanceof OpenAIError) {
				console.error(`Błąd podczas komunikacji z OpenAI: ${error.message}`);
			} else {
				console.error(`Wystąpił nieoczekiwany błąd: ${error.message}`);
			}
		}
	};

	useEffect(() => {
		if (triggerFetch && genres.length > 0 && types.length > 0) {
			fetchMovieSuggestion();
		}
	}, [triggerFetch]);

	return response;
}
