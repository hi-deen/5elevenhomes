import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create admin user
  const hashedPassword = await hash('Admin@5eleven2024', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@5elevenhomes.com' },
    update: {},
    create: {
      email: 'admin@5elevenhomes.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    },
  });

  console.log('✓ Admin user created:', admin.email);
  console.log('  Email: admin@5elevenhomes.com');
  console.log('  Password: Admin@5eleven2024');
  console.log('  ⚠️  Please change the password after first login!');

  // Create Showroom Items
  console.log('\nSeeding showroom items...');
  
  const showroomItems = [
    {
      title: 'Modern Velvet Sofa',
      description: 'Luxurious 3-seater sofa with premium velvet upholstery',
      fullDescription: 'Experience ultimate comfort with this stunning modern velvet sofa. Features high-density foam cushioning, solid wood frame, and elegant gold-finished legs. Perfect for contemporary living spaces.',
      price: 450000,
      category: 'Furniture',
      availability: 'Available',
      featured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop', publicId: 'showroom/sofa-1', order: 0 },
        { url: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&auto=format&fit=crop', publicId: 'showroom/sofa-2', order: 1 },
      ],
    },
    {
      title: 'Crystal Chandelier',
      description: 'Elegant crystal chandelier with LED lighting',
      fullDescription: 'Transform your space with this breathtaking crystal chandelier. Features premium K9 crystals, energy-efficient LED bulbs, and adjustable height. Ideal for dining rooms and entryways.',
      price: 180000,
      category: 'Lighting',
      availability: 'Available',
      featured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop', publicId: 'showroom/chandelier-1', order: 0 },
      ],
    },
    {
      title: 'Luxury Dining Set',
      description: 'Premium 6-seater marble dining table with chairs',
      fullDescription: 'Elevate your dining experience with this exquisite marble-top dining set. Includes handcrafted wooden base, six cushioned chairs with beautiful upholstery, and scratch-resistant finish.',
      price: 650000,
      category: 'Furniture',
      availability: 'Available',
      featured: false,
      images: [
        { url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&auto=format&fit=crop', publicId: 'showroom/dining-1', order: 0 },
        { url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&auto=format&fit=crop', publicId: 'showroom/dining-2', order: 1 },
      ],
    },
    {
      title: 'Designer Wall Mirror',
      description: 'Contemporary gold-framed decorative mirror',
      fullDescription: 'Add sophistication to any room with this stunning designer wall mirror. Features premium quality glass, ornate gold frame, and easy mounting hardware. Perfect for living rooms and bedrooms.',
      price: 85000,
      category: 'Decor',
      availability: 'Available',
      featured: false,
      images: [
        { url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&auto=format&fit=crop', publicId: 'showroom/mirror-1', order: 0 },
      ],
    },
    {
      title: 'King Size Bed Frame',
      description: 'Upholstered platform bed with storage',
      fullDescription: 'Sleep in luxury with this sophisticated king-size bed frame. Features premium fabric upholstery, built-in storage drawers, solid wood construction, and a stylish tufted headboard.',
      price: 520000,
      category: 'Furniture',
      availability: 'Reserved',
      featured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop', publicId: 'showroom/bed-1', order: 0 },
        { url: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&auto=format&fit=crop', publicId: 'showroom/bed-2', order: 1 },
      ],
    },
  ];

  for (const item of showroomItems) {
    const { images, ...itemData } = item;
    await prisma.showroomItem.create({
      data: {
        ...itemData,
        images: {
          create: images,
        },
      },
    });
  }

  console.log('✓ Created 5 showroom items');

  // Create Portfolio Projects
  console.log('\nSeeding portfolio projects...');

  const portfolioProjects = [
    {
      title: 'Luxury Penthouse - Kaduna',
      description: 'Complete interior transformation of a 4-bedroom penthouse featuring modern minimalist design with gold accents throughout. Included custom furniture, lighting design, and art curation.',
      clientType: 'Individual',
      location: 'Kaduna, Nigeria',
      servicesDelivered: ['Interior Design', 'Furniture Supply', 'Lighting Design', 'Installation'],
      completionDate: new Date('2024-06-15'),
      featured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&auto=format&fit=crop', publicId: 'portfolio/penthouse-1', order: 0 },
        { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop', publicId: 'portfolio/penthouse-2', order: 1 },
        { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop', publicId: 'portfolio/penthouse-3', order: 2 },
      ],
    },
    {
      title: 'Corporate Office - Abuja',
      description: 'Modern corporate office design for a tech company, featuring open workspaces, executive offices, and collaborative meeting areas with smart technology integration.',
      clientType: 'Corporate',
      location: 'Abuja, Nigeria',
      servicesDelivered: ['Space Planning', 'Furniture Supply', 'Technology Integration', 'Project Management'],
      completionDate: new Date('2024-08-20'),
      featured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop', publicId: 'portfolio/office-1', order: 0 },
        { url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop', publicId: 'portfolio/office-2', order: 1 },
      ],
    },
    {
      title: 'Contemporary Villa',
      description: 'Full interior design of a 6-bedroom villa with emphasis on luxury and comfort. Included living areas, bedrooms, kitchen, and outdoor spaces.',
      clientType: 'Individual',
      location: 'Lagos, Nigeria',
      servicesDelivered: ['Interior Design', 'Furniture Selection', 'Custom Cabinetry', 'Outdoor Design'],
      completionDate: new Date('2024-05-10'),
      featured: false,
      images: [
        { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop', publicId: 'portfolio/villa-1', order: 0 },
        { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop', publicId: 'portfolio/villa-2', order: 1 },
      ],
    },
    {
      title: 'Boutique Hotel Renovation',
      description: 'Complete renovation and interior design of a 20-room boutique hotel, including lobby, restaurant, and guest rooms with a focus on contemporary African aesthetics.',
      clientType: 'Corporate',
      location: 'Kaduna, Nigeria',
      servicesDelivered: ['Interior Design', 'Furniture Procurement', 'Lighting Design', 'Art Consultation', 'Project Management'],
      completionDate: new Date('2024-09-30'),
      featured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop', publicId: 'portfolio/hotel-1', order: 0 },
        { url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop', publicId: 'portfolio/hotel-2', order: 1 },
      ],
    },
    {
      title: 'Modern Family Home',
      description: 'Warm and inviting interior design for a 3-bedroom family home, balancing style with functionality for young families.',
      clientType: 'Individual',
      location: 'Port Harcourt, Nigeria',
      servicesDelivered: ['Interior Design', 'Furniture Supply', 'Color Consultation', 'Installation'],
      completionDate: new Date('2024-07-25'),
      featured: false,
      images: [
        { url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&auto=format&fit=crop', publicId: 'portfolio/family-1', order: 0 },
        { url: 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&auto=format&fit=crop', publicId: 'portfolio/family-2', order: 1 },
      ],
    },
  ];

  for (const project of portfolioProjects) {
    const { images, ...projectData } = project;
    await prisma.portfolioProject.create({
      data: {
        ...projectData,
        images: {
          create: images,
        },
      },
    });
  }

  console.log('✓ Created 5 portfolio projects');

  // Create Real Estate Sections
  console.log('\nSeeding real estate sections...');

  const realEstateSections = [
    {
      sectionName: 'Section A - Premium Villas',
      description: 'Luxury 4-bedroom detached villas with modern architecture, private gardens, and smart home features. Located in the prime area of the estate.',
      completedWorks: ['Foundation', 'Roofing', 'External Walls', 'Windows Installation', 'Plumbing'],
      ongoingWorks: ['Electrical Wiring', 'Interior Plastering', 'Tiling'],
      progressPercentage: 75,
      status: 'Ongoing',
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop',
      ],
      imagePublicIds: ['real-estates/section-a-1', 'real-estates/section-a-2'],
      order: 1,
    },
    {
      sectionName: 'Section B - Terrace Houses',
      description: '3-bedroom terraced houses with contemporary design, perfect for young families. Features include fitted kitchens, ensuite bedrooms, and dedicated parking.',
      completedWorks: ['Foundation', 'Roofing', 'External Walls', 'Windows', 'Doors', 'Plumbing', 'Electrical', 'Painting'],
      ongoingWorks: ['Landscaping', 'Street Lighting'],
      progressPercentage: 95,
      status: 'Ongoing',
      images: [
        'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&auto=format&fit=crop',
      ],
      imagePublicIds: ['real-estates/section-b-1', 'real-estates/section-b-2'],
      order: 2,
    },
    {
      sectionName: 'Section C - Apartments',
      description: 'Modern 2-bedroom apartments with open-plan living spaces and balconies. Ideal for young professionals and small families.',
      completedWorks: ['Foundation', 'Structural Works', 'Roofing', 'External Finishing', 'Windows', 'Doors', 'All Services'],
      ongoingWorks: [],
      progressPercentage: 100,
      status: 'Completed',
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
      ],
      imagePublicIds: ['real-estates/section-c-1', 'real-estates/section-c-2'],
      order: 3,
    },
    {
      sectionName: 'Section D - Estate Amenities',
      description: 'Clubhouse, swimming pool, gym, and recreational facilities for estate residents. Includes 24/7 security and smart access control.',
      completedWorks: ['Site Clearing', 'Foundation Works'],
      ongoingWorks: ['Structural Construction', 'Swimming Pool Excavation'],
      progressPercentage: 35,
      status: 'Ongoing',
      images: [
        'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop',
      ],
      imagePublicIds: ['real-estates/section-d-1', 'real-estates/section-d-2'],
      order: 4,
    },
    {
      sectionName: 'Section E - Semi-Detached Duplexes',
      description: '5-bedroom semi-detached duplexes with spacious layouts, boys quarters, and ample parking. Premium finishes throughout.',
      completedWorks: [],
      ongoingWorks: ['Site Development', 'Foundation Marking'],
      progressPercentage: 10,
      status: 'Planning',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&auto=format&fit=crop',
      ],
      imagePublicIds: ['real-estates/section-e-1', 'real-estates/section-e-2'],
      order: 5,
    },
  ];

  for (const section of realEstateSections) {
    await prisma.realEstateSection.create({
      data: section,
    });
  }

  console.log('✓ Created 5 real estate sections');

  console.log('\n✅ Database seed completed successfully!');
  console.log('\nSummary:');
  console.log('- 1 Admin user');
  console.log('- 5 Showroom items');
  console.log('- 5 Portfolio projects');
  console.log('- 5 Real estate sections');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
