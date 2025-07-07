export async function askLunos(
   key: string,
   model: string,
   prompt: string,
   mode: "long" | "short"
): Promise<string> {
   const res = await fetch("https://api.lunos.tech/v1/chat/completions", {
      method: "POST",
      headers: {
         Authorization: `Bearer ${key}`,
         "Content-Type": "application/json",
      },
      body: JSON.stringify({
         model,
         messages: [
            {
               role: "system",
               content:
                  "You are a commit message generator that strictly follows the Conventional Commits specification.",
            },
            { role: "user", content: prompt },
         ],
         max_tokens: mode === "long" ? 300 : 120,
      }),
   });

   if (!res.ok) {
      throw new Error(`Lunos API error: ${res.status} ${res.statusText}`);
   }

   const data = await res.json();
   return data.choices[0].message.content.trim();
}
