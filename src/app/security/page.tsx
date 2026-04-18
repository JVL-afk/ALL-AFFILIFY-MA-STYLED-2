'use client'

import { motion } from 'framer-motion'
import { 
  FileText, 
  Scale, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Calendar,
  Globe,
  CreditCard,
  RefreshCw,
  Ban,
  Eye,
  Lock,
  Users,
  Gavel,
  Mail,
  Phone,
  ExternalLink,
  Download,
  Info,
  Clock,
  DollarSign,
  Zap,
  Settings,
  Database,
  Cloud,
  Smartphone,
  Monitor,
  Code,
  Key,
  UserCheck,
  Bell,
  Share2
} from 'lucide-react'

export default function SecurityPage() {
  const lastUpdated = "April 13, 2026"

const sections = [
  {
    id: 'security' , 
    title: 'Security on our platform' ,
    icon: Database ,
    content: '
      Here at affilify.eu we take your personal security very seriously. We make it our personal commitment to you that from the moment you sign up you are totally safe and isolated from exterior attacks. We can provide you that by assuring you that all your data and all your requests will be run on a separate, hidden server in times when the platform is under attack/ nonoperative so that you can enjoy your post-login affilify.eu worry-free That is why sometimes (usually the time you sign up) you may see an account that isn’t yours. In that case just click the sign out in the bottom left of the dashboard and then login again with your credentials. This will ensure your information is saved two times into the database, assuring you that you will not be impacted during attacks.
  '
  } 
]
