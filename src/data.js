// src/data.js

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
    { id: "e1", name: "Mumbai HQ", location: "Nariman Point, India", planet: "Earth", type: "Earth Central" },
    { id: "e2", name: "New York Hub", location: "Manhattan, USA", planet: "Earth" },
    { id: "e3", name: "London Branch", location: "Canary Wharf, UK", planet: "Earth" },
    { id: "e4", name: "Tokyo Tower", location: "Minato City, Japan", planet: "Earth" },
    { id: "e5", name: "Paris Bureau", location: "La Défense, France", planet: "Earth" },
    { id: "e6", name: "Dubai Centre", location: "Downtown, UAE", planet: "Earth" },
    { id: "e7", name: "Singapore Office", location: "Marina Bay, Singapore", planet: "Earth" },
    { id: "e8", name: "Sydney Base", location: "Circular Quay, Australia", planet: "Earth" },
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

// --- UPDATED MEMBERS WITH BENTO PROFILE DATA ---
export const members = [
    {
        id: 1,
        name: "Yash Gajjar",
        role: "Founder & Admin",
        title: "The Architect",
        email: "gajjaryash195@gmail.com",
        image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Yash",
        isAdmin: true,
        password: "123",
        // --- NEW DATA ---
        age: "21",
        dob: "19 Feb, 2005",
        salary: "$1,200,000",
        description: "The mastermind behind the chaos. Yash spends 90% of his time tweaking CSS gradients and 10% actually coding. Known for deploying pranks directly into the production database.",
        posts: [
            { id: 101, image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800", caption: "Hacking the mainframe (actually just inspecting element)." },
            { id: 102, image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800", caption: "New setup. RGB increases speed by 200%." },
            { id: 103, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800", caption: "Touch grass? Never heard of her." }
        ]
    },
    {
        id: 2,
        name: "Bhavy Trivedi",
        role: "Founder & CFO",
        title: "The CFO",
        email: "bhavy@example.com",
        image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Bhavy&backgroundColor=c0aede",
        password: "123",
        // --- NEW DATA ---
        age: "22",
        dob: "12 Aug, 2004",
        salary: "$950,000",
        description: "Bhavy manages the funds, which mostly involves buying premium coffee and denying our expense reports for 'Prank Supplies'.",
        posts: [
            { id: 201, image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800", caption: "Stonks only go up 📈" },
            { id: 202, image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800", caption: "Another day, another spreadsheet." }
        ]
    },
    {
        id: 3,
        name: "Drashti Bhatia",
        role: "General Manager & HR Head",
        title: "The Manager",
        description: "Second in command. Manages the whole company and HR. If you're late, expect a 'friendly' chat.",
        image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Drashti&backgroundColor=ffdfbf",
        password: "123",
        age: "22",
        dob: "27 Sep, 2004",
        salary: "$1,000,000",
        posts: [
             { id: 301, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800", caption: "Reviewing performance (prank) metrics." },
             { id: 302, image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800", caption: "HR is watching you." }
        ]
    },
    {
        id: 4,
        name: "Preet Malde",
        role: "Head of Security",
        title: "The Tank",
        description: "Controls the army of guards. His bicep curls are the reason for our office earthquakes.",
        image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Preet&backgroundColor=ffd5dc",
        password: "123",
        age: "21",
        dob: "26 Feb, 2005",
        salary: "$800,000",
        posts: [
            { id: 401, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800", caption: "Security clearance: DENIED." },
            { id: 402, image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800", caption: "Protecting the assets (mostly snacks)." }
        ]
    },
    {
        id: 5,
        name: "Dhruvi Vashiyar",
        role: "Manager (A-Z Dept) & Designer",
        title: "Creative Chaos",
        description: "Idea giver, worst and best employee. Works under Yash. Mostly just makes memes.",
        image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Dhruvi&backgroundColor=b6e3f4",
        password: "123",
        age: "20",
        dob: "14 Jun, 2006",
        salary: "$500,000",
        posts: [
            { id: 501, image: "https://images.unsplash.com/photo-1626785774573-4b79931434f3?q=80&w=800", caption: "Design is my passion." },
            { id: 502, image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800", caption: "Fixing pixels, breaking hearts." }
        ]
    },
    {
        id: 6,
        name: "Vaishali Chavda",
        role: "Finance Manager",
        title: "Number Cruncher",
        description: "Works under Bhavy. Second highest in finance. Can calculate tax fraud in her head.",
        image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Vaishali&backgroundColor=d1d4f9",
        password: "123",
        age: "19",
        dob: "02 Jan, 2007",
        salary: "$600,000",
        posts: [
            { id: 601, image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?q=80&w=800", caption: "Numbers don't lie, but I do." },
            { id: 602, image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800", caption: "Quarterly review time!" }
        ]
    },
    {
        id: 7,
        name: "Riddhi Kaloliya",
        role: "Security Manager",
        title: "The Annoyer",
        description: "Works under Preet. Worst and most annoying employee. Professional pest.",
        image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Riddhi&backgroundColor=ffdfbf",
        password: "123",
        age: "21",
        dob: "26 Dec, 2005",
        salary: "$400,000",
        posts: [
            { id: 701, image: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=800", caption: "Annoying Preet is my full-time job." },
            { id: 702, image: "https://images.unsplash.com/photo-1485217988980-11786ced9454?q=80&w=800", caption: "Caught on camera!" }
        ]
    },
];
