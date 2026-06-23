import RegisterForm from "@/components/auth/Register-form";
import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";

export default function Register(){
    return(
        <>
        <div className="min-h-screen bg-background text-foreground bg-gradient-to-tl from-purple-50 via-white to-blue-50">
        <RegisterForm/>
          {/* <div className="relative bottom-0 left-0 w-full mt-10">
                <Footer />
              </div> */}
        </div>
        </>
    )
}