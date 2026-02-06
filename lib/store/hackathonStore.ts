import { create } from 'zustand'
import { Hackathon } from '../types'

const MOCK_HACKATHONS: Hackathon[] = [
  {
    id: '1',
    slug: 'iot-innovate-2024',
    name: 'IoT Innovate 2024',
    organizer: 'Department of Electronics',
    description: 'Build intelligent IoT solutions for real-world problems. This hackathon focuses on IoT applications, smart systems, and embedded development.',
    mode: 'Hybrid',
    location: 'SREC Campus, Bangalore',
    startDate: '2024-03-15',
    endDate: '2024-03-17',
    registrationDeadline: '2024-03-10',
    officialLink: 'https://iotinnovate.example.com',
    eligibility: 'Open to all SREC students. Teams of 2-5 members.',
    semester: 'Spring 2024',
    status: 'Active',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-15',
  },
  {
    id: '2',
    slug: 'code-sprint-2024',
    name: 'Code Sprint 2024',
    organizer: 'Department of Computer Science',
    description: 'A high-intensity programming competition focusing on algorithms, data structures, and problem-solving skills.',
    mode: 'In-Person',
    location: 'SREC Main Campus',
    startDate: '2024-02-20',
    endDate: '2024-02-21',
    registrationDeadline: '2024-02-15',
    officialLink: 'https://codesprint.example.com',
    eligibility: 'All engineering students welcome. Individual or team participation.',
    semester: 'Spring 2024',
    status: 'Upcoming',
    createdAt: '2024-01-15',
    updatedAt: '2024-02-05',
  },
  {
    id: '3',
    slug: 'webathon-2024',
    name: 'WebAthon 2024',
    organizer: 'Department of Information Technology',
    description: 'Create innovative web applications. Full-stack development, UI/UX design, and modern web technologies.',
    mode: 'Online',
    location: 'Remote',
    startDate: '2024-04-01',
    endDate: '2024-04-03',
    registrationDeadline: '2024-03-25',
    officialLink: 'https://webathon.example.com',
    eligibility: 'Open to 2nd, 3rd, and 4th year students.',
    semester: 'Spring 2024',
    status: 'Active',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-18',
  },
  {
    id: '4',
    slug: 'robotics-challenge-2024',
    name: 'Robotics Challenge 2024',
    organizer: 'Department of Mechanical Engineering',
    description: 'Design and build autonomous robots. Showcase innovation in robotics and automation.',
    mode: 'In-Person',
    location: 'SREC Sports Complex',
    startDate: '2024-05-10',
    endDate: '2024-05-12',
    registrationDeadline: '2024-04-30',
    officialLink: 'https://robotics.example.com',
    eligibility: 'All departments. Interdisciplinary teams encouraged.',
    semester: 'Spring 2024',
    status: 'Upcoming',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-10',
  },
]

interface HackathonStore {
  hackathons: Hackathon[]
  getHackathonBySlug: (slug: string) => Hackathon | undefined
  getHackathonById: (id: string) => Hackathon | undefined
  getAllHackathons: () => Hackathon[]
  addHackathon: (hackathon: Hackathon) => void
  updateHackathon: (id: string, hackathon: Partial<Hackathon>) => void
  deleteHackathon: (id: string) => void
}

export const useHackathonStore = create<HackathonStore>((set, get) => ({
  hackathons: MOCK_HACKATHONS,

  getHackathonBySlug: (slug: string) => {
    return get().hackathons.find((h) => h.slug === slug)
  },

  getHackathonById: (id: string) => {
    return get().hackathons.find((h) => h.id === id)
  },

  getAllHackathons: () => {
    return get().hackathons
  },

  addHackathon: (hackathon: Hackathon) => {
    set((state) => ({
      hackathons: [...state.hackathons, hackathon],
    }))
  },

  updateHackathon: (id: string, updates: Partial<Hackathon>) => {
    set((state) => ({
      hackathons: state.hackathons.map((h) =>
        h.id === id ? { ...h, ...updates, updatedAt: new Date().toISOString() } : h
      ),
    }))
  },

  deleteHackathon: (id: string) => {
    set((state) => ({
      hackathons: state.hackathons.filter((h) => h.id !== id),
    }))
  },
}))
