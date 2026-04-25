import { PrismaClient, UserRole, NERState, ExperienceType, ContentType, AccommodationType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // 1. Clear existing data
  await prisma.accommodation.deleteMany();
  await prisma.communityPerson.deleteMany();
  await prisma.culturalContent.deleteMany();
  await prisma.community.deleteMany();
  await prisma.user.deleteMany();

  // 2. Data Definitions
  const communitiesData = [
    {
      slug: "khonoma-village",
      name: "Khonoma Village",
      state: NERState.NAGALAND,
      latitude: 25.62,
      longitude: 94.11,
      ilpRequired: true,
      experienceTypes: [ExperienceType.ECO, ExperienceType.CULTURAL],
      shortDesc: "Asia's first green village, known for its conservation efforts and history of valor.",
      longDesc: "Khonoma is an Angami Naga village located about 20 km from the state capital, Kohima. It is famous for its unique agriculture, rich hunting history (now strictly banned), and its stand against the British.",
      rating: 4.9,
      reviewCount: 142,
    },
    {
      slug: "mawlynnong",
      name: "Mawlynnong",
      state: NERState.MEGHALAYA,
      latitude: 25.20,
      longitude: 92.01,
      ilpRequired: false,
      experienceTypes: [ExperienceType.CULTURAL, ExperienceType.ECO],
      shortDesc: "Acclaimed as Asia's cleanest village, a paradise of flowers and living root bridges.",
      longDesc: "Located in the East Khasi Hills, Mawlynnong offers a glimpse into the lifestyle of the Khasi community. It is renowned for its cleanliness, community-led tourism, and proximity to the famous Living Root Bridges.",
      rating: 4.8,
      reviewCount: 310,
    },
    {
      slug: "majuli-island",
      name: "Majuli Island Mising Tribe",
      state: NERState.ASSAM,
      latitude: 26.95,
      longitude: 94.15,
      ilpRequired: false,
      experienceTypes: [ExperienceType.CULTURAL, ExperienceType.CULINARY],
      shortDesc: "The world's largest river island, home to the Mising people and ancient Satras.",
      longDesc: "Majuli is the cradle of Assamese neo-Vaishnavite culture. The Mising tribe communities here live in stilt houses and are known for their exquisite weaving and traditional Apong (rice beer).",
      rating: 4.7,
      reviewCount: 225,
    },
    {
      slug: "ziro-valley",
      name: "Ziro Valley Apatani",
      state: NERState.ARUNACHAL_PRADESH,
      latitude: 27.54,
      longitude: 93.83,
      ilpRequired: true,
      experienceTypes: [ExperienceType.ADVENTURE, ExperienceType.CULTURAL],
      shortDesc: "Home to the Apatani tribe, famous for their unique agricultural system and Ziro Music Festival.",
      longDesc: "Ziro is a UNESCO World Heritage site candidate. The Apatani people are known for their sustainable farming, facial tattoos, and large nose plugs (traditional among older women).",
      rating: 5.0,
      reviewCount: 88,
    },
    {
      slug: "loktak-fisherfolk",
      name: "Loktak Fisherfolk Sendra",
      state: NERState.MANIPUR,
      latitude: 24.45,
      longitude: 93.78,
      ilpRequired: true,
      experienceTypes: [ExperienceType.ECO, ExperienceType.ADVENTURE],
      shortDesc: "Life on the floating islands (Phumdis) of the largest freshwater lake in NE India.",
      longDesc: "The fisherfolk of Loktak live in unique huts built on floating biomass called Phumdis. It is the only home of the Sangai (brow-antlered deer) in the Keibul Lamjao National Park.",
      rating: 4.6,
      reviewCount: 156,
    },
    {
      slug: "mizo-cheraw",
      name: "Mizo Cheraw Community",
      state: NERState.MIZORAM,
      latitude: 23.17,
      longitude: 92.67,
      ilpRequired: true,
      experienceTypes: [ExperienceType.CULTURAL, ExperienceType.SPIRITUAL],
      shortDesc: "Preserving the vibrant Bamboo Dance and the close-knit community spirit of the Mizos.",
      longDesc: "Mizoram is a land of rolling hills and bamboo forests. The Cheraw dance is one of the oldest traditional dances, performed during festive occasions like Chapchar Kut.",
      rating: 4.5,
      reviewCount: 92,
    },
    {
      slug: "dzongu-lepcha",
      name: "Dzongu Lepcha",
      state: NERState.SIKKIM,
      latitude: 27.66,
      longitude: 88.57,
      ilpRequired: false,
      experienceTypes: [ExperienceType.ECO, ExperienceType.SPIRITUAL],
      shortDesc: "The sacred land of the Lepchas, the original inhabitants of Sikkim.",
      longDesc: "Dzongu is a restricted area reserved for the Lepcha people. It is a land of deep valleys, glacial streams, and profound reverence for Mount Khangchendzonga.",
      rating: 4.9,
      reviewCount: 67,
    },
    {
      slug: "nokrek-garo",
      name: "Nokrek Garo Community",
      state: NERState.MEGHALAYA,
      latitude: 25.43,
      longitude: 90.47,
      ilpRequired: false,
      experienceTypes: [ExperienceType.ECO, ExperienceType.ADVENTURE],
      shortDesc: "Custodians of the Nokrek Biosphere Reserve and the wild citrus mother plant.",
      longDesc: "The Garo people in Nokrek are masters of the forest. This region is famous for its wild oranges (Citrus indica) and rich biodiversity including the Red Panda.",
      rating: 4.4,
      reviewCount: 54,
    },
    {
      slug: "tripuri-garia",
      name: "Tripuri Garia Community",
      state: NERState.TRIPURA,
      latitude: 23.68,
      longitude: 91.28,
      ilpRequired: false,
      experienceTypes: [ExperienceType.CULTURAL, ExperienceType.SPIRITUAL],
      shortDesc: "Celebrating the Garia Puja and the royal heritage of the Tripuri kingdom.",
      longDesc: "Tripura combines tribal culture with Bengali influences. The Garia Puja is a week-long festival of the indigenous Tripuris to pray for a good harvest.",
      rating: 4.3,
      reviewCount: 78,
    },
    {
      slug: "balpakram-garos",
      name: "Balpakram Garos",
      state: NERState.MEGHALAYA,
      latitude: 25.24,
      longitude: 90.72,
      experienceTypes: [ExperienceType.ADVENTURE, ExperienceType.ECO],
      shortDesc: "The 'Land of Spirits', a deep canyon with mythical significance for the Garo people.",
      longDesc: "Balpakram is a national park in the South Garo Hills. Local Garos believe it is the temporary home of departed souls before they embark on their final journey.",
      rating: 4.7,
      reviewCount: 42,
    },
    {
      slug: "adi-tribe-pasighat",
      name: "Adi Tribe Pasighat",
      state: NERState.ARUNACHAL_PRADESH,
      latitude: 28.07,
      longitude: 95.33,
      ilpRequired: true,
      experienceTypes: [ExperienceType.ADVENTURE, ExperienceType.CULTURAL],
      shortDesc: "Warrior culture and white-water rafting on the Siang (Brahmaputra) river.",
      longDesc: "Pasighat is the oldest town in Arunachal. The Adi tribe is known for their cane and bamboo bridges and their grand Solung festival.",
      rating: 4.8,
      reviewCount: 112,
    },
    {
      slug: "konyak-naga-mon",
      name: "Konyak Naga Mon",
      state: NERState.NAGALAND,
      latitude: 26.74,
      longitude: 95.11,
      ilpRequired: true,
      experienceTypes: [ExperienceType.CULTURAL, ExperienceType.ADVENTURE],
      shortDesc: "The last of the tattooed headhunters living on the Indo-Myanmar border.",
      longDesc: "Longwa village in Mon is unique as the border passes through the Angh's (King) house. The Konyaks are famous for their facial tattoos and woodcarving skills.",
      rating: 4.9,
      reviewCount: 198,
    },
    {
      slug: "deori-tribe-dhemaji",
      name: "Deori Tribe Dhemaji",
      state: NERState.ASSAM,
      latitude: 27.48,
      longitude: 94.57,
      experienceTypes: [ExperienceType.CULTURAL, ExperienceType.CULINARY],
      shortDesc: "The priestly tribe of the Chutia dynasty, maintaining unique rituals and languages.",
      longDesc: "The Deoris are one of the major indigenous communities of Assam. They have preserved their original dialect and traditional priestly practices near the Brahmaputra banks.",
      rating: 4.4,
      reviewCount: 35,
    },
    {
      slug: "hmong-thadou",
      name: "Hmong Thadou Community",
      state: NERState.MANIPUR,
      latitude: 24.86,
      longitude: 93.94,
      ilpRequired: true,
      experienceTypes: [ExperienceType.CULTURAL, ExperienceType.ECO],
      shortDesc: "Rich heritage of the Thadou-Kuki people in the hills of Manipur.",
      longDesc: "The Thadou people have a rich oral tradition and are known for their intricate weaving and traditional festivals like Chavang Kut.",
      rating: 4.5,
      reviewCount: 64,
    },
    {
      slug: "tangsa-tribe",
      name: "Tangsa Tribe Changlang",
      state: NERState.ARUNACHAL_PRADESH,
      latitude: 27.12,
      longitude: 96.37,
      ilpRequired: true,
      experienceTypes: [ExperienceType.ECO, ExperienceType.CULTURAL],
      shortDesc: "Diverse sub-tribes known for their handmade tea and traditional handlooms.",
      longDesc: "The Tangsas live near the historic Stilwell Road. They are famous for their 'Phalay' (traditional tea) smoked in bamboo tubes.",
      rating: 4.6,
      reviewCount: 51,
    }
  ];

  // 3. Create Seed Data
  for (const communityData of communitiesData) {
    // Create Admin User
    const adminEmail = `admin@${communityData.slug}.com`;
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: `${communityData.name} Admin`,
        role: UserRole.COMMUNITY_ADMIN,
        password: "hashed_password_placeholder", // In real app, use bcrypt
      },
    });

    // Create Community
    const community = await prisma.community.create({
      data: {
        ...communityData,
        adminUserId: admin.id,
        coverImageUrl: `https://res.cloudinary.com/vanroots/image/upload/v1/communities/${communityData.slug}/cover.jpg`,
        galleryUrls: [`https://res.cloudinary.com/vanroots/image/upload/v1/communities/${communityData.slug}/g1.jpg`],
        primaryLanguage: "Local Dialect",
        population: Math.floor(Math.random() * 5000) + 200,
        embedding: Array.from({ length: 384 }, () => Math.random()), // Dummy embedding for AI
        content: {
          create: [
            {
              contentType: ContentType.BELIEF,
              title: "Ancient Creation Myth",
              body: { text: "The elders tell a story of how the mountains were formed by spirits..." },
              featured: true,
            },
            {
              contentType: ContentType.FOLKLORE,
              title: "The Legend of the Golden Deer",
              body: { text: "A tale of a mystical creature that appears only during the harvest moon." },
            },
            {
              contentType: ContentType.FOOD,
              title: "Signature Smoked Meat",
              body: { text: "Traditional preservation method using hearth smoke for unique flavor." },
            }
          ]
        },
        people: {
          create: [
            {
              name: "Elder Kenie",
              role: "Village Headman",
              quote: "The earth provides for those who protect it.",
              featured: true,
            },
            {
              name: "Ane Yapa",
              role: "Master Weaver",
              quote: "Every pattern in our loom tells the story of our ancestors.",
            }
          ]
        },
        accommodations: {
          create: [
            {
              name: `${communityData.name} Homestay`,
              type: AccommodationType.HOMESTAY,
              contact: "+91 98765 43210",
              externalUrl: "https://booking.com/example",
            }
          ]
        }
      }
    });

    console.log(`Created community: ${community.name}`);
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
