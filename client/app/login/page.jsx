import Link from 'next/link';
import LoginForm from '@/components/login-form';
import { Logo } from '@/components/logo'; 
// Importing Logo component

//react sever component

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen container"> 
        <Link href="/" className="flex items-center gap-1 py-4">
          <Logo className="h-8 w-8" fill="fill-primary" />
          <div className="text-primary text-xl font-bold">CineScope.lk</div>
        </Link>
    <div className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
    </div>
  )
}
