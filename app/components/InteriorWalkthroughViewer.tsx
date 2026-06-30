"use client";

import { useEffect, useMemo, useState } from "react";
import FirstPersonWalkthroughViewer from "./FirstPersonWalkthroughViewer";

type ProjectType =
  | "hospital"
  | "mall"
  | "apartment"
  | "office"
  | "villa"
  | "campus";

type ZonePreview = {
  id: string;
  label: string;
  category: string;
  description: string;
  professionalDetails: string[];
};

type InteriorWalkthroughViewerProps = {
  projectName: string;
};

function getProjectType(projectName = ""): ProjectType {
  const name = projectName.toLowerCase();

  if (
    name.includes("hospital") ||
    name.includes("clinic") ||
    name.includes("medical") ||
    name.includes("health")
  ) {
    return "hospital";
  }

  if (
    name.includes("mall") ||
    name.includes("shopping") ||
    name.includes("retail") ||
    name.includes("galleria")
  ) {
    return "mall";
  }

  if (
    name.includes("campus") ||
    name.includes("school") ||
    name.includes("college") ||
    name.includes("academic") ||
    name.includes("university")
  ) {
    return "campus";
  }

  if (
    name.includes("apartment") ||
    name.includes("tower") ||
    name.includes("residential") ||
    name.includes("complex") ||
    name.includes("skyline")
  ) {
    return "apartment";
  }

  if (
    name.includes("commercial") ||
    name.includes("office") ||
    name.includes("workspace") ||
    name.includes("tech") ||
    name.includes("park") ||
    name.includes("corporate")
  ) {
    return "office";
  }

  return "villa";
}

function getProjectLabel(projectType: ProjectType) {
  if (projectType === "hospital") {
    return "Hospital Design";
  }

  if (projectType === "mall") {
    return "Mall Design";
  }

  if (projectType === "campus") {
    return "Campus Design";
  }

  if (projectType === "apartment") {
    return "Apartment Design";
  }

  if (projectType === "office") {
    return "Office Design";
  }

  return "Villa Design";
}

function getProjectDescription(projectType: ProjectType) {
  if (projectType === "hospital") {
    return "A connected healthcare walkthrough focused on patient movement, emergency access, clean-zone planning, ICU visibility, and clinical interior experience.";
  }

  if (projectType === "mall") {
    return "A connected retail walkthrough focused on customer flow, store visibility, escalator placement, food-court experience, cinema access, and parking orientation.";
  }

  if (projectType === "campus") {
    return "A connected academic walkthrough focused on classroom planning, lab experience, library access, auditorium flow, cafeteria movement, and campus usability.";
  }

  if (projectType === "apartment") {
    return "A connected residential walkthrough focused on arrival experience, living comfort, kitchen usability, bedroom privacy, amenity identity, and lifestyle spaces.";
  }

  if (projectType === "office") {
    return "A connected workplace walkthrough focused on reception quality, productivity zones, meeting rooms, executive cabins, breakout culture, server safety, and pantry usability.";
  }

  return "A connected premium residence walkthrough focused on luxury ambience, living experience, dining comfort, bedroom privacy, courtyard openness, and terrace lifestyle.";
}

function getZonesForProject(projectType: ProjectType): ZonePreview[] {
  if (projectType === "hospital") {
    return [
      {
        id: "hospital-reception",
        label: "Reception Lobby",
        category: "Arrival Zone",
        description:
          "Main patient arrival zone with reception counter, waiting visibility, and hospital identity.",
        professionalDetails: [
          "Reception counter",
          "Patient arrival flow",
          "Clear signage",
          "Entry waiting visibility",
        ],
      },
      {
        id: "hospital-waiting",
        label: "Waiting Area",
        category: "Patient Zone",
        description:
          "Organized patient seating zone with clear movement path toward consultation and pharmacy.",
        professionalDetails: [
          "Rows of waiting chairs",
          "Open circulation",
          "Queue-friendly planning",
          "Patient comfort zone",
        ],
      },
      {
        id: "hospital-consultation",
        label: "Consultation Room",
        category: "Clinical Zone",
        description:
          "Doctor consultation space with desk, patient chairs, storage, and clinical discussion layout.",
        professionalDetails: [
          "Doctor table",
          "Patient seating",
          "Medical storage",
          "Private discussion zone",
        ],
      },
      {
        id: "hospital-pharmacy",
        label: "Pharmacy",
        category: "Support Zone",
        description:
          "Medicine dispensing zone with shelves, billing counter, and patient access near reception.",
        professionalDetails: [
          "Medicine shelves",
          "Billing counter",
          "Quick access",
          "Support workflow",
        ],
      },
      {
        id: "hospital-nurse",
        label: "Nurse Station",
        category: "Monitoring Zone",
        description:
          "Central nursing and monitoring space connecting ICU, operation theatre, and patient care zones.",
        professionalDetails: [
          "Monitoring desk",
          "Clinical supervision",
          "Quick response access",
          "Staff control point",
        ],
      },
      {
        id: "hospital-icu",
        label: "ICU Ward",
        category: "Critical Care",
        description:
          "Critical care area with hospital beds, monitoring units, and controlled movement planning.",
        professionalDetails: [
          "ICU beds",
          "Monitor panels",
          "Restricted access",
          "Medical equipment zone",
        ],
      },
      {
        id: "hospital-operation",
        label: "Operation Theatre",
        category: "Sterile Zone",
        description:
          "Specialized operation zone with operation table, surgical lighting, and controlled clean-room feel.",
        professionalDetails: [
          "Operation table",
          "Surgical lights",
          "Sterile planning",
          "Equipment wall",
        ],
      },
      {
        id: "hospital-labour",
        label: "Labour Room",
        category: "Special Care",
        description:
          "Dedicated labour room with medical bed planning, privacy feeling, and hospital care workflow.",
        professionalDetails: [
          "Care bed",
          "Privacy layout",
          "Clinical support",
          "Emergency access",
        ],
      },
    ];
  }

  if (projectType === "mall") {
    return [
      {
        id: "mall-atrium",
        label: "Entrance Atrium",
        category: "Arrival Zone",
        description:
          "Large entry zone with glass frontage, visual openness, and mall identity point.",
        professionalDetails: [
          "Glass entry",
          "Atrium volume",
          "Brand identity",
          "Open arrival flow",
        ],
      },
      {
        id: "mall-retail",
        label: "Retail Store Row",
        category: "Shopping Zone",
        description:
          "Retail-focused area with shopfronts, display counters, and visible product shelving.",
        professionalDetails: [
          "Shopfront glass",
          "Display shelves",
          "Retail counter",
          "Customer browsing path",
        ],
      },
      {
        id: "mall-escalator",
        label: "Escalator Zone",
        category: "Vertical Movement",
        description:
          "Escalator-focused circulation zone connecting customer movement across levels.",
        professionalDetails: [
          "Escalator structure",
          "Side glass railing",
          "Movement focus",
          "Central circulation",
        ],
      },
      {
        id: "mall-food",
        label: "Food Court",
        category: "Dining Zone",
        description:
          "Food court area with service counters, seating clusters, and customer dining flow.",
        professionalDetails: [
          "Food counters",
          "Dining tables",
          "Seating clusters",
          "Service frontage",
        ],
      },
      {
        id: "mall-cinema",
        label: "Cinema Lobby",
        category: "Entertainment Zone",
        description:
          "Cinema lobby with big screen identity, ticketing feel, and lounge-style waiting.",
        professionalDetails: [
          "Cinema screen wall",
          "Waiting seating",
          "Poster-style area",
          "Entertainment identity",
        ],
      },
      {
        id: "mall-security",
        label: "Security Room",
        category: "Control Zone",
        description:
          "Security control room with monitor wall, control desk, and operational supervision.",
        professionalDetails: [
          "Monitor wall",
          "Control desk",
          "Surveillance zone",
          "Security operations",
        ],
      },
      {
        id: "mall-parking",
        label: "Parking Zone",
        category: "Vehicle Zone",
        description:
          "Parking area with lanes, cars, pillars, and road marking identity.",
        professionalDetails: [
          "Cars",
          "Lane markings",
          "Structural pillars",
          "Vehicle orientation",
        ],
      },
    ];
  }

  if (projectType === "campus") {
    return [
      {
        id: "campus-admin",
        label: "Admin Block",
        category: "Administration",
        description:
          "Administrative arrival space for admissions, office work, and institutional front desk.",
        professionalDetails: [
          "Admin counter",
          "Office desk",
          "Visitor flow",
          "Institutional entry",
        ],
      },
      {
        id: "campus-classroom",
        label: "Classroom",
        category: "Learning Zone",
        description:
          "Classroom with smart board, benches, student seating, and teacher-facing layout.",
        professionalDetails: [
          "Smart board",
          "Student benches",
          "Teaching wall",
          "Learning layout",
        ],
      },
      {
        id: "campus-lab",
        label: "Computer Lab",
        category: "Technical Zone",
        description:
          "Computer lab with workstation rows, monitor tables, and technical learning experience.",
        professionalDetails: [
          "Computer desks",
          "Monitor rows",
          "Lab circulation",
          "Technical learning",
        ],
      },
      {
        id: "campus-library",
        label: "Library",
        category: "Knowledge Zone",
        description:
          "Library area with bookshelf identity, reading desk, and focused learning ambience.",
        professionalDetails: [
          "Bookshelves",
          "Reading table",
          "Quiet study zone",
          "Knowledge identity",
        ],
      },
      {
        id: "campus-auditorium",
        label: "Auditorium",
        category: "Event Zone",
        description:
          "Auditorium-style space with stage/screen wall and audience seating layout.",
        professionalDetails: [
          "Stage screen",
          "Audience seating",
          "Event focus",
          "Presentation space",
        ],
      },
      {
        id: "campus-cafeteria",
        label: "Cafeteria",
        category: "Student Life",
        description:
          "Student cafeteria with service counter, tables, and informal gathering flow.",
        professionalDetails: [
          "Food counter",
          "Dining tables",
          "Student gathering",
          "Service flow",
        ],
      },
      {
        id: "campus-staff",
        label: "Staff Room",
        category: "Faculty Zone",
        description:
          "Faculty support room with staff desks, storage, and work discussion environment.",
        professionalDetails: [
          "Staff desks",
          "Storage shelves",
          "Faculty seating",
          "Work support zone",
        ],
      },
    ];
  }

  if (projectType === "apartment") {
    return [
      {
        id: "apartment-lobby",
        label: "Apartment Lobby",
        category: "Arrival Zone",
        description:
          "Residential lobby with reception-style arrival, waiting seating, and premium entry feel.",
        professionalDetails: [
          "Lobby counter",
          "Waiting sofa",
          "Entry identity",
          "Resident arrival",
        ],
      },
      {
        id: "apartment-living",
        label: "Living Room",
        category: "Family Zone",
        description:
          "Main living space with sofa, TV wall, coffee table, and family interaction layout.",
        professionalDetails: [
          "Sofa set",
          "TV wall",
          "Coffee table",
          "Decor plants",
        ],
      },
      {
        id: "apartment-kitchen",
        label: "Kitchen",
        category: "Utility Zone",
        description:
          "Kitchen zone with counters, cabinets, island feel, and usable cooking workflow.",
        professionalDetails: [
          "Kitchen counters",
          "Cabinet wall",
          "Island counter",
          "Cooking workflow",
        ],
      },
      {
        id: "apartment-balcony",
        label: "Balcony",
        category: "Outdoor Zone",
        description:
          "Semi-open balcony with railing, plants, outdoor table, and fresh-air experience.",
        professionalDetails: [
          "Glass railing",
          "Outdoor flooring",
          "Plants",
          "Open view feel",
        ],
      },
      {
        id: "apartment-bedroom",
        label: "Bedroom",
        category: "Private Zone",
        description:
          "Bedroom space with bed, headboard, wardrobe, side table, and privacy-focused planning.",
        professionalDetails: [
          "Bed",
          "Headboard",
          "Wardrobe",
          "Side table",
        ],
      },
      {
        id: "apartment-gym",
        label: "Gym",
        category: "Amenity Zone",
        description:
          "Fitness amenity with treadmill-like equipment, weights, mirror wall, and active zone identity.",
        professionalDetails: [
          "Gym equipment",
          "Weight units",
          "Mirror wall",
          "Fitness identity",
        ],
      },
      {
        id: "apartment-clubhouse",
        label: "Clubhouse",
        category: "Community Zone",
        description:
          "Resident clubhouse with lounge seating, TV wall, coffee table, and community ambience.",
        professionalDetails: [
          "Lounge sofa",
          "Feature wall",
          "Coffee table",
          "Community seating",
        ],
      },
    ];
  }

  if (projectType === "office") {
    return [
      {
        id: "office-reception",
        label: "Office Reception",
        category: "Arrival Zone",
        description:
          "Professional reception with front desk, visitor waiting, and corporate entry identity.",
        professionalDetails: [
          "Reception counter",
          "Visitor seating",
          "Brand wall",
          "Arrival control",
        ],
      },
      {
        id: "office-workstation",
        label: "Workstation Area",
        category: "Productivity Zone",
        description:
          "Team workspace with desks, monitors, chairs, and productive office planning.",
        professionalDetails: [
          "Work desks",
          "Monitor rows",
          "Team seating",
          "Productivity layout",
        ],
      },
      {
        id: "office-conference",
        label: "Conference Room",
        category: "Meeting Zone",
        description:
          "Meeting room with conference table, chairs, display wall, and discussion-focused layout.",
        professionalDetails: [
          "Conference table",
          "Meeting chairs",
          "Display wall",
          "Client discussion",
        ],
      },
      {
        id: "office-manager",
        label: "Manager Cabin",
        category: "Executive Zone",
        description:
          "Private cabin with manager desk, visitor seating, and executive work environment.",
        professionalDetails: [
          "Manager desk",
          "Visitor chairs",
          "Private cabin",
          "Executive storage",
        ],
      },
      {
        id: "office-breakout",
        label: "Breakout Zone",
        category: "Collaboration Zone",
        description:
          "Informal collaboration space with lounge furniture, plants, and casual discussion setting.",
        professionalDetails: [
          "Casual sofa",
          "Coffee table",
          "Creative zone",
          "Team discussion",
        ],
      },
      {
        id: "office-server",
        label: "Server Room",
        category: "Technical Zone",
        description:
          "Technical server area with server racks, glowing monitor panels, and restricted identity.",
        professionalDetails: [
          "Server racks",
          "Technical monitors",
          "Restricted zone",
          "IT infrastructure",
        ],
      },
      {
        id: "office-pantry",
        label: "Pantry",
        category: "Support Zone",
        description:
          "Office pantry with counters, casual seating, and refreshment support planning.",
        professionalDetails: [
          "Pantry counter",
          "Refreshment zone",
          "Small dining",
          "Support space",
        ],
      },
    ];
  }

  return [
    {
      id: "villa-living",
      label: "Living Room",
      category: "Luxury Family Zone",
      description:
        "Premium living area with sofa, TV wall, decor, and family lounge experience.",
      professionalDetails: [
        "Premium sofa",
        "TV feature wall",
        "Coffee table",
        "Luxury decor",
      ],
    },
    {
      id: "villa-dining",
      label: "Dining Area",
      category: "Dining Zone",
      description:
        "Villa dining space with large table, seating, and family dining ambience.",
      professionalDetails: [
        "Dining table",
        "Seating layout",
        "Feature wall",
        "Family dining",
      ],
    },
    {
      id: "villa-kitchen",
      label: "Kitchen",
      category: "Premium Utility",
      description:
        "Premium kitchen with counters, cabinets, island-like planning, and cooking workflow.",
      professionalDetails: [
        "Kitchen counter",
        "Cabinets",
        "Island unit",
        "Cooking workflow",
      ],
    },
    {
      id: "villa-bedroom",
      label: "Master Bedroom",
      category: "Private Luxury",
      description:
        "Master bedroom with bed, headboard, wardrobe, side unit, and calm private ambience.",
      professionalDetails: [
        "Bed",
        "Headboard",
        "Wardrobe",
        "Private ambience",
      ],
    },
    {
      id: "villa-courtyard",
      label: "Courtyard",
      category: "Open Space",
      description:
        "Open courtyard with greenery, outdoor table, and luxury villa breathing space.",
      professionalDetails: [
        "Greenery",
        "Open court",
        "Outdoor table",
        "Natural light feel",
      ],
    },
    {
      id: "villa-lounge",
      label: "Private Lounge",
      category: "Premium Lounge",
      description:
        "Private lounge with sofa, feature wall, relaxed seating, and premium lifestyle identity.",
      professionalDetails: [
        "Lounge seating",
        "Feature wall",
        "Coffee table",
        "Private ambience",
      ],
    },
    {
      id: "villa-terrace",
      label: "Terrace",
      category: "Outdoor Lifestyle",
      description:
        "Terrace experience with railing, outdoor seating, plants, and open-view lifestyle.",
      professionalDetails: [
        "Terrace railing",
        "Outdoor seating",
        "Plants",
        "Open view feel",
      ],
    },
  ];
}

function getExperienceNotes(projectType: ProjectType) {
  if (projectType === "hospital") {
    return [
      "Reception, waiting, ICU, operation theatre, nurse station, and pharmacy are generated as connected healthcare zones.",
      "The VR walkthrough focuses on patient movement, clean medical identity, and clinical workflow clarity.",
      "Use this project to explain hospital planning intelligence to hackathon judges.",
    ];
  }

  if (projectType === "mall") {
    return [
      "Mall zones are visually separated using retail shelves, escalator geometry, cinema screen, food counters, and parking elements.",
      "The VR walkthrough focuses on customer journey, vertical circulation, shopping visibility, and parking orientation.",
      "Use this project to explain commercial experience design and customer-flow intelligence.",
    ];
  }

  if (projectType === "campus") {
    return [
      "Campus now uses academic spaces only: classroom, computer lab, library, auditorium, cafeteria, admin, and staff room.",
      "No living room, bedroom, kitchen, or private lounge is used for campus projects.",
      "Use this project to explain education-space planning and student movement experience.",
    ];
  }

  if (projectType === "apartment") {
    return [
      "Apartment zones include lobby, living room, kitchen, balcony, bedroom, gym, and clubhouse.",
      "Each zone has a different visual identity so it does not feel like repeated rooms.",
      "Use this project to explain lifestyle planning, amenity experience, and residential walkthrough value.",
    ];
  }

  if (projectType === "office") {
    return [
      "Office zones include reception, workstation, conference room, manager cabin, breakout zone, server room, and pantry.",
      "The layout focuses on productivity, collaboration, executive privacy, and support spaces.",
      "Use this project to explain workplace design intelligence.",
    ];
  }

  return [
    "Villa zones include living, dining, kitchen, master bedroom, courtyard, private lounge, and terrace.",
    "The walkthrough focuses on premium residential lifestyle and client-facing presentation.",
    "Use this project to explain luxury design experience and interior storytelling.",
  ];
}

export default function InteriorWalkthroughViewer({
  projectName,
}: InteriorWalkthroughViewerProps) {
  const projectType = useMemo(() => {
    return getProjectType(projectName);
  }, [projectName]);

  const projectLabel = useMemo(() => {
    return getProjectLabel(projectType);
  }, [projectType]);

  const projectDescription = useMemo(() => {
    return getProjectDescription(projectType);
  }, [projectType]);

  const zones = useMemo(() => {
    return getZonesForProject(projectType);
  }, [projectType]);

  const experienceNotes = useMemo(() => {
    return getExperienceNotes(projectType);
  }, [projectType]);

  const [activeZoneId, setActiveZoneId] = useState("");

  useEffect(() => {
    setActiveZoneId(zones[0]?.id || "");
  }, [zones]);

  const activeZone = useMemo(() => {
    const matchedZone = zones.find((zone) => {
      return zone.id === activeZoneId;
    });

    return matchedZone || zones[0];
  }, [activeZoneId, zones]);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950 p-5 shadow-2xl shadow-slate-950/40">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Whole-Design VR Walkthrough
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-white">
              {projectLabel}
            </h2>

            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">
              {projectDescription}
            </p>
          </div>

          <div className="grid min-w-[260px] gap-3 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4">
            <div>
              <p className="text-xs text-slate-400">Detected Project Type</p>

              <p className="mt-1 text-sm font-semibold capitalize text-cyan-200">
                {projectType}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Generated Design Zones</p>

              <p className="mt-1 text-sm font-semibold text-white">
                {zones.length} connected zones
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Active Walkthrough Zone</p>

              <p className="mt-1 text-sm font-semibold text-emerald-200">
                {activeZone?.label}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Walkthrough Type
            </p>

            <p className="mt-2 text-sm font-semibold text-white">
              Full connected building layout
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Zone buttons move the camera to a specific area, but the entire
              project remains connected in one walkthrough.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Interior Direction
            </p>

            <p className="mt-2 text-sm font-semibold text-white">
              Professional box-model prototype
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Each project type uses different recognizable interior elements
              instead of repeated generic rooms.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Controls
            </p>

            <p className="mt-2 text-sm font-semibold text-white">
              W/A/S/D move · Q/E turn · R reset
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Click inside the viewer first, then move like a person walking
              through the design.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Design Zone Navigator
            </p>

            <div className="mt-4 space-y-3">
              {zones.map((zone) => {
                const isActive = zone.id === activeZone?.id;

                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setActiveZoneId(zone.id)}
                    className={
                      isActive
                        ? "w-full rounded-2xl border border-cyan-400 bg-cyan-400/10 p-4 text-left shadow-lg shadow-cyan-950/30 transition"
                        : "w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-cyan-400/40 hover:bg-cyan-400/5"
                    }
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p
                          className={
                            isActive
                              ? "text-sm font-semibold text-cyan-100"
                              : "text-sm font-semibold text-white"
                          }
                        >
                          {zone.label}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {zone.category}
                        </p>
                      </div>

                      <span
                        className={
                          isActive
                            ? "rounded-full bg-cyan-400 px-2.5 py-1 text-[11px] font-semibold text-slate-950"
                            : "rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-slate-400"
                        }
                      >
                        Zone
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {zone.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-5">
            <p className="text-sm font-semibold text-emerald-200">
              Active Zone Details
            </p>

            <h3 className="mt-3 text-lg font-semibold text-white">
              {activeZone?.label}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              {activeZone?.description}
            </p>

            <div className="mt-4 space-y-2">
              {activeZone?.professionalDetails.map((detail) => (
                <div
                  key={detail}
                  className="rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-200"
                >
                  {detail}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Presentation Notes
            </p>

            <div className="mt-4 space-y-3">
              {experienceNotes.map((note) => (
                <div
                  key={note}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-slate-300"
                >
                  {note}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section>
          {activeZone ? (
            <FirstPersonWalkthroughViewer
              projectName={projectName}
              roomName={activeZone.label}
              roomDescription={activeZone.description}
            />
          ) : (
            <div className="flex h-[680px] items-center justify-center rounded-[2rem] border border-white/10 bg-slate-950 text-sm text-slate-400">
              Preparing whole-design walkthrough...
            </div>
          )}
        </section>
      </div>
    </div>
  );
}