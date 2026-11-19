export type PlanningKind = "solar" | "infrastructure" | "security";
export type PlanningQuestion = { prompt: string; guidance: string };

export const planningChecklists: Record<PlanningKind, { service: string; introduction: string; questions: PlanningQuestion[] }> = {
  infrastructure: {
    service: "Data Centre & IT Infrastructure",
    introduction: "Review the space, equipment and practical requirements behind your infrastructure project. You do not need every answer before speaking to us.",
    questions: [
      { prompt: "Have you defined what the project needs to achieve?", guidance: "For example: a new server room, extra capacity, a relocation or more organised network cabling." },
      { prompt: "Have you listed the equipment and users in scope?", guidance: "Note the servers, storage, network devices and teams that will depend on the installation." },
      { prompt: "Have you identified the rooms and available rack space?", guidance: "Record room dimensions, rack locations, access routes and any restrictions on installation work." },
      { prompt: "Do you have a record of existing power arrangements?", guidance: "List available supplies and backup equipment. An engineer will need to verify suitability." },
      { prompt: "Have you considered cooling and ventilation?", guidance: "Note existing cooling equipment and any known temperature or airflow concerns." },
      { prompt: "Have you documented the network and cabling requirements?", guidance: "Identify connections between devices, racks, floors or buildings, including copper and fibre links." },
      { prompt: "Have you identified access and physical security requirements?", guidance: "Consider who may enter equipment rooms and how installation access will be arranged." },
      { prompt: "Have you agreed when installation work can take place?", guidance: "Record any maintenance windows, working-hour restrictions and systems that must remain available." },
      { prompt: "Have you set an indicative budget and target timeline?", guidance: "An estimate is useful; a final scope and quotation follow the assessment." },
      { prompt: "Have you identified who will accept and maintain the installation?", guidance: "Agree a handover owner, documentation needs and the technical support your team may require." },
    ],
  },
  security: {
    service: "Security & Surveillance",
    introduction: "Think through the areas, people and equipment your security project needs to support. We can help clarify the details during an assessment.",
    questions: [
      { prompt: "Have you identified the areas that need monitoring?", guidance: "List entrances, parking areas, shared spaces and other locations relevant to your property." },
      { prompt: "Have you defined what you need to see or control?", guidance: "Consider the purpose of each camera or access point, rather than choosing equipment by quantity alone." },
      { prompt: "Have you listed existing security equipment?", guidance: "Record cameras, recorders, access devices and any equipment you hope to retain." },
      { prompt: "Have you noted lighting and environmental conditions?", guidance: "Identify dark areas, outdoor exposure and obstructions that may affect equipment selection." },
      { prompt: "Have you considered mounting positions and cable routes?", guidance: "Note building access restrictions and locations where installation will need special planning." },
      { prompt: "Have you checked the available network connections?", guidance: "Record existing switches, cabling and internet access where remote viewing may be needed." },
      { prompt: "Have you considered power and backup requirements?", guidance: "Identify which security equipment needs to operate during a power interruption." },
      { prompt: "Have you considered footage retention and authorised access?", guidance: "Decide who should view recordings and discuss suitable retention and privacy requirements with your team." },
      { prompt: "Have you set an indicative budget and installation timeline?", guidance: "Include any operating hours or activities that installation work should avoid disrupting." },
      { prompt: "Have you identified who will manage and maintain the system?", guidance: "Plan user guidance, access permissions, routine maintenance and a point of contact for faults." },
    ],
  },
  solar: {
    service: "Solar Energy & Power Solutions",
    introduction: "Prepare for a solar discussion by reviewing your electricity use, backup priorities and property. Your answers support a consultation; they do not size or approve a system.",
    questions: [
      { prompt: "Have you listed the appliances you want to power?", guidance: "Include the equipment that is essential during an outage and items that can be left off." },
      { prompt: "Do you know the power ratings of those appliances?", guidance: "Use equipment labels or manuals where available. Some appliances also have starting loads that need assessment." },
      { prompt: "Have you estimated how long each appliance runs daily?", guidance: "Separate daytime use from evening and overnight use where possible." },
      { prompt: "Have you decided which appliances need backup power?", guidance: "Prioritise essentials such as lighting, refrigeration, connectivity or business equipment." },
      { prompt: "Have you considered your preferred backup duration?", guidance: "Battery requirements depend on the connected load, available charge and operating conditions." },
      { prompt: "Have you identified a possible panel installation area?", guidance: "Note shade, access and available space. Roof condition and mounting suitability need professional assessment." },
      { prompt: "Have you identified a possible indoor equipment location?", guidance: "The installer will assess space, ventilation, protection and manufacturer requirements for inverter and battery equipment." },
      { prompt: "Have you listed existing power equipment?", guidance: "Record generators, inverters, batteries and any existing solar equipment for compatibility checks." },
      { prompt: "Have you considered your budget and future electricity needs?", guidance: "Include planned appliances or business expansion so that future requirements can be discussed." },
      { prompt: "Have you identified your preferred timeline and project contact?", guidance: "Arrange access for an assessment and decide who will discuss the system's use, handover and maintenance." },
    ],
  },
};

export function getPlanningQuestions(kind: PlanningKind, supplied: string[] | null = []): PlanningQuestion[] {
  const values = Array.isArray(supplied) ? supplied.filter((prompt): prompt is string => typeof prompt === "string") : [];
  const unique = [...new Map(values.map(prompt => [prompt.trim().toLowerCase(), prompt.trim()])).values()].filter(Boolean);
  // Older CMS records contain four preparation tasks; use the complete editorial
  // questionnaire until a full ten-question version is published in the CMS.
  return unique.length >= 10
    ? unique.slice(0, 10).map(prompt => ({ prompt, guidance: "Consider what is already documented and where you would like our team to help." }))
    : planningChecklists[kind].questions;
}
