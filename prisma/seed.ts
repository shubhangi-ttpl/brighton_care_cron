import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding rooms...');

  let facility = await prisma.facility.findFirst();
  if (!facility) {
    facility = await prisma.facility.create({
      data: {
        name: 'Brighton Care Facility',
        contact: '9876543210',
      },
    });
    console.log('🏢 Created new facility for seeding');
  }

  await prisma.room.createMany({
    data: [
      {
        roomNumber: "101",
        roomType: 'Single',
        status: 'Available',
        facilityId: facility.id,
      },
      {
        roomNumber: "102",
        roomType: 'Double',
        status: 'Occupied',
        facilityId: facility.id,
      },
      {
        roomNumber: "103",
        roomType: 'Deluxe',
        status: 'Maintenance',
        facilityId: facility.id,
      },
      {
        roomNumber: "104",
        roomType: 'Single',
        status: 'Available',
        facilityId: facility.id,
      },
    ],
  });

  console.log('✅ Rooms seeded successfully!');

  await prisma.intermediateRoomResident.createMany({
    data: [
      {
        roomId: 101,
        residentId: 1,
        mealTime: 'Breakfast',
        occupancyType: 'Single',
      },
      {
        roomId: 102,
        residentId: 2,
        mealTime: 'Lunch',
        occupancyType: 'Double',
      },
    ],
  });
  console.log('✅ Intermediate Room Resident seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
