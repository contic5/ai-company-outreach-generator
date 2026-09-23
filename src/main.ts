import './style.css'

export async function askOpenAI() 
{
  let prompt_element=document.getElementById("prompt") as HTMLInputElement;
  let prompt=prompt_element.value;
  console.log(`Prompt: ${prompt}`);
  if(!running_prompt)
  {
    return;
  }

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

const running_prompt=true;