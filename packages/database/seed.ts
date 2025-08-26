// @author: fatima bashir
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Seed learning modules
  const modules = [
    {
      title: 'JavaScript Fundamentals',
      description: 'Master the core concepts of JavaScript programming',
      difficulty: 'beginner',
      duration: 120,
      skills: ['JavaScript', 'Programming Fundamentals'],
      prerequisites: []
    },
    {
      title: 'React Development',
      description: 'Build modern web applications with React',
      difficulty: 'intermediate',
      duration: 180,
      skills: ['React', 'Component Architecture', 'State Management'],
      prerequisites: ['JavaScript Fundamentals']
    },
    {
      title: 'System Design Basics',
      description: 'Learn to design scalable software systems',
      difficulty: 'intermediate',
      duration: 240,
      skills: ['System Architecture', 'Scalability', 'Database Design'],
      prerequisites: ['JavaScript Fundamentals']
    },
    {
      title: 'Interview Preparation',
      description: 'Prepare for technical and behavioral interviews',
      difficulty: 'intermediate',
      duration: 90,
      skills: ['Communication', 'Problem Solving', 'Interview Skills'],
      prerequisites: []
    }
  ]

  for (const module of modules) {
    await prisma.learningModule.upsert({
      where: { title: module.title },
      update: module,
      create: module
    })
  }

  // Seed sample job descriptions
  const jobDescriptions = [
    {
      title: 'Frontend Developer',
      company: 'Tech Corp',
      description: 'We are looking for a skilled Frontend Developer to join our team...',
      requirements: [
        '3+ years of JavaScript experience',
        'Proficiency in React',
        'Experience with TypeScript',
        'Knowledge of CSS and responsive design'
      ],
      skills: ['JavaScript', 'React', 'TypeScript', 'CSS', 'HTML'],
      experienceLevel: 'mid',
      location: 'San Francisco, CA',
      remote: true
    },
    {
      title: 'Full Stack Engineer',
      company: 'Startup Inc',
      description: 'Join our fast-growing startup as a Full Stack Engineer...',
      requirements: [
        '5+ years of full-stack development',
        'Node.js and React experience',
        'Database design skills',
        'Cloud deployment experience'
      ],
      skills: ['JavaScript', 'Node.js', 'React', 'PostgreSQL', 'AWS'],
      experienceLevel: 'senior',
      location: 'Remote',
      remote: true
    }
  ]

  for (const job of jobDescriptions) {
    await prisma.jobDescription.upsert({
      where: { title: job.title },
      update: job,
      create: job
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

