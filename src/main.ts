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

  let knowledge="";
  const knowledge_checkboxes=document.getElementsByName("knowledge_checkbox");
  for(let i=0;i<knowledge_checkboxes.length;i++)
  {
    let knowledge_checkbox=knowledge_checkboxes[i] as HTMLInputElement;
    let knowledge_dict_key=knowledge_checkbox.value;
    if(knowledge_checkbox.checked)
    {
      knowledge+=knowledge_dict[knowledge_dict_key]+"\n";
    }
  }

  let prompt=`
  Write a company outreach letter from Spectrum Works to ${company}. The goal is for ${company} to ${goal}. Context about Spectrum Works: ${knowledge}
  `;

  let prompt_short=prompt;
  for(let knowledge_dict_key of knowledge_dict_keys)
  {
    prompt_short=prompt_short.replace(knowledge_dict[knowledge_dict_key],`[${knowledge_dict_key}]`);
  }
  
  const query_element=document.getElementById("query") as HTMLDivElement;
  query_element.innerHTML=prompt_short;
  if(running_prompt)
  {
    askOpenAI(prompt);
  }
}
function toTitleCase(text:string)
{
  let words=text.split(" ");
  for(let i=0;i<words.length;i++)
  {
    words[i]=words[i].slice(0,1).toUpperCase()+words[i].slice(1,words[i].length);
  }
  return words.join(" ");
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
export function load_checkboxes()
{
  let knowledge_checkbox_div=document.getElementById("knowledge_checkbox_div") as HTMLDivElement;
  for(let knowledge_dict_key of knowledge_dict_keys)
  {
    let div=document.createElement("div");
    knowledge_checkbox_div.appendChild(div);

    let label_text=knowledge_dict_key;
    label_text=label_text.replace("_"," ");
    label_text=toTitleCase(label_text);

    let label=document.createElement("label");
    div.appendChild(label);
    label.innerHTML=label_text;

    let checkbox=document.createElement("input");
    div.appendChild(checkbox);
    checkbox.type="checkbox";
    checkbox.name="knowledge_checkbox";
    checkbox.value=knowledge_dict_key;
  }
}

const running_prompt=true;
let knowledge_dict:Record<string,string>={};
let knowledge_dict_keys=["company_benefits","employment_model","goals","impact","partner_companies","partner_quotes","values"];
get_context();