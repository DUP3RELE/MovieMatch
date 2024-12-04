import OpenAI from "openai";
const openai = new OpenAI();

const completion = await openai.chat.completions.create({
	model: "gpt-4o-mini",
	messages: [
		{
			role: "system",
			content:
				"You are a movie suggestion assistant. You return only links for picked movie trailer from Youtube.",
		},
		{
			role: "user",
			content: "",
		},
	],
});

console.log(completion.choices[0].message);
