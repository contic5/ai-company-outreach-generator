import './style.css'

async function askOpenAI(prompt:string) 
{
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
async function get_context()
{
  for(let knowledge_dict_key of knowledge_dict_keys)
  {
    const file=await fetch(`knowledge/${knowledge_dict_key}.txt`);
    const blob=await file.blob();
    const text=await blob.text();
    console.log(text);
    knowledge_dict[knowledge_dict_key]=text;
  }
}
export function handle_submit()
{
  const company_element=document.getElementById("company") as HTMLInputElement;
  const company=company_element.value;

  const goal_element=document.getElementById("goal") as HTMLTextAreaElement;
  const goal=goal_element.innerHTML;

  let warning_element=document.getElementById("warning") as HTMLSpanElement;
  warning_element.innerHTML="";
  if(!goal)
  {
    warning_element.innerHTML="Provide a goal.";
    return;
  }
  if(!company)
  {
    warning_element.innerHTML="Provide a target company.";
    return;
  }

  let prompt=`
  Write a company outreach letter from Spectrum Works to ${company}. The goal is for ${company} to ${goal}.
  `;  
  
  const query_element=document.getElementById("query") as HTMLDivElement;
  query_element.innerHTML=prompt;
  if(running_prompt)
  {
    askOpenAI(prompt);
  }
}
export function update_goal()
{
  const sample_goal_element=document.getElementById("sample_goal") as HTMLSelectElement;
  const sample_goal=sample_goal_element.value;
  if(sample_goal!=""&&sample_goal.length>0)
  {
    let goal_element=document.getElementById("goal") as HTMLTextAreaElement;
    goal_element.innerHTML=sample_goal;
  }
}

const running_prompt=false;
let knowledge_dict:Record<string,string>={};
let knowledge_dict_keys=["company_benefits","employment_model","goals","impact","partner_companies","partner_quotes","values"];
get_context();