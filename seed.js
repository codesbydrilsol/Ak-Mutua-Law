require('dotenv').config();
const mongoose = require('mongoose');
const Client = require('./models/Client'); // adjust path if needed

// ------------------------------------------------------------------
// DATA ARRAYS (you can copy the full lists from below)
// ------------------------------------------------------------------

// Phone numbers – I've taken the first few from your list; copy all!
const phoneNumbers = [
  '+254 725 593551', '+254 710 355891', '+254 717 564009', '+254 794 885739',
  // ... include ALL numbers from your message (I'll provide a complete list)
];

// Male first names (English)
const maleFirstNames = [
  'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Joseph', 'Thomas',
  'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Donald', 'Paul'
];

// Female first names (English)
const femaleFirstNames = [
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan',
  'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Margaret', 'Sandra'
];

// Last names – Eastern (Kamba, Mijikenda)
const lastNamesEastern = [
  'Mutua', 'Muthoka', 'Ndolo', 'Musembi', 'Kioko', 'Nzioka', 'Mutungi', 'Kilonzo',
  'Muli', 'Mwikali', 'Kavula', 'Mwarabu', 'Mwamure', 'Mwangemi', 'Mwamburi'
];

// Last names – Other tribes (Kikuyu, Luo, Luhya, Kalenjin, etc.)
const lastNamesOther = [
  'Kamau', 'Mwangi', 'Kariuki', 'Maina', 'Omondi', 'Otieno', 'Ochieng', 'Odhiambo',
  'Wanjala', 'Mukhongo', 'Kiprop', 'Kipchoge', 'Kibet', 'Korir', 'Mbugua'
];

// Case types with templates
const caseTypes = [
  { category: 'Traffic Offence', templates: [
    'Exceeding speed limit by 40 km/h on Thika Road',
    'Driving without a valid license',
    'Reckless driving causing accident'
  ]},
  { category: 'Sexual Offence', templates: [
    'Defilement of a minor',
    'Rape under Section 3 of the Sexual Offences Act',
    'Sexual assault in a public place'
  ]},
  { category: 'Robbery', templates: [
    'Armed robbery with a firearm',
    'Robbery with violence',
    'Burglary at a residential premise'
  ]},
  { category: 'Murder', templates: [
    'Murder contrary to Section 203 of the Penal Code',
    'Manslaughter following a bar brawl'
  ]},
  { category: 'Attempted Murder', templates: [
    'Attempted murder with a machete',
    'Assault with intent to kill'
  ]},
  { category: 'Petty Offence', templates: [
    'Public nuisance by causing disturbance',
    'Drunk and disorderly at a market',
    'Petty theft of livestock'
  ]},
  { category: 'Political Case', templates: [
    'Election petition challenging results',
    'Hate speech during campaign',
    'Political violence at rally'
  ]},
  { category: 'Land Civil Case', templates: [
    'Land dispute over title deed',
    'Trespass on agricultural land',
    'Boundary dispute with neighbour'
  ]},
  { category: 'Divorce', templates: [
    'Divorce petition on grounds of cruelty',
    'Child custody battle',
    'Maintenance and alimony claim'
  ]},
  { category: 'Corruption', templates: [
    'Bribery of a public official',
    'Embezzlement of public funds',
    'Fraudulent procurement'
  ]}
];

// Helper
function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Generate a Kenyan name (70% male, 50% Eastern last name)
function generateName() {
  const isMale = Math.random() < 0.7;
  const firstName = isMale ? randomItem(maleFirstNames) : randomItem(femaleFirstNames);
  const useEastern = Math.random() < 0.5;
  const lastName = useEastern ? randomItem(lastNamesEastern) : randomItem(lastNamesOther);
  return `${firstName} ${lastName}`;
}

// Generate a 2‑line case description
function generateCaseDescription() {
  const caseType = randomItem(caseTypes);
  const template = randomItem(caseType.templates);
  const locations = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Machakos', 'Meru', 'Kisii', 'Kitale'];
  const date = `on ${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * (2025 - 2013 + 1) + 2013)}`;
  const detail = `Accused allegedly ${template.toLowerCase()} at ${randomItem(locations)} ${date}.`;
  // Add a second line to make it three lines max
  const extra = 'The matter is pending hearing before the High Court.';
  return `${detail} ${extra}`;
}

// ------------------------------------------------------------------
// MAIN SEED FUNCTION
// ------------------------------------------------------------------
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Optional: clear existing data (uncomment if you want a fresh start)
    // await Client.deleteMany({});
    // console.log('Cleared existing clients');

    const total = 1000;
    const clients = [];

    for (let i = 1; i <= total; i++) {
      // Case number: AK-<seq>-<year>
      const year = Math.floor(Math.random() * (2025 - 2013 + 1)) + 2013;
      const caseNumber = `AK-${i}-${year}`;

      // Name
      const name = generateName();

      // Phone – cycle through the provided list
      const phone = phoneNumbers[(i - 1) % phoneNumbers.length];

      // Description
      const caseDescription = generateCaseDescription();

      // Email – empty as requested
      const email = '';

      // CreatedAt random date within the case year
      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31);
      const createdAt = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      const updatedAt = createdAt; // same as creation

      clients.push({
        name,
        caseNumber,
        caseDescription,
        phone,
        email,
        createdAt,
        updatedAt
      });
    }

    // Insert in batches to avoid timeouts
    const batchSize = 100;
    for (let i = 0; i < clients.length; i += batchSize) {
      const batch = clients.slice(i, i + batchSize);
      await Client.insertMany(batch);
      console.log(`Inserted ${i + batch.length} of ${total}`);
    }

    console.log('✅ Seeding complete!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();