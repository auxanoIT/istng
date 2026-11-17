export const projectStages = ["Assess", "Plan", "Install", "Test", "Handover", "Support"] as const;

export const journeyProjects = [
  {
    serviceId: "solar-energy",
    title: "Solar Energy",
    cta: "Explore Solar Solutions",
    image: "/integrated-assets/images/project-journey/solar-energy-wide.webp",
    stages: [
      {
        heading: "We Start by Understanding Your Needs.",
        description: "We assess your energy usage, property conditions and backup requirements to understand what your solar system needs to achieve.",
      },
      {
        heading: "Your Solar Solution Is Carefully Planned.",
        description: "We design a system that fits your building, energy goals and budget, with the right combination of solar panels, inverter and battery storage.",
      },
      {
        heading: "Your Solar System Takes Shape.",
        description: "We install the panels, inverter and battery storage around the needs of your building, with careful attention to quality and performance.",
      },
      {
        heading: "We Test Before It Goes Live.",
        description: "We check the complete system to confirm that it is properly connected, operating correctly and ready for everyday use.",
      },
      {
        heading: "Your System Is Ready to Use.",
        description: "We guide you through the completed installation, explain how the system works and help you understand its operation and maintenance needs.",
      },
      {
        heading: "Support Beyond Installation.",
        description: "We provide maintenance and technical assistance to help keep your solar system operating effectively over time.",
      },
    ],
  },
  {
    serviceId: "network-infrastructure",
    title: "Network Infrastructure",
    cta: "Explore Network Solutions",
    image: "/integrated-assets/images/project-journey/network-infrastructure-wide.webp",
    stages: [
      {
        heading: "First, We Understand How Your Business Connects.",
        description: "We assess your existing network, connectivity requirements, building layout and operational needs to identify the right infrastructure approach.",
      },
      {
        heading: "A Network Designed Around Your Operations.",
        description: "We plan your network architecture, structured cabling, equipment placement and connectivity requirements to support reliable communication across your business.",
      },
      {
        heading: "Building the Connections Your Business Depends On.",
        description: "We install network equipment, structured copper and fibre cabling, racks and connectivity systems with attention to organisation, performance and future maintenance.",
      },
      {
        heading: "Every Connection Matters.",
        description: "We test and verify network connections, cabling and equipment configuration against the agreed requirements before handover.",
      },
      {
        heading: "Your Network Is Ready for Business.",
        description: "We hand over the completed infrastructure with relevant documentation and guidance to help your team manage the network confidently.",
      },
      {
        heading: "Keeping Your Business Connected.",
        description: "We provide network maintenance, troubleshooting and technical support to help your connectivity infrastructure continue meeting operational needs.",
      },
    ],
  },
  {
    serviceId: "data-centre-deployment",
    title: "Data Centre",
    cta: "Explore Data Centre Solutions",
    image: "/integrated-assets/images/project-journey/data-centre-deployment-wide.webp",
    stages: [
      {
        heading: "Understanding Your Infrastructure Requirements.",
        description: "We review your existing environment, equipment requirements, available space and operational priorities to establish a practical approach to deployment.",
      },
      {
        heading: "Every Component Has Its Place.",
        description: "We plan rack layouts, equipment positioning, cabling, connectivity and deployment requirements to support an organised and maintainable infrastructure environment.",
      },
      {
        heading: "Your Infrastructure, Professionally Deployed.",
        description: "We install and integrate server racks, enterprise servers, storage systems, networking equipment and supporting infrastructure in line with the project requirements.",
      },
      {
        heading: "Checked, Verified and Ready for Operation.",
        description: "We inspect installed equipment, verify connections and perform agreed system checks to confirm the infrastructure is ready for handover.",
      },
      {
        heading: "A Clear Handover. A Ready Environment.",
        description: "We provide relevant installation records, system information and operational guidance to help your team understand and manage the completed infrastructure.",
      },
      {
        heading: "Technical Support Beyond Deployment.",
        description: "We provide maintenance and technical assistance to help organisations manage their data centre infrastructure and respond to changing operational requirements.",
      },
    ],
  },
];
