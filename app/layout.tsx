import "./globals.css";
export const metadata={
  title:"Korea Fintech Entry Intelligence",
  description:"Evidence-linked regulatory intelligence for fintechs entering Korea."
};
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body>{children}</body></html>
}