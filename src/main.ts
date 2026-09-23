import './style.css'

export async function askOpenAI() 
{
  let prompt=document.getElementById("query")!.innerHTML;

  const result = await fetch("/api/openai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  });

  const data = await result.json();

  alert(data.response);
  document.getElementById("response")!.innerHTML=data.response;
}