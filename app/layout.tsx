import "./globals.css";
export const metadata={
  title:"Korea Digital Finance Entry Intelligence",
  description:"Evidence-linked regulatory intelligence for entering Korea's digital-finance market."
};
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body>{children}</body></html>
}