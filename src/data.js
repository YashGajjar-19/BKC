// import YashImg from './assets/images/per_bit/Yash.png';
const YashImg = "https://api.dicebear.com/9.x/avataaars/svg?seed=Yash";

export const companyDetails = {
    name: "Bakchodi International PVT. LTD.",
    description: "The leading global (and intergalactic) conglomerate in organized chaos, advanced pranks, and masti management.",
    founded: "2026 (Earth Time)",
    mission: "To spread chaos and laughter across the multiverse, one refined prank at a time.",
    vision: "A world where seriousness is a crime and laughter is the currency.",
};

export const rules = [
    { id: 1, title: "The Golden Rule", description: "If it's not funny, it's a violation of company policy." },
    { id: 2, title: "Meeting Protocol", description: "All meetings must begin with a 2-minute silence followed by a mandatory 'That's what she said' joke." },
    { id: 3, title: "Dress Code", description: "Fake moustaches are mandatory on Tuesdays. Capes are optional but encouraged." },
    { id: 4, title: "Expense Policy", description: "All expenses for whoopee cushions and confetti cannons are 100% reimbursable." },
    { id: 5, title: "No Snitching", description: "What happens in the multiverse HQ, stays in the multiverse HQ." },
];

export const locationStats = {
    totalEarthLocations: "500+",
    galacticOutposts: "120+",
    management: {
        operations: "Yash & Drashti",
        finance: "Bhavy & Vaishali",
        security: "Preet & Riddhi",
        independent: "Dhruvi & Yashvi"
    }
};

export const hqs = [
    // --- MAIN GALACTIC HQS ---
    {
        id: "g1",
        name: "Intergalactic Command",
        location: "Supermassive Black Hole, Sagittarius A*",
        type: "Central Operations",
        planet: "Unknown",
        managedBy: "Yash & Drashti"
    },
    {
        id: "g2",
        name: "The Treasury Moon",
        location: "Orbit of Jupiter",
        type: "Finance & Gold Storage",
        planet: "Europa",
        managedBy: "Bhavy & Vaishali"
    },
    {
        id: "g3",
        name: "Fortress of Solitude",
        location: "Dark Side of the Moon",
        type: "Maximum Security",
        planet: "Luna",
        managedBy: "Preet & Riddhi"
    },
    {
        id: "g4",
        name: "Chaos Lab Alpha",
        location: "Nebula Cluster 42",
        type: "R&D & Experiments",
        planet: "Nebula",
        managedBy: "Dhruvi & Yashvi"
    },
    {
        id: "g5",
        name: "Mars Colony One",
        location: "Olympus Mons",
        type: "Future Expansion",
        planet: "Mars",
        managedBy: "Yash & Drashti"
    },
    
    // --- EARTH CITIES (Top 20 Featured, Rest generated dynamically in UI) ---
    { id: "e1", name: "Mumbai HQ", location: "Nariman Point, India", planet: "Earth", type: "Earth Central" },
    { id: "e2", name: "New York Hub", location: "Manhattan, USA", planet: "Earth" },
    { id: "e3", name: "London Branch", location: "Canary Wharf, UK", planet: "Earth" },
    { id: "e4", name: "Tokyo Tower", location: "Minato City, Japan", planet: "Earth" },
    { id: "e5", name: "Paris Bureau", location: "La Défense, France", planet: "Earth" },
    { id: "e6", name: "Dubai Centre", location: "Downtown, UAE", planet: "Earth" },
    { id: "e7", name: "Singapore Office", location: "Marina Bay, Singapore", planet: "Earth" },
    { id: "e8", name: "Sydney Base", location: "Circular Quay, Australia", planet: "Earth" },
    // Add more famous cities as simple strings if needed, or handle in component
];

export const earthCities = [
    "Los Angeles", "Chicago", "Toronto", "Berlin", "Madrid", "Rome", "Amsterdam", "Brussels", "Vienna", "Zurich",
    "Moscow", "Istanbul", "Seoul", "Beijing", "Shanghai", "Hong Kong", "Bangkok", "Kuala Lumpur", "Jakarta", "Manila",
    "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Ahmedabad", "Kolkata", "Surat", "Jaipur", "Lucknow",
    "Cape Town", "Johannesburg", "Cairo", "Lagos", "Nairobi", "Riyadh", "Tel Aviv", "Doha", "Kuwait City", "Muscat",
    "Sao Paulo", "Rio de Janeiro", "Buenos Aires", "Santiago", "Lima", "Bogota", "Mexico City", "Vancouver", "Montreal",
    "San Francisco", "Seattle", "Boston", "Miami", "Dallas", "Houston", "Atlanta", "Washington D.C.", "Philadelphia",
    "Dublin", "Edinburgh", "Manchester", "Barcelona", "Lisbon", "Milan", "Munich", "Frankfurt", "Hamburg", "Copenhagen",
    "Stockholm", "Oslo", "Helsinki", "Warsaw", "Prague", "Budapest", "Athens", "Bucharest", "Kiev", "St. Petersburg",
    "Auckland", "Wellington", "Melbourne", "Brisbane", "Perth", "Adelaide", "Ho Chi Minh City", "Hanoi", "Taipei",
    "Osaka", "Kyoto", "Fukuoka", "Sapporo", "Busan", "Incheon", "Guangzhou", "Shenzhen", "Chengdu", "Xi'an"
];

export const members = [
    {
        id: 1,
        name: "Yash Gajjar",
        email: "gajjaryash195@gmail.com",
        role: "Founder & Admin",
        title: "The Founder",
        description: "Does A-Z things and fun in the company.",
        image: YashImg,
        isAdmin: true,
        password: "123",
        details: {
            age: 21,
            dob: "19-07-2005",
            place: "Sun, Solar System",
            departments: ["Administration", "Operations", "Chaos Control"],
            post: "Founder",
            salary: "Infinite + Private Universes",
            tasks: ["Masterminding Global Chaos", "Approving Prank", "Intergalactic Diplomacy"]
        }
    },
    {
        id: 2,
        name: "Bhavy Trivedi",
        role: "Founder & CFO",
        title: "Money Man",
        description: "Manages all finance (A-Z).",
        image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Bhavy&backgroundColor=c0aede",
        password: "123",
        details: {
            age: 20,
            dob: "19-04-2006",
            place: "Dessa, India",
            departments: ["Finance", "Treasury", "Laundering (Clothes)"],
            post: "Chief Money Hoarder",
            salary: "Infinite + Antimatter Bullion",
            tasks: ["Counting Cash", "Hiding Assets on Mars", "Inventing New Currencies"]
        }
    },
    {
        id: 3,
        name: "Drashti Bhatia",
        role: "General Manager & HR Head",
        title: "The Manager",
        description: "Second in command. Manages the whole company and HR.",
        image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Drashti&backgroundColor=ffdfbf",
        password: "123",
        details: {
            age: 22,
            dob: "27-09-2004",
            place: "Pluto, Solar System",
            departments: ["HR", "Management", "Secret Service"],
            post: "The Hungry Lady",
            salary: "$1000 Quadrillion + 10 Private Planets",
            tasks: ["Managing Yash", "Hiring & Firing Minions", "Keeping Company Secrets"]
        }
    },
    {
        id: 4,
        name: "Preet Malde",
        role: "Head of Security",
        title: "The Tank",
        description: "Controls the army of guards.",
        image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Preet&backgroundColor=ffd5dc",
        password: "123",
        details: {
            age: 21,
            dob: "26-02-2005",
            place: "Moscow, Russia",
            departments: ["Security", "Defense", "Gym"],
            post: "Chief Muscle Officer",
            salary: "$800 Quadrillion + 1 Private Planet",
            tasks: ["Guarding the Fridge", "Intimidating Aliens", "Bicep Curls"]
        }
    },
    {
        id: 5,
        name: "Dhruvi Vashiyar",
        role: "Manager (A-Z Dept) & Designer",
        title: "Creative Chaos",
        description: "Idea giver, worst and best employee. Works under Yash.",
        image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Dhruvi&backgroundColor=b6e3f4",
        password: "123",
        details: {
            age: 20,
            dob: "14-06-2006",
            place: "Vienna, Austria",
            departments: ["Design", "Creativity", "Meme Department"],
            post: "Glitch Artist",
            salary: "$500 Quadrillion + 50 Private Cities",
            tasks: ["Designing Memes", "Breaking Production", "Painting on Walls"]
        }
    },
    {
        id: 6,
        name: "Vaishali Chavda",
        role: "Finance Manager",
        title: "Number Cruncher",
        description: "Works under Bhavy. Second highest in finance.",
        image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Vaishali&backgroundColor=d1d4f9",
        password: "123",
        details: {
            age: 19,
            dob: "2-01-2007",
            place: "Toronto, Canada",
            departments: ["Finance", "Accounts"],
            post: "Senior Calculator",
            salary: "$600 Quadrillion + 60 Private Cities",
            tasks: ["Excel Wizardry", "Hide & Seek with Taxman", "Budgeting Office Parties"]
        }
    },
    {
        id: 7,
        name: "Riddhi Kaloliya",
        role: "Security Manager",
        title: "The Annoyer",
        description: "Works under Preet. Worst and most annoying employee.",
        image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Riddhi&backgroundColor=ffdfbf",
        password: "123",
        details: {
            age: 21,
            dob: "26-12-2005",
            place: "Saturn, Solar System",
            departments: ["Security", "Surveillance", "Gossip"],
            post: "Director of Annoyance",
            salary: "$400 Quadrillion + 40 Private Cities",
            tasks: ["Annoying Preet", "Distributing Gossip", "Authorized Security Breaches"]
        }
    },
];
