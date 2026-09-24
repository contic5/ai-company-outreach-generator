import './style.css'

export async function askOpenAI() 
{
  const company_element=document.getElementById("company") as HTMLInputElement;
  const company=company_element.value;

  const goal_element=document.getElementById("goal") as HTMLTextAreaElement;
  const goal=goal_element.innerHTML;

  let prompt=`
  Write a company outreach letter for Spectrum Works to ${company}. Spectrum Works is looking to ${goal}.
  `;
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
export function update_goal()
{
  const sample_goal_element=document.getElementById("select_goal") as HTMLSelectElement;
  const sample_goal=sample_goal_element.value;
  if(sample_goal!=""&&sample_goal.length>0)
  {
    let goal_element=document.getElementById("goal") as HTMLTextAreaElement;
    goal_element.innerHTML=sample_goal;
  }
}

const running_prompt=true;