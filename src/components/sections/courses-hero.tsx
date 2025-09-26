import { Badge } from '@/components/ui/badge'
import { BookOpen, Award, Users, Star } from 'lucide-react'

const stats = [
  {
    icon: BookOpen,
    value: '50+',
    label: 'Courses',
  },
  {
    icon: Users,
    value: '1000+',
    label: 'Students',
  },
  {
    icon: Award,
    value: '6',
    label: 'Levels',
  },
  {
    icon: Star,
    value: '4.8',
    label: 'Rating',
  },
]

export default function CoursesHero() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-6">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            <Award className="w-4 h-4 mr-2" />
            Accredited NVQ Qualifications
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            NVQ Courses
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover industry-recognized qualifications that boost your career. Filter our
            comprehensive range by category and level to find your perfect course.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-3">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
