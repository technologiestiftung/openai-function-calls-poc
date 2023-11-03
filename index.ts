import { parseArgs } from "node:util";

try {
	if (!process.env.OPENAI_API_KEY) {
		throw new Error("OPENAI_API_KEY not set");
	}
	const { OPENAI_API_KEY } = process.env;

	const { values, positionals } = parseArgs({
		options: {
			topic: {
				short: "t",
				type: "string",
			},
		},
	});
	console.log(JSON.stringify(values), JSON.stringify(positionals));

	// Define the quotes
	const quotes = {
		inspiration:
			"The only way to do great work is to love what you do. - Steve Jobs",
		life: "In the end, it's not the years in your life that count. It's the life in your years. - Abraham Lincoln",
		friendship:
			"True friendship comes when the silence between two people is comfortable. - David Tyson Gentry",
		love: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage. - Lao Tzu",
		happiness:
			"Happiness is not something ready made. It comes from your own actions. - Dalai Lama",
		wisdom: "The only true wisdom is in knowing you know nothing. - Socrates",
		leadership:
			"Innovation distinguishes between a leader and a follower. - Steve Jobs",
		travel:
			"Travel makes one modest, you see what a tiny place you occupy in the world. - Gustave Flaubert",
		hope: "Hope is the only thing stronger than fear. - Suzanne Collins",
		family: "The family is one of nature’s masterpieces. - George Santayana",
		work: "Choose a job you love, and you will never have to work a day in your life. - Confucius",
		success:
			"Success usually comes to those who are too busy to be looking for it. - Henry David Thoreau",
		courage:
			"Courage is the first of human qualities because it is the quality which guarantees the others. - Aristotle",
		education:
			"The roots of education are bitter, but the fruit is sweet. - Aristotle",
		passion:
			"Passion is energy. Feel the power that comes from focusing on what excites you. - Oprah Winfrey",
		patience:
			"Patience is not simply the ability to wait - it's how we behave while we're waiting. - Joyce Meyer",
		freedom: "Freedom lies in being bold. - Robert Frost",
		change:
			"Change is the law of life. And those who look only to the past or present are certain to miss the future. - John F. Kennedy",
		perseverance:
			"Perseverance is not a long race; it is many short races one after the other. - Walter Elliot",
		strength:
			"Strength does not come from physical capacity. It comes from an indomitable will. - Mahatma Gandhi",
	};

	const response = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${OPENAI_API_KEY}`,
		},
		body: JSON.stringify({
			model: "gpt-3.5-turbo-0613",
			messages: [
				{
					role: "system",
					content: `Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous. These are the topics you can talk about ${Object.keys(
						quotes,
					).join(
						", ",
					)}, If the topic you're looking for is not in the list above, you MUST ask for help by saying "help I don't know this topic"`,
				},
				{
					role: "user",
					content: `Can you give me a quote about ${values.topic}?`,
				},
			],
			functions: [
				{
					name: "get_quote",
					description:
						"Get a quote about a specific topic from a predefined list",
					parameters: {
						type: "object",
						properties: {
							topic: {
								type: "string",
								description: "The topic the quote is about",
							},
						},
						required: ["topic"],
					},
				},
			],
			function_call: "auto",
		}),
	});

	if (response.ok) {
		const data = (await response.json()) as any;
		console.log(JSON.stringify(data));
		const functionResponse = data["choices"][0]["message"]["function_call"];
		if (functionResponse) {
			const functionName = functionResponse["name"];
			const functionArgs = JSON.parse(functionResponse["arguments"]);
			if (functionName === "get_quote") {
				// @ts-ignore
				const quote = quotes[functionArgs.topic];
				console.log(`Quote on ${functionArgs.topic}: ${quote}`);
			}
		} else {
			console.log(JSON.stringify(data, null, 2));
		}
	} else {
		console.error("HTTP Error:", response.status);
	}
} catch (error) {
	console.error(error);
}
