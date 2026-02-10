// src/data.js
import yashImg from "../assets/images/per_bit/Yash.png";
import bhavyImg from "../assets/images/per_bit/Bhavy.png";
import drashtiImg from "../assets/images/per_bit/Drashti.png";
import preetImg from "../assets/images/per_bit/Preet.png";
import dhruviImg from "../assets/images/per_bit/Dhruvi.png";
import vaishaliImg from "../assets/images/per_bit/Vaishali.png";
import riddhiImg from "../assets/images/per_bit/Riddhi.png";


export const companyDetails = {
    name: "Bakchodi International PVT. LTD.",
    description: "The leading global (and intergalactic) conglomerate in doing bakchodi, advanced bakchodi, and masti forever.",
    founded: "2026 (Earth Time)",
    mission: "To spread bakchodi and masti across the multiverse, one refined bakchodi at a time.",
    vision: "A world where seriousness is a crime and bakchodi is the currency.",
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
        title: "The Founder",
        dob: "19 July, 2005",
        age: "21",
        salary: "$1000 Quadrillion",
        posts: "Founder",
        description: "The mastermind behind the chaos. The one who started it all. The one who makes the decisions of bakchodi. The one who know how to build towers with 'Bottles' and 'Mobile phones'. The only one who can talk the most. The one who is owner of all this. The only one 'Yash Gajjar'. ",
        email: "",
        image: yashImg,
        isAdmin: true,
    }, 
    {
        id: 2,
        name: "Bhavy Trivedi",
        role: "Founder & CFO",
        title: "The CFO",
        dob: "19 April, 2006",
        age: "20",
        salary: "$950 Quadrillion",
        posts: "Founder and CFO",
        description: "Bhavy manages the funds of the company. He manages quadrilions of dollars on daily basis. If he gets angry then he fires any one in the company. The pakko marwadi. He is also an expert in 'news reporting'",
        email: "",
        image: bhavyImg,
        isAdmin: true,
    },
    {
        id: 3,
        name: "Drashti Bhatia",
        role: "General Manager & HR Head",
        title: "The Manager",
        dob: "27 September, 2004",
        age: "22",
        salary: "$800 Quadrillion",
        description: "The most laziest employee of the company. But still she is the most important person in the company. She is the one who manages the company. She is who takes interviews of new employees. She is also an expert in 'eating food all time'. She always feel bored. But she is serious when it comes to work.",
        posts: "General Manager & HR Head",
        email: "[EMAIL_ADDRESS]",
        authEmail: "",
        image: drashtiImg,
        isAdmin: true
    },
    {
        id: 4,
        name: "Preet Malde",
        role: "Head of Security",
        title: "The Tank",
        dob: "26 February, 2005",
        age: "21",
        salary: "$780 Quadrillion",
        description: "Controls the security team. Ensures total asset protection. He is the most chutiya person in the company. He is also an expert in 'fighting with people'. He also carries a 'gun' with him, his special Pistol. He is expert in getting some bad words and some slaps from whole team. But still he carries his gaurd army with him to protect the company from any danger.",
        posts: "Head of Security",
         email: "[EMAIL_ADDRESS]",
         authEmail: "",
        image: preetImg,
        isAdmin: true
    },
    {
        id: 5,
        name: "Dhruvi Vashiyar",
        role: "Manager (A-Z Dept) & Designer",
        title: "Creative Chaos",
        dob: "14 June, 2006",
        age: "20",
        salary: "$550 Quadrillion",
        description: "The most talkative person in the company. She has creative brain but she never use it. She is expert in 'Getting news from others - 'Chaplusi''. She always feel bored. She is never serious when it comes to work. She is worst and best employee of the company. Also she is the first intern of the company. She is also an expert in 'making fun of others'. The leftout feeling person when she is not with her group.",
        posts: "Manager & Designer",
        email: "[EMAIL_ADDRESS]",
        authEmail: "",
        image: dhruviImg,
        isAdmin: true
    },
    {
        id: 6,
        name: "Vaishali Chavda",
        role: "Finance Manager",
        title: "Number Cruncher",
        dob: "2 January, 2007",
        age: "19",
        salary: "$650 Quadrillion",
        description: "Handles accounts and tax compliance with precision. She is the one who manages the 'Accounts' of the company after Bhavy. She manages the salary of all employees who has lower-mid posts. The most honest employee of the company.",
        posts: "Finance Manager",
        email: "[EMAIL_ADDRESS]",
        authEmail: "",
        image: vaishaliImg  ,
        isAdmin: true
    },
    {
        id: 7,
        name: "Riddhi Kaloliya",
        role: "Security Manager",
        title: "The Annoyer",
        dob: "27 December, 2005",
        age: "20",
        salary: "$450 Quadrillion",
        description: "The most annoying person in the company. She never agrees with the founder. she never performs her tasks properly. Writing about her is just waste of time.",
        posts: "Security Manager",
        email: "[EMAIL_ADDRESS]",
        authEmail: "",
        image: riddhiImg,
        isAdmin: true
    },
];
