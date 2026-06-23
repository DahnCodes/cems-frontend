import LoginForm from '@/components/auth/Login-form'
import Footer from '@/components/Footer'

export default function Login() {
  return (
    <>
    <div className="min-h-screen bg-background text-foreground bg-gradient-to-tl from-purple-50 via-white to-blue-50">
      <LoginForm />

    </div>
      {/* <div className="fixed bottom-0 left-0 w-full">
        <Footer />
      </div> */}
    </>
  )
}
